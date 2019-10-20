const
        chatModel = require('../models/chatModel'),
        usersModel = require('../models/usersModel')
;

class ChatController{
    constructor(io=null){
        // console.log(FileStore);
        if(io){
            // io.sockets.on('connection',socket=>{
            //     socket.on(`sm_${store.get('userId')}`,function (data) {
            //         let Chat = new chatModel();
            //         Chat.create(data);
            //         io.sockets.emit('new message',data);
            //     });
            // });
        }

    }

     index(req,res) {
        let
            Chat = new chatModel(),
            Users = new usersModel(),
            session = req.session
        ;


        Chat.getAll(messages => {
            Users.find(session.userId,user=>{
                console.log(user);
                res.render('chat/index', {messages,user});
            });

        });






     }

}









module.exports = ChatController;