#!/bin/bash

# LimitBreakers Mobile App Builder
# This script helps build the mobile app for Android and iOS

set -e

echo "🚀 LimitBreakers Mobile App Builder"
echo "==================================="

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

# Check if we're in the right directory
if [ ! -f "capacitor.config.ts" ]; then
    print_error "capacitor.config.ts not found. Please run this script from the LimitBreakers root directory."
    exit 1
fi

# Function to build web assets
build_web_assets() {
    print_status "Building web assets for mobile..."
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "dist directory not found after build. Check your build configuration."
        exit 1
    fi
    
    print_success "Web assets built successfully!"
}

# Function to sync with mobile platforms
sync_mobile() {
    print_status "Syncing with mobile platforms..."
    npx cap sync
    print_success "Mobile platforms synced!"
}

# Function to build Android
build_android() {
    print_status "Setting up Android build..."
    
    # Check if Android Studio is available
    if ! command -v android &> /dev/null; then
        print_warning "Android Studio not found in PATH."
        print_warning "Please install Android Studio from: https://developer.android.com/studio"
    fi
    
    print_status "Opening Android project..."
    print_status "To build APK:"
    print_status "1. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)"
    print_status "2. APK will be in: android/app/build/outputs/apk/debug/"
    
    npm run mobile:android
}

# Function to build iOS
build_ios() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        print_error "iOS development requires macOS. Current OS: $OSTYPE"
        return 1
    fi
    
    print_status "Setting up iOS build..."
    
    # Check if Xcode is available
    if ! command -v xcodebuild &> /dev/null; then
        print_error "Xcode not found. Please install Xcode from the Mac App Store."
        return 1
    fi
    
    # Check if CocoaPods is available
    if ! command -v pod &> /dev/null; then
        print_warning "CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi
    
    print_status "Installing iOS dependencies..."
    cd ios/App && pod install && cd ../..
    
    print_status "Opening iOS project..."
    print_status "To build IPA:"
    print_status "1. In Xcode: Product → Archive"
    print_status "2. Distribute App → Choose distribution method"
    
    npm run mobile:ios
}

# Main menu
echo ""
echo "What would you like to build?"
echo "1) Android APK"
echo "2) iOS App (macOS only)"
echo "3) Both Android and iOS"
echo "4) Just build web assets"
echo "5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        print_status "Building for Android..."
        build_web_assets
        sync_mobile
        build_android
        ;;
    2)
        print_status "Building for iOS..."
        build_web_assets
        sync_mobile
        build_ios
        ;;
    3)
        print_status "Building for both platforms..."
        build_web_assets
        sync_mobile
        print_status "Building Android..."
        build_android &
        if [[ "$OSTYPE" == "darwin"* ]]; then
            print_status "Building iOS..."
            build_ios &
        else
            print_warning "Skipping iOS build (requires macOS)"
        fi
        wait
        ;;
    4)
        build_web_assets
        sync_mobile
        print_success "Web assets built and synced!"
        ;;
    5)
        print_status "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
print_success "Mobile app build process completed!"
print_status "Next steps:"
print_status "- For Android: Check android/app/build/outputs/apk/ for APK files"
print_status "- For iOS: Use Xcode to archive and distribute"
print_status "- See MOBILE_APP_GUIDE.md for detailed instructions"
