var express = require('express');
var router = express.Router();
const { celebrate, Joi } = require('celebrate');

var userController = require('../controllers/UserController')
var authenticate = require('../policies/authenticate')
var checkAdmin = require('../policies/checkAdmin')

const signupSchema = celebrate({
  body: {
    firstName: Joi.string().required().error(new Error('first name is required')),
    lastName: Joi.string().required().error(new Error('last name name is required')),
    email: Joi.string().required().error(new Error('the email is required')),
    password: Joi.string().required().error(new Error('password is required')),
    userType: Joi.number(),
  }
})
const signinSchema = celebrate({
  body: {
    email: Joi.string().required().error(new Error('first name is required')),
    password: Joi.string().required().error(new Error('first name is required')),
  }
})


router.post('/signup',  signupSchema, userController.signup);
router.post('/signin', signinSchema, userController.signin);
router.get('/checkLogin', userController.checkLogin);

//admin route
router.get('/all', userController.getAllUsers);
router.get('/deleteUser/:userId', userController.deleteUser)


module.exports = router;
