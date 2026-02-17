import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.handwerksuite.mobile",
  appName: "HandwerkSuite",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: "Library/CapacitorDatabase",
      iosIsEncryption: true,
      iosKeychainPrefix: "handwerksuite",
      androidIsEncryption: true,
    },
  },
};

export default config;
