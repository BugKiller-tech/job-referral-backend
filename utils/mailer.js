var nodemailer = require('nodemailer');

const from = '"Flight System" <info@flight_sys.com>';


var transporter = nodemailer.createTransport({
    // service: 'smtp.elasticemail.com',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PORT
       }
   });




module.exports = {
    sendConfirmationEmail: function sendConfirmationEmail(user) {
    
    },
    sendResetPasswordEmail: function sendResetPasswordEmail(user, app) {
        const token = user.generateResetPasswordLink();

        const mailOptions = {
            from: 'noreply@jetcab.com', // sender address
            to: user.email,
            subject: 'Reset for password for JETCAB', // Subject line
            html: `
                <html><body><h1>abcdef</h1></body></html>           
            `
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err) console.log(err); else console.log(info);
        });
    },
    sendSuccessBookMail: (user, book) => {
        const mailOptions = {
            from: 'noreply@jetcab.com', // sender address
            to: user.email,
            subject: 'You booked flight in JETCAB', // Subject line
            html: `
                <html>
                <head>
                </head>
                <body>
                sdfsdf
                </body>
                </html>
            `
        }
        transporter.sendMail(mailOptions, function (err, info) {
            if(err) console.log(err); else console.log(info);
        });
    }
}
