import { Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Svg, { Polygon, Rect, Path } from 'react-native-svg';
import { colors, borders } from '@/theme/tokens';
import { TestPhase } from '@/types/speedtest';

interface ActionButtonProps {
  phase: TestPhase;
  onPress: () => void;
  size?: number;
}

export default function ActionButton({ phase, onPress, size = 64 }: ActionButtonProps) {
  const isRunning = phase !== 'idle' && phase !== 'complete' && phase !== 'error';

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    onPress();
  };

  const iconSize = size * 0.35;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        borderWidth: borders.strokeWidth,
        borderColor: colors.ink,
      })}
    >
      <BlurView
        intensity={40}
        tint="light"
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
          {isRunning ? (
            // Stop icon (square)
            <Rect x={4} y={4} width={16} height={16} fill={colors.ink} rx={2} />
          ) : phase === 'complete' ? (
            // Checkmark
            <Path
              d="M4 12l6 6L20 6"
              stroke={colors.ink}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            // Play icon (triangle)
            <Polygon points="6,3 21,12 6,21" fill={colors.ink} />
          )}
        </Svg>
      </BlurView>
    </Pressable>
  );
}
