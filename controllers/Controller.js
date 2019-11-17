const usersModel = require('../models/usersModel');
const chatModel = require('../models/chatModel');
const helpers = require('../helpers');
const Joi = require('@hapi/joi');

class Controller{


    index(req,res) {
        const user = res.locals.user;
        const Chats = new chatModel();
        Chats.select('chats.*,messages.id as messageId,messages.message,messages.date as messageDate,chatUsers.id as chatUsersId,chatUsers.fullName as chatUsersFullName,messageUsers.id as messageUsersId,messageUsers.fullName as messageUsersFullName')
                .leftJoin('users','chats.user1=chatUsers.id or chats.user2=chatUsers.id','chatUsers')
                .leftJoin('messages','messages.id=chats.lastMessageId')
                .leftJoin('users','messages.userId = messageUsers.id','messageUsers')
                .where('chats.user1',user.id,1)
                .orWhere('chats.user2',user.id,1)
                .andNotWhere('chatUsers.fullname',user.fullname)
                .getAll(chats => {
            // console.log(chats)
            res.render('index/index',{chats})
        }); //.sql(query=>console.log(query))
    }

    newChat(req,res){
        const user = res.locals.user;
        const Users = new usersModel();
        Users.getAll(users => {
            users = users.removeIndex('id',user.id);
            res.render('index/newChat',{user,users});
        });
    }

    loginPage(req,res) {
        let error = helpers.getErrorMessage(req);
        res.render('index/login',{error});
    }

    login(req,res){
        const session = req.session;
        const Users = new usersModel();
        const {userName,password} = req.body;
        Users.where({
            userName,password
        }).get(user => {
            if(user){
                session.userId = user.id;
                res.redirect('/');
            }else{
                let error='login_or_password_is_incorrect';
                res.redirect('/login?error='+error);
            }
        });
    }

    registerPage(req,res){
        res.render('index/register',{});
    }

    register(req,res){
        const Users = new usersModel();
        const session = req.session;
        const Schema = Joi.object({
            fullName: Joi.string().min(3).required(),
            password: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
        });

        const {fullName,email,password} = req.body;

        const { error, value } = Schema.validate({fullName,email,password});
        value.username = helpers.generateUserName(value.fullName);
        if(!error){
            Users.create(value,(result,err)=>{
                session.userId = result.insertId;
                res.redirect('/');
            });
        }
    }



    exit(req,res){
        const session = req.session;
        session.userId = null;
        res.redirect('/');
    }

}

module.exports = Controller;