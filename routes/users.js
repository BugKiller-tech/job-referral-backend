var express = require('express');
var router = express.Router();
var validator = require('express-joi-validation')({ passError: true })
var Joi = require('joi');

var userController = require('../controllers/UserController')

var authenticate = require('../policies/authenticate')
var checkAdmin = require('../policies/checkAdmin')


const signInValidator = Joi.object({
  email_phonenumber: Joi.string().required(),
  password: Joi.string().regex(
    new RegExp('^[a-zA-Z0-9]{6,32}$')
  ).required(),
})



router.post('/signup', userController.signup);
router.post('/signin', validator.body(signInValidator), userController.signin);
router.get('/checkLogin', userController.checkLogin);


router.use(authenticate)
router.post('/saveFCMToken', userController.saveFCMToken);
router.get('/allUsersHasToken', userController.allUsersHasToken)

router.post('/setFavoriteCities', userController.setFavoriteCities)
router.post('/updateProfile', userController.updateProfile)
router.post('/updateUser', userController.updateUser)
router.post('/setAsTermsAgree', userController.setAsTermsAgree);


router.use(checkAdmin)
router.post('/createUserAccount', userController.createUserAccount)
router.get('/deleteUser/:userId', userController.deleteUser)


//admin route
router.get('/all', userController.getAllUsers);
router.get('/:userType', userController.getUsers);


module.exports = router;
