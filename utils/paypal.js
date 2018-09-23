const paypal = require('paypal-rest-sdk');
const config = require('../config/paypal');

paypal.configure(config.sandbox)
// paypal.configure(config.production)

module.exports = paypal