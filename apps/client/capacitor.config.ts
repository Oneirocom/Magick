import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.magick.ide',
  appName: 'magick',
  webDir: './dist/apps/client',
  bundledWebRuntime: false,
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  electron: {
    packager: {
      platform: ['win32', 'darwin', 'linux'],
      arch: 'x64',
    },
  },
}

export default config