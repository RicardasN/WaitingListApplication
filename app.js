require('dotenv').config();
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
//Non-Library imports
const globalvariables = require('./middleware/globalVariables').userMiddleware;
const passportConfig = require('./config/passport');
const indexRoutes = require('./routes/index');
const authenticationRoutes = require('./routes/auth');


//Middleware
//ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//Morgan
app.use(morgan('dev'));
//Cookie Parser
app.use(cookieParser());
passportConfig(passport);

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'justasecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use(globalvariables);

//Routes
//Routes for creating Database and it's tables
//app.use("/", require("./routes/databaseIntialization"));
//Home routes (would be home controller in .Net or symfony)
app.use('/', indexRoutes);
authenticationRoutes(app, passport);

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started on port 3000');
});