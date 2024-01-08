const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const towerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  harbor_towerid: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  lockers: [{
    type: Schema.Types.ObjectId,
    ref: 'Locker'
  }],
  lockers_count: {
    type: Number,
    required: true
  }
},
{ timestamps: true });

module.exports = mongoose.model("Tower", towerSchema)