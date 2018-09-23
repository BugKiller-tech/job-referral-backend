const Joi = require('joi')
const validator = require('validator');
const sharp = require('sharp');
const path = require('path')

const User = require('../models/User')
const parseErrors = require('../utils//parseErrors')
const CommonResponse = require('../utils/commonResponse');

module.exports = {
  signup: async (req, res) => {
    const schema = {
      email: Joi.string().email().required(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{6,32}$')
      ).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      // userName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      "favoriteCities": Joi.array(),
      "idImage": Joi.string(),
      "originCity": Joi.string(),
    }
    const { error, value } = Joi.validate(req.body, schema);
    if(error) {
      switch(error.details[0].context.key){
        case 'email':
        case 'password':
        case 'firstName':
        case 'lastName':
        // case 'userName':
        case 'phoneNumber':
        case 'idImage':
        case 'originCity':
          res.status(400).send({
            success: false,
            errors: error.details[0].message
          })
          break;
        default:
          res.status(400).send({
            success: false,
            errors: 'Please input all the information'
          })
          break;
      }
    }else {
      req.body.userName = req.body.firstName + ' ' + req.body.lastName

      if (req.body.idImage && req.body.idImage != "") {
        const idImageFileName = req.body.firstName + '_' + req.body.lastName + Date.now() + '.jpeg';
        const url = path.join(__dirname, '../public/uploads/idImages/' + idImageFileName);
        
        try {
          const user = await User.findOne({ $or: [ { email: req.body.email }, { phoneNumber: req.body.phoneNumber }] });
          console.log('check already exists', user)
          if (user) {
            return res.status(403).json({
              success: false,
              errors: 'email or phoneNumber is already in use!'
            })
          }

          // let buffered = new Buffer(req.body.idImage, 'base64');
          // console.log('Buffered result is .... ... ...', buffered)
          // return res.status(400).json({
          //   success: true,
          // })
          try {
            console.log('trying to upload the image with sharp', req.body.idImage);
            console.log(new Buffer(req.body.idImage));
            sharp(new Buffer(req.body.idImage, 'base64')).resize(500, 500).toFile(url, async (err, info) => {
              console.log('error~~~', err);
              console.log('info~~~', info);
              if (err) {
                return res.status(400).json({
                  success: false,
                  errors: 'failed to upload your identity image!'
                })
              }
              const data = Object.assign({}, req.body);
              if (data.idImage ) delete data.idImage
              console.log('Creating the user with this data', data);

              const newUser = new User(data)
              newUser.idImage = req.protocol + '://' + req.get('host') + '/uploads/idImages/' + idImageFileName;
              newUser.setPassword(req.body.password)
              
              newUser.save()
              .then(userRecord => {
                res.json({
                  success: true,
                  message: 'Successfully registered user'
                })
              })
              .catch(err => {
                console.log(err);
                res.status(400).json({
                  success: false,
                  errors: "can not create the user! maybe originCity could be wrong!"
                })
              })
            });
          } catch(sharpError) {
            console.log('sharp error', sharpError);
            return res.status(400).json({
              success: false,
              errors: 'Please provide valid id image to signup'
            })
          }
        } catch (error) {
          CommonResponse.sendSomethingWentWrong(req, res, error);
        }

      } else {
        return res.status(400).json({
          success: false,
          errors: 'Please provide the id image'
        })
      }

    }
  },
  createUserAccount: async (req, res) => {
    const schema = {
      email: Joi.string().email().required(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{6,32}$')
      ).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      userName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      role: Joi.number().required(),
    }
    const { error, value } = Joi.validate(req.body, schema);
    if(error) {
      switch(error.details[0].context.key){
        case 'email':
        case 'password':
        case 'firstName':
        case 'lastName':
        case 'userName':
        case 'phoneNumber':
        case 'role':
          res.status(400).send({
            success: false,
            errors: error.details[0].message
          })
          break;
        default:
          res.status(400).send({
            success: false,
            errors: 'Please input all the information'
          })
          break;
      }
    }else {
      try{
        const user = await User.findOne({ $or: [ { email: req.body.email }, { phoneNumber: req.body.phoneNumber }] });
        if(user) {
          res.status(403).json({
            success: false,
            errors: 'email is already in use!'
          })
        }else {
          const userData = req.body;
          const newUser = new User(userData)
          newUser.setPassword(req.body.password)
          const user = await newUser.save()
          res.json({
            success: true,
            message: 'Successfully registered user',
            user: user
          })
        }
      }catch(err) {
        res.status(400).json({
          success: false,
          errors: parseErrors(err.errors)
        })
      }
    }
  },
  signin: async(req, res) => {
    const { password, email_phonenumber } = req.body;
    var isEmailAuth = false;

    if (validator.isEmail(email_phonenumber)) {  isEmailAuth = true; }
    
    try {
      var user;
      if (isEmailAuth)
        user  = await User.findOne({email: req.body.email_phonenumber}).populate('favoriteCities').exec()
      else
        user  = await User.findOne({phoneNumber: req.body.email_phonenumber}).populate('favoriteCities').exec()
      
      if(user && user.isValidPassword(req.body.password)) {
        req.session.user = user
        return res.json({
          success: true,
          message: 'Successfully logged in',
          user: user
        })
      }else {
        return res.status(400).json({
          success: false,
          errors: 'Invalid credentials'
        })
      }
    }catch(err) {
      CommonResponse.sendSomethingWentWrong(req,res, err);
    }
    return res.status(400).json({
      success: false,
      errors: 'what are you doing'
    })
  },
  setAsTermsAgree: async (req, res) => {
    if (req.session.user && req.session.user._id) {
      try {
        const user = await User.findOne({ _id: req.session.user._id })
        user.isTermsAgree = true;
        await user.save();
        return res.json({
          success: true,
          message: 'You agreed successfully for terms and condition'
        })
      } catch( err) {
        CommonResponse.sendSomethingWentWrong(req, res, err);
      }
    }
    return res.status(400).json({
      success: false,
      errors: 'Please login first to make agree'
    })
  },
  checkLogin: (req, res) => {
    if (req.session && req.session.user){
      return res.json({
        success: true,
        user: req.session.user
      })
    }else{
      return res.status(401).json({
        errors: 'you did not log in'
      })
    }
  },

  getAllUsers: (req, res) => {
    User.find({}).then(users => {
      res.json({
        success: true,
        users
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false
      })
    })
  },
  getUsers: async(req, res) => {
    console.log(req.params);
    try {
      var users = {}
      switch(req.params.userType){
        case 'normal':
          users = await User.find({role: 0})
          break;
        case 'airline':
          users = await User.find({role: 1})
          break;
        case 'admin':
          users = await User.find({role: 2})
          break;
        default:
          users = await User.find({})
      }
      res.json({
        success: true,
        users
      })
    }catch(e) {
      res.status(400).json({
        success: false,
        errors: e
      })
    }
  },

  setFavoriteCities: async(req, res) => {
    const cities = req.body.cities
    const schema = {
      cities: Joi.array().required()
    }
    const { error, value} = Joi.validate(req.body, schema)
    if(error){
      switch(error.details[0].context.key){
        case 'cities':
          res.status(400).send({
            success: false,
            errors: error.details[0].message
          })
          break;
        default:
          res.status(400).send({
            success: false,
            errors: 'Please input all the information'
          })
          break;
      }
      return;
    }

    try{
      const user = req.session.user
      if(user){
        const newUser = await User.findByIdAndUpdate(user._id, {favoriteCities: cities }, {new: true})
        req.session.user = newUser;
        if(newUser){
          res.json({
            success: true,
            message: 'successfully saved',
            user: newUser
          })
        }else {
          res.status(400).json({
            success: false,
            errors: 'Can not save the cities'
          })
        }
      }
    }catch(error) {
      CommonResponse.sendSomethingWentWrong(req,res, error);
    }
  },

  saveFCMToken: async(req, res) => {
    if (!req.body.fireToken) {
      return res.status(400).json({
        success: false,
        errors: 'Please provide the fcm token'
      })
    };
    

    try{
      const user = req.session.user
      if(user){
        const newUser = await User.findByIdAndUpdate(user._id, {fireToken: req.body.fireToken }, {new: true})
        req.session.user = newUser;
        if(newUser){
          res.json({
            success: true,
            message: 'successfully token',
            fireToken: req.body.fireToken
          })
        }else {
          res.status(400).json({
            success: false,
            errors: 'Can not save the token to db'
          })
        }
      }
    }catch(error) {
      CommonResponse.sendSomethingWentWrong(req,res, error);
    }
  },

  updateProfile: async (req, res) => {
    const schema = {
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{6,32}$')
      ),
      firstName: Joi.string(),
      lastName: Joi.string(),
      // userName: Joi.string(),
      phoneNumber: Joi.string(),
      originCityId: Joi.string(),
    }
    const { error, value } = Joi.validate(req.body, schema);
    if(error) {
      switch(error.details[0].context.key){
        case 'password':
        case 'firstName':
        case 'lastName':
        // case 'userName':
        case 'phoneNumber':
          return res.status(400).json({
            success: false,
            errors: error.details[0].message
          })
        default:
          res.status(400).send({
            success: false,
            errors: 'Too much info'
          })
        break;
      }
      return;
    }
    req.body.userName = req.body.firstName + ' ' + req.body.lastName
    try {
      const user = req.session.user;
      const data = req.body
      var newPassword;
      if(data.password){
        newPassword = data.password;
        delete data.password
      }
      const newUser = await User.findByIdAndUpdate(user._id, data, {new: true})
      req.session.user = newUser;
      if(newUser){
        if(newPassword){
          newUser.setPassword(newPassword)
          await newUser.save();
        }
        res.json({
          success: true,
          message: 'successfully saved',
          user: newUser
        })
      }else {
        res.status(400).json({
          success: false,
          errors: 'Can not save the cities'
        })
      }
    }catch(err) {
      res.status(400).json({
        success: false,
        errors: 'Something went wrong'
      })
    }
  },
  updateUser: async (req, res) => {
    const schema = {
      _id: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      // userName: Joi.string(),
      phoneNumber: Joi.string(),
    }
    const { error, value } = Joi.validate(req.body, schema);
    if(error) {
      switch(error.details[0].context.key){
        case 'id':
        case 'firstName':
        case 'lastName':
        // case 'userName':
        case 'phoneNumber':
        case 'originCityId':
          return res.status(400).json({
            success: false,
            errors: error.details[0].message
          })
        default:
          res.status(400).send({
            success: false,
            errors: 'Too much info'
          })
        break;
      }
      return;
    }
    req.body.userName = req.body.firstName + ' ' + req.body.lastName
    try {
      const data = req.body
      console.log('~~~~~~~~', JSON.stringify(data));
      const id = data._id
      delete data._id
      const newUser = await User.findByIdAndUpdate(id, data, {new: true})
      console.log('~~~~~~~~', JSON.stringify(data));
      if(newUser){
        res.json({
          success: true,
          message: 'successfully saved',
          user: newUser
        })
      }else {
        res.status(400).json({
          success: false,
          errors: 'Can not save the cities'
        })
      }
    }catch(err) {
      res.status(400).json({
        success: false,
        errors: 'Something went wrong'
      })
    }
  },

  deleteUser: async (req, res) => {
    if (req.params.userId) {
      try {
        const user = await User.findByIdAndRemove(req.params.userId)
        if (user) {
          return res.json({
            success: true,
            errors: 'Successfully deleted'
          })
        }
      }catch(err){
        console.log(err);
        return res.status(400).json({
          errors: 'can not delete the user'
        })
      }
    }
    return res.status(400).json({
      errors: 'please provide id to delete'
    })
  },


  allUsersHasToken: async (req, res) => {
    try {
      const users = await User.find({fireToken: { $ne: null }})
      if (users) {
        return res.json({
          success: true,
          users: users
        })
      } else {
        res.json({
          success: true,
          users: []
        })
      }
    } catch(err) {
      return res.status(400).json({
        success: false,
        errors: JSON.stringify(err)
      })
    }
  },

}

