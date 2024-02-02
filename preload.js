const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    listPorts: () => ipcRenderer.invoke('list-ports'),
    flashArduino: (board, port, firmware) => ipcRenderer.invoke('flash-arduino', board, port, firmware),
    downloadFirmware: (url) => ipcRenderer.invoke('download-firmware', url),
});