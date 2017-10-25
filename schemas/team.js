const mongoose = require('mongoose');
const mongooseLeanId = require('mongoose-lean-id');
const connection = require('../mongooseConnection');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: String,
  color: String,
  toDo: [String],
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
  });

teamSchema.plugin(mongooseLeanId);

const Team = connection.model('Team', teamSchema);

module.exports = Team;
