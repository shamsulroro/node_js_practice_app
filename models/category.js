const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  towers: [{
    type: Schema.Types.ObjectId,
    ref: 'Tower'
  }],
},
{ timestamps: true });

module.exports = mongoose.model("Category", categorySchema)