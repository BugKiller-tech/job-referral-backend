const validator = require('validator');
const sharp = require('sharp');
const path = require('path')
const multer = require('multer');


const User = require('../models/User')
const parseErrors = require('../utils//parseErrors')
const CommonResponse = require('../utils/commonResponse');
const mailer = require('../utils/mailer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/resumes')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const uploadResumeMulter = multer({
                      storage,
                      limits: {
                        fileSize: 10 * 1024 * 1024 // this means 10 mb
                      }
                    }).single('file')

module.exports = {
  signup: async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        return res.status(403).json({
          errors: 'This email is already in use! Please use another email.'
        })
      }

      const user1 = new User(req.body);
      user1.setPassword(password);
      const confirmationUrl = user1.generateConfirmationUrl();
      await user1.save();
      mailer.sendVerificationEmail(user1, confirmationUrl);

      return res.json({
        message: 'Successfully signed up! Please verify your email',
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
      if (!user.confirmed) {
        return res.status(400).json({
          errors: 'Please verify your email first to use the website'
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

  changePassword: async (req, res) => {
    const { newPwd } = req.body;
    try {
      const user = await User.findOne({ _id: req.session.user._id })
      console.log('logged in user is ', user);
      if (!user) {
        return res.status(400).json({
          errors: 'can not find the user'
        })
      }
      user.setPassword(newPwd);
      await user.save();
      return res.json({
        message: 'Successfully updated the password'
      })
    } catch (err) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  },

  account_info: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.session.user._id });
      return res.json({
        message: 'this is your account info',
        user
      })
    } catch(err) {
      CommonResponse.sendSomethingWentWrong(req, res, err);
    }
  },

  uploadResume: async (req, res) => {
    try {
      let fileUrl = '';

      const error = await new Promise((resolve, reject) => {
        uploadResumeMulter(req, res, (uploadError) => {
          if (uploadError) {
            reject(uploadError)
          } else {
            if (req.file) {
              fileUrl = process.env.HOST + '/uploads/resumes/' + req.file.filename;
            }
            resolve(null);
          }
        });
      });

      
      if (fileUrl == '') {
        return res.status(400).json({
          errors: 'Please upload the resume file'
        })
      }

      if (error) {
        return res.status(400).json({
          errors: 'Can not upload the resume'
        })
      }
    
      const user = await User.findOne({ _id: req.session.user._id});

      if (!user) {
        return res.status(400).json({
          errors: 'Can not find the user in database'
        })
      }
      user.resume = fileUrl;
      await user.save();

      return res.json({
        message: 'Successfully uploaded the resume',
        user: user
      })
    } catch(err) {
      console.log('upload resume', err);
      CommonResponse.sendSomethingWentWrong(req,res, err);
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
        errors: 'Can not get the all user list'
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

