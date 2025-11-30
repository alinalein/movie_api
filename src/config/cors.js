const cors = require('cors');

const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:4200',
    'http://localhost:1234',
    'https://alinalein.github.io',
    'https://movie-api-lina-834bc70d6952.herokuapp.com',
    'https://myflix-alinalein.netlify.app',
    'http://my-api-alb.amazonaws.com'
];
// 1. CORS config:
const applyCORS = {
    origin: (origin, callback) => {
        // if request has no origin header, allow it by default , like Postman OR server to server request 
        if (!origin) return callback(null, true);  // callback(error, result); null -> no error / true -> allow access  
        // .indexOf() method in JS is called on arrays-> here array allowedOrigins - 
        //  It searches array completly and compare each item in array to the origin - here incoming request origin
        //.indexOf(value) returns: index (0, 1, 2, ...) if value is found in array / -1 if value is NOT found
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn\'t allow access from origin' + origin;
            return callback(new Error(message), false); // callback(error, result); pass here an Error object as first argument to callback
        }
        return callback(null, true);
    }
};

// cors(applyCORS) -> calls cors function from cors package & pass config (applyCORS) to it.
// cors() is a function that returns middleware that express can use via app.use(), without it would only export the configuration — not the actual logic that Express can use.
// result of cors(applyCORS) is a middleware function — just like:(req, res, next) => { ... }
// 2. Passing that config to cors() -> cors(corsOptions) returns the middleware function, are storing that in applyCORS.
module.exports = cors(applyCORS);
// cors is then called in app.js via -> app.use(cors;) - should always be placed above the routes 