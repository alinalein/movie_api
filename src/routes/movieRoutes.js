const passport = require('passport'),
    express = require('express'),
    router = express.Router(),
    MovieModel = require('../models/movie');

let Movies = MovieModel.Movie
/**
 * GET route to the index page.
 * @function
 * @name indexRoute
 * @param {Object} req - Express request object. 
 * @param {Object} res - Express response object. 
 * @returns {String} Containing the message ("Welcome to the best movie search app ever!(Maybe😁))
 */
router.get('/', (req, res) => {
    res.send('Welcome to the best movie search app ever!(Maybe😁)');
});

/**
 * GET route to get all movies.
 * @function
 * @name getMovies
 * @param {Object} req - Express request object. 
 * @param {Object} res - Express response object. 
 * @returns {Promise<Object[]>} Containing an array of all fetched movies from the database if promise resolved.
 * @throws {Error} If a problem occurs while fetching the movies from the database or if the user is not logged in.   
 */
// applies the jwt authentication to every route, except register 
router.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('An Error occurred: ' + err);
        })
});

/**
 * GEt route to get the requested movie.
 * @function
 * @name getMovie
 * @param {Object} req - Express request object. Parameters: {String} Title - (movie Title)
 * @param {Object} res - Express response object. 
 * @returns {Promise<Object>} Containing the requested movie if promise resolved.
 * @throws {Error} If a problem occurs while fetching the requested movie from the database or if the user is not logged in.. 
 */
router.get('/movies/title/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const foundMovie = await Movies.findOne({ Title: req.params.Title })
        if (!foundMovie) {
            return res.status(404).send('Can\'t find a movie with this title: ' + req.params.Title)
        }
        res.status(200).json(foundMovie);
    } catch (err) {
        console.error(err);
        res.status(500).send('An Error occurred: ' + err);
    }
});

/**
 * GEt route to get the requested director.
 * @function
 * @name getDirector
 * @param {Object} req - Express request object. Parameters: {String} Director - (movie Director)
 * @param {Object} res - Express response object. 
 * @returns {Promise<Object>} Containing the requested director if promise resolved.
 * @throws {Error} If a problem occurs while fetching the requested director from the database or if the user is not logged in.. 
 */
router.get('/movies/director/:Director', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.Director }, 'Director')
        .then((movies) => {
            res.status(200).json(movies.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('An Error occurred:  ' + err);
        })
});

/**
 * GET route to get the requested genre.
 * @function
 * @name getGenre
 * @param {Object} req - Express request object. Parameters: {String} Genre - (movie Genre)
 * @param {Object} res - Express response object. 
 * @returns {Promise<Object>} Containing the requested genre if promise resolved.
 * @throws {Error} If a problem occurs while fetching the requested genre from the database or if the user is not logged in. 
 */
router.get('/movies/genre/:Genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Genre.Name from DB -> req.params.Genre -> Genre from URL
    await Movies.findOne({ 'Genre.Name': req.params.Genre }, 'Genre')
        .then((movies) => {
            res.status(200).json(movies.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Can\'t find the genre-Err: ' + err);
        })
});

module.exports = router;