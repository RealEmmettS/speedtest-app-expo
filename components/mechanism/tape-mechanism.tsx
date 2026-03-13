import { View, Text, useWindowDimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { colors, typography } from '@/theme/tokens';
import TapeReel from './tape-reel';
import ActionButton from '@/components/ui/action-button';
import { TestPhase } from '@/types/speedtest';

interface TapeMechanismProps {
  phase: TestPhase;
  currentProvider: string;
  speed: number;
  onAction: () => void;
}

function getStatusText(phase: TestPhase): string {
  switch (phase) {
    case 'idle': return 'PRESS TO START';
    case 'discovering': return 'CONNECTING';
    case 'latency': return 'MEASURING LATENCY';
    case 'download': return 'TESTING DOWNLOAD';
    case 'upload': return 'TESTING UPLOAD';
    case 'complete': return 'SYSTEM STANDBY';
    case 'error': return 'CONNECTION FAILURE';
    default: return '';
  }
}

export default function TapeMechanism({ phase, currentProvider, speed, onAction }: TapeMechanismProps) {
  const { width } = useWindowDimensions();
  const isRunning = phase !== 'idle' && phase !== 'complete' && phase !== 'error';
  const reelSize = Math.min(width * 0.28, 120);
  const gapBetweenReels = reelSize * 0.8;

  return (
    <View style={{ alignItems: 'center', paddingVertical: 16 }}>
      {/* Status text */}
      <Text
        style={{
          ...typography.metaLabel,
          fontSize: 11,
          color: phase === 'error' ? colors.error : colors.ink,
          marginBottom: 16,
        }}
      >
        {getStatusText(phase)}
      </Text>

      {/* Reels + button assembly */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: gapBetweenReels }}>
        <TapeReel size={reelSize} isSpinning={isRunning} speed={speed} />

        {/* Connecting tape line (SVG behind button) */}
        <View
          style={{
            position: 'absolute',
            left: reelSize / 2,
            right: reelSize / 2,
            top: reelSize / 2,
            height: 2,
          }}
        >
          <Svg width={reelSize + gapBetweenReels} height={2}>
            <Line
              x1={0}
              y1={1}
              x2={reelSize + gapBetweenReels}
              y2={1}
              stroke={colors.ink}
              strokeWidth={1.5}
              opacity={0.3}
            />
          </Svg>
        </View>

        {/* Action button overlaid at center */}
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <ActionButton phase={phase} onPress={onAction} />
        </View>

        <TapeReel size={reelSize} isSpinning={isRunning} speed={speed} />
      </View>

      {/* Provider label */}
      {currentProvider ? (
        <Text
          style={{
            ...typography.metaLabel,
            fontSize: 9,
            marginTop: 12,
            opacity: 0.5,
          }}
        >
          VIA {currentProvider.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}
