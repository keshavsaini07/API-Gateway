const { UserRepository } = require("../repository");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { checkPassword, createToken } = require('../utils/common').Auth;

const userRepository = new UserRepository();

// user signup function
async function createUser(data) { 
  try {
    const user = await userRepository.create(data);
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


module.exports = {
  createUser,
  signIn,
};
