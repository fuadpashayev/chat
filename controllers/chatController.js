const
        express = require('express'),
        chatModel = require('../models/chatModel'),
        usersModel = require('../models/usersModel'),
        Users = new usersModel(),
        store = new express.session.MemoryStore
;

class ChatController{
    constructor(io=null){

    }

     index(req,res) {


     }

}









module.exports = ChatController;