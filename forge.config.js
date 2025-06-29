const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
    executableName: "CaritasLiftMonitor",
    win32metadata: {
      CompanyName: "Caritas",
      FileDescription: "Caritas Lift Monitor",
      ProductName: "Caritas Lift Monitor",
      InternalName: "CaritasLiftMonitor",
    },
    icon: "./icons/app-logo", // Base icon path (without extension)
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "CaritasLiftMonitor",
        exe: "CaritasLiftMonitor.exe",
        setupExe: "CaritasLiftMonitorSetup.exe",
        shortcutName: "Caritas Lift Monitor",
        authors: "Caritas",
        description: "Caritas Lift Monitor",
        iconUrl:
          "https://raw.githubusercontent.com/NiCkWKT/Assets/refs/heads/main/app-logo.ico",
        setupIcon: "./icons/app-logo.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Caritas",
          icon: "./icons/app-logo.png", // PNG icon for Debian (256x256 recommended)
          categories: ["Utility"],
          desktopName: "Caritas Lift Monitor",
          description: "Caritas Lift Monitor for tracking lift operations",
          bin: "CaritasLiftMonitor",
          mimeType: ["application/x-caritas-lift-monitor"],
        },
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
