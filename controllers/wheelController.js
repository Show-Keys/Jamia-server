// controllers/wheelController.js
import WheelItem from '../models/WheelItem';

// Get all wheel items
exports.getWheelItems = async (req, res) => {
  try {
    const items = await WheelItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new wheel item
exports.addWheelItem = async (req, res) => {
  try {
    const { option } = req.body;
    const newItem = new WheelItem({ option });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a wheel item
exports.deleteWheelItem = async (req, res) => {
  try {
    const { id } = req.params;
    await WheelItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
