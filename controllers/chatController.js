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
                .leftJoin('users',`users.id=if(user1=${user.id},user2,user1)`)
                .where('chats.id',chatId)
                .get(chatUser => {
                    Messages.where('chatId', chatId).getAll(messages => {
                        res.render('chat/index', {messages, user, chatId, chatUser })
                    })
            }).sql(sql=>console.log(sql));
        })

    }

}


module.exports = ChatController;