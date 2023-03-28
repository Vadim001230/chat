const Router = require('express');
const router = new Router;
const AuthController = require('../controllers/auth.controller');

router.get('/users', AuthController.getUsers);
router.post('/registration', AuthController.registration);
router.post('/login', AuthController.signin);

module.exports = router;