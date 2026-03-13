# Changelog

All notable changes to QubeTX Speed Test will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-13

### Added

#### Speed Testing
- Dual-provider speed testing: Cloudflare and M-Lab NDT7
- Aggregated measurement mode averages results across both providers
- Configurable test duration: auto, 15s, 30s, 1min, 2min, 5min, 10min
- DNS connectivity diagnostics probing 8 major domains in parallel
- Real-time progress tracking during download and upload phases
- Auto-copy formatted results to clipboard on test completion
- Auto unit conversion: Mbps, Kbps, Gbps with manual override

#### User Interface
- Retro cassette tape UI faithfully ported from web app
- Animated SVG tape reels with speed-proportional spin rate
- Frosted glass action button (play/stop/reset) with expo-blur
- Data panel: ping/jitter split row, download/upload rows with progress bars
- DNS bar with colored status dots and expandable domain detail overlay
- "TEST COMPLETE" results stamp with bounce animation
- CRT scanline overlay effect and speaker grill pattern
- Top bar with network badge, server name, and real-time clock
- Crosshair corner decorations on data rows
- Error state UI with red border and "CONNECTION FAILURE" status
- SHAUGHV brandmark integrated as subtle brand nod

#### Navigation & Settings
- NativeTabs navigation (Speed Test + Settings)
- Settings screen: provider mode, test duration, speed unit, auto-copy, sound effects
- M-Lab data policy consent modal (formSheet presentation)
- Settings persisted via AsyncStorage

#### Technical
- Expo SDK 55 with New Architecture enabled
- Speed test engine runs as Expo DOM component (web libraries in webview)
- React Native Reanimated 4 for all animations
- react-native-svg for tape reels and decorative patterns
- Inter font family (400-800 weights) via @expo-google-fonts
- Haptic feedback on iOS (action button, completion, errors)
- EAS build configuration for production, preview, and development
- iOS and Android App Store/Play Store ready
- Responsive layout scaling via useWindowDimensions
- Thorough README with architecture docs and getting started guide
