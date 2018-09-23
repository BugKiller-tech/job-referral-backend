var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv')
var cors = require('cors')
var mongoose = require('mongoose')
var Promise = require('bluebird')


dotenv.config()

mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URL, {useMongoClient: true})





var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));





app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: process.env.SECRET, resave: true, saveUninitialized: true}))
app.use(cors())


// var mailer = require('express-mailer');
// mailer.extend(app, {
//     from: 'jetcabad@gmail.com',
//     host: 'smtp.gmail.com', // hostname
//     secureConnection: true, // use SSL
//     port: 465, // port for secure SMTP
//     transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
//     auth: {
//         user: 'jetcabad@gmail.com',
//         pass: 'AircraftOperator01'
//     }
// });




var index = require('./routes/index');
app.use('/', index);



//Joi error send middleware
app.use((err, req, res, next) => {
  if (err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json({
      type: err.type, // will be "query" here, but could be "headers", "body", or "params"
      message: err.error.toString(),
    });
  } else {
    // pass on to another error handler
    next(err);
  }
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
