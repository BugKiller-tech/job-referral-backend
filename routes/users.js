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
    email: Joi.string().required().error(new Error('Please provide the email to signin')),
    password: Joi.string().required().error(new Error('Please provide the password to sign in')),
  }
})

const changePwdSchema = celebrate({
  body: {
    newPwd: Joi.string().required().error(new Error('Please provide new password')),
  }
})


router.post('/signup',  signupSchema, userController.signup);
router.post('/signin', signinSchema, userController.signin);
router.get('/checkLogin', userController.checkLogin);

router.use(authenticate);

router.post('/changePassword', changePwdSchema, userController.changePassword);
router.post('/uploadResume',  userController.uploadResume);
router.get('/account_info', userController.account_info);

//admin route
router.get('/all', userController.getAllUsers);
router.get('/deleteUser/:userId', userController.deleteUser)


module.exports = router;
