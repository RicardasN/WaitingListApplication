const mysql = require('mysql');

//Create connection
var db = mysql.createConnection({
    host     : process.env.DBSERVER,
    user     : process.env.DBUSERNAME,
    password : process.env.DBPASSWORD,
    port     : process.env.DBPORT,
    database : process.env.DBNAME
  });
//Connect  
db.connect(function(err){
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

module.exports = db;