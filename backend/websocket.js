const WebSocket = require('ws');
const locationModel = require('./models/locationModel');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    // Send locations every 2 seconds
    const sendLocations = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(locationModel.getAllUserLocations()));
      }
    };
    const interval = setInterval(sendLocations, 2000);
    ws.on('close', () => clearInterval(interval));
  });
}

module.exports = setupWebSocket;
