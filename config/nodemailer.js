const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport( {
    // service : 'gmail',
    // host : 'smtp.gmail.com',
    // port : 587,
    // secure : false,
    // auth : {
    //     user :'manojr124u@gmail.com',
    //     pass : 'Gdev1234'
    // }
    service : 'mailtrap.io',
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "85bb51e1aef3de",
      pass: "c53e93bc3c2102"
    }
 

});

let renderTemplate = (data,relativePath) => {
    let mailHTML;
    ejs.renderFile (
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template)   {
            if (err) {console.log('error in rendering mailer template', err ); return}
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}