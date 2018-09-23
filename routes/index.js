var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var users = require('./users')
var flights = require('./flights')
var planes = require('./planes')
var cities = require('./cities')
var configs = require('./configs')
var faqs = require('./faqs')
var hangars = require('./hangars')
var reviews = require('./reviews')
var books = require('./books')
var others = require('./others');
var reset_passwords = require('./reset_password')
var notifications = require('./notifications');
var alerts = require('./alerts');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });




router.use('/api/users', users)
router.use('/api/flight', flights)
router.use('/api/plane', planes)
router.use('/api/city', cities)
router.use('/api/config', configs);
router.use('/api/faq', faqs);
router.use('/api/hangar', hangars)

router.use('/api/book', books);

router.use('/api', reset_passwords);
router.use('/api/review', reviews);
router.use('/api/other', others);
router.use('/api/notification', notifications);
router.use('/api/alerts', alerts);








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
