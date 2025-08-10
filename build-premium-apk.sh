#!/bin/bash

# LimitBreakers Premium APK Build Script
# Enhanced mobile build with premium features

set -e

echo "🚀 Building LimitBreakers Premium APK..."
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

# Check if Android Studio/SDK is installed
if ! command -v adb &> /dev/null; then
    print_warning "Android SDK not found. Make sure Android Studio is installed and ADB is in your PATH."
fi

print_status "Cleaning previous builds..."
rm -rf out/ dist/ .next/

print_status "Installing dependencies..."
npm install

print_status "Building optimized web version for mobile..."
npm run build

print_status "Syncing with Capacitor..."
npx cap sync android

print_status "Copying mobile assets..."
npx cap copy android

print_status "Opening Android Studio for APK build..."
print_warning "In Android Studio:"
print_warning "1. Wait for Gradle sync to complete"
print_warning "2. Go to Build → Generate Signed Bundle/APK"
print_warning "3. Select APK and click Next"
print_warning "4. Create a new keystore or use existing one"
print_warning "5. Set release build variant"
print_warning "6. Click Finish to build APK"

# Try to open Android Studio automatically
if command -v studio &> /dev/null; then
    print_status "Opening Android Studio automatically..."
    npx cap open android
elif command -v android-studio &> /dev/null; then
    print_status "Opening Android Studio automatically..."
    npx cap open android
else
    print_warning "Please open Android Studio manually and open the android/ folder"
    print_status "Android project location: $(pwd)/android"
fi

print_success "Build process initiated!"
print_status "APK will be generated in: android/app/build/outputs/apk/release/"

echo ""
echo "📱 APK Build Instructions:"
echo "========================="
echo "1. Android Studio should open automatically"
echo "2. Wait for Gradle sync (bottom status bar)"
echo "3. Go to Build → Generate Signed Bundle/APK"
echo "4. Choose APK → Next"
echo "5. Create/Select keystore → Next"
echo "6. Select 'release' build variant → Finish"
echo ""
echo "🎉 Your premium LimitBreakers APK will be ready for distribution!"
echo ""
echo "📦 APK Location: android/app/build/outputs/apk/release/app-release.apk"
echo "📱 Install on device: adb install android/app/build/outputs/apk/release/app-release.apk"
