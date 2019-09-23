const express = require('express');
const moment = require('moment');
const crypto = require('crypto');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authorization');


router.get('/', function (req, res) {
    const sql = 'SELECT * FROM `specializations`, `specialists` WHERE `specialists`.`specialization_id`=`specializations`.`specialization_id`';
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.render('index', { specializations: result });
    });
});

router.post('/getticket', function (req, res) {
    //lets generate a unique link for the user
    crypto.randomBytes(20, function (err, buff) {
        if (err) {
            console.log(error);
            res.redirect('back');
        }
        const token = buff.toString('hex');
        sql = 'INSERT INTO `clients` (' +
            '`client_id`, `specialist_id`, `name`, `wasServed`, `ticketCreated`, `token`) ' +
            'VALUES (NULL, ' + req.body.specialistSelect + ', \' ' + req.body.name + ' \', 0,  \'' + moment().format("YYYY-MM-DD HH:mm:ss") + '\', \'' + token + '\');';
        //console.log(sql);
        db.query(sql, function (err, result) {
            if (err) throw err;
            res.redirect('/waitingList/' + token);
        });
    })

});

router.get('/waitingList', async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name, `specialists`.`averageServingTime` AS servingTime, ' +
        ' `clients`.`client_id`, clients.name, clients.wasServed, clients.ticketCreated' +
        ' FROM `specialists`' +
        ' INNER JOIN `clients`' +
        ' ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0' +
        ' ORDER BY clients.ticketCreated ASC LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        let clients = await calcRowPosition(result);
        //console.log(clients);
        res.render('waitingList', { clients, moment });
    });
});
router.get('/specialistPage', auth.isLoggedIn, async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name,' +
        ' `clients`.`client_id`, clients.name, clients.wasServed, clients.ticketCreated' +
        ' FROM `specialists`' +
        ' INNER JOIN `clients`' +
        ' ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0 AND `specialists`.`specialist_id`=' + req.user.specialist_id +
        ' ORDER BY clients.ticketCreated ASC LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        res.render('specialistPage', { clients: result });
    });
});
router.get('/waitingList/:token', async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name,`specialists`.`specialist_id`, `clients`.`client_id`,' +
        ' `clients`.`name`, `clients`.`token`, clients.wasServed, clients.ticketCreated ' +
        ' FROM `specialists` INNER JOIN `clients`' +
        'ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0 AND `clients`.`token` = \'' + req.params.token + '\';';

    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.render('clientPage', { clients: [], error_message: 'Įvyko klaida, kreipkitės telefonu', moment });
        }
        const rowPositionCountSql = 'SELECT COUNT(*) AS rowPosition FROM `clients` WHERE `ticketCreated`<\'' + result[0].ticketCreated +
            '\' AND `specialist_id`=' + result[0].specialist_id;
        db.query(rowPositionCountSql, function (err, position) {
            if (err) {
                console.log(err);
                res.render('clientPage', { clients: [], error_message: 'Įvyko klaida, kreipkitės telefonu', moment });
            }
            res.render('clientPage', {
                clients: result, position: position[0].rowPosition,
                success_message: 'Užregistruota sėkmingai, išsisaugokite savo unikalią nuorodą! Nes ji dėl saugumo nėra rodoma niekur kitur', moment
            });
        });
    });
})
router.get('/client/changeState/:id', auth.isLoggedIn, function (req, res) {
    //Update client state to served
    const sql = 'UPDATE `clients` SET `wasServed` = 1, `ticketClosed` = NOW() WHERE `clients`.`client_id` = ' + req.params.id;
    db.query(sql, function (err) {
        if (err) console.log(err);
        //console.log(req.user);
        //Calculate the average time it takes for a specialist to serve a client
        const getAvgTimeSql = 'SELECT AVG(TIME_TO_SEC(TIMEDIFF(`clients`.`ticketClosed`,`clients`.`ticketCreated`))/60) AS servingTime FROM `clients` WHERE `clients`.`specialist_id` =' + 1;
        //console.log(getAvgTimeSql);
        db.query(getAvgTimeSql, function (err, avgTime) {
            if (err) console.log(err);
            //Update the average time it takes for a specialist to serve a client
            const updateSpcTimeSql = 'UPDATE `specialists` SET `averageServingTime` = ' + Math.round(avgTime[0].servingTime) + ' WHERE `specialists`.`specialist_id` = ' + 1;
            ///console.log(updateSpcTimeSql);
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

async function calcRowPosition(clients) {
    var specialists = [];
    for (var i = 0; i < clients.length; i++) {
        specialists.push(clients[i].sepcialist_name);
        clients[i].rowPosition = specialists.filter(s => s === clients[i].sepcialist_name).length;
    }
    return clients;
}

module.exports = router;

// 