const usersModel = require('../models/usersModel');

class UserController{
     index(req,res) {
        let Users = new usersModel();
        Users.getAll(users => {
            res.render('users/index', {users});
        });
    }

    show(req,res){
        let Users = new usersModel();
        const {id} = req.params;
        Users.find(id,user => {
            res.send(user);
        });

    }

}

module.exports = UserController;