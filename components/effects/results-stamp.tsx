import { Text, View } from 'react-native';
import Animated, { BounceIn } from 'react-native-reanimated';
import { colors, typography } from '@/theme/tokens';

export default function ResultsStamp() {
  return (
    <View
      style={{
        position: 'absolute',
        top: '30%',
        left: '10%',
        right: '10%',
        alignItems: 'center',
        zIndex: 10,
        transform: [{ rotate: '-12deg' }],
      }}
    >
      <Animated.View
        entering={BounceIn.duration(600)}
        style={{
          borderWidth: 3,
          borderColor: colors.ink,
          borderRadius: 8,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: 'rgba(244, 244, 244, 0.9)',
        }}
      >
        <Text
          style={{
            fontFamily: typography.fontFamilyExtraBold,
            fontSize: 20,
            letterSpacing: 4,
            color: colors.ink,
            textAlign: 'center',
          }}
        >
          TEST COMPLETE
        </Text>
      </Animated.View>
    </View>
  );
}
