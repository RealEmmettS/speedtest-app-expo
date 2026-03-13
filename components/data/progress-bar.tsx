import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/tokens';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
}

export default function ProgressBar({ progress, height = 4 }: ProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${Math.min(100, Math.max(0, progress))}%`, { duration: 300 }),
  }));

  return (
    <View
      style={{
        height,
        backgroundColor: colors.bgScreen,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: colors.ink,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
