// routes/userRoutes.js
import express from 'express';
import { insertUser, userLogin, adminLogin } from '../controllers/userController.js';

const router = express.Router();

// Insert User Route
router.post('/insertUser', insertUser);

// User Login Route
router.post('/userLogin', userLogin);

// Admin Login Route
router.post('/adminLogin', adminLogin);

export default router;
