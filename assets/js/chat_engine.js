class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://127.0.0.1:5000');

        if (this.userEmail){
            this.connectionHandler();
        }
    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })

            // load the chatroom with the chatroom messages from the database
            self.load_chatroom();

        });


        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            self.send_message(self);
        });

        $('#chat-message-input').keydown(function(e){
            if (e.keyCode == 13) {
                self.send_message(self);
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';
            let dataMessage;

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
                dataMessage = `
                <div class="div-message">
                    <span>${data.message} </span>
                </div>`
            } else {
                dataMessage = `
                <div "div-message">
                    <span class ="other-email" >${data.user_email} </span><br>
                    <span>${data.message} </span>
                </div>`
            }


            // newMessage.append($('<span>', {
            //     'html': data.message
            // }));

            // newMessage.append($('<sub>', {
            //     'html': data.user_email
            // }));
            newMessage.append($('<sub>', {
                'html': dataMessage
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    } // connectionHandler()



    send_message (self) {
        let msg = $('#chat-message-input').val();

        if (msg != ''){
            self.socket.emit('send_message', {
                message: msg,
                user_email: self.userEmail,
                chatroom: 'codeial'
            });
        }
        $('#chat-message-input').val("");
        // var messageBody = document.querySelector('#chat-messages-list');
        // messageBody.scrollTop = messageBody.scrollHeight ;
        // messageBody.scrollTo(0, messageBody.scrollHeight);
        var messageBody = document.querySelector('#user-chat-box');
        messageBody.scrollTop = messageBody.scrollHeight ;
        $('#chat-messages-list').scrollTop($('#chat-messages-list').height());
    };

    load_chatroom () {
        console.log('load_chatroom ...');
        let cself = this;
        $.ajax({
            type : 'get',
            url : '/messages/load',
            dataType: "json",
            success : function (data) {
                console.log('ajax result : load messages', data.data.messages);
                cself.populate_chatroom(data.data.messages, cself);
            }, 
            error : function ( error) {
                console.log('AJAX error: load_chatroom',error.responseText);
            }
        })

    }


    populate_chatroom (messages, self) {

        for (let message of messages ) {
            console.log('message :' , message);
            self.add_message_toDOM(message.content, message.from_user, self);
        }

    }


    add_message_toDOM (data_message, data_user_email, self){
        let newMessage = $('<li>');

        let messageType = 'other-message';
        let dataMessage;

        console.log('add_message_toDOM:data_user_email' ,data_user_email);
        console.log('add_message_toDOM:self.userEmail' ,self.userEmail);


        if (data_user_email == self.userEmail){
            messageType = 'self-message';
            dataMessage = `
            <div class="div-message">
                <span>${data_message} </span>
            </div>`
        } else {
            dataMessage = `
            <div "div-message">
                <span class ="other-email" >${data_user_email} </span><br>
                <span>${data_message} </span>
            </div>`
        }


        // newMessage.append($('<span>', {
        //     'html': data.message
        // }));

        // newMessage.append($('<sub>', {
        //     'html': data.user_email
        // }));
        newMessage.append($('<sub>', {
            'html': dataMessage
        }));

        newMessage.addClass(messageType);

        $('#chat-messages-list').append(newMessage);


    }

}