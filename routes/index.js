const express = require('express');
const router = express.Router();
const db = require('../middleware/db');

router.get('/', function(req, res){
    const sql = 'SELECT * from specializations';
    db.query(sql, function(err, result){
        if(err)throw err;
        res.render('index', {specializations: result});
    });
});


module.exports = router;