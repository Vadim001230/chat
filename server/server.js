const ws = require('ws');
const Sequelize = require('sequelize');

const wss = new ws.Server({ port: 5000 }, () => console.log('Server started on 5000'));

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/chat_postgres');
const Message = sequelize.define('messages', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event: {
    type: Sequelize.ENUM('connection', 'message'),
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('Messages table has been created successfully.'))
  .catch(error => console.error('Unable to create messages table:', error));

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      message = JSON.parse(message);
      await broadcastMessage(message, ws);
    } catch (error) {
      console.error(`Error parsing message: ${error}`);
    }
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });
});

async function broadcastMessage(message) {
  const savedMessage = await Message.create({
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
