import { View, Text } from 'react-native';
import { useNetworkInfo } from '@/hooks/use-network-info';
import { colors, borders, typography } from '@/theme/tokens';

export default function NetworkBadge() {
  const { type, isConnected } = useNetworkInfo();

  const label = isConnected ? type.replace('NetworkStateType.', '').toUpperCase() : 'OFFLINE';

  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: borders.radiusPill,
        borderWidth: 1.5,
        borderColor: isConnected ? colors.ink : colors.error,
        backgroundColor: isConnected ? 'transparent' : colors.errorFaint,
      }}
    >
      <Text
        style={{
          ...typography.metaLabel,
          fontSize: 8,
          color: isConnected ? colors.ink : colors.error,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
