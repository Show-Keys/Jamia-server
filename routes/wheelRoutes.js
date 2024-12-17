// routes/wheelRoutes.js
import express from 'express';
const router = express.Router();
const {
  getWheelItems,
  addWheelItem,
  deleteWheelItem,
} = require('../controllers/wheelController');

// GET all wheel items
router.get('/', getWheelItems);

// POST a new wheel item
router.post('/', addWheelItem);

// DELETE a wheel item by ID
router.delete('/:id', deleteWheelItem);

module.exports = router;
