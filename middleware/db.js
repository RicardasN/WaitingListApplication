const mysql = require('mysql');

//Create connection
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'secret123',
    database : 'waitingApp'
  });
//Connect  
db.connect(function(err){
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

module.exports = db;