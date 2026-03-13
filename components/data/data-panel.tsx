import { View } from 'react-native';
import { colors, borders } from '@/theme/tokens';
import SplitRow from './split-row';
import DataRow from './data-row';
import DnsBar from './dns-bar';
import { SpeedTestProgress, SpeedTestResult, DnsCheckResult, SpeedUnit, TestPhase } from '@/types/speedtest';

interface DataPanelProps {
  phase: TestPhase;
  progress: SpeedTestProgress;
  result: SpeedTestResult | null;
  dnsCheck: DnsCheckResult | null;
  speedUnit: SpeedUnit;
}

function getRowStatus(phase: TestPhase, activePhase: string, hasValue: boolean, isAggregated: boolean) {
  if (phase === 'error') return 'failed' as const;
  if (phase === 'complete') return isAggregated ? 'avg' as const : 'complete' as const;
  if (phase === activePhase) return 'active' as const;
  if (hasValue) return 'complete' as const;
  if (phase !== 'idle') return 'waiting' as const;
  return 'idle' as const;
}

function getBreakdown(result: SpeedTestResult | null, metric: 'ping' | 'jitter' | 'downloadSpeed' | 'uploadSpeed'): string | undefined {
  if (!result?.providerResults) return undefined;
  const cf = result.providerResults.cloudflare;
  const ndt = result.providerResults.ndt7;
  if (!cf && !ndt) return undefined;

  const cfVal = cf?.[metric];
  const ndtVal = ndt?.[metric];
  if (cfVal == null && ndtVal == null) return undefined;

  const parts: string[] = [];
  if (cfVal != null) {
    const v = metric.includes('Speed') ? `${cfVal.toFixed(0)}` : `${cfVal.toFixed(1)}`;
    parts.push(`CF: ${v}`);
  }
  if (ndtVal != null) {
    const v = metric.includes('Speed') ? `${ndtVal.toFixed(0)}` : `${ndtVal.toFixed(1)}`;
    parts.push(`NDT: ${v}`);
  }
  return parts.join(' \u00B7 ');
}

export default function DataPanel({ phase, progress, result, dnsCheck, speedUnit }: DataPanelProps) {
  const isRunning = phase !== 'idle' && phase !== 'complete' && phase !== 'error';
  const isAggregated = !!result?.providerResults;

  // Use result values when complete, progress values otherwise
  const ping = phase === 'complete' ? result?.ping ?? null : progress.ping;
  const jitter = phase === 'complete' ? result?.jitter ?? null : progress.jitter;
  const download = phase === 'complete' ? result?.downloadSpeed ?? null : progress.downloadSpeed;
  const upload = phase === 'complete' ? result?.uploadSpeed ?? null : progress.uploadSpeed;

  return (
    <View
      style={{
        backgroundColor: colors.bgScreen,
        borderWidth: borders.strokeWidth,
        borderColor: borders.strokeColor,
        borderRadius: borders.radiusBox,
        borderCurve: 'continuous',
        overflow: 'hidden',
      }}
    >
      <SplitRow
        ping={ping}
        jitter={jitter}
        pingBreakdown={getBreakdown(result, 'ping')}
        jitterBreakdown={getBreakdown(result, 'jitter')}
      />
      <DataRow
        label="DOWNLOAD"
        value={download}
        unit={speedUnit}
        status={getRowStatus(phase, 'download', download != null, isAggregated)}
        progress={progress.downloadProgress}
        breakdown={getBreakdown(result, 'downloadSpeed')}
      />
      <DataRow
        label="UPLOAD"
        value={upload}
        unit={speedUnit}
        status={getRowStatus(phase, 'upload', upload != null, isAggregated)}
        progress={progress.uploadProgress}
        breakdown={getBreakdown(result, 'uploadSpeed')}
      />
      <DnsBar dnsCheck={dnsCheck} isRunning={isRunning} />
    </View>
  );
}
