import { ScrollView, View, Text, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography } from '@/theme/tokens';
import { useSpeedTestContext } from '@/store/speed-test-context';
import { ProviderMode, TestDuration, SpeedUnit } from '@/types/speedtest';

const PROVIDER_OPTIONS: { label: string; value: ProviderMode }[] = [
  { label: 'Both (Averaged)', value: 'both' },
  { label: 'Cloudflare Only', value: 'cloudflare' },
  { label: 'M-Lab NDT7 Only', value: 'ndt7' },
];

const DURATION_OPTIONS: { label: string; value: TestDuration }[] = [
  { label: 'Auto', value: 'auto' },
  { label: '15 seconds', value: 15 },
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '2 minutes', value: 120 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
];

const UNIT_OPTIONS: { label: string; value: SpeedUnit }[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Mbps', value: 'Mbps' },
  { label: 'Kbps', value: 'Kbps' },
  { label: 'Gbps', value: 'Gbps' },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        ...typography.metaLabel,
        fontSize: 12,
        color: colors.ink,
        opacity: 0.5,
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 16,
      }}
    >
      {title}
    </Text>
  );
}

function OptionRow({
  label,
  selected,
  onPress,
  isFirst,
  isLast,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.paper,
        borderTopLeftRadius: isFirst ? 10 : 0,
        borderTopRightRadius: isFirst ? 10 : 0,
        borderBottomLeftRadius: isLast ? 10 : 0,
        borderBottomRightRadius: isLast ? 10 : 0,
        borderCurve: 'continuous',
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: colors.bgScreen,
      }}
    >
      <Text style={{ fontFamily: typography.fontFamily, fontSize: 16, color: colors.ink }}>
        {label}
      </Text>
      {selected && (
        <Text style={{ fontSize: 16, color: colors.ink }}>✓</Text>
      )}
    </Pressable>
  );
}

function SwitchRow({
  label,
  value,
  onValueChange,
  description,
  isFirst,
  isLast,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  description?: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.paper,
        borderTopLeftRadius: isFirst ? 10 : 0,
        borderTopRightRadius: isFirst ? 10 : 0,
        borderBottomLeftRadius: isLast ? 10 : 0,
        borderBottomRightRadius: isLast ? 10 : 0,
        borderCurve: 'continuous',
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: colors.bgScreen,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: typography.fontFamily, fontSize: 16, color: colors.ink, flex: 1 }}>
          {label}
        </Text>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
      {description && (
        <Text style={{ fontFamily: typography.fontFamily, fontSize: 12, color: colors.ink, opacity: 0.5, marginTop: 4 }}>
          {description}
        </Text>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, updateSettings } = useSpeedTestContext();
  const router = useRouter();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      style={{ backgroundColor: colors.bgCanvas }}
    >
      {/* Test Provider */}
      <SectionHeader title="TEST PROVIDER" />
      <View>
        {PROVIDER_OPTIONS.map((opt, i) => (
          <OptionRow
            key={opt.value}
            label={opt.label}
            selected={settings.providerMode === opt.value}
            onPress={() => {
              if (opt.value === 'ndt7' && !settings.dataPolicyAccepted) {
                router.push('/consent-modal');
                return;
              }
              if (opt.value === 'both' && !settings.dataPolicyAccepted) {
                router.push('/consent-modal');
                return;
              }
              updateSettings({ providerMode: opt.value });
            }}
            isFirst={i === 0}
            isLast={i === PROVIDER_OPTIONS.length - 1}
          />
        ))}
      </View>

      {/* Test Duration */}
      <SectionHeader title="TEST DURATION" />
      <View>
        {DURATION_OPTIONS.map((opt, i) => (
          <OptionRow
            key={String(opt.value)}
            label={opt.label}
            selected={settings.testDuration === opt.value}
            onPress={() => updateSettings({ testDuration: opt.value })}
            isFirst={i === 0}
            isLast={i === DURATION_OPTIONS.length - 1}
          />
        ))}
      </View>

      {/* Speed Unit */}
      <SectionHeader title="SPEED UNIT" />
      <View>
        {UNIT_OPTIONS.map((opt, i) => (
          <OptionRow
            key={opt.value}
            label={opt.label}
            selected={settings.speedUnit === opt.value}
            onPress={() => updateSettings({ speedUnit: opt.value })}
            isFirst={i === 0}
            isLast={i === UNIT_OPTIONS.length - 1}
          />
        ))}
      </View>

      {/* Toggles */}
      <SectionHeader title="OPTIONS" />
      <View>
        <SwitchRow
          label="Auto-Copy Results"
          value={settings.autoCopyResults}
          onValueChange={(v) => updateSettings({ autoCopyResults: v })}
          description="Copy test results to clipboard when complete"
          isFirst
        />
        <SwitchRow
          label="Sound Effects"
          value={settings.soundEffects}
          onValueChange={(v) => updateSettings({ soundEffects: v })}
          isLast
        />
      </View>

      {/* Data Policy */}
      <SectionHeader title="M-LAB DATA POLICY" />
      <View>
        <SwitchRow
          label="Accept Data Policy"
          value={settings.dataPolicyAccepted}
          onValueChange={(v) => {
            if (v) {
              router.push('/consent-modal');
            } else {
              updateSettings({ dataPolicyAccepted: false });
              if (settings.providerMode !== 'cloudflare') {
                updateSettings({ providerMode: 'cloudflare' });
              }
            }
          }}
          description="M-Lab NDT7 publishes your IP address and test results as open data. Required for NDT7 provider."
          isFirst
          isLast
        />
      </View>
    </ScrollView>
  );
}
