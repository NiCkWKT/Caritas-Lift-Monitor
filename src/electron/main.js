import { app, BrowserWindow, screen } from "electron";
import { SerialPort } from "serialport";
import { join } from "path";
import { format } from "url";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  const displays = screen.getAllDisplays();
  console.log(displays);

  const totalWidth = displays.reduce(
    (sum, display) => sum + display.size.width,
    0
  );
  const minHeight = Math.min(...displays.map((display) => display.size.height));

  console.log(totalWidth);
  console.log(minHeight);
  // Create the browser window.
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

  // and load the index.html of the app.
  mainWindow.loadURL(
    format({
      pathname: join(app.getAppPath(), "dist-ui/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // mainWindow.maximize();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  const port = new SerialPort({
    path: "/tmp/ttyUSB0",
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
  });

  port.on("open", () => {
    console.log("Serial port opened");
  });

  let isControl = true;
  let controlByte;

  // Read from serial port
  port.on("data", (data) => {
    const buffer = Buffer.from(data);
    if (isControl) {
      if (buffer[0] >= 0x2c && buffer[0] <= 0x2f) {
        controlByte = buffer[0].toString(16);
        isControl = false;
      }
    } else {
      let value = buffer[0].toString(2).padStart(8, "0");
      mainWindow.webContents.send("serial-data", { controlByte, value });
      isControl = true;
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
