// passport is a authentication middleware for Node.js
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userModels = require('../models/user'),
    passportJWT = require('passport-jwt');

// users exported and imported from models.js
let Users = userModels.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

// configure the local strategy (HTTP-Authentication) with passport
passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password'
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await Users.findOne({ Username: username })
                .then((user) => {
                    if (!user) {
                        console.log('incorrect username');
                        return callback(null, false, {
                            message: 'Incorrect username or passoword.',
                        });
                    }
                    if (!user.validatePassword(password)) {
                        console.log('Incorrect password');
                        return callback(null, false, { message: 'Incorrect password.' })
                    }
                    console.log('finished');
                    return callback(null, user);
                })
                .catch((error) => {
                    if (error) {
                        console.error(error);
                        return callback(error);
                    }
                })
        }
    )
)

// configure the JWT strategy (Token-Based-Authentication) with passport
passport.use(new JWTStrategy({
    //defines how the JWT should be extracted from request -> Bearer token
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // secret used to verify the JWT's signature, will compare with token from login (same secret key)
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            // will return null -> no error & the found user
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error);
        });
}));