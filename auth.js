const jwtSecret = 'your_jwt_secret';

// jsonwebtoken library used for creating and verifying JSON Web Tokens (JWTs) in Node.js 
const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    // jwt.sign(payload, secretKey, options)
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

// login path imported to index.js
module.exports = (router) => {
    router.post('/users/login', (req, res) => {
        // uses local strategy from passport.js to authenticate the user
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something seems to be wrong',
                    user: user
                });
            }
            req.login(user, { session: false }, error => {
                if (error) {
                    res.status(400).send(error);
                }
                let token = generateJWTToken(user.toJSON());
                let responseUser = {
                    Username: user.Username,
                    Email: user.Email,
                    Birthday: user.Birthday,
                    FavoriteMovies: user.FavoriteMovies
                };
                // after login was successful return this data
                return res.status(201).json({ 
                    user: responseUser,  
                    token: token });
            });
        })(req, res);
    })
}