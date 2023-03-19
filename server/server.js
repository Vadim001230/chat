const ws = require('ws');
const Sequelize = require('sequelize');
const Message = require('./app/models/message.model');

const wss = new ws.Server({ port: 5000 }, () => console.log('Server started on 5000'));

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/chat_postgres');
const initMessage = Message(sequelize, Sequelize);

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


// wss.on('connection', async (ws) => {
//   try {
//     const messages = await initMessage.findAll({ order: [['createdAt', 'ASC']] });
//     messages.forEach((message) => {
//       ws.send(JSON.stringify(message));
//     });
//   } catch (error) {
//     console.error(`Error retrieving messages from database: ${error}`);
//   }

//   ws.on('message', async (message) => {
//     try {
//       message = JSON.parse(message);
//       await broadcastMessage(message, ws);
//     } catch (error) {
//       console.error(`Error parsing message: ${error}`);
//     }
//   });

//   ws.on('close', () => {
//     console.log('Connection closed');
//   });
// });