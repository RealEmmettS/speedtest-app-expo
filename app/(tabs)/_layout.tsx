import { NativeTabs } from 'expo-router/unstable-native-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(test)">
        <NativeTabs.Trigger.Icon
          md="speed"
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="speedometer" />}
        />
        <NativeTabs.Trigger.Label>Speed Test</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon
          md="settings"
          src={<NativeTabs.Trigger.VectorIcon family={Ionicons} name="settings-sharp" />}
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
