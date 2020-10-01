const mailer = require('nodemailer'); 

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 25 ,
    secure: false,
    auth: {
        user: "d5d7e0103204be",
        pass: "eafa5bce26543d"
    }
});

module.exports = { 
    async sendVerificationCode(email , link ) { 
        var mail = {
            from: "Hangman <hangman@gmail.com>",
            to: email,
            subject: "Verifiy Email",            
            html: `<b>Click on the link to activate your account <a href="${link}">Click Me!</a></b>`
        };
        await smtpTransport.sendMail(mail); 
        smtpTransport.close();
    }
}