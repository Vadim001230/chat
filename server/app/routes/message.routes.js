const Router = require('express');
const router = new Router;
const MessageController = require('../controllers/message.controller');

router.get('/messages', MessageController.getMessages);
router.put('/messages', MessageController.updateMessage);
router.delete('/messages/:id', MessageController.deleteMessage);

module.exports = router;