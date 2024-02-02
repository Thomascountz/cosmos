// Populate USB port dropdown when the app loads
window.addEventListener('DOMContentLoaded', async () => {
  const ports = await window.electron.listPorts();
  const select = document.getElementById('usb-port');
  ports.forEach((port) => {
    const option = document.createElement('option');
    option.value = port;
    option.text = port;
    select.appendChild(option);
  });
});;

// Handle click event for the flash button
document.getElementById('flash-button').addEventListener('click', async () => {
  const firmwareUrl = document.getElementById('firmware-url').value;
  await window.electron.downloadFirmware(firmwareUrl);
  const usbPort = document.getElementById('usb-port').value;
  const boardType = document.getElementById('board').value;
  try {
    await window.electron.flashArduino(boardType, usbPort);
    alert('Firmware updated successfully!');
  } catch (error) {
    console.error(error);
  }
});
