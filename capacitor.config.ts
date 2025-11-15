import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ugttowa.portal',
  appName: 'UGT Towa Portal',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#e50000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#e50000",
      sound: "beep.wav",
    },
    HttpsServerPlugin: {
      enabled: true
    },
    Dialog: {
      // Configuración mejorada para mensajes
      enabled: true
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#ffffff"
    },
    Keyboard: {
      style: "dark",
      stylePlugins: {
        styleDark: true
      }
    },
    Network: {
      enableNativeLog: true
    }
  },
  cordova: {},
  bundledWebRuntime: false,
  debug: false,
  bundledRuntime: false,
  platform: {
    android: {
      buildOptions: {
        keystorePath: undefined,
        keystorePassword: undefined,
        keystoreAlias: undefined,
        keystoreAliasPassword: undefined,
        releaseType: "apk",
        googleServicesPath: undefined
      }
    },
    ios: {
      scheme: "UGT Towa Portal",
      contentInset: "always",
      scrollEnabled: true,
      preferredContentMode: "mobile"
    }
  }
};

export default config;