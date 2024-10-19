const WebSocket = require('ws');
const ideService = require('../services/ideService');

module.exports = (wss) => (ws) => {
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'join':
          await ideService.joinRoom(data.roomId);
          ws.roomId = data.roomId; // Store roomId on the WebSocket instance
          console.log(`Client joined room: ${data.roomId}`);
          break;
        case 'code_update':
          await ideService.updateRoomCode(data.roomId, data.code);
          broadcast(wss, data.roomId, { type: 'code_update', code: data.code }, ws);
          console.log(`Code updated in room: ${data.roomId}`);
          break;
        default:
          console.log(`Unhandled message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected from room: ${ws.roomId}`);
    // You could add additional cleanup here if needed
  });
};

function broadcast(wss, roomId, data, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN && client.roomId === roomId) {
      client.send(JSON.stringify(data));
    }
  });
}