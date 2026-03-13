import { useState, useCallback, useRef } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import {
  TestPhase,
  SpeedTestProgress,
  SpeedTestResult,
  DnsCheckResult,
  Settings,
  SerializedSettings,
  initialProgress,
  formatSpeed,
} from '@/types/speedtest';

export function useSpeedTest(settings: Settings) {
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [progress, setProgress] = useState<SpeedTestProgress>(initialProgress());
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [dnsCheck, setDnsCheck] = useState<DnsCheckResult | null>(null);

  // DOM component bridge state
  const [command, setCommand] = useState<'idle' | 'start' | 'stop'>('idle');
  const [commandId, setCommandId] = useState(0);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const getSerializedSettings = useCallback((): SerializedSettings => {
    const s = settingsRef.current;
    // If NDT7 is selected but consent not given, fall back to cloudflare
    let providerMode = s.providerMode;
    if (providerMode === 'ndt7' && !s.dataPolicyAccepted) {
      providerMode = 'cloudflare';
    }
    if (providerMode === 'both' && !s.dataPolicyAccepted) {
      providerMode = 'cloudflare';
    }
    return {
      providerMode,
      testDuration: s.testDuration,
      dataPolicyAccepted: s.dataPolicyAccepted,
    };
  }, []);

  const handleProgress = useCallback(async (p: SpeedTestProgress) => {
    setProgress(p);
    setPhase(p.phase);
  }, []);

  const handleResult = useCallback(async (r: SpeedTestResult) => {
    setResult(r);
    setPhase('complete');
    setCommand('idle');

    // Haptic feedback on completion (iOS only)
    if (process.env.EXPO_OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Auto-copy results
    if (settingsRef.current.autoCopyResults) {
      const formatted = formatResultsText(r, settingsRef.current);
      try {
        await Clipboard.setStringAsync(formatted);
      } catch {
        // clipboard may fail silently
      }
    }
  }, []);

  const handleDnsUpdate = useCallback(async (d: DnsCheckResult) => {
    setDnsCheck(d);
  }, []);

  const handleError = useCallback(async (error: string) => {
    setPhase('error');
    setProgress((prev) => ({ ...prev, phase: 'error', error }));
    setCommand('idle');

    // Haptic feedback on error (iOS only)
    if (process.env.EXPO_OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  const startTest = useCallback(() => {
    setResult(null);
    setDnsCheck(null);
    setProgress(initialProgress());
    setPhase('discovering');
    setCommand('start');
    setCommandId((prev) => prev + 1);
  }, []);

  const stopTest = useCallback(() => {
    setCommand('stop');
    setCommandId((prev) => prev + 1);
    setPhase('idle');
    setProgress(initialProgress());
  }, []);

  const resetTest = useCallback(() => {
    setResult(null);
    setDnsCheck(null);
    setProgress(initialProgress());
    setPhase('idle');
    setCommand('idle');
  }, []);

  return {
    phase,
    progress,
    result,
    dnsCheck,
    command,
    commandId,
    serializedSettings: getSerializedSettings(),
    startTest,
    stopTest,
    resetTest,
    handleProgress,
    handleResult,
    handleDnsUpdate,
    handleError,
  };
}

function formatResultsText(r: SpeedTestResult, settings: Settings): string {
  const dl = formatSpeed(r.downloadSpeed, settings.speedUnit);
  const ul = formatSpeed(r.uploadSpeed, settings.speedUnit);
  const lines = [
    'SpeedQX Results',
    '─────────────────────────',
    `Ping: ${r.ping.toFixed(1)}ms | Jitter: ${r.jitter.toFixed(1)}ms`,
    `Download: ${dl.value} ${dl.unit}`,
    `Upload: ${ul.value} ${ul.unit}`,
  ];
  if (r.packetLoss != null) {
    lines.push(`Packet Loss: ${r.packetLoss.toFixed(2)}%`);
  }
  if (r.dnsCheck) {
    const passed = r.dnsCheck.probes.filter((p) => p.status === 'pass').length;
    const avg = r.dnsCheck.avgTotalMs?.toFixed(0) ?? '—';
    lines.push(`DNS: ${passed}/${r.dnsCheck.probes.length} reachable (${avg}ms avg)`);
  }
  lines.push(`Provider: ${r.provider}`);
  lines.push(`Server: ${r.serverName}`);
  return lines.join('\n');
}
