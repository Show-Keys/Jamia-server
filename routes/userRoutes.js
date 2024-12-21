// routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser, adminLogin } from '../controllers/userController.js';

const router = express.Router();

// Register User Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

// Admin Login Route
router.post('/admin/login', adminLogin);

export default router;
