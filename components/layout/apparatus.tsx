import { View, useWindowDimensions } from 'react-native';
import { colors, borders } from '@/theme/tokens';
import TopBar from './top-bar';
import TapeMechanism from '@/components/mechanism/tape-mechanism';
import DataPanel from '@/components/data/data-panel';
import SpeakerGrill from './speaker-grill';
import ResultsStamp from '@/components/effects/results-stamp';
import { useSpeedTestContext } from '@/store/speed-test-context';

export default function Apparatus() {
  const { width } = useWindowDimensions();
  const ctx = useSpeedTestContext();

  const currentSpeed = ctx.progress.downloadSpeed ?? ctx.progress.uploadSpeed ?? 0;

  const handleAction = () => {
    if (ctx.phase === 'idle') {
      ctx.startTest();
    } else if (ctx.phase === 'complete') {
      ctx.resetTest();
    } else if (ctx.phase === 'error') {
      ctx.resetTest();
    } else {
      ctx.stopTest();
    }
  };

  const apparatusWidth = Math.min(width - 32, 500);

  return (
    <View
      style={{
        width: apparatusWidth,
        alignSelf: 'center',
        backgroundColor: colors.bgDevice,
        borderWidth: borders.strokeWidth,
        borderColor: ctx.phase === 'error' ? colors.error : borders.strokeColor,
        borderRadius: borders.radiusBox,
        borderCurve: 'continuous',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <TopBar serverName={ctx.progress.serverName} />

      <TapeMechanism
        phase={ctx.phase}
        currentProvider={ctx.progress.currentProvider}
        speed={currentSpeed}
        onAction={handleAction}
      />

      <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
        <DataPanel
          phase={ctx.phase}
          progress={ctx.progress}
          result={ctx.result}
          dnsCheck={ctx.dnsCheck}
          speedUnit={ctx.settings.speedUnit}
        />
      </View>

      <SpeakerGrill width={apparatusWidth} />

      {/* Results stamp overlay */}
      {ctx.phase === 'complete' && <ResultsStamp />}
    </View>
  );
}
