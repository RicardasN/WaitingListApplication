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
        res.redirect('/waitingList/' + result.insertId);
    });
});

router.get('/waitingList', async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name,' +
        ' `clients`.`client_id`, clients.name, clients.wasServed, clients.ticketCreated' +
        ' FROM `specialists`' +
        ' INNER JOIN `clients`' +
        ' ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0 LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        res.render('waitingList', { clients: result });
    });
});
router.get('/waitingList/:id', function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name,' +
        ' `clients`.`client_id`, clients.name, clients.wasServed, clients.ticketCreated' +
        ' FROM `specialists`' +
        ' INNER JOIN `clients`' +
        ' ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0 AND `clients`.`client_id` = ' + req.params.id +
        ' LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        res.render('waitingList', { clients: result });
    });
})
router.get('/client/changeState/:id', function (req, res) {
    const sql = 'UPDATE `clients` SET `wasServed` = 1 WHERE `clients`.`client_id` = ' + req.params.id;
    db.query(sql, function (err) {
        if (err) console.log(err);
        res.redirect('/waitingList');
    });
});

module.exports = router;