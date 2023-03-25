const ws = require('ws');
const wss = new ws.Server({ port: 5001 }, () => console.log('WebSocket server started on 5001'));

module.exports = wss;