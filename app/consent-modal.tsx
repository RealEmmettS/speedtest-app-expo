import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, borders } from '@/theme/tokens';
import { useSpeedTestContext } from '@/store/speed-test-context';

export default function ConsentModal() {
  const router = useRouter();
  const { updateSettings } = useSpeedTestContext();

  const handleAccept = () => {
    updateSettings({ dataPolicyAccepted: true });
    router.back();
  };

  const handleDecline = () => {
    updateSettings({ dataPolicyAccepted: false, providerMode: 'cloudflare' });
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, gap: 20 }}
      style={{ flex: 1, backgroundColor: colors.bgCanvas }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamilyBold,
          fontSize: 22,
          color: colors.ink,
        }}
      >
        M-Lab Data Policy
      </Text>

      <Text
        style={{
          fontFamily: typography.fontFamily,
          fontSize: 15,
          color: colors.ink,
          lineHeight: 22,
        }}
      >
        M-Lab NDT7 is an open-source speed test developed by Measurement Lab, a consortium of
        research, industry, and public-interest partners.
      </Text>

      <Text
        style={{
          fontFamily: typography.fontFamily,
          fontSize: 15,
          color: colors.ink,
          lineHeight: 22,
        }}
      >
        By using the NDT7 speed test, you agree that your IP address and test results will be
        published as open data. This data is used to study internet performance and inform policy
        decisions.
      </Text>

      <Text
        style={{
          fontFamily: typography.fontFamilySemiBold,
          fontSize: 15,
          color: colors.ink,
          lineHeight: 22,
        }}
      >
        Data collected includes:
      </Text>

      <View style={{ gap: 4, paddingLeft: 16 }}>
        {[
          'Your public IP address',
          'Download and upload speeds',
          'Latency measurements',
          'Connection metadata',
        ].map((item) => (
          <Text key={item} style={{ fontFamily: typography.fontFamily, fontSize: 14, color: colors.ink, lineHeight: 20 }}>
            {'\u2022'} {item}
          </Text>
        ))}
      </View>

      <Text
        style={{
          fontFamily: typography.fontFamily,
          fontSize: 13,
          color: colors.ink,
          opacity: 0.6,
          lineHeight: 18,
        }}
      >
        If you decline, only the Cloudflare speed test will be used, which does not publish your
        data.
      </Text>

      {/* Buttons */}
      <View style={{ gap: 12, marginTop: 8 }}>
        <Pressable
          onPress={handleAccept}
          style={({ pressed }) => ({
            backgroundColor: colors.ink,
            borderRadius: borders.radiusBox,
            borderCurve: 'continuous',
            paddingVertical: 14,
            alignItems: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ fontFamily: typography.fontFamilySemiBold, fontSize: 16, color: colors.paper }}>
            Accept & Enable NDT7
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDecline}
          style={({ pressed }) => ({
            backgroundColor: 'transparent',
            borderRadius: borders.radiusBox,
            borderCurve: 'continuous',
            borderWidth: 2,
            borderColor: colors.ink,
            paddingVertical: 14,
            alignItems: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ fontFamily: typography.fontFamilySemiBold, fontSize: 16, color: colors.ink }}>
            Decline
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
