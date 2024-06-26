const express = require('express')
const app = express()
require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true}))

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/pantryRoutes');
app.use('/', router);
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.listen(process.env.PORT ||3000, () => {console.log('Server up and running!');})