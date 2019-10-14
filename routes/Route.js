const
    route = require('express').Router(),
    controller = require('../controllers/Controller'),
    Controller = new controller(),
    loginMiddleware = require('../middlewares/loginMiddleware')
;

route.use(loginMiddleware);

route.get('/',Controller.index);
route.get('/login',Controller.loginPage);
route.post('/login',Controller.login);
route.get('/register',Controller.registerPage);
route.post('/register',Controller.register);
route.get('/exit',Controller.exit);


module.exports = route;