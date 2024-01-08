const mongoose = require("mongoose");
// const Store = require('./store');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false
  },
  login_pin: {
    type: String,
    required: false
  },
  role: {
    type: Number,
    required: true
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  },
  activity_histories: [{
    type: Schema.Types.ObjectId,
    ref: 'ActivityHistory'
  }],
  access_logs: [{
    type: Schema.Types.ObjectId,
    ref: 'AccessLog'
  }],
},
{ timestamps: true });

module.exports = mongoose.model("User", userSchema)
