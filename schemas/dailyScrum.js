const mongoose = require('mongoose');
const mongooseLeanId = require('mongoose-lean-id');
const connection = require('../mongooseConnection');
const Schema = mongoose.Schema;

const dailyScrumSchema = new Schema({
  yesterday: String,
  today: String,
  problems: String,
  _team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    index: true,
  },
  _teamMember: {
    type: Schema.Types.ObjectId,
    ref: 'TeamMember',
    required: true,
    index: true,
  },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
  });

dailyScrumSchema.plugin(mongooseLeanId);

const DailyScrum = connection.model('DailyScrum', dailyScrumSchema);

module.exports = DailyScrum;
