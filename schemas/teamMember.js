const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const connection = require('../mongooseConnection');
const roles = require('../utils/roles');

const { Schema } = mongoose;

const teamMemberSchema = new Schema({
  role: {
    type: String,
    enum: roles,
  },
  _member: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true,
  },
  _team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
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

teamMemberSchema.virtual('id').get(function get() {
  return this._id.toString();
});

teamMemberSchema.plugin(mongooseLeanVirtuals);

const TeamMember = connection.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
