import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme/tokens';

interface SpeakerGrillProps {
  width: number;
  height?: number;
}

export default function SpeakerGrill({ width, height = 40 }: SpeakerGrillProps) {
  const dotSize = 3;
  const gap = 8;
  const cols = Math.floor((width - 24) / gap);
  const rows = Math.floor(height / gap);

  return (
    <View style={{ height, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }}>
      <Svg width={cols * gap} height={rows * gap}>
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => (
            <Circle
              key={`${row}-${col}`}
              cx={col * gap + gap / 2}
              cy={row * gap + gap / 2}
              r={dotSize / 2}
              fill={colors.ink}
              opacity={0.15}
            />
          ))
        )}
      </Svg>
    </View>
  );
}
