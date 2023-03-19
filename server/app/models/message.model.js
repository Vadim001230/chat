module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define('messages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
      allowNull: false,
    },
  });

  return Message;
};