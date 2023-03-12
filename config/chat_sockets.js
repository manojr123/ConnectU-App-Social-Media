const Message = require('../models/message');



module.exports.chatSockets = function(socketServer){
    //let io = require('socket.io')(socketServer);

 
    let io = require('socket.io')(socketServer ,
        { cors:{origin:'http://127.0.0.1:8000' ,methods:['GET','POST'],
            credentials: true
    }});

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });
        
        socket.on('join_room', function(data){
            console.log('joining request rec.', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

        // CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message', async function(data){
            io.in(data.chatroom).emit('receive_message', data);

            let message = await Message.create ( {
                chatroom : data.chatroom,
                from_user : data.user_email,
                content : data.message
            });

            console.log ( 'chat_sockets :',message);





        });

    });

}