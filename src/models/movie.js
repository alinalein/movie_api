const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    // casesensitiv - must be same as in DB Title is not same as title 
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

// By default, Mongoose will: Convert 'Movie' to lowercase → 'movie' Then pluralize it → 'movies' - so collection must be called movies
let Movie = mongoose.model('Movie', movieSchema);
module.exports.Movie = Movie;