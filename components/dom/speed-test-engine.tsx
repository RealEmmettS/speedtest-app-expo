'use dom';

import { useEffect, useRef } from 'react';
import type { SpeedTestProgress, SpeedTestResult, DnsCheckResult, SerializedSettings } from '@/types/speedtest';

interface Props {
  command: 'idle' | 'start' | 'stop';
  commandId: number;
  settings: SerializedSettings;
  onProgress: (progress: SpeedTestProgress) => Promise<void>;
  onResult: (result: SpeedTestResult) => Promise<void>;
  onDnsUpdate: (dnsResult: DnsCheckResult) => Promise<void>;
  onError: (error: string) => Promise<void>;
  dom: import('expo/dom').DOMProps;
}

export default function SpeedTestEngine({
  command,
  commandId,
  settings,
  onProgress,
  onResult,
  onDnsUpdate,
  onError,
}: Props) {
  const providerRef = useRef<any>(null);
  const lastCommandIdRef = useRef(0);

  useEffect(() => {
    if (commandId === lastCommandIdRef.current) return;
    lastCommandIdRef.current = commandId;

    if (command === 'start') {
      runTest();
    } else if (command === 'stop') {
      if (providerRef.current?.stop) {
        providerRef.current.stop();
      }
    }

    async function runTest() {
      try {
        // Dynamic import of provider factory (runs in webview context)
        const { createProvider } = await import('@/services/dom/provider-factory');
        const { runDnsCheck } = await import('@/services/dom/dns-check');

        const provider = createProvider(settings.providerMode);
        providerRef.current = provider;

        // Start DNS check in background
        runDnsCheck().then((result) => {
          onDnsUpdate(result);
        }).catch(() => {
          // DNS check failure is non-blocking
        });

        // Start speed test
        const result = await provider.start(
          (progress: SpeedTestProgress) => {
            onProgress(progress);
          },
          settings.testDuration
        );

        await onResult(result);
      } catch (err: any) {
        await onError(err?.message ?? 'Speed test failed');
      } finally {
        providerRef.current = null;
      }
    }
  }, [command, commandId, settings, onProgress, onResult, onDnsUpdate, onError]);

  // Hidden DOM component — no visible UI
  return <div style={{ width: 0, height: 0, overflow: 'hidden' }} />;
}
