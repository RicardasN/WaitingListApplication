const express = require('express');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const app = express();

//Middleware
//ejs
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
//Morgan
app.use(morgan('dev'));
//Cookie Parser
app.use(cookieParser());
require('./config/passport')(passport);

//Body parser
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'justasecret',
    resave:false,
    saveUninitialized: false
}));
   
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use(async function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Routes
//Routes for creating Database and it's tables
//app.use("/", require("./routes/databaseIntialization"));
//Home routes (would be home controller in .Net or symfony)
app.use("/", require("./routes/index"));
require('./routes/auth')(app, passport);

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started on port 3000');
});