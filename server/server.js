// const express = require('express');
const ws = require('ws');

// const PORT = process.env.PORT || 8080;

const wss = new ws.Server({ port: 5000 }, () => console.log('Server started on 5000'));

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      message = JSON.parse(message);
      switch (message.event) {
        case 'message':
          broadcastMessage(message);
          break;
        case 'connection':
          broadcastMessage(message);
          break;
      }
    } catch (error) {
      console.error(`Error parsing message: ${error}`);
    }
  });
});

function broadcastMessage(message) {
  wss.clients.forEach(client => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(message), (error) => {
        if (error) {
          console.error(`Error sending message: ${error}`);
        }
      });
    }
  });
}