const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

function checkPassword(plainPassword, encyptedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, encyptedPassword);
  } catch (error) {
    console.log(error);
  }
}

function createToken(input) {
  try {
    return jwt.sign(input, ServerConfig.JWT_SECRET, { expiresIn: ServerConfig.JWT_EXPIRY})
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  checkPassword,
  createToken,
};
