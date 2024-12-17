// models/WheelItem.js
import mongoose from 'mongoose';

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

const WheelItem = mongoose.model('WheelItem', wheelItemSchema);

export default WheelItem;
