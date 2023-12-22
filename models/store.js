const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address1: {
    type: String,
    required: true
  },
  address2: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zip: {
    type: Number,
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  towers: [{
    type: Schema.Types.ObjectId,
    ref: 'Tower'
  }],
  lockers: [{
    type: Schema.Types.ObjectId,
    ref: 'Locker'
  }],
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  access_logs: [{
    type: Schema.Types.ObjectId,
    ref: 'AccessLog'
  }],
  activity_histories: [{
    type: Schema.Types.ObjectId,
    ref: 'ActivityHistory'
  }]
},
{ timestamps: true });

module.exports = mongoose.model("Store", storeSchema)
