const logger = require('winston');
const mongoose = require('mongoose');
const Promise = require('bluebird');

// mongoose.plugin(schema => { schema.options.usePushEach = true });
// Mongoose old Version
// "mongoose": "4.11.12",
mongoose.Promise = Promise;

const db = mongoose.connection;

db.on('error', err => logger.error('connection error: ', err));

db.once('open', () => logger.info('connection opened with DB'));

const mongooseConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/DailyScrum');

module.exports = mongooseConnection;
