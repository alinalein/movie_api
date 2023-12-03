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
    res.status(400).send('Movies could not be loaded-Err: ' + err);
   })
});

app.get('/movies/title/:Title', async (req, res) => {
    await Movies.findOne({Title: req.params.Title})
    .then((movie) =>{
        res.status(201).json(movie);
    })
    .catch((err)=>{
        console.log(err);
        res.send(400).send('Can not find the movie-Err: ' + err);
    })
});

app.get('/movies/director/:Director', async (req, res) => {
    await Movies.findOne({'Director.Name': req.params.Director})
    .then((movie) => {
    res.status(201).json(movie.Director);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send('Can not find a Director with this name-Err: ' + err);
    })
  
  
});

app.get('/movies/genre/:Genre', async (req, res) => {
    await Movies.findOne({'Genre.Name': req.params.Genre})
    .then((movie) => {
        res.status(201).json(movie.Genre);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send("Can't find the genre-Err: " +  err)
    })
});

// app.post('/users/register/:username', (req, res) => {
//     res.status(201).send('User XY has been successfully registered');
// });

// app.put('/users/update/:id/:username', (req, res) => {
//     res.status(201).send('Username XY was successfully updated');
// });

// app.put('/movies/add/:title/:id', (req, res) => {
//     res.status(201).send('Movie XY was successfully added to the favorites list');
// });

// app.delete('/movies/remove/:title/:id', (req, res) => {
//     res.status(201).send('Movie XY was successfully removed from the favorites list');
// });

// app.delete('/users/deregister/:id', (req, res) => {
//     res.status(201).send('User email XY has been removed');
// });

//uses the common morgan format 
app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
