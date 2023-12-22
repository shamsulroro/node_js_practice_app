const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lockerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  harbor_lockerid: {
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
},
{ timestamps: true });

module.exports = mongoose.model("Locker", lockerSchema)