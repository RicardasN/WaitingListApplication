const express = require('express');
const mysql = require('mysql');

const app = express();

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

//Routes
//Routes for creating Database and it's tables
app.use("/", require("./routes/databaseIntialization"));


app.listen(process.env.PORT || 3000, function(){
    console.log('Server started on port 3000');
});