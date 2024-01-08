const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const activityHistorySchema = new Schema({
  activity: {
    type: String,
    required: true
  },
  status: {
    type: String,
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
  access_log: {
    type: Schema.Types.ObjectId,
    ref: 'AccessLog',
    required: false
  }
},
{ timestamps: true });

activityHistorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ActivityHistory", activityHistorySchema)
