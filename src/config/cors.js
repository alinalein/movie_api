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

const applyCORS = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn\'t allow access from origin' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
};

module.exports = cors(applyCORS);