/* eslint-disable no-undef */
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // connects Mongoose to the DB in Mongo Atlas 
        await mongoose.connect(process.env.CONNECTION_URI);
        // to connect Mongoose to local DB
        // await mongoose.connect('mongodb://localhost:27017/movies_apiDB');
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = { connectDB };