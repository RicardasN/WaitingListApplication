const express = require('express');
const mysql = require('mysql');

const app = express();

//Create connection
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'secret123'
  });
//Connect  
db.connect(function(err){
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

//Routes
app.get('/createdb', function(req, res){
    let sql = 'CREATE DATABASE waitingApp';
    db.query(sql, function(err, result){
        if(err) throw err;
        console.log(result);
        res.send('Database created!');
    })
});


app.listen(process.env.PORT || 3000, function(){
    console.log('Server started on port 3000');
});