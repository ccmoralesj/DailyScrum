const mongoose = require('mongoose');
const mongooseLeanId = require('mongoose-lean-id');
const connection = require('../mongooseConnection');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  birthDate: Date,
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
  });

memberSchema.plugin(mongooseLeanId);

const Member = connection.model('Member', memberSchema);

module.exports = Member;
