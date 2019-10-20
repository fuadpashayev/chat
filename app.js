const
        express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        io = require('socket.io')(server),
        mustache = require('mustache-express'),
        config = require('./config'),
        bodyParser = require('body-parser'),
        session = require('express-session')
;


app.engine('html',mustache());
app.set('view engine','html');
app.set('views',`${__dirname}/views`);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.use(session({
    secret:'chat_project',
    saveUninitialized: true,
    resave: true
}));

/*Routes*/
const
        Route = require('./routes/Route'),
        usersRoute = require('./routes/usersRoute'),
        chatRoute = require('./routes/chatRoute')(io)
;

app.use('/',Route);
app.use('/users',usersRoute);
app.use('/chat',chatRoute);

server.listen(config.PORT);














