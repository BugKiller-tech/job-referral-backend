const mailer = require('../utils/mailer');


module.exports = {
  sendEmail: async (req, res) => {
    console.log('I got the request for testing send mail')
    await mailer.sendTestEmailTo('hkg328@outlook.com');
    return res.json({
      message: 'Successfully sent email'
    })
  },
}