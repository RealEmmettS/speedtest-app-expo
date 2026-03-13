import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, typography, spacing } from '@/theme/tokens';
import CrosshairCorners from '@/components/ui/crosshair-corners';

interface SplitRowProps {
  ping: number | null;
  jitter: number | null;
  pingBreakdown?: string;
  jitterBreakdown?: string;
}

export default function SplitRow({ ping, jitter, pingBreakdown, jitterBreakdown }: SplitRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: 2,
        borderTopColor: colors.ink,
      }}
    >
      {/* Ping */}
      <View style={{ flex: 1, paddingVertical: spacing.dataRowPaddingVertical, paddingHorizontal: spacing.dataRowPaddingHorizontal, position: 'relative' }}>
        <CrosshairCorners />
        <Text style={typography.metaLabel}>PING</Text>
        <Animated.View entering={FadeIn.duration(200)} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
          <Text selectable style={{ ...typography.numberMedium, color: colors.ink }}>
            {ping != null ? ping.toFixed(1) : '—'}
          </Text>
          <Text style={{ ...typography.unit, color: colors.ink, fontSize: 12 }}>ms</Text>
        </Animated.View>
        {pingBreakdown && (
          <Text style={{ ...typography.metaValue, color: colors.ink, opacity: 0.5, marginTop: 2, fontSize: 11 }}>
            {pingBreakdown}
          </Text>
        )}
      </View>

      {/* Divider */}
      <View style={{ width: 2, backgroundColor: colors.ink }} />

      {/* Jitter */}
      <View style={{ flex: 1, paddingVertical: spacing.dataRowPaddingVertical, paddingHorizontal: spacing.dataRowPaddingHorizontal, position: 'relative' }}>
        <CrosshairCorners />
        <Text style={typography.metaLabel}>JITTER</Text>
        <Animated.View entering={FadeIn.duration(200)} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
          <Text selectable style={{ ...typography.numberMedium, color: colors.ink }}>
            {jitter != null ? jitter.toFixed(1) : '—'}
          </Text>
          <Text style={{ ...typography.unit, color: colors.ink, fontSize: 12 }}>ms</Text>
        </Animated.View>
        {jitterBreakdown && (
          <Text style={{ ...typography.metaValue, color: colors.ink, opacity: 0.5, marginTop: 2, fontSize: 11 }}>
            {jitterBreakdown}
          </Text>
        )}
      </View>
    </View>
  );
}
