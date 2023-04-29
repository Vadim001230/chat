module.exports = (sequelize, Sequelize) => {
  const UserModel = sequelize.define('users', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return UserModel;
};