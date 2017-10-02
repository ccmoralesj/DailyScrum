const mongoose = require('mongoose');
const mongooseLeanId = require('mongoose-lean-id');
const connection = require('../mongooseConnection');
const Schema = mongoose.Schema;

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

taskSchema.plugin(mongooseLeanId);

const Task = connection.model('Task', taskSchema);

module.exports = Task;
