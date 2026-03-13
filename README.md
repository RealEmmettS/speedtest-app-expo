<p align="center">
  <img src="https://shaughv.s3.us-east-1.amazonaws.com/brandmark/SHAUGHV-Official.svg" alt="SHAUGHV" width="160" />
</p>

<h1 align="center">QubeTX Speed Test</h1>

<p align="center">
  A native iOS &amp; Android internet speed test app with a retro cassette tape interface, powered by dual-provider measurement from Cloudflare and M-Lab NDT7.
</p>

---

## Features

- **Dual-provider speed testing** -- run measurements against Cloudflare's edge network and M-Lab's NDT7 infrastructure independently or together
- **Aggregated measurement averaging** -- "Both" mode runs both providers sequentially and averages per-metric results for a more representative reading
- **DNS connectivity diagnostics** -- parallel probes against 8 major domains (Google, Cloudflare, Apple, Microsoft, Amazon, Netflix, GitHub, Wikipedia)
- **Retro cassette tape UI** -- animated SVG tape reels whose spin speed responds to live throughput, CRT overlay, speaker grill pattern, and crosshair corner accents
- **Real-time progress tracking** -- animated data rows for ping, jitter, download, upload, and packet loss update live during the test
- **Native iOS and Android app** -- built with Expo and React Native for full native performance
- **Configurable settings** -- provider mode (Cloudflare / NDT7 / Both), test duration (auto, 15s - 10min), speed unit (auto / Mbps / Kbps / Gbps), and auto-copy results to clipboard
- **M-Lab data policy consent management** -- formSheet modal with grab handle, required before NDT7 measurements can run
- **Haptic feedback on iOS** -- heavy impact haptic fires on action button press
- **Frosted glass action button** -- circular blur-backed button with play/stop/checkmark states

## Architecture

QubeTX Speed Test uses a **two-layer architecture** that separates the native UI from the speed test measurement engine:

```
┌─────────────────────────────────────────────────┐
│              Native UI Layer                     │
│  React Native + Reanimated + SVG + expo-blur     │
│  Handles all rendering, animations, navigation   │
├─────────────────────────────────────────────────┤
│     Bridge (props + async callbacks)             │
├─────────────────────────────────────────────────┤
│          Speed Test Engine (DOM Component)        │
│  Expo DOM Component running in a hidden WebView  │
│  Executes @cloudflare/speedtest + @m-lab/ndt7    │
│  Reports progress/results back to native layer   │
└─────────────────────────────────────────────────┘
```

**Why a DOM component?** The Cloudflare and M-Lab speed test libraries are web-only -- they rely on browser APIs (`fetch`, `WebSocket`, `XMLHttpRequest`, `PerformanceObserver`) for accurate throughput measurement. The Expo DOM component (`'use dom'` directive) runs these libraries inside a hidden WebView while the native layer handles all visible UI. Communication flows through serializable props and async callback functions.

**Why not run tests natively?** HTTP-based speed tests require precise timing of many concurrent connections. The browser networking stack handles connection pooling, TLS negotiation, and timing measurement automatically. Reimplementing this natively would sacrifice measurement accuracy.

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Expo SDK | 55 |
| Runtime | React Native | 0.83 |
| Language | TypeScript | 5.9 |
| Navigation | Expo Router (NativeTabs) | 55 |
| Animations | React Native Reanimated | 4 |
| SVG | react-native-svg | 15.15 |
| Blur effects | expo-blur | 55 |
| Speed test (Cloudflare) | @cloudflare/speedtest | 1.7 |
| Speed test (M-Lab) | @m-lab/ndt7 | 0.1.4 |
| Persistence | @react-native-async-storage/async-storage | 2.2 |
| Clipboard | expo-clipboard | 55 |
| Haptics | expo-haptics | 55 |
| Network info | expo-network | 55 |
| Fonts | @expo-google-fonts/inter | 0.4 |

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Expo CLI** (`npx expo` -- no global install required)
- **Xcode** 15+ (for iOS development, macOS only)
- **Android Studio** with SDK 34+ (for Android development)

### Install and Run

```bash
# Clone the repository
git clone https://github.com/your-username/speedtest-app-expo.git
cd speedtest-app-expo

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on a Device with Expo Go

1. Install **Expo Go** from the App Store (iOS) or Play Store (Android)
2. Run `npx expo start` in the project directory
3. Scan the QR code shown in the terminal with your device camera (iOS) or Expo Go app (Android)

> **Note:** Some native modules (haptics, blur) may behave differently in Expo Go vs. a development build. For the full experience, use a development build.

### Development Build

```bash
# Create a development build for iOS
npx expo run:ios

# Create a development build for Android
npx expo run:android
```

### Building with EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build for iOS (production)
eas build --platform ios --profile production

# Build for Android (production)
eas build --platform android --profile production

# Build for local testing (iOS Simulator)
eas build --platform ios --profile preview

# Build for internal distribution (Android APK)
eas build --platform android --profile preview
```

## Project Structure

```
speedtest-app-expo/
├── app/
│   ├── _layout.tsx                     # Root layout: fonts, theme, context provider
│   ├── consent-modal.tsx               # M-Lab data policy consent (formSheet)
│   └── (tabs)/
│       ├── _layout.tsx                 # NativeTabs: Speed Test + Settings
│       ├── (test)/
│       │   ├── _layout.tsx             # Test tab stack
│       │   └── index.tsx               # Main speed test screen (Apparatus)
│       └── (settings)/
│           ├── _layout.tsx             # Settings tab stack
│           └── index.tsx               # Settings screen
├── components/
│   ├── dom/
│   │   └── speed-test-engine.tsx       # Expo DOM component (hidden WebView)
│   ├── data/
│   │   ├── data-panel.tsx              # Container for all data rows
│   │   ├── data-row.tsx                # Single metric row (download, upload, etc.)
│   │   ├── dns-bar.tsx                 # DNS connectivity status bar
│   │   ├── progress-bar.tsx            # Animated progress indicator
│   │   └── split-row.tsx              # Side-by-side metrics (ping + jitter)
│   ├── effects/
│   │   ├── crt-overlay.tsx             # CRT scanline overlay effect
│   │   └── results-stamp.tsx           # "TEST COMPLETE" bounce stamp
│   ├── layout/
│   │   ├── apparatus.tsx               # Main cassette tape layout assembly
│   │   ├── speaker-grill.tsx           # Decorative speaker grill pattern
│   │   └── top-bar.tsx                 # Network badge, server name, clock
│   ├── mechanism/
│   │   ├── tape-mechanism.tsx          # Tape deck housing (reels + button)
│   │   └── tape-reel.tsx              # Animated SVG reel with spokes
│   └── ui/
│       ├── action-button.tsx           # Frosted glass play/stop/check button
│       ├── crosshair-corners.tsx       # Corner accent decorations
│       └── network-badge.tsx           # Wi-Fi/cellular connection indicator
├── hooks/
│   ├── use-clock.ts                    # Real-time clock for top bar
│   ├── use-network-info.ts             # Network type and connectivity
│   ├── use-settings.ts                 # AsyncStorage-backed settings
│   └── use-speed-test.ts              # Test lifecycle and DOM bridge
├── services/
│   └── dom/                            # Runs inside WebView (DOM context)
│       ├── aggregated-provider.ts      # Sequential CF + NDT7, per-metric averaging
│       ├── cloudflare-provider.ts      # @cloudflare/speedtest wrapper
│       ├── dns-check.ts               # Parallel DNS reachability probes
│       ├── ndt7-provider.ts           # @m-lab/ndt7 wrapper
│       └── provider-factory.ts        # Provider instantiation by mode
├── store/
│   └── speed-test-context.tsx          # React context wrapping all state
├── theme/
│   └── tokens.ts                       # Colors, typography, spacing, borders
├── types/
│   └── speedtest.ts                    # TypeScript types and constants
├── assets/
│   ├── icon.png                        # App icon
│   ├── favicon.png                     # Web favicon
│   ├── splash-icon.png                # Splash screen icon
│   ├── android-icon-foreground.png    # Android adaptive icon foreground
│   ├── android-icon-background.png    # Android adaptive icon background
│   └── android-icon-monochrome.png    # Android monochrome icon
├── app.json                            # Expo configuration
├── eas.json                            # EAS Build profiles
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies and scripts
└── CHANGELOG.md                        # Version history
```

## Speed Test Methodology

### Cloudflare Provider

The Cloudflare provider uses the official `@cloudflare/speedtest` library to measure against Cloudflare's global edge network:

1. **Latency** -- 20 ICMP-like packets to measure unloaded latency and jitter
2. **Download** -- Progressive payload sizes (100KB x8, 1MB x6, 10MB x4) to measure throughput across different transfer sizes
3. **Upload** -- Same progressive sizing as download (100KB x8, 1MB x6, 10MB x4)
4. **Packet Loss** -- 1,000 UDP-like packets via TURN relay to detect dropped packets

Measurement counts scale proportionally with configured test duration (a 60s test runs 2x the default packet/transfer counts).

### M-Lab NDT7 Provider

The NDT7 provider uses M-Lab's `@m-lab/ndt7` library, which connects to the nearest M-Lab server automatically:

1. **Server Discovery** -- Auto-selects the nearest M-Lab server via the Locate API
2. **Download** -- WebSocket-based bulk data transfer for ~10 seconds, reporting `MeanClientMbps` from client measurements
3. **Upload** -- WebSocket-based bulk data upload for ~10 seconds
4. **Latency/Jitter** -- Derived from TCP `MinRTT` and `SmoothedRTT` reported in server-side `TCPInfo` structs; jitter computed as mean successive RTT difference

NDT7 does not support packet loss measurement. For extended durations, the provider runs multiple test iterations and averages results.

### Aggregated Mode

When "Both" is selected, the aggregated provider:

1. Runs **Cloudflare first** (progress 0-50%), then tears down connections
2. Pauses 3 seconds for connection cleanup
3. Runs **M-Lab NDT7 second** (progress 50-100%)
4. **Averages per-metric**: each metric (ping, jitter, download, upload) is averaged independently; if one provider fails, the other's result is used as-is
5. Packet loss comes exclusively from Cloudflare (NDT7 does not measure it)

### DNS Diagnostics

Runs in parallel alongside the speed test (non-blocking). Probes 8 domains:

| Domain | Purpose |
|--------|---------|
| google.com | General connectivity |
| cloudflare.com | CDN / DNS provider |
| apple.com | Platform services |
| microsoft.com | Platform services |
| amazon.com | Cloud / CDN |
| netflix.com | Streaming |
| github.com | Developer services |
| wikipedia.org | Non-commercial |

Each probe sends a `no-cors` fetch to `https://{domain}/favicon.ico` with a 5-second timeout. Results show pass/fail per domain and average response time across successful probes.

## Building for Production

### iOS (TestFlight)

```bash
# Build for App Store / TestFlight
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios --profile production
```

### Android (Play Store)

```bash
# Build AAB for Play Store
eas build --platform android --profile production

# Submit to Google Play (internal track)
eas submit --platform android --profile production
```

### Build Profiles

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| `production` | App Store / Play Store release | Store |
| `preview` | Internal testing (iOS Simulator / Android APK) | Internal |
| `development` | Development client with dev tools | Internal |

## License

MIT

---

<p align="center">
  <img src="https://shaughv.s3.us-east-1.amazonaws.com/brandmark/favicon/SHAUGHV-Favicon-Light.svg" alt="SHAUGHV" width="32" />
</p>
