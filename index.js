const express = require('express'),
    morgan = require('morgan'),
    app = express();

app.use(express.static('public'));

let movies = [
    { movie: 'Harry Potter and the Sorcerer\'s Stone', genre: 'Fantasy', rating: 8.5 },
    { movie: 'Lord of the Rings', genre: 'Adventure', rating: 9.0 },
    { movie: 'Twilight', genre: 'Romance', rating: 6.2 }
];

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    res.json( );
});

app.get('/movies/:genre', (req, res) => {
    res.json(  );
});

app.get('/movies/:director', (req, res) => {
    res.json(  );
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
