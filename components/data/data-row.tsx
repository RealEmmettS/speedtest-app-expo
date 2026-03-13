import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, typography, spacing } from '@/theme/tokens';
import ProgressBar from './progress-bar';
import CrosshairCorners from '@/components/ui/crosshair-corners';
import { formatSpeed, SpeedUnit } from '@/types/speedtest';

type RowStatus = 'idle' | 'waiting' | 'active' | 'complete' | 'avg' | 'failed';

interface DataRowProps {
  label: string;
  value: number | null;
  unit: SpeedUnit;
  status: RowStatus;
  progress?: number;
  breakdown?: string;
}

export default function DataRow({ label, value, unit, status, progress, breakdown }: DataRowProps) {
  const formatted = value != null ? formatSpeed(value, unit) : { value: '—', unit: '' };
  const showProgress = status === 'active' && progress != null;

  return (
    <View
      style={{
        paddingVertical: spacing.dataRowPaddingVertical,
        paddingHorizontal: spacing.dataRowPaddingHorizontal,
        borderTopWidth: 2,
        borderTopColor: colors.ink,
        position: 'relative',
      }}
    >
      <CrosshairCorners />

      {/* Meta label */}
      <Text style={typography.metaLabel}>{label}</Text>

      {/* Large number */}
      <Animated.View entering={FadeIn.duration(200)} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
        <Text
          selectable
          style={{
            ...typography.numberLarge,
            color: status === 'failed' ? colors.error : colors.ink,
          }}
        >
          {formatted.value}
        </Text>
        {formatted.unit ? (
          <Text style={{ ...typography.unit, color: colors.ink }}>
            {formatted.unit}
          </Text>
        ) : null}

        {/* Status badge */}
        {(status === 'avg' || status === 'waiting') && (
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: colors.ink,
              marginLeft: 4,
            }}
          >
            <Text style={{ ...typography.metaLabel, fontSize: 8 }}>
              {status === 'avg' ? 'AVG' : 'WAIT'}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Breakdown text */}
      {breakdown && (
        <Text style={{ ...typography.metaValue, color: colors.ink, opacity: 0.5, marginTop: 2, fontSize: 11 }}>
          {breakdown}
        </Text>
      )}

      {/* Progress bar */}
      {showProgress && (
        <View style={{ marginTop: 8 }}>
          <ProgressBar progress={progress} />
        </View>
      )}
    </View>
  );
}
