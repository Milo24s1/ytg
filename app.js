const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/credintials');
const User = require('./src/model/user');


const indexRouter = require('./routes/index');


const app = express();
//const port = process.env.PORT || 9999;
const port = 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


mongoose.connect(config.database);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connection.on('connected',()=>{
    console.log('connected to '+config.database);
});
mongoose.connection.on('error',(error)=>{
    console.log('Database error '+error);
});

app.use('/admin',User.checkUser);
app.use('/addEvent',User.checkUser);
app.use('/deleteEvent/*',User.checkUser);
app.use('/addEventVideo',User.checkUser);
app.use('/',indexRouter);


app.listen(port, function(){
    console.log('Server is running on port:', port);
});