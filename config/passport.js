var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

const db = require('../config/db');

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.specialist_id);
 });

 passport.deserializeUser(function(id, done){
  db.query("SELECT * FROM specialists WHERE specialist_id = ? ", [id],
   function(err, rows){
    done(err, rows[0]);
   });
 });

 passport.use(
  'local-signup',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   db.query("SELECT * FROM specialists WHERE username = ? ", 
   [username], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'That is already taken'));
    }else{
     var newUserMysql = {
      username: username,
      password: bcrypt.hashSync(password, null, null),
      name: req.body.name,
      specialization: req.body.specialization
     };
     var insertQuery = "INSERT INTO specialists (username, password, name, specialization_id) values (?, ?, ?, ?)";

     db.query(insertQuery, [newUserMysql.username, newUserMysql.password, newUserMysql.name, newUserMysql.specialization],
      function(err, rows){
       if(err) console.log(err);
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
   });
  })
 );

 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   db.query("SELECT * FROM specialists WHERE username = ? ", [username],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage', 'No User Found'));
    }
    if(!bcrypt.compareSync(password, rows[0].password))
     return done(null, false, req.flash('loginMessage', 'Wrong Password'));
    return done(null, rows[0]);
   });
  })
 );
};