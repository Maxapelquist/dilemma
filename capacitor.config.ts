import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e50ba2cbfd514d2d8bb6c95fc0401d9b',
  appName: 'Together - Couples Communication',
  webDir: 'dist',
  server: {
    url: 'https://e50ba2cb-fd51-4d2d-8bb6-c95fc0401d9b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f7f0f3",
      showSpinner: false
    }
  }
};

export default config;