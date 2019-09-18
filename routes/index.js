const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', function (req, res) {
    const sql = 'SELECT * from specializations';
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.render('index', { specializations: result });
    });
});

router.post('/getticket', function (req, res) {
    sql = 'INSERT INTO `clients` (' +
        '`client_id`, `specialist_id`, `name`, `wasServed`, `ticketCreated`) ' +
        'VALUES (NULL, ' + req.body.specialistSelect + ', \' ' + req.body.name + ' \', 0,  current_timestamp());';
    console.log(sql);
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/waitingList/'+result.insertId);
    });
});

router.get('/waitingList', async function (req, res) {
    var clients = [];
    const sql = 'SELECT * from `clients` WHERE `wasServed`=0 LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            var client = {
                name: result[i].name,
                ticketCreated: result[i].ticketCreated,
                number: result[i].client_id
            };
            var sql1 = 'SELECT name FROM `specialists` WHERE `specialist_id`=' + result[i].specialist_id;
            db.query(sql1, function (err, specialists) {
                if (err) console.log(err);
                client.specialist = specialists[0].name;
                clients.push(client);
            });
            await sleep(10);
        }
    });
    setTimeout(function () {
        console.log(clients);
        res.render('waitingList', { clients });
    }, 100);
});
router.get('/waitingList/:id', function (req, res) {
    const sql = 'SELECT * FROM `clients` WHERE `client_id`='+req.params.id;
    db.query(sql, function (err, result) {
        if (err) throw err;
        var client = {
            name: result[0].name,
            ticketCreated: result[0].ticketCreated,
            number: result[0].client_id
        };
        var sql1 = 'SELECT name FROM `specialists` WHERE `specialist_id`=' + result[0].specialist_id;
        db.query(sql1, function (err, specialists) {
            if (err) console.log(err);
            client.specialist = specialists[0].name;
            res.render('waitingList', { clients: [client] });
        });
    });
})
router.get('/client/changeState/:id', function(req, res){
    var sql = 'UPDATE `clients` SET `wasServed` = 1 WHERE `clients`.`client_id` = '+req.params.id;
    db.query(sql, function (err) {
        if (err) console.log(err);
        res.redirect('/waitingList');
    });
});
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
module.exports = router;