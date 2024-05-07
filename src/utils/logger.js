/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

// create a write stream & path.join appends it to ‘log.txt’ file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

module.exports = { accessLogStream };