module.exports = function(io){
    const
            route = require('express').Router(),
            chatController = require('../controllers/chatController'),
            ChatController = new chatController(io)
    ;

    route.get('/',ChatController.index);

    return route;
};