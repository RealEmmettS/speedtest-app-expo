import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface CrtOverlayProps {
  width: number;
  height: number;
}

export default function CrtOverlay({ width, height }: CrtOverlayProps) {
  const lineCount = Math.floor(height / 4);

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        opacity: 0.04,
      }}
    >
      <Svg width={width} height={height}>
        {Array.from({ length: lineCount }).map((_, i) => (
          <Line
            key={i}
            x1={0}
            y1={i * 4}
            x2={width}
            y2={i * 4}
            stroke="#000"
            strokeWidth={1}
          />
        ))}
      </Svg>
    </View>
  );
}
