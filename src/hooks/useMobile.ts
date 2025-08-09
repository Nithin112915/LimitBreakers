'use client';

import { useEffect, useState } from 'react';

// Hook to detect if user is using APK
export function useIsMobileApp() {
  const [isMobileApp, setIsMobileApp] = useState(false);

  useEffect(() => {
    // Check for various mobile app indicators
    const isWebView = window.navigator.userAgent.includes('wv'); // Android WebView
    const isCapacitor = !!(window as any).Capacitor; // Capacitor framework
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches; // PWA
    const isMobileSize = window.innerWidth <= 768;
    
    setIsMobileApp(isWebView || isCapacitor || (isStandalone && isMobileSize));
  }, []);

  return isMobileApp;
}

// Hook for safe area insets (for notched devices)
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      setSafeArea({
        top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right') || '0')
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}

// Hook for haptic feedback
export function useHaptics() {
  const vibrate = (pattern: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
    
    // Capacitor haptics
    if ((window as any).Capacitor?.Plugins?.Haptics) {
      (window as any).Capacitor.Plugins.Haptics.impact({ style: 'medium' });
    }
  };

  const lightImpact = () => vibrate(50);
  const mediumImpact = () => vibrate(100);
  const heavyImpact = () => vibrate(200);
  const success = () => vibrate([100, 50, 100]);
  const error = () => vibrate([200, 100, 200]);

  return {
    vibrate,
    lightImpact,
    mediumImpact,
    heavyImpact,
    success,
    error
  };
}
