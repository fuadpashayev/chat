const
        chatModel = require('../models/chatModel'),
        usersModel = require('../models/usersModel'),
        messagesModel = require('../models/messagesModel')
;

class ChatController{
    constructor(io=null){
        // console.log(FileStore);
        if(io){
            io.sockets.on('connection',socket=>{
                socket.on(`send message`,function (data) {
                    // let Chat = new chatModel();
                    // Chat.create(data);
                    io.sockets.emit('new message',data);
                });
            });
        }

    }

     index(req,res) {
        let
            Chat = new chatModel(),
            Users = new usersModel(),
            Messages = new messagesModel(),
            session = req.session,
            {chatId} = req.params
        ;


        Messages.where('chatId',chatId).getAll(messages => {
            Users.find(session.userId,user=>{
                console.log(user)
                res.render('chat/index', {messages,user});
            });

        });






     }

}









module.exports = ChatController;