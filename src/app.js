/* eslint-disable no-undef */
const express = require('express'),
    // mongoose = require('mongoose'),
    // cors = require('cors'), // middleware from express -> Cross-Origin Resource Sharing 
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('./config/cors'),
    { connectDB } = require('./config/database'),
    { accessLogStream } = require('./utils/logger')


require('dotenv').config() // allows to load the CONNECTION_URI

// mongoose.connect('mongodb://localhost:27017/movies_apiDB'); // to connect Mongoose to local DB
connectDB(); // database connection- if connection cant be made, the server will not run , as it is first in the code 

// if want to gnore the request for favicon.ico, has to be placed before all other app.use middleware
// app.get('/favicon.ico', (req, res) => res.status(204));

app.use(bodyParser.json()); // so I can use req.body 

// request should be logged used the common morgan format & stream specifies to write/log the request details to -> accessLogStream
app.use(morgan('combined', { stream: accessLogStream }));

// app.use(cors()); // if want to allow access for everyone
app.use(cors); // use CORS middleware -> access only to specific URLs

app.use(express.json()); // makes sure express gets to json format 

require('./routes/auth')(app); // (app)-> applies express also to auth.js
app.use(require('./routes/movieRoutes'));
app.use(require('./routes/userRoutes'));
app.use(require('./routes/s3Routes'));
app.use(express.static('src/public')); // directs the host provider the documentation.html

app.use((err, res) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// checks port number of hosting service, like heroku -> if there is none, server will use port 8080 
const port = process.env.PORT || 8080; // as 3000 often used by font end 

// 0000 allows to acces app from other IPs than only my laptop, like phone or heroku
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});