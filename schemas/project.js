const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const connection = require('../mongooseConnection');

const { Schema } = mongoose;

const projectSchema = new Schema({
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  toDo: [String],
},
{
  timestamps: true,
  toObject: {
    virtuals: true,
  },
});

projectSchema.virtual('id').get(function get() {
  return this._id.toString();
});

projectSchema.plugin(mongooseLeanVirtuals);

const Project = connection.model('Project', projectSchema);

module.exports = Project;
