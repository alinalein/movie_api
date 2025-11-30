const mongoose = require('mongoose'),
    // bcrypt is a password hashing function 
    bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    // because only reference Movie by name, I dont have to import the movie.js
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// stores the functionality of hashing the password in the custom static method defined by me -> hashPassword
// statics-> called on the Model itself- before used was created in the DB
userSchema.statics.hashPassword = (password) => {
    // hashes the password using bcrypt's synchronous method. 10 is a common default, controls how save it is
    return bcrypt.hashSync(password, 10);
};

// here arrow function now allowed -> then this would not reffer to the docucument user, instead to outer scope (maybe the module, or undefined)
// define the method validatePassword -> this functiality is to compare the password input & password in DB via compareSync from bcrypt
// methods-> called on the document user - after user was created in the DB
userSchema.methods.validatePassword = function (password) {
    // it returns true if passwords match, false otherwise.
    return bcrypt.compareSync(password, this.Password);
};

// per default mongoose Convert 'User' to lowercase → 'user' and then plurelize it users
let User = mongoose.model('User', userSchema);
module.exports.User = User;

