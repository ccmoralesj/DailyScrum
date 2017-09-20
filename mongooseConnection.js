const logger = require('winston');
const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

const db = mongoose.connection;

db.on('error', err => logger.error('connection error: ', err));

db.once('open', () => logger.info('connection opened with DB'));

const mongooseConnection = mongoose.createConnection('mongodb://localhost:27017/DailyScrum');

module.exports = mongooseConnection;
