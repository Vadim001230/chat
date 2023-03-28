const UserModel = require('../models/user.model');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const initUser = UserModel(sequelize, Sequelize);

class AuthController {
  async getUsers(req, res) {
    try {
      const users  = await initUser.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'ASC']]
      });
      const count = await initUser.count();
      res.json({users: users, count});
    } catch (error) {
      console.error(`Error getting users: ${error}`);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async registration(req, res) {
    try {
      const {username, password} = req.body;
      const candidate = await initUser.findOne({ where: { username } });
      if (candidate) {
        res.status(400).json({message: 'User with the same name already exists'});
      } else {
        await initUser.create({
          username,
          password: bcrypt.hashSync(password, 7),
        });
        res.json({ message: 'User was registered successfully'});
      }
    } catch (error) {
      console.error(`Error registration: ${error}`);
      res.status(400).json({message: 'Registration error'});
    }
  }

  async signin(req, res) {
    try {

    } catch (error) {
      console.error(`Error signin: ${error}`);
      res.status(400).json({message: 'Login error'});
    }
  }
}

module.exports = new AuthController();