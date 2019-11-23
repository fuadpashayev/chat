const
        chatModel = require('../models/chatModel'),
        usersModel = require('../models/usersModel'),
        messagesModel = require('../models/messagesModel'),
        Chat = new chatModel(),
        Users = new usersModel(),
        Messages = new messagesModel()
;


class ChatController {
    constructor(io = null) {
        if(io){
            io.sockets.on('connection',socket=>{
                socket.on(`sendMessage`,function (data) {
                    Users.find(data.userId, user => {
                        let Chat = new chatModel();
                        Chat.where('user1',user.id,1).orWhere('user2',user.id,1).andWhere('id',data.chatId).get(chat=>{
                            if(chat){
                                data.userId = user.id;
                                let date = Math.round(Date.now()/1000);
                                Messages.create({
                                    userId:data.userId,
                                    chatId:data.chatId,
                                    message:data.message,
                                    date
                                });
                                io.emit('newMessage',data);
                            }else{
                                //create new chat
                            }
                        })
                    });
                });

                socket.on('sendTyping',function(data){
                    Users.find(data.userId, user => {
                        let Chat = new chatModel();
                        Chat.where('user1',user.id,1).orWhere('user2',user.id,1).andWhere('id',data.chatId).get(chat=>{
                            if(chat){
                                data.userId = user.id;
                                socket.broadcast.emit('getTyping',data);
                            }
                        })
                    });
                });
            });
        }
    }

    index(req, res){
        let
            session = req.session,
            {chatId} = req.params
        ;

        Users.find(session.userId, user => {
            Chat.select('users.*')
                .leftJoin('users','chats.user1=users.id or chats.user2=users.id')
                .notWhere('chats.user1',user.id,1)
                .orNotWhere('chats.user2',user.id,1)
                .get(chatUser => {
                    console.log(chatUser)
                    Messages.where('chatId', chatId).getAll(messages => {
                        res.render('chat/index', {messages, user, chatId, chatUser })
                    })
            });
        })

    }

}


module.exports = ChatController;