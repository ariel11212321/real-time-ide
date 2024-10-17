const WebSocket = require('ws');
const ideService = require('../services/ideService');

module.exports = (ws) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'join':
        await ideService.joinRoom(data.roomId, data.userId, data.username);
        break;
      case 'code_update':
        await ideService.updateRoomCode(data.roomId, data.code);
        ws.broadcast(data.roomId, { type: 'code_update', code: data.code }, ws);
        break;
    }
  });

  ws.broadcast = (roomId, data, sender) => {
    wss.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN && client.roomId === roomId) {
        client.send(JSON.stringify(data));
      }
    });
  };
};