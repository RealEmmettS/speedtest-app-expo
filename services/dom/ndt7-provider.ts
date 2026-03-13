import type { SpeedTestProvider, SpeedTestProgress, SpeedTestResult, TestDuration } from '@/types/speedtest';

// Inline NDT7 worker code as Blob URLs so they work inside the DOM component's webview.
// The @m-lab/ndt7 library normally loads these from file paths via new Worker(filename),
// but those file paths don't resolve in an Expo DOM component. Creating Blob URLs from
// the worker source code avoids the path resolution issue entirely.
function createWorkerBlobUrl(code: string): string {
  const blob = new Blob([code], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
}

// Download worker source (from @m-lab/ndt7/src/ndt7-download-worker.js)
const DOWNLOAD_WORKER_SRC = `
const workerMain = function(ev) {
  'use strict';
  const url = ev.data['///ndt/v7/download'];
  const sock = new WebSocket(url, 'net.measurementlab.ndt.v7');
  let now;
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    now = () => performance.now();
  } else {
    now = () => Date.now();
  }
  sock.onclose = function() { postMessage({ MsgType: 'complete' }); };
  sock.onerror = function(ev) { postMessage({ MsgType: 'error', Error: ev.type }); };
  let start = now(); let previous = start; let total = 0;
  sock.onopen = function() { start = now(); previous = start; total = 0; postMessage({ MsgType: 'start', Data: { ClientStartTime: start } }); };
  sock.onmessage = function(ev) {
    total += (typeof ev.data.size !== 'undefined') ? ev.data.size : ev.data.length;
    const t = now(); const every = 250;
    if (t - previous > every) {
      postMessage({ MsgType: 'measurement', ClientData: { ElapsedTime: (t - start) / 1000, NumBytes: total, MeanClientMbps: (total / (t - start)) * 0.008 }, Source: 'client' });
      previous = t;
    }
    if (typeof ev.data === 'string') { postMessage({ MsgType: 'measurement', ServerMessage: ev.data, Source: 'server' }); }
  };
};
self.onmessage = workerMain;
`;

// Upload worker source (from @m-lab/ndt7/src/ndt7-upload-worker.js)
const UPLOAD_WORKER_SRC = `
const workerMain = function(ev) {
  const url = ev.data['///ndt/v7/upload'];
  const sock = new WebSocket(url, 'net.measurementlab.ndt.v7');
  let now;
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    now = () => performance.now();
  } else {
    now = () => Date.now();
  }
  let closed = false;
  sock.onclose = function() { if (!closed) { closed = true; postMessage({ MsgType: 'complete' }); } };
  sock.onerror = function(ev) { postMessage({ MsgType: 'error', Error: ev.type }); };
  sock.onmessage = function(ev) { if (typeof ev.data !== 'undefined') { postMessage({ MsgType: 'measurement', Source: 'server', ServerMessage: ev.data }); } };
  function postClientMeasurement(total, bufferedAmount, start) {
    const numBytes = total - bufferedAmount;
    const elapsedTime = (now() - start) / 1000;
    const meanMbps = numBytes * 8 / 1000000 / elapsedTime;
    postMessage({ MsgType: 'measurement', ClientData: { ElapsedTime: elapsedTime, NumBytes: numBytes, MeanClientMbps: meanMbps }, Source: 'client', Test: 'upload' });
  }
  function uploader(data, start, end, previous, total) {
    if (closed) return;
    const t = now();
    if (t >= end) { sock.close(); postClientMeasurement(total, sock.bufferedAmount, start); return; }
    const maxMessageSize = 8388608;
    const clientMeasurementInterval = 250;
    const nextSizeIncrement = (data.length >= maxMessageSize) ? Infinity : 16 * data.length;
    if ((total - sock.bufferedAmount) >= nextSizeIncrement) { data = new Uint8Array(data.length * 2); }
    const desiredBuffer = 7 * data.length;
    if (sock.bufferedAmount < desiredBuffer) { sock.send(data); total += data.length; }
    if (t >= previous + clientMeasurementInterval) { postClientMeasurement(total, sock.bufferedAmount, start); previous = t; }
    setTimeout(() => uploader(data, start, end, previous, total), 0);
  }
  sock.onopen = function() {
    const data = new Uint8Array(8192);
    const start = now(); const duration = 10000; const end = start + duration;
    postMessage({ MsgType: 'start', Data: { StartTime: start / 1000, ExpectedEndTime: end / 1000 } });
    uploader(data, start, end, start, 0);
  };
};
self.onmessage = workerMain;
`;

export class NDT7Provider implements SpeedTestProvider {
  name = 'M-Lab NDT7';
  supportsPacketLoss = false;
  requiresConsent = true;

  private aborted = false;
  private downloadWorkerUrl: string | null = null;
  private uploadWorkerUrl: string | null = null;

  async start(onProgress: (p: SpeedTestProgress) => void, duration: TestDuration = 'auto'): Promise<SpeedTestResult> {
    this.aborted = false;

    // Create inline worker Blob URLs
    this.downloadWorkerUrl = createWorkerBlobUrl(DOWNLOAD_WORKER_SRC);
    this.uploadWorkerUrl = createWorkerBlobUrl(UPLOAD_WORKER_SRC);

    // NDT7 is a UMD module — import it dynamically
    const ndt7Module = await import('@m-lab/ndt7');
    const ndt7 = ndt7Module.default || ndt7Module;

    let serverName = 'M-Lab Auto';
    let lastPing: number | null = null;
    let lastDlSpeed: number | null = null;
    let lastUlSpeed: number | null = null;
    const rttSamples: number[] = [];

    // For duration-based iteration
    const seconds = duration === 'auto' ? 0 : (typeof duration === 'number' ? duration : 30);
    const iterations = seconds > 30 ? Math.ceil(seconds / 20) : 1;
    const allDlSpeeds: number[] = [];
    const allUlSpeeds: number[] = [];
    const allPings: number[] = [];

    for (let iter = 0; iter < iterations; iter++) {
      if (this.aborted) break;

      await new Promise<void>((resolve, reject) => {
        const dlStartTime = Date.now();
        let ulStartTime = 0;

        ndt7.test(
          {
            userAcceptedDataPolicy: true,
            downloadworkerfile: this.downloadWorkerUrl!,
            uploadworkerfile: this.uploadWorkerUrl!,
            metadata: {
              client_name: 'speedqx',
              client_version: '1.0.0',
            },
          },
          {
            serverChosen: (server: { machine: string }) => {
              serverName = server.machine || 'M-Lab Server';
              console.log('[NDT7] Server:', serverName);
              onProgress({
                phase: 'discovering',
                currentProvider: 'M-Lab NDT7',
                ping: null,
                jitter: null,
                downloadSpeed: null,
                uploadSpeed: null,
                packetLoss: null,
                downloadProgress: 0,
                uploadProgress: 0,
                serverName,
                error: null,
              });
            },

            downloadMeasurement: (data: {
              Source: string;
              Data: {
                MeanClientMbps?: number;
                NumBytes?: number;
                TCPInfo?: { MinRTT?: number; SmoothedRTT?: number };
                ElapsedTime?: number;
              };
            }) => {
              if (this.aborted) return;

              if (data.Source === 'client' && data.Data.MeanClientMbps !== undefined) {
                lastDlSpeed = data.Data.MeanClientMbps;
              }

              // Server-source: capture ping from TCPInfo, and throughput as secondary fallback
              if (data.Source === 'server') {
                if (data.Data.TCPInfo?.MinRTT) {
                  const rttMs = data.Data.TCPInfo.MinRTT / 1000; // µs → ms
                  lastPing = rttMs;
                  rttSamples.push(rttMs);
                }
                // Secondary fallback: compute download throughput from server-reported bytes
                if (lastDlSpeed === null && data.Data.NumBytes && data.Data.ElapsedTime && data.Data.ElapsedTime > 0) {
                  lastDlSpeed = (data.Data.NumBytes * 8) / data.Data.ElapsedTime; // bits/µs = Mbps
                }
              }

              const elapsed = Date.now() - dlStartTime;
              const dlProgress = Math.min(100, (elapsed / 10000) * 100);

              onProgress({
                phase: 'download',
                currentProvider: 'M-Lab NDT7',
                ping: lastPing,
                jitter: computeJitter(rttSamples),
                downloadSpeed: lastDlSpeed,
                uploadSpeed: null,
                packetLoss: null,
                downloadProgress: dlProgress,
                uploadProgress: 0,
                serverName,
                error: null,
              });
            },

            downloadComplete: (data: any) => {
              // Fallback: use LastClientMeasurement if streaming measurements missed
              if (lastDlSpeed === null && data?.LastClientMeasurement?.MeanClientMbps !== undefined) {
                lastDlSpeed = data.LastClientMeasurement.MeanClientMbps;
              }
              // Fallback: use LastServerMeasurement for ping
              if (lastPing === null && data?.LastServerMeasurement?.TCPInfo?.MinRTT) {
                lastPing = data.LastServerMeasurement.TCPInfo.MinRTT / 1000;
                rttSamples.push(lastPing);
              }
              if (lastDlSpeed !== null) allDlSpeeds.push(lastDlSpeed);
              if (lastPing !== null) allPings.push(lastPing);
              console.log('[NDT7] Download complete:', { download: lastDlSpeed, ping: lastPing });
              ulStartTime = Date.now();
              onProgress({
                phase: 'upload',
                currentProvider: 'M-Lab NDT7',
                ping: lastPing,
                jitter: computeJitter(rttSamples),
                downloadSpeed: lastDlSpeed,
                uploadSpeed: null,
                packetLoss: null,
                downloadProgress: 100,
                uploadProgress: 0,
                serverName,
                error: null,
              });
            },

            uploadMeasurement: (data: {
              Source: string;
              Data: {
                MeanClientMbps?: number;
                ElapsedTime?: number;
              };
            }) => {
              if (this.aborted) return;

              if (data.Source === 'client' && data.Data.MeanClientMbps !== undefined) {
                lastUlSpeed = data.Data.MeanClientMbps;
              }

              const elapsed = Date.now() - (ulStartTime || Date.now());
              const ulProgress = Math.min(100, (elapsed / 10000) * 100);

              onProgress({
                phase: 'upload',
                currentProvider: 'M-Lab NDT7',
                ping: lastPing,
                jitter: computeJitter(rttSamples),
                downloadSpeed: lastDlSpeed,
                uploadSpeed: lastUlSpeed,
                packetLoss: null,
                downloadProgress: 100,
                uploadProgress: ulProgress,
                serverName,
                error: null,
              });
            },

            uploadComplete: (data: any) => {
              // Fallback: use LastClientMeasurement if streaming measurements missed
              if (lastUlSpeed === null && data?.LastClientMeasurement?.MeanClientMbps !== undefined) {
                lastUlSpeed = data.LastClientMeasurement.MeanClientMbps;
              }
              if (lastUlSpeed !== null) allUlSpeeds.push(lastUlSpeed);
              console.log('[NDT7] Upload complete:', { upload: lastUlSpeed });
              resolve();
            },

            error: (err: string | Error) => {
              const msg = typeof err === 'string' ? err : err.message;
              console.warn('[NDT7] Error:', msg);
              reject(new Error(msg));
            },
          },
        );
      });
    }

    this.revokeWorkerUrls();

    const avgDl = allDlSpeeds.length > 0 ? allDlSpeeds.reduce((a, b) => a + b, 0) / allDlSpeeds.length : (lastDlSpeed ?? 0);
    const avgUl = allUlSpeeds.length > 0 ? allUlSpeeds.reduce((a, b) => a + b, 0) / allUlSpeeds.length : (lastUlSpeed ?? 0);
    const avgPing = allPings.length > 0 ? allPings.reduce((a, b) => a + b, 0) / allPings.length : (lastPing ?? 0);

    console.log('[NDT7] Final:', { download: avgDl, upload: avgUl, ping: avgPing, jitter: computeJitter(rttSamples) });

    return {
      provider: 'ndt7',
      ping: avgPing,
      jitter: computeJitter(rttSamples),
      downloadSpeed: avgDl,
      uploadSpeed: avgUl,
      packetLoss: null,
      serverName,
      timestamp: Date.now(),
    };
  }

  stop() {
    this.aborted = true;
    this.revokeWorkerUrls();
  }

  private revokeWorkerUrls() {
    if (this.downloadWorkerUrl) {
      URL.revokeObjectURL(this.downloadWorkerUrl);
      this.downloadWorkerUrl = null;
    }
    if (this.uploadWorkerUrl) {
      URL.revokeObjectURL(this.uploadWorkerUrl);
      this.uploadWorkerUrl = null;
    }
  }
}

function computeJitter(samples: number[]): number {
  if (samples.length < 2) return 0;
  let totalDiff = 0;
  for (let i = 1; i < samples.length; i++) {
    totalDiff += Math.abs(samples[i] - samples[i - 1]);
  }
  return totalDiff / (samples.length - 1);
}
