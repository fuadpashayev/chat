const
        mysql = require('mysql'),
        config = require('./config'),
        db = mysql.createConnection({
            host: config.DB_HOST,
            user: config.DB_USER,
            pass: config.DB_PASS,
            database: config.DB_NAME,
        })
;

db.connect('',res =>{
    console.log(res)
});

module.exports = db;