const { UserRepository, RoleRepository } = require("../repository");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { checkPassword, createToken, verifyToken } = require('../utils/common').Auth;
const { Enums } = require('../utils/common');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

// user signup function
async function createUser(data) { 
  try {
    const user = await userRepository.create(data);
    const role = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUM.CUSTOMER);
    user.addRole(role);
    return user;
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    throw new AppError(
      "Cannot create a new user object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signIn(data) {
  try {
    const user = await userRepository.getUserByEmail(data.email);
    if(!user){
        throw new AppError(
          "No user found for the given email",
          StatusCodes.NOT_FOUND
        );
    }
    
    const passwordMatch = checkPassword(data.password, user.password);
    
    if(!passwordMatch){
        throw new AppError(
          "Invalid Password for the given email",
          StatusCodes.BAD_REQUEST
        );
    }
     
    const jwt = createToken({id: user.id, email: user.email});
    return jwt;
  } catch (error) {
    if(error instanceof AppError) throw error;
    console.log(error)
    throw new AppError(
      "Cannot create a jwt token",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAuthenticated(token){
    try {
        if(!token) {
            throw new AppError(
              "Missing JWT token",
              StatusCodes.BAD_REQUEST
            );
        }
        const response = verifyToken(token);
        // if token is verified, we will get a similar object liek this - { id: "", email: "", iat: "", exp: "" }

        const user = await userRepository.get(response.id);
        if(!user){
            throw new AppError(
              "No user found",
              StatusCodes.NOT_FOUND
            );
        }

        return user.id;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if(error.name == "JsonWebTokenError"){
            throw new AppError(
              "Invalid JWT token",
              StatusCodes.BAD_REQUEST
            );
        }
        if(error.name == "TokenExpiredError"){
            throw new AppError(
              "Token expired! Please generate new token",
              StatusCodes.BAD_REQUEST
            );
        }
        console.log(error)
        throw error;
    }
}

module.exports = {
  createUser,
  signIn,
  isAuthenticated,
};
