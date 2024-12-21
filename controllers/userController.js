import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';


// Insert User
export const insertUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ uname: req.body.uname });
    if (user) {
      res.status(400).send('User Exists ...');
    } else {
      const hpass = await bcrypt.hash(req.body.password, 10);
      const newuser = new UserModel({
        fullName: req.body.fullName,
        uname: req.body.uname,
        pnumber: req.body.pnumber,
        password: hpass,
        adminCode: req.body.adminCode,
      });
      await newuser.save();
      res.status(200).send('User Added..');
    }
  } catch (error) {
    console.error('Error in insertUser', error);
    res.status(500).send('Server Error');
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    const user = await UserModel.findOne({ uname: req.body.uname });
    if (!user) {
      return res.status(404).json({ message: 'User not found..' });
    }
    const passMatch = await bcrypt.compare(req.body.password, user.password);
    if (passMatch) {
      return res.status(200).json({ user, message: 'success' });
    } else {
      return res.status(401).json({ message: 'Authorization Failed' });
    }
  } catch (error) {
    console.error('Error in userLogin', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const admin = await AdminModel.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found..' });
    } else {
      if (admin.password === req.body.password) {
        return res.status(200).json({ admin, message: 'success' });
      } else {
        return res.status(401).json({ message: 'Authorization Failed' });
      }
    }
  } catch (error) {
    console.error('Error in adminLogin', error);
    res.status(500).json({ message: 'Server Error' });
  }
};