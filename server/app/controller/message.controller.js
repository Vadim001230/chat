const Message = require('../models/message.model');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const ws = require('ws');
const wss = require('../config/ws');

const initMessage = Message(sequelize, Sequelize);

class MessageController {
  async getMessages(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const messages = await initMessage.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      res.json(messages.reverse());
    } catch (error) {
      console.error(`Error getting messages: ${error}`);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async updateMessage(req, res) {
    const { id, text } = req.body;
    try {
      await initMessage.update(
        { text },
        { where: { id } }
      );
      wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ event: 'update_message' }));
        };
      });
      res.json({ message: 'Message updated successfully' });
    } catch (error) {
      console.error(`Error updating message: ${error}`);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async deleteMessage(req, res) {
    const id = req.params.id;
    try {
      const message = await initMessage.findOne({ where: { id } });
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      await message.destroy();
      wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ event: 'delete_message' })); //todo проверка на того кто удалил сообщение
        };
      });
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error(`Error deleting message: ${error}`);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new MessageController();