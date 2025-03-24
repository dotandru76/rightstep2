
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
        '-Xmx4096m',
        '-Xms2048m',
        '-Dfile.encoding=UTF-8',
        '-XX:+UseParallelGC',
        '-XX:MaxPermSize=512m',
        '-XX:+HeapDumpOnOutOfMemoryError',
        '-Djava.io.tmpdir=./temp',
        '-Dorg.gradle.daemon=false',
        '-Dorg.gradle.jvmargs=-Xmx4096M',
        '-Dkotlin.daemon.jvm.options=-Xmx2048M',
        '-Dandroid.sdk.dir=C:\\Users\\dotan_d\\AppData\\Local\\Android\\Sdk'
      ],
      gradleArgs: [
        '--rerun-tasks',
        '--no-daemon',
        '--max-workers=2',
        '-Dorg.gradle.caching=false',
        '-Dorg.gradle.parallel=false',
        '-Pandroid.sdk.dir=C:\\Users\\dotan_d\\AppData\\Local\\Android\\Sdk'
      ]
    },
    iconBackground: '#ffffff',
  },
  bundledWebRuntime: false
};

export default config;
