const jwtSecret = 'your_jwt_secret',
    // jsonwebtoken library used for creating and verifying JSON Web Tokens (JWTs) in Node.js 
    jwt = require('jsonwebtoken'),
    passport = require('passport');


// Registers LocalStrategy and JwtStrategy using passport.use().
// Since they're attached to the global Passport instance by passport.use(),
// they will be available anywhere you call: const passport = require('passport');
require('../config/passportConfig');

let generateJWTToken = (user) => {
    // jwt.sign(payload, secretKey, options)
    // payload = user ; secretKey = jwtSecret; options = subject / expiresIn / algorithm
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * Handles user login.
 * @param {Object} router - Express Router object.
 */

module.exports = (router) => {
    /**
     * POST route to authenticate user login.
     * @name loginUser
     * @function
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} Containing user data and token if the login was successful.
     * @throws {Object} If a problem occurs while the user tries to login. 
    */

    // the })(req, res); part immediately invokes the middleware function returned by passport.authenticate - what is the response returned by passport after try to authenticate. 
    // This ensures that when a login request is sent to the backend, the middleware function is executed right away, initiating the authentication process with the provided local strategy.
    router.post('/users/login', (req, res) => {
        // passport.authenticate(strategyName, options, callback)
        // 'local' -> call the LocalStrategy that was set in passport.js to authenticate the user
        // session: false -> disables session support , as use JWT dont need to store session
        // Step 1: get the middleware with your custom callback
        // passport.authenticate(...) returns a middleware function BUT doesn't run the authentication immediately -for that step 2 needed below
        // The callback allows us to send a custom response to the frontend depending on whether the login was successful (user object) or not (error).
        passport.authenticate('local', { session: false }, (error, user) => {
            // Step 3 all below: This is the callback (that includes the parameters error & object) that runs after auth local strategy finished
            // if user object is null (no user found) or error  -> login failed
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something seems to be wrong',
                    user: user
                });
            }
            // if the login was successful,  req.login() tells passport -> user has been authenticated – attach it to req.user for this request
            // req.login() is a method that's added to the req object by Passport
            req.login(user, { session: false }, error => {
                // if in any case error occurs and login fails at that stage
                if (error) {
                    res.status(400).send(error);
                }
                // when user submits username & passwort, it gets checked with Localstrategy agains username & password in DB
                // if successful will retun acomplex Mongoose object of that user from DB, 
                // now want to strip out all that extra Mongoose stuff and just get the raw data -> JS object that can be used in generateJWTToken function
                let token = generateJWTToken(user.toJSON());
                // extract the user data you want to return in the response (leaving out password and other sensitive fields).
                let responseUser = {
                    Username: user.Username,
                    Email: user.Email,
                    Birthday: user.Birthday,
                    FavoriteMovies: user.FavoriteMovies
                };
                // after login was successful return this data to front end
                return res.status(201).json({
                    user: responseUser,
                    token: token
                });
            });
        })(req, res);   // Step 2: run the middleware function (which will call the callback later) immediately
        // invokes the middleware function returned by passport.authenticate(...) immediately - the localstrategy is called on the user.
        // middleware function is the return value of passport.authenticate(...) - everytime return is called inside passport - the response we get 
    })
}