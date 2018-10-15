var nodemailer = require('nodemailer');
var ejs = require('ejs');
var path = require('path');

const from = '"Job Referral Site" <info@job-ref.com>';


var transporter = nodemailer.createTransport({
    // service: 'smtp.elasticemail.com',
    host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function ejsRenderToHtml(fileName, data) {
    try {
        const htmlData = await new Promise((resolve, reject) => {
            ejs.renderFile(path.join(__dirname, `../views/email-templates/${fileName}`), data, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        return htmlData;
    } catch (err) {
        return '';
    }
}


module.exports = {
    
    sendTestEmailTo: async function (email) {
        let data = {
            code: 12302
        }
        try {
            const htmlData = await ejsRenderToHtml('test-email.ejs', data);
            console.log(htmlData);
            const mailOptions = {
                from: from, // sender address
                to: user.email,
                subject: 'This is the test email', // Subject line
                html: htmlData
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) console.log(err); else console.log(info);
            });
        } catch (err) {
            console.log(err);
        }
    },

    sendVerificationEmail: async (user, confirmationUrl) => {
        try {
            const htmlData = await ejsRenderToHtml('email-confirm.ejs', { user, confirmationUrl });
            const mailOptions = {
                from: from, // sender address
                to: user.email,
                subject: 'Please verify your email!', // Subject line
                html: htmlData
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) console.log(err); else console.log(info);
            });
        } catch (err) {
            console.log('sendverificationemail', err);
        }             
    },






    sendConfirmationEmail: function sendConfirmationEmail(user) {
    
    },
    sendResetPasswordEmail: function sendResetPasswordEmail(user, app) {
        const token = user.generateResetPasswordLink();
        const mailOptions = {
            from: from, // sender address
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
