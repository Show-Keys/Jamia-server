// models/WheelItem.js
const mongoose = require('mongoose');

const wheelItemSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WheelItem', wheelItemSchema);
