const mongoose = require('mongoose'),
    // bcrypt is a password hashing function 
    bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// apply the hashPassword on the Password of the userSchema
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// compare the input Password with the Password in the DB, with validatePassword & this. not allowed to use arrow function
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

module.exports = mongoose.model('User', userSchema);
