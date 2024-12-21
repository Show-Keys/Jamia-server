// controllers/userController.js
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import ResultModel from '../models/resultModel.js'; // Assuming you have a ResultModel

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

// Get Results
export const getResults = async (req, res) => {
  try {
    const results = await ResultModel.find({ userId: req.params.userId });
    res.status(200).json(results);
  } catch (error) {
    console.error('Error in getResults', error);
    res.status(500).send('Server Error');
  }
};

// Add Result
export const addResult = async (req, res) => {
  try {
    const newResult = new ResultModel({
      userId: req.body.userId,
      score: req.body.score,
      date: req.body.date,
    });
    await newResult.save();
    res.status(200).send('Result Added..');
  } catch (error) {
    console.error('Error in addResult', error);
    res.status(500).send('Server Error');
  }
};