const
        usersModel = require('../models/usersModel'),
        Users = new usersModel()
;

let session;

const loginMiddleware = (req, res, next) => {
    session = req.session;
    Users.find(session.userId,(result,err) => {
        if(result){
            res.locals.user = result;
            next();
        }else{
            let allowed = ['/login','/register'];
            if(allowed.indexOf(req.path)!==-1){
                next();
            }else{
                res.redirect('/login');
            }
        }
    });
};

module.exports = loginMiddleware;