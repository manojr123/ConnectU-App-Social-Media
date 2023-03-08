const nodeMailer = require('../../config/nodemailer');

// This is another way of exporting a method
exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment:comment }, '/comments/new_comment.ejs');

    //console.log('inside newComment mailer', comment);

    nodeMailer.transporter.sendMail ({
        from : 'manojr124u@gmail.com',
        to : comment.user.email,
        subject : "New Comment Published",
        //html :'<h1> Yup, your comment is now published! </h1>'
        html : htmlString
    }, (err, info ) => {
        if ( err) {
            console.log('Error in sending mail', err);
            return;
        }
        //console.log('Message sent', info);
        return;
    })
}