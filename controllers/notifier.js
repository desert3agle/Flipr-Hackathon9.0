let nodemailer = require('nodemailer');


let nodemailerTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_ID
    }
});


exports.sendEmail = function (to, cc, subject, mailbody, callback) {
    let options = {
        from: process.env.EMAIL,
        to: to,
        cc: cc,
        subject: subject,
        html: mailbody
    };
    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        }
        else {
            let current = new Date();
            console.log(`mail sent! to ${options.to} and CCs at ${current.toLocaleString()}`);
        }
        callback(error, info);
    });
};
















