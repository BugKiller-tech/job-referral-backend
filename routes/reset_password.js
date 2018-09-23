var express = require('express');
var router = express.Router();
var User = require('../models/User');
var sendResetPasswordEmail = require('../utils/mailer').sendResetPasswordEmail;


router.post('/reset_password_request', (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({
      success: false,
      errors: 'Please provide email first!'
    })
  }
  User.findOne({email: req.body.email}).then(user => {
    if(user){
        sendResetPasswordEmail(user, res);
        res.json({
          success: true,
          message: 'Successfully sent mail'
        });
    }else {
        res.status(400).json({
            errors: "There is not user with such email"
        })
    }
  })
})

router.post('/reset_password', (req, res) => {
  if (!req.body._id || !req.body.password) {
    return res.status(400).json({
      errors: 'Please provide the password correctly!'
    })
  }

  User.findById(req.body._id, (err, user) => {
    if (err) {
      return res.status(400).json({
        success: false,
        errrors: 'can not find the user'
      })
    }

    user.setPassword(req.body.password)
    user.save().then(userRecord => {
      res.json({
        success: true,
        message: 'Successfully resetted password'
      })
    })
    .catch(err => res.status(400).json({
      success: false,
      errors: err
    }))
  })
  
})

module.exports = router