import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/UserModel.js';

export const registerUser = async (req, res) => {
  const { fullName, uname, pnumber, email, password, adminCode } = req.body;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fullName,
      uname,
      pnumber,
      email,
      password: hashedPassword,
      adminCode,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, isAdmin: adminCode === 'admin123' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, adminCode } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isAdmin = adminCode === 'admin123';

    const token = jwt.sign(
      { userId: user._id, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password, adminCode } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (adminCode !== 'admin123') {
      return res.status(400).json({ error: 'Invalid admin code' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userModel.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};