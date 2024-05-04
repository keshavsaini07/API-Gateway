'use strict';
const {
  Model
} = require('sequelize');

const { ServerConfig } = require('../config');
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 50],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  // sequelize hooks: sequelize uses something similar like js objects to implement these models in the backend
  User.beforeCreate(function encrypt(user){
    // salt rounds are actually the cost factor. higher the cost factor, the more hashing rounds are done and it also increases the time
    const encryptedPassword = bcrypt.hashSync(user.password, +ServerConfig.SALT_ROUNDS);
    user.password = encryptedPassword; 

  });
  return User;
};