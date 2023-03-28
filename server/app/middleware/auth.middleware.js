const jwt = require('jsonwebtoken');
const {secret} = require('../config/auth');

module.exports = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      res.status(403).json({message: 'User not authorized'});
    }
    const decodedData = jwt.verify(token, secret);
    req.user = decodedData;
    next();
  } catch {
    res.status(403).json({message: 'User not authorized'});
  }
};