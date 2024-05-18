const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

/*
 * POST : /signup
 * req-body { email: 'abc@xyz.com', password: 1234 }
 */
async function createUser(req, res) {
  try {
    const user = await UserService.createUser({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

/*
 * POST : /signin
 * req-body { email: 'abc@xyz.com', password: 1234 }
 */
async function signIn(req, res) {
  try {
    console.log(req.body.password);
    const user = await UserService.signIn({
      email: req.body.email,
      password: req.body.password,
    });
    
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error)
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function addRoleToUser(req, res) {
  try {
    const user = await UserService.addRoleToUser({
      role: req.body.role,
      id: req.body.id,
    });

    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createUser,
  signIn,
  addRoleToUser
};
