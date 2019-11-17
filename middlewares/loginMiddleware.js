const
        usersModel = require('../models/usersModel'),
        Users = new usersModel()
;

let session;

const loginMiddleware = (req, res, next) => {
    session = req.session;
    let allowed = ['/login','/register'];
    Users.find(session.userId,(result,err) => {
        if(result){
            res.locals.user = result;
            if(allowed.indexOf(req.path)===-1) next();
            else res.redirect('/');
        }else{
            if(allowed.indexOf(req.path)!==-1) next();
            else res.redirect('/login');
        }
    });
};

module.exports = loginMiddleware;