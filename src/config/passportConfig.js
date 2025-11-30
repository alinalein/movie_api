// passport is a authentication middleware for Node.js
const passport = require('passport'),
    // passport strategy specifically for username-password authentication.
    LocalStrategy = require('passport-local').Strategy,
    userModels = require('../models/user'),
    // strategy for passport that handles JSON Web Token ->JWT-based authentication.
    passportJWT = require('passport-jwt');

// set variables - could be const - Not storing the tokens themselves
// Just references to functions, classes, or utilities used to process tokens
let Users = userModels.User,
    // every user/token gets processed through the same fixed logic — there's no need to reassign or change the JWTStrategy or ExtractJWT themselves.
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

// ckecks username & password that is send by front end client with the BD 
// using passport.use() to define a Local Strategy — means users will log in with a username and password.
passport.use(
    // LocalStrategy constructor takes two parameters:
    //registered a strategy with the name 'local' — because LocalStrategy automatically registers itself under that name. -> then used in passport.authenticate ('local')
    new LocalStrategy(
        // first parameter Options Object
        {
            usernameField: 'Username',
            passwordField: 'Password'
        },
        // second parametere - Verify Callback Function
        async (username, password, callback) => {
            //console.log(`${username} ${password}`);
            await Users.findOne({ Username: username })
                .then((user) => {
                    if (!user) {
                        console.log('incorrect username');
                        // callback follows the format -> callback(error, user, info)
                        // callback(null, false);  if user not found or bad password
                        return callback(null, false, {
                            message: 'Incorrect username or passoword.',
                        });
                    }
                    // Call validatePassword(password) on the user object, and give the results of validatePassword - true or false / match or not match password
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
                        // as user & password was not the problem but if DB or server error
                        return callback(error);
                    }
                })
        }
    )
)

// extract token from header with  ExtractJWT.fromAuth.. , 
// veryfies it using secretOrKey - token was originaly set via signin - checks if match
// decodes the payload (if token valid - passport decodes token and checks what was put inside it (user object)) 
// when payload decoded can use it , for example for the Users.findById(jwtPayload._id)
// registered a strategy with the name 'jwt' — because JWTStrategy automatically registers itself under that name. -> then used in passport.authenticate ('jwt')
passport.use(new JWTStrategy({
    // comes from the passport-jwt package and defines how the JWT should be extracted from request -> Bearer token
    // required : tells Passport where to find the JWT
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // secretOrKey is a predefined option name used by the passport-jwt strategy.
    // Required: tells Passport how to verify the JWT signature
    // string value ('your_jwt_secret') defined by me, naming must match the in auth.js - to compare
    secretOrKey: 'your_jwt_secret'
    // jwtPayload provided by passport-jwt, when successfully extracts and verifies the JWT from the request.
}, async (jwtPayload, callback) => {
    // what is stored in the jwtPayload defined in auth.js -> here the whole user object 
    // as whole user object is the payload, the id of payload id same as id of user
    // 1. use jwtPayload to find the user in the DB
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            // 2. return & pass the user to Passport using the callback
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error);
        });
}));