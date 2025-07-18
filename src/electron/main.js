const { app, BrowserWindow, screen, Menu, dialog } = require("electron");
const { SerialPort } = require("serialport");
const { join } = require("path");
const { format } = require("url");

let mainWindow;
let currentPort = null;

// Handle Squirrel events for Windows installer
if (require("electron-squirrel-startup")) app.quit();

// Handle installation events
if (process.platform === "win32") {
  const handleStartupEvent = () => {
    const squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
      case "--squirrel-install":
      case "--squirrel-updated":
        // Install desktop and start menu shortcuts
        require("electron-squirrel-startup");
        return true;
      case "--squirrel-uninstall": {
        // Clean up any app data
        const fs = require("fs");
        const directories = [
          // Roaming directory
          join(process.env.APPDATA, "CaritasLiftMonitor"),
          // Local directory
          join(process.env.LOCALAPPDATA, "CaritasLiftMonitor"),
          // Local directory-temp
          join(process.env.LOCALAPPDATA, "CaritasLiftMonitor-updater"),
        ];

        for (const dir of directories) {
          if (fs.existsSync(dir)) {
            try {
              fs.rmdirSync(dir, { recursive: true, force: true });
            } catch (err) {
              console.error(`Failed to remove directory ${dir}:`, err);
            }
          }
        }
        return true;
      }
      case "--squirrel-obsolete":
        app.quit();
        return true;
    }
  };

  if (handleStartupEvent()) {
    app.quit();
  }
}

async function listSerialPorts() {
  try {
    const ports = await SerialPort.list();
    return ports;
  } catch (err) {
    // console.error("Error listing ports:", err);
    return [];
  }
}

async function connectToPort(portPath) {
  if (currentPort) {
    currentPort.close();
  }

  currentPort = new SerialPort({
    path: portPath,
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
  });

  currentPort.on("open", () => {
    // console.log("Serial port opened:", portPath);
  });

  let isControl = true;
  let controlByte;

  currentPort.on("data", (data) => {
    const buffer = Buffer.from(data);
    if (isControl) {
      if (buffer[0] >= 0x2c && buffer[0] <= 0x2f) {
        controlByte = buffer[0].toString(16);
        isControl = false;
      }
    } else {
      let value = buffer[0].toString(2).padStart(8, "0");
      if (mainWindow) {
        mainWindow.webContents.send("serial-data", { controlByte, value });
      }
      isControl = true;
    }
  });

  currentPort.on("error", (err) => {
    // console.error("Serial port error:", err);
    dialog.showErrorBox(
      "Serial Port Error",
      `Error with port ${portPath}: ${err.message}`
    );
  });
}

async function createContextMenu() {
  const ports = await listSerialPorts();

  // ports.push({
  //   path: "/tmp/ttyUSB0",
  // });
  const menuTemplate = [
    {
      label: "Zone Images",
      submenu: [
        {
          label: "Zone 1",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("change-zone", "zone1.png");
            }
          },
        },
        {
          label: "Zone 2",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("change-zone", "zone2.png");
            }
          },
        },
        { type: "separator" }, // Adds a line separator in the menu
      ],
    },
  ];

  // Add serial port items
  // if (ports.length > 0) {
  //   menuTemplate.push({ type: "separator" });
  //   menuTemplate.push({
  //     label: "Serial Ports",
  //     submenu: ports.map((port) => ({
  //       label: `${port.path} - ${port.manufacturer || "Unknown"}`,
  //       click: () => connectToPort(port.path),
  //     })),
  //   });
  // } else {
  //   dialog.showMessageBox(mainWindow, {
  //     type: "info",
  //     message: "No available serial ports",
  //     buttons: ["OK"],
  //   });

  menuTemplate.push({ type: "separator" });
  menuTemplate.push({
    label: "Serial Ports",
    submenu: ports.map((port) => ({
      label: `${port.path} - ${port.manufacturer || "Unknown"}`,
      click: () => connectToPort(port.path),
    })),
  });

  // Add separator and quit option at the bottom
  menuTemplate.push(
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        if (currentPort) {
          currentPort.close();
        }
        app.quit();
      },
    }
  );

  return Menu.buildFromTemplate(menuTemplate);
}

function createWindow() {
  const displays = screen.getAllDisplays();
  // console.log(displays);
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setBounds({
    x: displays[0].bounds.x,
    y: Math.min(...displays.map((display) => display.bounds.y)),
    width: 2048,
    height: 768,
  });

  mainWindow.loadURL(
    format({
      pathname: join(app.getAppPath(), "dist-ui/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  mainWindow.webContents.on("context-menu", async () => {
    const menu = await createContextMenu();
    if (menu) {
      menu.popup();
    }
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  createWindow();

  // Connect to the first available port on startup
  const ports = await listSerialPorts();
  if (ports.length > 0) {
    await connectToPort(ports[0].path);
  } else {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      message: "No available serial ports",
      buttons: ["OK"],
    });
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (currentPort) {
    currentPort.close();
  }
  app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
