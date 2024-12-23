import express from 'express';
import { registerUser, loginUser, adminLogin, fetchUsers, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Register User Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

// Admin Login Route
router.post('/admin/login', adminLogin);

// Fetch Users Route
router.get('/', fetchUsers);

// Delete User Route
router.delete('/:userId', deleteUser);

export default router;
