const express = require('express'),
    morgan = require('morgan'),
    app = express();

app.use(express.static('public'));

let topMovies = [
    { title: 'Harry Potter and the Sorcerer\'s Stone', genre: 'Fantasy', rating: 8.5 },
    { title: 'Lord of the Rings', genre: 'Adventure', rating: 9.0 },
    { title: 'Twilight', genre: 'Romance', rating: 6.2 }
];

app.get('/movies', (req, res) => {
    res.json({ 'Top 10 Movies': topMovies });
});

app.get('/', (req, res) => {
    res.send('Welcome to the best Movies Platform ever!');
});
app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
