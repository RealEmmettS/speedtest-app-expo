import { View, Text } from 'react-native';
import { colors, typography, spacing } from '@/theme/tokens';
import NetworkBadge from '@/components/ui/network-badge';
import { useClock } from '@/hooks/use-clock';

interface TopBarProps {
  serverName: string | null;
}

export default function TopBar({ serverName }: TopBarProps) {
  const time = useClock();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.topBarInset,
        paddingVertical: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <Text
          style={{
            fontFamily: typography.fontFamilySemiBold,
            fontSize: 10,
            letterSpacing: 1,
            color: colors.ink,
            textTransform: 'uppercase',
          }}
          numberOfLines={1}
        >
          {serverName ?? 'QUBETX SPEED TEST'}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <NetworkBadge />
        <Text
          style={{
            fontFamily: typography.fontFamily,
            fontSize: 10,
            color: colors.ink,
            opacity: 0.5,
            fontVariant: ['tabular-nums'],
          }}
        >
          {time}
        </Text>
      </View>
    </View>
  );
}
