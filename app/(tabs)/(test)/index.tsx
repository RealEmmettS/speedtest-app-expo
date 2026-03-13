import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';
import Apparatus from '@/components/layout/apparatus';
import SpeedTestEngine from '@/components/dom/speed-test-engine';
import { useSpeedTestContext } from '@/store/speed-test-context';

export default function SpeedTestScreen() {
  const insets = useSafeAreaInsets();
  const ctx = useSpeedTestContext();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 16,
          alignItems: 'center',
        }}
      >
        <Apparatus />

        {/* SHAUGHV brandmark */}
        <Image
          source={{ uri: 'https://shaughv.s3.us-east-1.amazonaws.com/brandmark/SHAUGHV-Official.svg' }}
          style={{ width: 80, height: 32, marginTop: 20, opacity: 0.2 }}
          contentFit="contain"
        />
      </ScrollView>

      {/* Hidden speed test engine (DOM component running in webview) */}
      <SpeedTestEngine
        command={ctx.command}
        commandId={ctx.commandId}
        settings={ctx.serializedSettings}
        onProgress={ctx.handleProgress}
        onResult={ctx.handleResult}
        onDnsUpdate={ctx.handleDnsUpdate}
        onError={ctx.handleError}
        dom={{ style: { width: 0, height: 0, position: 'absolute', opacity: 0 } }}
      />
    </View>
  );
}
