import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.efa16eac30044c6da29b33185b914e05',
  appName: 'buildconnectke',
  webDir: 'dist',
  server: {
    url: "https://efa16eac-3004-4c6d-a29b-33185b914e05.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Geolocation: {
      permissions: {
        location: "when-in-use"
      }
    }
  }
};

export default config;