import { NextRequest, NextResponse } from 'next/server';

// App version configuration
const APP_VERSION = {
  version: '1.0.1', // Update this when you release new APK
  releaseDate: '2025-08-09',
  features: [
    'Bug fixes and performance improvements',
    'Enhanced habit tracking',
    'New notification system',
    'Improved user interface'
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
