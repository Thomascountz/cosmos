const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Avrgirl = require('avrgirl-arduino');
const SerialPort = require('serialport');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // protect against potential security vulnerabilities
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('list-ports', async () => {
  return new Promise((resolve, reject) => {
    Avrgirl.list((err, ports) => {
      if (err) {
        reject(err);
      } else {
        resolve(ports.map(port => port.comName));
      }
    });
  });
});;

ipcMain.handle('download-firmware', async (event, url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const firmware = Buffer.from(response.data, 'binary');
  fs.writeFileSync('firmware.hex', firmware);
});

ipcMain.handle('flash-arduino', async (event, board, port) => {
  return new Promise((resolve, reject) => {
    const avrgirl = new Avrgirl({ board, port });
    avrgirl.flash('firmware.hex', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
});
