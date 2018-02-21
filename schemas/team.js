const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const connection = require('../mongooseConnection');

const { Schema } = mongoose;

const teamSchema = new Schema({
  name: String,
  color: String,
  toDo: [String],
  _project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
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

teamSchema.virtual('id').get(function get() {
  return this._id.toString();
});

teamSchema.plugin(mongooseLeanVirtuals);

const Team = connection.model('Team', teamSchema);

module.exports = Team;
