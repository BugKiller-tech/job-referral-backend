var express = require('express');
var router = express.Router();
const { celebrate, Joi } = require('celebrate');
var controller = require('../controllers/TestController');

router.get('/send-email', controller.sendEmail);

module.exports = router;
