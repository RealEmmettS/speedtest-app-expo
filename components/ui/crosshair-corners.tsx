import { View } from 'react-native';
import { colors } from '@/theme/tokens';

const CORNER_SIZE = 8;
const CORNER_WIDTH = 1;

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isTop = position.startsWith('t');
  const isLeft = position.endsWith('l');

  return (
    <View
      style={{
        position: 'absolute',
        top: isTop ? -1 : undefined,
        bottom: !isTop ? -1 : undefined,
        left: isLeft ? -1 : undefined,
        right: !isLeft ? -1 : undefined,
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: colors.ink,
        borderTopWidth: isTop ? CORNER_WIDTH : 0,
        borderBottomWidth: !isTop ? CORNER_WIDTH : 0,
        borderLeftWidth: isLeft ? CORNER_WIDTH : 0,
        borderRightWidth: !isLeft ? CORNER_WIDTH : 0,
      }}
    />
  );
}

export default function CrosshairCorners() {
  return (
    <>
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
    </>
  );
}
