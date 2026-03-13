import { Platform } from 'react-native';
import { Stack } from 'expo-router/stack';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: Platform.OS === 'ios',
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerTitleStyle: { color: '#111111' },
        headerLargeTitle: true,
        headerBlurEffect: 'none',
        headerBackButtonDisplayMode: 'minimal',
        ...(Platform.OS === 'android' && {
          headerStyle: { backgroundColor: '#e9e9e9' },
        }),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
    </Stack>
  );
}
