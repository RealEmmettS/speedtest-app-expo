# Changelog

All notable changes to QubeTX Speed Test will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Project scaffolding with Expo SDK 55, TypeScript, and Expo Router
- App configuration (app.json) with iOS/Android bundle IDs and permissions
- EAS build configuration for production, preview, and development profiles
- Type definitions ported from web app with DOM component bridge types
- Native theme tokens (colors, typography, spacing) adapted from web CSS
- Speed test engine as Expo DOM component running Cloudflare + NDT7 providers
- Service files: cloudflare-provider, ndt7-provider, aggregated-provider, dns-check
- Navigation structure: NativeTabs (Speed Test + Settings) with Stacks
- Cassette tape UI: animated SVG tape reels, frosted glass action button
- Data panel: ping/jitter split row, download/upload data rows with progress bars
- DNS connectivity bar with expandable domain detail overlay
- Results stamp animation ("TEST COMPLETE" with bounce effect)
- CRT overlay effect and speaker grill pattern
- Top bar with network badge, server name, and clock
- Apparatus layout assembling all components
- Settings screen: provider mode, test duration, speed unit, auto-copy, sound effects
- M-Lab data policy consent modal (formSheet presentation)
- Hooks: useSettings (AsyncStorage), useSpeedTest (lifecycle + DOM bridge), useNetworkInfo, useClock
- SpeedTestContext provider wrapping all state management
- Inter font family loading (400-800 weights)
