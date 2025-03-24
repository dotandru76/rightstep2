
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a26073b59f5f4705861366b7bad50c8b',
  appName: 'water-balance-journey',
  webDir: 'dist',
  server: {
    url: 'https://a26073b5-9f5f-4705-8613-66b7bad50c8b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
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
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK',
      minSdkVersion: 22,
      targetSdkVersion: 33,
      jvmArgs: [
        '-Xmx4096m',  // Further increased memory allocation
        '-Xms2048m',  // Increased initial memory allocation
        '-Dfile.encoding=UTF-8',
        '-XX:+UseParallelGC',
        '-XX:MaxPermSize=512m',
        '-XX:+HeapDumpOnOutOfMemoryError',
        '-Djava.io.tmpdir=./temp',  // Use a local temp directory instead
        '-Dorg.gradle.daemon=false', // Disable gradle daemon
        '-Dorg.gradle.jvmargs=-Xmx4096M', // Increase gradle JVM memory
        '-Dkotlin.daemon.jvm.options=-Xmx2048M', // Increase Kotlin daemon memory
        '-Dandroid.sdk.dir=C:\\Users\\dotan_d\\AppData\\Local\\Android\\Sdk' // Updated SDK location
      ],
      // Add these to try and fix file locking issues
      gradleArgs: [
        '--rerun-tasks',
        '--no-daemon',
        '--max-workers=2',
        '-Dorg.gradle.caching=false',
        '-Dorg.gradle.parallel=false',
        '-Pandroid.sdk.dir=C:\\Users\\dotan_d\\AppData\\Local\\Android\\Sdk' // Updated SDK location
      ]
    },
    iconBackground: '#ffffff', // Optional background color for adaptive icons
  },
  // Add this line to help with asset handling
  bundledWebRuntime: false
};

export default config;
