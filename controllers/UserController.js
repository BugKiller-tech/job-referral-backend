const validator = require('validator');
const sharp = require('sharp');
const path = require('path')

const User = require('../models/User')
const parseErrors = require('../utils//parseErrors')
const CommonResponse = require('../utils/commonResponse');

module.exports = {
  signup: async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({
          errors: 'This email is already in use! Please use another email.'
        })
      }

      const user1 = new User(req.body);
      user1.setPassword(req.password);
      await user1.save();

      return res.json({
        message: 'Successfully signed up! Please verify your email',
        user: user
      })      
    } catch (error) {
      CommonResponse.sendSomethingWentWrong(req, res, error);
    }
  },

  signin: async(req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          errors: 'can not find the user'
        })
      }

      if(user && user.isValidPassword(req.body.password)) {
        req.session.user = user
        return res.json({
          success: true,
          message: 'Successfully logged in',
          user: user
        })
      }else {
        return res.status(400).json({
          errors: 'Invalid credentials'
        })
      }
    }catch(err) {
      CommonResponse.sendSomethingWentWrong(req,res, err);
    }
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
        users
      })
    })
    .catch(err => {
      res.status(400).json({
      })
    })
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
}

