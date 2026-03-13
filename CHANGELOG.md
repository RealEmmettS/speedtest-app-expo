# Changelog

All notable changes to QubeTX Speed Test will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-03-13

### Fixed
- Tab bar icons not appearing on iOS — SF Symbols via `sf` prop silently fail to render in Expo Go; switched to `@expo/vector-icons/Ionicons` via `NativeTabs.Trigger.VectorIcon` for reliable cross-platform icon rendering while keeping native Material `md` icons on Android
- Tab bar icons invisible on iOS due to white tint on light background — added `iconColor="#111111"` to NativeTabs for consistent dark icon rendering
- Android Settings page content overlapping camera hole and status bar — `headerTransparent: true` caused content to render behind the header on Android since `contentInsetAdjustmentBehavior` is iOS-only; made `headerTransparent` conditional (`Platform.OS === 'ios'`) and added solid header background on Android

### Added
- `@expo/vector-icons` dependency for tab bar icon rendering

---

## [1.0.2] - 2026-03-13

### Fixed
- Tab bar icons not appearing on iOS — replaced invalid SF Symbol name `gauge.open.with.lines.needle.84percent.exclamation` with standard `speedometer`; changed `gear` to `gearshape` for consistency
- Action button (play/stop/check) off-center in cassette tape mechanism on both platforms — replaced unreliable percentage-based absolute positioning (`left: '50%'` + `translateX`) with a full-width flexbox overlay for reliable cross-platform centering
- Red debug box appearing at bottom of speed test screen — Expo's `useDebugZeroHeight` hook was adding a red border with `minHeight: 40` to the hidden DOM component; removed `matchContents: true` and set 1px size to suppress the debug style
- Android content overlapping camera hole and status bar — moved safe area inset (`insets.top`) from ScrollView content padding to the outer View's `paddingTop` so the entire content area sits below the system UI

### Added
- Consent modal prompt when starting a speed test with provider mode set to "Both" or "NDT7" without prior data policy acceptance — previously the app silently fell back to Cloudflare-only mode; now it shows the M-Lab data policy consent modal before starting

---

## [1.0.1] - 2026-03-13

### Fixed

#### TypeScript Compilation
- Resolved 6 TypeScript strict-mode errors that prevented clean `tsc --noEmit`
- Fixed theme token `fontVariant` readonly tuple incompatibility with React Native `TextStyle` by widening array types
- Fixed `metaLabel` token literal color/font types too narrow for style spread — cast to `string` where needed
- Replaced `PlatformColor('label')` in settings layout header with plain `'#111111'` string to fix Android crash and `OpaqueColorValue` type error
- Added explicit `string` type annotation to DNS bar dot color variable to resolve literal type narrowing from `as const` theme tokens
- Created `types/m-lab-ndt7.d.ts` type declaration file for the untyped `@m-lab/ndt7` package

#### Speed Test Engine
- Fixed NDT7 Web Worker loading in Expo DOM component — workers are now inlined as Blob URLs instead of referencing file paths (`/ndt7-download-worker.js`) that don't resolve inside the webview. Download and upload worker source code from `@m-lab/ndt7` is embedded as string literals, converted to `Blob` objects, and loaded via `URL.createObjectURL()`. Blob URLs are properly revoked after test completion or cancellation to prevent memory leaks.

#### Animations & UI
- Fixed progress bar width animation — replaced Reanimated string percentage interpolation (`width: withTiming('50%')`) with numeric pixel width computed from `onLayout` container measurement, ensuring reliable cross-platform animation
- Fixed SVG tape line between reels — replaced `x2="100%"` string (unsupported by react-native-svg) with computed numeric width `reelSize + gapBetweenReels`
- Integrated CRT scanline overlay into apparatus layout — component existed but was not rendered; now renders via `onLayout` height measurement

#### Code Quality
- Replaced `require('react').use(SpeedTestContext)` with proper `import { use } from 'react'` — cleaner React 19 API usage pattern

### Added
- Haptic feedback on test completion (`NotificationFeedbackType.Success`) and error (`NotificationFeedbackType.Error`) via `expo-haptics` in `useSpeedTest` hook — previously only the action button had haptic feedback
- CRT overlay now actually renders on the apparatus (was previously an unused component)

---

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
