const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accessLogSchema = new Schema({
  harbor_lockerid: {
    type: String,
    required: true
  },
  harbor_towerid: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  internal: {
    type: Boolean,
    required: true
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  tower: {
    type: Schema.Types.ObjectId,
    ref: 'Tower',
    required: true
  },
  locker: {
    type: Schema.Types.ObjectId,
    ref: 'Locker',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  activity_histories: [{
    type: Schema.Types.ObjectId,
    ref: 'ActivityHistory'
  }],
},
{ timestamps: true });

module.exports = mongoose.model("AccessLog", accessLogSchema)
