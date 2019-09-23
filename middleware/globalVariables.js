const express = require('express');
const moment = require('moment');

var app = express();

module.exports = {
    userMiddleware: async function (req, res, next) {
        res.locals.currentUser = req.user;
        app.locals.moment = moment;
        res.locals.error_message=req.flash('error_message');
        res.locals.success_message=req.flash('success_message');
        
        next();
    }
}