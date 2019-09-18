const express = require('express');
const router = express.Router();
const db = require('../config/db');

//Routes for creating Database and it's tables
router.get('/createdb', function(req, res){
    let sql = 'CREATE DATABASE waitingApp';
    db.query(sql, function(err, result){
        if(err) throw err;
        console.log(result);
        res.send('Database created!');
    })
});
//Enum for storing possible specializations
router.get('/createspecializationstable', function(res, res){
    let sql = 'CREATE TABLE IF NOT EXISTS specializations ('+
                'specialization_id INT AUTO_INCREMENT PRIMARY KEY,'+
                'specialization VARCHAR(255))';
    db.query(sql, function(err, result){
        if(err)throw err;
        console.log(result);
        res.send('Specializations table created ');
    });
});
router.get('/createspecialiststable', function(res, res){
    let sql = 'CREATE TABLE IF NOT EXISTS specialists ('+
                'specialist_id INT AUTO_INCREMENT PRIMARY KEY,'+
                'name VARCHAR(255) NOT NULL,'+
                'specialization_id INT,'+
                'FOREIGN KEY (specialization_id)'+
                '  REFERENCES specializations (specialization_id)'+
               ')';
    db.query(sql, function(err, result){
        if(err)throw err;
        console.log(result);
        res.send('Specialists table created ');
    });
});
router.get('/createwaitingrowtable', function(res, res){
    let sql = 'CREATE TABLE IF NOT EXISTS clients ('+
                 'client_id INT AUTO_INCREMENT,'+
                 'specialist_id INT,'+
                 'name VARCHAR(255) NOT NULL,'+
                 'wasServed BOOLEAN NOT NULL DEFAULT FALSE,'+
                 'PRIMARY KEY (client_id),'+
                 'FOREIGN KEY (specialist_id)'+
                 '  REFERENCES specialists (specialist_id)'+
                 '  ON UPDATE RESTRICT ON DELETE CASCADE'+
                ')';
    db.query(sql, function(err, result){
        if(err)throw err;
        console.log(result);
        res.send('clients table created ');
    });
});

module.exports = router;