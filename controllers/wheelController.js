import WheelItem from '../models/WheelItem.js';

// Get all wheel items
export const getWheelItems = async (req, res) => {
  try {
    const items = await WheelItem.find();
    res.json(items);
  } catch (err) {
    console.error('Error fetching wheel items:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new wheel item
export const addWheelItem = async (req, res) => {
  try {
    const { option } = req.body;
    if (!option) {
      return res.status(400).json({ error: 'Option field is required' });
    }
    const newItem = new WheelItem({ option });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error adding wheel item:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a wheel item
export const deleteWheelItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await WheelItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting wheel item:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
