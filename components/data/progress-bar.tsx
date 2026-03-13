import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
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
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming((clampedProgress / 100) * containerWidth, { duration: 300 }),
  }));

  return (
    <View
      onLayout={onLayout}
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
