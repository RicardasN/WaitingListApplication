const express = require('express');

const app = express();

//Middleware
//ejs
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
//Body parser
app.use(express.urlencoded({extended: false}));

//Routes
//Routes for creating Database and it's tables
app.use("/", require("./routes/databaseIntialization"));
//Home routes (would be home controller in .Net or symfony)
app.use("/", require("./routes/index"));

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started on port 3000');
});