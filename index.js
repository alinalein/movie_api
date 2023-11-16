const express = require('express');
const app = express();

let topMovies = [
    { title: 'Harry Potter and the Sorcerer\'s Stone' },
    { title: 'Lord of the Rings' },
    { title: 'Twilight' }];

app.get('/movies', (req, res) => {
    res.json('Top 10 Movies: ' + topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to the best Movies Platform ever!');
});
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
