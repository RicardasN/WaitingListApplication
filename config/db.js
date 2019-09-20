const mysql = require('mysql');

//Create connection
var db = mysql.createConnection({
    host: 'remotemysql.com',
    port: process.env.DBPORT,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
});
//Connect  
db.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});

module.exports = db;