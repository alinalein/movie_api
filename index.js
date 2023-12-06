const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    app = express(),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movies_apiDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
//directs to the documentation.html
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/movies', async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('An Error occurred: ' + err);
        })
});

// additional message in case the movie is not in the DB 
app.get('/movies/title/:Title', async (req, res) => {
    try {
        const foundMovie = await Movies.findOne({ Title: req.params.Title })
        if (!foundMovie) {
            return res.status(200).send('Can\'t find a movie with this title: ' + req.params.Title)
        }
        res.status(201).json(foundMovie);
    } catch (err) {
        console.log(err);
        res.send(400).send('An Error occurred: ' + err);
    }
});

app.get('/movies/director/:Director', async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.Director }, 'Director')
        .then((movies) => {
            res.status(201).json(movies.Director);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('An Error occurred:  ' + err);
        })
});

app.get('/movies/genre/:Genre', async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.Genre }, 'Genre')
        .then((movies) => {
            res.status(201).json(movies.Genre);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Can\'t find the genre-Err: ' + err);
        })
});

app.post('/users/register', async (req, res) => {
    await Users.findOne({Username: req.body.Username})
    .then((user) => {
        if(user){
            res.status(200).send('User with ' + req.body.Username + ' already exist');
        }else{
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {
                res.status(201).json(user);
            })
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('An Error occurred: ' + err);
    })
});

app.put('/users/update/:Username', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username}, {$set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }}, 
    {new:true})
    .then((updatedUser)=>{
        res.status(201).json(updatedUser);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('Couldn\'t update user data: ' + err);
    })
});

app.put('/users/:Username/movies/add/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username}, 
        {$push: {FavoriteMovies: req.params.MovieID}},
    {new:true})
    .then((updatedUser) => {
        res.status(201).json(updatedUser);
    })
    .catch ((err) => {
        console.log(err);
        res.status(400).send('Couldn\t add movie to favorites List-Err: ' + err);
    })
});

app.delete('/users/:Username/movies/remove/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username},
        { $pull: {FavoriteMovies: req.params.MovieID}},
        {new:true})
    .then((updatedUser) => {
        res.status(200).json(updatedUser);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('Movie couldn\'t be deleted from favorite Movies-Err: '+ err);
    })
});

app.delete('/users/deregister/:Username', async(req, res) => {
    await Users.findOneAndDelete({Username: req.params.Username})
    .then((user) => {
        if(!user){
            res.status(200).send('No user with Username: ' + req.params.Username + ' found');
        }else{
            res.status(201).send('User with Username: ' + req.params.Username + ' was deleted');
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('User couldn\'t be deleted-Err: ' + err);
    })
});

//uses the common morgan format 
app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
