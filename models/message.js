const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema ({
    chatroom : {
        type : String,
        required : true
    },
    from_user : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    }

}, {
    timestamps : true
})

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;
