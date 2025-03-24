
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a26073b59f5f4705861366b7bad50c8b',
  appName: 'water-balance-journey',
  webDir: 'dist',
  // Removing the server configuration to use bundled content instead
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  android: {
    iconBackground: '#ffffff', // Optional background color for adaptive icons
  }
};

export default config;
