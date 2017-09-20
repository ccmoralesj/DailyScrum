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
