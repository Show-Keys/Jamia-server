// routes/wheelRoutes.js
import express from 'express';
import { getWheelItems, addWheelItem, deleteWheelItem } from '../controllers/wheelController.js';

const router = express.Router();

// GET all wheel items
router.get('/', getWheelItems);

// POST a new wheel item
router.post('/', addWheelItem);

// DELETE a wheel item by ID
router.delete('/:id', deleteWheelItem);

export default router;
