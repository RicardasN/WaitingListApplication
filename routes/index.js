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
    //First of all lets validate the data
    const { name, specialistSelect } = req.body;
    //--------------------------------------------------
    //validation error handling
    let errors = [];
    //If any data was even entered into the form
    if (!name || specialistSelect==="Choose...") {
        errors.push("Please fill in all the fields!")
    } else {
        //To ease people woking with system it would be complicated if there are 2 people with teh same name
        //It could cause confusion, therefore we check if it is a full name
        if (name.length < 9) {
            errors.push("Please enter your full name!")
        }
        //If the name contains characters or numbers it's not a name
        var regex = /[0-9//*&%${}()£$"@;.,?!~#|]+/g;
        if (name.match(regex) && name.match(regex).length > 0) {
            errors.push("Please enter a valid name, not a mix of characters!")
        }
    }
    //if there were errors return the form
    if (errors.length > 0) {
        const sql = 'SELECT * FROM `specializations`, `specialists` WHERE `specialists`.`specialization_id`=`specializations`.`specialization_id`';
        db.query(sql, function (err, result) {
            if (err) throw err;
            res.render('index', { specializations: result, errors, name, specialistSelect });
        });
        return;
    }
    //If not everything is ok and we can create a ticket

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
            req.flash('success_message', 'Ticket was created successfully! You are now in a row. Don\'t forget to save this URL' +
                ' as it is unique and not displayed anywhere else on the page due to security measures');
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
        res.render('waitingList', { clients, moment });
    });
});
router.get('/specialistPage', auth.isLoggedIn, async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name, `specialists`.`averageServingTime` AS servingTime, ' +
        ' `clients`.`client_id`, clients.name, clients.wasServed, clients.ticketCreated' +
        ' FROM `specialists`' +
        ' INNER JOIN `clients`' +
        ' ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0 AND `specialists`.`specialist_id`=' + req.user.specialist_id +
        ' ORDER BY clients.ticketCreated ASC LIMIT 20';
    db.query(sql, async function (err, result) {
        if (err) throw err;
        let clients = await calcRowPosition(result);
        res.render('specialistPage', { clients, moment });
    });
});
router.get('/waitingList/:token', async function (req, res) {
    const sql = 'SELECT `specialists`.`name` AS sepcialist_name,`specialists`.`specialist_id`, `specialists`.`averageServingTime` AS servingTime, `clients`.`client_id`,' +
        ' `clients`.`name`, `clients`.`token`, clients.wasServed, clients.ticketCreated ' +
        ' FROM `specialists` INNER JOIN `clients`' +
        'ON `specialists`.`specialist_id`=`clients`.`specialist_id`' +
        ' WHERE clients.wasServed = 0 AND `clients`.`token` = "' + req.params.token + '";';
    db.query(sql, function (err, result) {
        if (err || result.length < 1) {
            console.log(err);
            req.flash('error_message', 'An error occured trying to cancel, contact over the phone');
            res.render('clientPage', { clients: [] });
            return;
        }
        const rowPositionCountSql = 'SELECT COUNT(*) AS rowPosition FROM `clients` WHERE `ticketCreated`<\'' + result[0].ticketCreated +
            '\' AND `specialist_id`=' + result[0].specialist_id;
        db.query(rowPositionCountSql, function (err, position) {
            if (err) {
                console.log(err);
                req.flash('error_message', 'An error occured trying to cancel, contact over the phone');
                res.render('clientPage', { clients: [] });
                return;
            }
            console.log(result, position[0].rowPosition);
            res.render('clientPage', {
                clients: result, position: position[0].rowPosition, moment
            });
        });
    });
})
router.get('/client/changeState/:id', auth.isLoggedIn, function (req, res) {
    //Update client state to served
    const sql = 'UPDATE `clients` SET `wasServed` = 1, `ticketClosed` = \'' + moment().format("YYYY-MM-DD HH:mm:ss") + '\' WHERE `clients`.`client_id` = ' + req.params.id;
    console.log(sql);
    db.query(sql, function (err) {
        if (err) {
            console.log(err);
            req.flash('error_message', 'An error occured trying to change client state');
            res.redirect('back');
            return;
        }
        console.log(req.user);
        //Calculate the average time it takes for a specialist to serve a client
        const getAvgTimeSql = 'SELECT AVG(TIME_TO_SEC(TIMEDIFF(`clients`.`ticketClosed`,`clients`.`ticketCreated`))/60) AS servingTime FROM `clients` WHERE `clients`.`specialist_id` =' + req.user.specialist_id;
        console.log(getAvgTimeSql);
        db.query(getAvgTimeSql, function (err, avgTime) {
            if (err) {
                console.log(err);
                req.flash('error_message', 'An error occured trying to change client state');
                res.redirect('back');
                return;
            }
            //Update the average time it takes for a specialist to serve a client
            const updateSpcTimeSql = 'UPDATE `specialists` SET `averageServingTime` = ' + Math.round(avgTime[0].servingTime) + ' WHERE `specialists`.`specialist_id` = ' + req.user.specialist_id;
            ///console.log(updateSpcTimeSql);
            db.query(updateSpcTimeSql, function (err) {
                if (err) {
                    console.log(err);
                    req.flash('error_message', 'An error occured trying to change client state');
                    res.redirect('back');
                    return;
                }
                res.redirect('/specialistPage');
            });
        });
    });

});
router.delete('/clients/:token', function (req, res) {
    const sql = 'DELETE FROM `clients` WHERE `clients`.`token` = \'' + req.params.token + '\'';
    console.log(sql);
    db.query(sql, function (err) {
        if (err) {
            console.log(err);
            req.flash('error_message', 'An error occured trying to cancel, contact over the phone');
            res.redirect('back');
            return;
        }
        req.flash('success_message', 'Apointment canceled successfully! If you have any other problems you will have create a new ticket');
        res.redirect('/waitingList');
    });
});
router.get('/delay/:id', async function (req, res) {
    //Find the 2 users in question, whose positions we will switch
    const sql = 'SELECT * FROM `clients` WHERE `clients`.`client_id`>=' + req.params.id + ' LIMIT 0,2';
    db.query(sql, async function (err, clients) {
        if (err) {
            console.log(err);
            req.flash('error_message', 'An error occured trying to delay, contact over the phone');
            res.redirect('back');
            return;
        } if (clients.length < 2) {
            //If the client is already the last in line
            req.flash('error_message', 'Client is already last in line!');
            res.redirect('back');
            return;
        }
        //Sql query to switch clients' ticket creation datetimes
        const updateSql1 = `UPDATE clients SET ticketCreated='` + moment(clients[1].ticketCreated).format("YYYY-MM-DD HH:mm:ss") + `'` +
            ` WHERE clients.client_id=` + clients[0].client_id;
        const updateSql2 = ` UPDATE clients SET ticketCreated='` + moment(clients[0].ticketCreated).format("YYYY-MM-DD HH:mm:ss") + `'` +
            ` WHERE clients.client_id=` + clients[1].client_id;
        try {
            let firstQuery = await db.query(updateSql1);
            let secondQuery = await db.query(updateSql2);
            req.flash('success_message', 'Apointment delayed successfully!');
            res.redirect('/waitingList');

        } catch (err) {
            console.log(err);
            req.flash('error_message', 'An error occured trying to delay, contact over the phone');
            res.redirect('back');
            return;
        }
    });
});
router.get('/specialistStatistics', async function (req, res) {
    sql = 'SELECT COUNT(`client_id`) as clientCount, DAY(`ticketCreated`) as ticketDay, `specialists`.`name`, `specialists`.`averageServingTime`' +
        ' FROM `clients` JOIN `specialists` ON `clients`.`specialist_id` = `specialists`.`specialist_id` ' +
        ' WHERE `clients`.`specialist_id`=' + req.query.specialistSelect + ' AND `clients`.`wasServed`=1' +
        ' GROUP BY ticketDay, `clients`.`specialist_id`';
    db.query(sql, async function (err, statistics) {
        if (err) {
            console.log(err);
            req.flash('error_message', 'An error occured trying to delay, contact over the phone');
            res.redirect('back');
            return;
        } if (statistics.length < 1) {
            req.flash('error_message', 'Statistics are empty, most likely this specialist is new here');
        }
        //Get information about specialists for the dropdown menu
        const specialistsSql = 'SELECT * FROM `specializations`, `specialists` WHERE `specialists`.`specialization_id`=`specializations`.`specialization_id`';
        db.query(specialistsSql, function (err, specialists) {
            if (err) {
                console.log(err);
                req.flash('error_message', 'An error occured trying to delay, contact over the phone');
                res.redirect('back');
                return;
            }
            res.render('statistics', { statistics, specialists });
        });
    });
})
router.get('/statistics', async function (req, res) {
    sql = 'SELECT COUNT(`client_id`) as clientCount, DAY(`ticketCreated`) as ticketDay, `specialists`.`name`, `specialists`.`averageServingTime`' +
        ' FROM `clients` JOIN `specialists` ON `clients`.`specialist_id` = `specialists`.`specialist_id` ' +
        ' AND `clients`.`wasServed`=1' +
        ' GROUP BY ticketDay, `clients`.`specialist_id`' +
        ' ORDER BY ticketDay DESC';
    db.query(sql, async function (err, statistics) {
        if (err) {
            console.log(err);
            req.flash('error_message', 'An error occured trying to delay, contact over the phone');
            res.redirect('back');
            return;
        } if (statistics.length < 1) {
            req.flash('error_message', 'An error occured trying to delay, contact over the phone');
            res.render('statistics', { statistics: [] });
            return;
        }
        //Get information about specialists for the dropdown menu
        const specialistsSql = 'SELECT * FROM `specializations`, `specialists` WHERE `specialists`.`specialization_id`=`specializations`.`specialization_id`';
        db.query(specialistsSql, function (err, specialists) {
            if (err) {
                console.log(err);
                req.flash('error_message', 'An error occured trying to delay, contact over the phone');
                res.redirect('back');
                return;
            }
            res.render('statistics', { statistics, specialists });
        });

    });
})
async function calcRowPosition(clients) {
    var specialists = [];
    for (var i = 0; i < clients.length; i++) {
        specialists.push(clients[i].sepcialist_name);
        clients[i].rowPosition = specialists.filter(s => s === clients[i].sepcialist_name).length;
    }
    return clients;
}

module.exports = router;
