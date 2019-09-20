const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authorization');

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
router.get('/asignSpecialist/:id', function (req, res) {
    //Update client state to served
    const sql = 'UPDATE `clients` SET `specialist_id` = ' + req.params.id + ' WHERE `clients`.`client_id` = ' + req.params.id;
    db.query(sql, function (err) {
        if (err) console.log(err);
        console.log(req.user);
        res.redirect('/waitingList/' + result.insertId);
    });
});

router.get('/waitingList', async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name, `specialists`.`averageServingTime` AS servingTime, ' +
        ' `clients`.`client_id`, clients.name, clients.wasServed, clients.ticketCreated' +
        ' FROM `specialists`' +
        ' INNER JOIN `clients`' +
        ' ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0' +
        ' ORDER BY clients.ticketCreated DESC LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('waitingList', { clients: result });
    });
});
router.get('/specialistPage', auth.isLoggedIn, async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name,' +
        ' `clients`.`client_id`, clients.name, clients.wasServed, clients.ticketCreated' +
        ' FROM `specialists`' +
        ' INNER JOIN `clients`' +
        ' ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0 AND `specialists`.`specialist_id`=' + req.user.specialist_id +
        ' ORDER BY clients.ticketCreated DESC LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        res.render('specialistPage', { clients: result });
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
router.get('/client/changeState/:id', auth.isLoggedIn, function (req, res) {
    //Update client state to served
    const sql = 'UPDATE `clients` SET `wasServed` = 1, `ticketClosed` = NOW() WHERE `clients`.`client_id` = ' + req.params.id;
    db.query(sql, function (err) {
        if (err) console.log(err);
        console.log(req.user);
        //Calculate the average time it takes for a specialist to serve a client
        const getAvgTimeSql = 'SELECT AVG(TIME_TO_SEC(TIMEDIFF(`clients`.`ticketClosed`,`clients`.`ticketCreated`))/60) AS servingTime FROM `clients` WHERE `clients`.`specialist_id` =' + 1;
        console.log(getAvgTimeSql);
        db.query(getAvgTimeSql, function (err, avgTime) {
            if (err) console.log(err);
            //Update the average time it takes for a specialist to serve a client
            const updateSpcTimeSql = 'UPDATE `specialists` SET `averageServingTime` = ' + Math.round(avgTime[0].servingTime) + ' WHERE `specialists`.`specialist_id` = ' + 1;
            console.log(updateSpcTimeSql);
            db.query(updateSpcTimeSql, function (err) {
                if (err) console.log(err);
                res.redirect('/waitingList');
            });
        });
    });

});
router.get('/client/delete/:id', auth.isLoggedIn, function (req, res) {
    const sql = 'DELETE FROM `clients` WHERE `clients`.`client_id` =' + req.params.id;
    db.query(sql, function (err) {
        if (err) console.log(err);
        res.redirect('/waitingList');
    });
});

module.exports = router;

// 