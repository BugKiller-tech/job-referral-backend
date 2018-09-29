var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var users = require('./users')
var reset_passwords = require('./reset_password')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.use('/api/users', users)
router.use('/api', reset_passwords);










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
