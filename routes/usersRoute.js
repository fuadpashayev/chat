const
    route = require('express').Router(),
    userController = require('../controllers/usersController'),
    UserController = new userController()
;

route.get('/',UserController.index);
route.get('/:id',UserController.show);

module.exports = route;