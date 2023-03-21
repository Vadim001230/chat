const Sequelize = require('sequelize');

const sequelize = new Sequelize('chat_postgres', 'postgres', 'postgres', {
  dialect: 'postgres',
  host: 'localhost',
  define: {
    timestamps: true
  },
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;