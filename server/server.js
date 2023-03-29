const express = require('express');
const ws = require('ws');
const wss = require('./app/config/ws');
const Sequelize = require('sequelize');
const sequelize = require('./app/config/db');
const MessageModel = require('./app/models/message.model');
const messageRouter = require('./app/routes/message.routes');
const authRouter = require('./app/routes/auth.routes');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', messageRouter, authRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const initMessage = MessageModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => console.log('Messages table has been created successfully.'))
  .catch(error => console.error('Unable to create messages table:', error));

async function broadcastMessage(message) {
  const savedMessage = await initMessage.create({
    event: message.event,
    username: message.username,
    text: message.text || null,
  });

  wss.clients.forEach(client => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(savedMessage), (error) => {
        if (error) {
          console.error(`Error sending message: ${error}`);
        }
      });
    }
  });
}

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      const messageParse = JSON.parse(message);
      await broadcastMessage(messageParse);
    } catch (error) {
      console.error(`Error parsing message: ${error}`);
    }
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  wss.close(() => {
    console.log('Http server closed.');
    sequelize.close(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
});

module.exports = wss;