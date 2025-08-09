import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.limitbreakers.app',
  appName: 'LimitBreakers',
  webDir: 'dist',
  server: {
    url: 'https://limibreakers.netlify.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4F46E5",
      showSpinner: false
    },
    StatusBar: {
      style: 'default'
    }
  }
};

export default config;
