const Router = require('express');
const router = new Router;
const messageController = require('../controller/message.controller');

router.get('/messages', messageController.getMessages);
router.put('/messages', messageController.updateMessage);
router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;