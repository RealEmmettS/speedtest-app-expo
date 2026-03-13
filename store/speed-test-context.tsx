import { createContext, ReactNode } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { useSpeedTest } from '@/hooks/use-speed-test';
import {
  TestPhase,
  SpeedTestProgress,
  SpeedTestResult,
  DnsCheckResult,
  Settings,
  SerializedSettings,
} from '@/types/speedtest';

interface SpeedTestContextValue {
  // State
  phase: TestPhase;
  progress: SpeedTestProgress;
  result: SpeedTestResult | null;
  dnsCheck: DnsCheckResult | null;
  settings: Settings;
  settingsLoaded: boolean;

  // DOM bridge
  command: 'idle' | 'start' | 'stop';
  commandId: number;
  serializedSettings: SerializedSettings;

  // Actions
  startTest: () => void;
  stopTest: () => void;
  resetTest: () => void;
  updateSettings: (updates: Partial<Settings>) => void;

  // DOM callbacks
  handleProgress: (p: SpeedTestProgress) => Promise<void>;
  handleResult: (r: SpeedTestResult) => Promise<void>;
  handleDnsUpdate: (d: DnsCheckResult) => Promise<void>;
  handleError: (error: string) => Promise<void>;
}

export const SpeedTestContext = createContext<SpeedTestContextValue | null>(null);

export function SpeedTestContextProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings, loaded } = useSettings();
  const speedTest = useSpeedTest(settings);

  const value: SpeedTestContextValue = {
    phase: speedTest.phase,
    progress: speedTest.progress,
    result: speedTest.result,
    dnsCheck: speedTest.dnsCheck,
    settings,
    settingsLoaded: loaded,
    command: speedTest.command,
    commandId: speedTest.commandId,
    serializedSettings: speedTest.serializedSettings,
    startTest: speedTest.startTest,
    stopTest: speedTest.stopTest,
    resetTest: speedTest.resetTest,
    updateSettings,
    handleProgress: speedTest.handleProgress,
    handleResult: speedTest.handleResult,
    handleDnsUpdate: speedTest.handleDnsUpdate,
    handleError: speedTest.handleError,
  };

  return (
    <SpeedTestContext value={value}>
      {children}
    </SpeedTestContext>
  );
}

export function useSpeedTestContext(): SpeedTestContextValue {
  const ctx = require('react').use(SpeedTestContext);
  if (!ctx) throw new Error('useSpeedTestContext must be used within SpeedTestContextProvider');
  return ctx;
}
