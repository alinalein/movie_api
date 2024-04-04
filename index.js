/* eslint-disable no-undef */
const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    fs = require("fs"),
    path = require("path"),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User,
    // middleware from express -> Cross-Origin Resource Sharing c
    cors = require('cors');
const { check, validationResult } = require('express-validator');
require('dotenv').config()
//allows Mongoose to connect to local DB-> mongoose.connect('mongodb://localhost:27017/movies_apiDB');
//connects Mongoose to the DB in Mongo Atlas 
mongoose.connect(process.env.CONNECTION_URI);

//so I can use req.body 
app.use(bodyParser.json());

//directs to the documentation.html
app.use(express.static('public'));

// adds middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// define allowed origins 
// app.use(cors());
let allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'http://localhost:1234', 'https://movie-api-lina-834bc70d6952.herokuapp.com', 'https://myflix-alinalein.netlify.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn\'t allow access from origin' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

//makes sure express gets to json format 
app.use(express.json());
// (app)-> applies express also to auth.js
require('./auth')(app);

const passport = require('passport');
require('./passport');

//create a write stream & path.join appends it to ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
//request should be logged used the common morgan format & stream specifies to write/log the request details to -> accessLogStream
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
    res.send('Welcome to the best movie search app ever!(Maybe😁)');
});

// applies the jwt authentication to every route, except register 
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('An Error occurred: ' + err);
        })
});

app.get('/movies/title/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const foundMovie = await Movies.findOne({ Title: req.params.Title })
        if (!foundMovie) {
            return res.status(200).send('Can\'t find a movie with this title: ' + req.params.Title)
        }
        res.status(201).json(foundMovie);
    } catch (err) {
        console.error(err);
        res.send(400).send('An Error occurred: ' + err);
    }
});

app.get('/movies/director/:Director', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.Director }, 'Director')
        .then((movies) => {
            res.status(201).json(movies.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('An Error occurred:  ' + err);
        })
});

// Genre.Name from DB -> req.params.Genre -> Genre from URL
app.get('/movies/genre/:Genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.Genre }, 'Genre')
        .then((movies) => {
            res.status(201).json(movies.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('Can\'t find the genre-Err: ' + err);
        })
});

// use express validation methods
app.post('/users/signup', [check('Username', 'The user name is required and must be at least 5 characters long').isLength({ min: 5 }),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'The password is required and must be at least 8 characters long').not().isEmpty().isLength({ min: 8 }),
// .withMessage('Password must contain at least 1 number')
// .matches(/[A-Za-z]/)
// .withMessage('Password must contain at least 1 letter')
check('Email', 'Please type a valid email').isEmail(),
], async (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Extract error messages from validation errors
        const errorMessages = errors.array().map(error => error.msg);

        // Log all error messages
        errorMessages.forEach(errorMessage => {
            console.error(`Validation error: ${errorMessage}`);
        });

        // Send the error messages array with status 422
        return res.status(422).send({ message: 'Validation failed', errors: errorMessages });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                res.status(401).send('User with ' + req.body.Username + ' already exist');
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                    .then((user) => {
                        res.status(201).send('Successfully signed up!\n' + JSON.stringify({
                            Username: user.Username,
                            Email: user.Email,
                            Birthday: user.Birthday
                        }, null, 2));
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(400).send('An Error occurred 1: ' + err);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('An Error occurred 2: ' + err);
        })
});

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('An Error occurred: ' + err);
        })
});

app.put('/users/update/:Username',
    [check('Username', 'The user name is required and must be at least 5 characters long').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
        // check('Password', 'The password is required and must be at least 8 characters long').not().isEmpty().isLength({ min: 8 }),
        // .matches(/\d/)
        //.optional()
        // .withMessage('Password must contain at least 1 number')
        // .matches(/[A-Za-z]/)
        // .withMessage('Password must contain at least 1 letter')
        // check('Email', 'Please type a valid email').isEmail()
    ],

    passport.authenticate('jwt', { session: false }), async (req, res) => {

        if (req.user.Username !== req.params.Username) {
            return res.status(400).send('Permission denied!')
        }
        console.log('req.Body:', req.body)

        let errors = validationResult(req);
        console.log('error:', errors)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            // extract Username from req.body
            const { Username } = req.body;

            // Check if new username already in the BD 
            const existingUser = await Users.findOne({ Username });
            //if the username already in DB and not owned by current user->give an error message
            if (existingUser && existingUser.Username !== req.params.Username) {
                return res.status(401).json({ error: 'Username is already in use.  Please choose another username' });
            }
            // Set values only if they are provided in the request body
            const updateFields = {};
            if (req.body.Username) updateFields.Username = req.body.Username;
            if (req.body.Password) updateFields.Password = Users.hashPassword(req.body.Password);
            if (req.body.Email !== "" && req.body.Email !== null) updateFields.Email = req.body.Email;
            if (req.body.Birthday) updateFields.Birthday = req.body.Birthday;

            // Update the user with new values
            const updatedUser = await Users.findOneAndUpdate(
                { Username: req.params.Username },
                { $set: updateFields },
                { new: true }
            );

            res.status(200).json({
                Username: updatedUser.Username,
                Email: updatedUser.Email,
                Birthday: updatedUser.Birthday,
                FavoriteMovies: updatedUser.FavoriteMovies
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error: ' + err);
        }
    });

app.put('/users/:Username/movies/add/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied!')
    }

    await Users.findOneAndUpdate({ Username: req.params.Username },
        { $push: { FavoriteMovies: req.params.MovieID } },
        { new: true })
        .then((updatedUser) => {
            res.status(201).send('Successfully added the movie to the favorite List!\n' + JSON.stringify({
                Username: updatedUser.Username,
                FavoriteMovies: updatedUser.FavoriteMovies,
            }, null, 2));
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('Couldn\t add movie to favorites List-Err: ' + err);
        })
});

app.delete('/users/:Username/movies/remove/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied!')
    }
    await Users.findOneAndUpdate({ Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID } },
        { new: true })
        .then((updatedUser) => {
            res.status(200).send('Successfully deleted the movie to the favorite List!\n' + JSON.stringify({
                Username: updatedUser.Username,
                FavoriteMovies: updatedUser.FavoriteMovies,
            }, null, 2));
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('Movie couldn\'t be deleted from favorite Movies-Err: ' + err);
        })
});

app.delete('/users/deregister/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied!')
    }
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(200).send('No user with Username: ' + req.params.Username + ' found');
            } else {
                res.status(201).send('User with Username: ' + req.params.Username + ' was deleted');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('User couldn\'t be deleted-Err: ' + err);
        })
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// checks port number of hosting service-> if there is none, server will use port 8080 
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});