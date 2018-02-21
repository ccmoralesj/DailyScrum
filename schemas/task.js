const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const connection = require('../mongooseConnection');

const { Schema } = mongoose;

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  finishDate: {
    type: Date,
    index: true,
  },
  notes: [String],
  archive: {
    type: Boolean,
    default: false,
  },
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

taskSchema.virtual('id').get(function get() {
  return this._id.toString();
});

taskSchema.plugin(mongooseLeanVirtuals);

const Task = connection.model('Task', taskSchema);

module.exports = Task;
