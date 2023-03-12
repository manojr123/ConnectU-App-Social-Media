const Message = require('../models/message');

module.exports.load = async function ( req,res) {
    console.log('MC : Load');

    let messages = await Message.find({chatroom : 'codeial'});

    if ( req.xhr) {
        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        console.log('MC : request is xhr....');

        return res.status(200).json ({
            data : {
                messages : messages
            },
            message : "Chat Messages sent!"
        })        

    } else {            
        return res.redirect('back');
    }

}