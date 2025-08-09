import { NextRequest, NextResponse } from 'next/server';

// App version configuration
const APP_VERSION = {
  version: '1.2.0', // Latest fixed version with mobile optimization
  releaseDate: '2025-08-09',
  features: [
    'Fixed build warnings and compilation errors',
    'Resolved dynamic server usage issues',
    'Optimized static generation for better performance',
    'Improved database schema indexing',
    'Enhanced stability and error handling',
    'Complete mobile UI with native-like experience',
    'Bottom navigation and haptic feedback',
    'Mobile-optimized habit cards and dashboard'
  ],
  downloadUrl: 'https://limitbreakers.netlify.app/download.html',
  isRequired: false, // Set to true for critical updates
  minimumVersion: '1.0.0' // Minimum supported version
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(APP_VERSION);
  } catch (error) {
    console.error('Error checking app version:', error);
    return NextResponse.json(
      { error: 'Failed to check version' },
      { status: 500 }
    );
  }
}
