const express = require("express");
const { UserController } = require("../../controllers");
const { AuthMiddlewares } = require('../../middlewares')

const router = express.Router();

// /api/v1/user/signup - POST
router.post('/signup', UserController.createUser);

// /api/v1/user/signin - POST
router.post("/signin", AuthMiddlewares.validateAuthRequest , UserController.signIn);

module.exports = router; 