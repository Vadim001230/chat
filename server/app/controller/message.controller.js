const Message = require('../models/message.model');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('chat_postgres', 'postgres', 'postgres', {
  dialect: 'postgres',
  host: 'localhost',
  define: {
    timestamps: true
  }
});

const initMessage = Message(sequelize, Sequelize);

class MessageController {
  async getMessages(req, res) {
    try {
      const messages = await initMessage.findAll();
      res.json(messages);
    } catch (error) {
      console.error(`Error getting messages: ${error}`);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async createMessage(req, res) {
    const { event, username, text } = req.body;
    try {
      const savedMessage = await initMessage.create({
        event,
        username,
        text: text || null,
      });
      res.json(savedMessage);
    } catch (error) {
      console.error(`Error creating message: ${error}`);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async updateMessage(req, res) {
    const id = req.params.id;
    const { event, username, text } = req.body;
    try {
      await initMessage.update(
        { event, username, text },
        { where: { id } }
      );
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
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error(`Error deleting message: ${error}`);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new MessageController();