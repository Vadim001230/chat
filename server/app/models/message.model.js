module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define('messages', {
    event: {
      type: Sequelize.ENUM('connection', 'message'),
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  return Message;
};