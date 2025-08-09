import { useState, useEffect } from 'react';

interface AppVersion {
  version: string;
  releaseDate: string;
  features: string[];
  downloadUrl: string;
  isRequired: boolean;
}

export function useAppUpdates() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState<AppVersion | null>(null);
  const [currentVersion] = useState('1.0.0'); // Current APK version

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Check if we're in the mobile app (APK)
      const isAPK = window.navigator.userAgent.includes('wv'); // WebView indicator
      
      if (!isAPK) return; // Skip for web users
      
      const response = await fetch('/api/app/version');
      const data = await response.json();
      
      if (data.version !== currentVersion) {
        setLatestVersion(data);
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  };

  const dismissUpdate = () => {
    if (!latestVersion?.isRequired) {
      setUpdateAvailable(false);
    }
  };

  return {
    updateAvailable,
    latestVersion,
    currentVersion,
    checkForUpdates,
    dismissUpdate
  };
}
