const mongoose = require('mongoose');
const mongooseLeanId = require('mongoose-lean-id');
const connection = require('../mongooseConnection');
const roles = require('../utils/roles');
const Schema = mongoose.Schema;

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

teamMemberSchema.plugin(mongooseLeanId);

const TeamMember = connection.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
