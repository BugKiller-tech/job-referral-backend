var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var users = require('./users')
var reset_passwords = require('./reset_password')
var tests = require('./tests')





router.use('/api/users', users)
router.use('/api/test', tests);


router.use('/api', reset_passwords);


router.get('/confirmation/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const user = await user.findOne({ confirmationToken: token });
    if (!user) {
      return res.render('resetPassword', {
        invalidToken: true,
        token: '',
        user: {_id: '', email: ''}
      });
    }
    user.confirmationToken = '';
    user.confirmed = true
    await user.save();

    return res.json({
      message: 'your email is verified! you can use the website!'
    })
  } catch (err) {
    return res.render('resetPassword', {
      invalidToken: true,
      token: '',
      user: {_id: '', email: ''}
    });
  }
})

router.get('/reset_password_request', (req, res) => {
  res.render('resetPasswordRequest')
})
router.use('/reset_password/:token', (req, res) => {
  if (req.method == 'GET') {
    const token = req.params.token;
    if (!token || token ==''){
      res.send('Empty token!!')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
          return res.render('resetPassword', {
            invalidToken: true,
            token: '',
            user: {_id: '', email: ''}
          });
        }else {
          return res.render('resetPassword', {
            invalidToken: false,
            token: token,
            user: decoded
          })
        }
    })
  }
})

router.get('/*', function(req, res){
  res.render('index')
})


module.exports = router;
