const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

let movies = [
    { title: 'Harry Potter and the Sorcerer\'s Stone', genre: 'Fantasy', rating: 8.5, director: 'Chris Columbus'},
    { title: 'Lord of the Rings', genre: 'Adventure', rating: 9.0, director: 'Peter Jackson'},
    { title: 'Twilight', genre: 'Romance', rating: 6.2, director: 'Catherine Hardwicke'}
];

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title }));
});

app.get('/movies/:genre', (req, res) => {
    const requestedGenre = req.params.genre;
    console.log('Requested Genre:', requestedGenre);

    const foundMovie = movies.find((movie) => {
        return movie.genre === requestedGenre;
    });

    res.json(foundMovie);
});

app.get('/movies/:director', (req, res) => {
    res.json(movies.find( (movie) => {
        return movie.director === req.params.director}));
});

app.post('/users/register/:name', (req, res) => {
    res.status(201).send('User XY has been successfully registered');
});

app.put('/users/update/:id/:username', (req, res) => {
    res.status(201).send('Username XY was successfully updated');
});

app.put('/movies/add/:title/:id', (req, res) => {
    res.status(201).send('Movie XY was successfully added to the favorites list');
});

app.delete('/movies/remove/:title/:id', (req, res) => {
    res.status(201).send('Movie XY was successfully removed from the favorites list');
});

app.delete('/users/deregister/:id', (req, res) => {
    res.status(201).send('User email XY has been removed');
});

//directs to the documentation.html
app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
