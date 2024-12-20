// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import wheelRoutes from './routes/wheelRoutes.js'; // Ensure the path is correct
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('connected ✅'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/wheel', wheelRoutes);
// app.use('/api/users', userRoutes);
// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});