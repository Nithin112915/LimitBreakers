# 📱 LimitBreakers Mobile App Setup Guide

This guide will help you create Android APK and iOS app from the LimitBreakers web application.

## 🏗️ Project Structure

The mobile app is built using **Capacitor**, which wraps the web application into native mobile apps.

```
LimitBreakers/
├── android/          # Android native project
├── ios/              # iOS native project (requires macOS + Xcode)
├── dist/             # Web assets for mobile
├── capacitor.config.ts
└── package.json
```

## 📋 Prerequisites

### For Android Development:
- **Android Studio** (Download from: https://developer.android.com/studio)
- **Java Development Kit (JDK) 11+**
- **Android SDK** (installed with Android Studio)

### For iOS Development:
- **macOS** (required)
- **Xcode** (from Mac App Store)
- **iOS Developer Account** (for App Store distribution)
- **CocoaPods** (`sudo gem install cocoapods`)

## 🤖 Building Android APK

### 1. Install Android Studio
```bash
# Download from: https://developer.android.com/studio
# Install Android SDK and create virtual device
```

### 2. Build and Run Android App
```bash
# Build the web assets and sync with native project
npm run mobile:build

# Open Android Studio
npm run mobile:android

# Or run directly on device/emulator
npm run mobile:run:android
```

### 3. Generate APK
In Android Studio:
1. Open the `android` folder
2. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. APK will be generated in `android/app/build/outputs/apk/debug/`

### 4. Generate Signed APK (for distribution)
1. **Build** → **Generate Signed Bundle / APK**
2. Choose **APK**
3. Create or use existing keystore
4. Select **release** build variant
5. APK ready for distribution!

## 🍎 Building iOS App

### 1. Setup iOS Development Environment
```bash
# Install CocoaPods (on macOS only)
sudo gem install cocoapods

# Install iOS dependencies
cd ios/App && pod install
```

### 2. Build and Run iOS App
```bash
# Build web assets and sync
npm run mobile:build

# Open Xcode
npm run mobile:ios

# Or run directly on simulator/device
npm run mobile:run:ios
```

### 3. Generate IPA (iOS App)
In Xcode:
1. Open `ios/App/App.xcworkspace`
2. Select your device/simulator
3. **Product** → **Archive**
4. **Distribute App** → Choose distribution method
5. Follow signing and provisioning profile setup

## ⚙️ App Configuration

### App Information
- **App Name**: LimitBreakers
- **Bundle ID**: com.limitbreakers.app
- **Package Name**: com.limitbreakers.app

### Features Included
- 📊 Dashboard and Analytics
- 🎯 Habit Tracking
- 🏆 Achievements System
- 👥 Social Community
- 📱 Native Mobile UI
- 🔔 Push Notifications (configurable)
- 📸 Camera Access (for habit proof)
- 📂 File System Access

## 🌐 Hybrid App Approach

The mobile app uses a **hybrid approach**:
- **Web View**: Loads the main web application
- **Native Features**: Camera, notifications, file system
- **Offline Capability**: Basic caching (expandable)

### Current Configuration
```typescript
// capacitor.config.ts
server: {
  url: 'https://limibreakers.netlify.app',
  cleartext: true
}
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Build for mobile
npm run mobile:build

# Android commands
npm run mobile:android          # Open Android Studio
npm run mobile:run:android      # Run on Android device/emulator

# iOS commands (macOS only)
npm run mobile:ios              # Open Xcode  
npm run mobile:run:ios          # Run on iOS simulator/device

# Sync native projects with web assets
npx cap sync

# Copy web assets to native projects
npx cap copy

# Update native dependencies
npx cap update
```

## 📦 Distribution

### Android (Google Play Store)
1. Create **Google Play Developer Account** ($25 one-time fee)
2. Generate **signed APK** or **App Bundle** (AAB)
3. Upload to **Google Play Console**
4. Complete store listing and submit for review

### iOS (Apple App Store)
1. **Apple Developer Account** ($99/year)
2. Configure **App Store Connect**
3. Generate **signed IPA** with distribution certificate
4. Upload via **Xcode** or **Application Loader**
5. Submit for App Store review

## 🚀 Quick Start

```bash
# 1. Install mobile dependencies
npm install

# 2. Build web assets for mobile
npm run mobile:build

# 3. For Android (requires Android Studio)
npm run mobile:android

# 4. For iOS (requires macOS + Xcode)
npm run mobile:ios
```

## 📱 App Features

### Core Functionality
- ✅ User Authentication
- ✅ Habit Creation & Tracking
- ✅ Progress Dashboard
- ✅ Social Features
- ✅ Achievement System
- ✅ AI Recommendations

### Mobile-Specific Features
- 📸 Camera integration for habit proof
- 🔔 Push notifications
- 📱 Native navigation
- 🎨 Platform-specific UI adaptations
- 📂 File management

## 🔒 Security & Privacy

- 🔐 Secure authentication via NextAuth.js
- 🛡️ HTTPS connections only
- 🔒 Local data encryption (configurable)
- 📊 Privacy-compliant analytics

## 📞 Support

For mobile app development questions:
1. Check **Capacitor Documentation**: https://capacitorjs.com/docs
2. Android issues: **Android Studio** documentation
3. iOS issues: **Xcode** and **Apple Developer** documentation

## 🎯 Next Steps

1. **Install Android Studio** for APK generation
2. **Setup app icons** (see `dist/ICONS_README.md`)
3. **Configure push notifications** (optional)
4. **Test on real devices**
5. **Prepare for store submission**

The mobile app is ready to build! Follow the platform-specific instructions above to generate your APK and iOS app files.
