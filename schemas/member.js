const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const connection = require('../mongooseConnection');

const { Schema } = mongoose;

const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  birthDate: Date,
  username: {
    type: String,
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

memberSchema.virtual('id').get(function get() {
  return this._id.toString();
});

memberSchema.plugin(mongooseLeanVirtuals);

const Member = connection.model('Member', memberSchema);

module.exports = Member;
