const Router = require('express');
const router = new Router;
const AuthController = require('../controllers/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const {check} = require('express-validator');

router.post('/registration', [
  check('username', 'Username field cannot be empty').notEmpty(),
  check('password', 'Password must be more than 4 and less than 12 characters').isLength({min: 4, max: 12}),
], AuthController.registration);
router.post('/login', AuthController.signin);
router.get('/users', AuthMiddleware, AuthController.getUsers);

module.exports = router;