const mongoose = require('mongoose'),
//bcrypt is a password hashing function 
    bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
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

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type:mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

// apply the hashPassword on the Password of the userSchema
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// compare the input Password with the Password in the DB, with validatePassword & this. not allowed to use arrow function
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;