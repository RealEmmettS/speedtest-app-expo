import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { colors } from '@/theme/tokens';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface TapeReelProps {
  size: number;
  isSpinning: boolean;
  speed: number; // Mbps — controls spin duration
}

const SPOKE_COUNT = 6;

export default function TapeReel({ size, isSpinning, speed }: TapeReelProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isSpinning) {
      const duration = Math.max(150, 400 - (speed / 1000) * 250);
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [isSpinning, speed, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const center = size / 2;
  const outerRadius = size / 2 - 2;
  const innerRadius = size * 0.15;
  const spokeLength = outerRadius - innerRadius;

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer ring */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={colors.ink}
          strokeWidth={2.5}
        />
        {/* Inner hub */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill={colors.bgDevice}
          stroke={colors.ink}
          strokeWidth={2}
        />
        {/* Center dot */}
        <Circle
          cx={center}
          cy={center}
          r={4}
          fill={colors.ink}
        />
        {/* Spokes */}
        <G>
          {Array.from({ length: SPOKE_COUNT }).map((_, i) => {
            const angle = (i * 360) / SPOKE_COUNT;
            const rad = (angle * Math.PI) / 180;
            const x1 = center + Math.cos(rad) * innerRadius;
            const y1 = center + Math.sin(rad) * innerRadius;
            const x2 = center + Math.cos(rad) * (innerRadius + spokeLength * 0.7);
            const y2 = center + Math.sin(rad) * (innerRadius + spokeLength * 0.7);
            return (
              <Line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={colors.ink}
                strokeWidth={1.5}
              />
            );
          })}
        </G>
        {/* Decorative ring */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius * 0.6}
          fill="none"
          stroke={colors.ink}
          strokeWidth={0.8}
          opacity={0.3}
        />
      </Svg>
    </Animated.View>
  );
}
