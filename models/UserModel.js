import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  uname: { type: String, required: true },
  pnumber: { type: String, required: true },
  password: { type: String, required: true },
  adminCode: { type: String, required: true }, // Added adminCode field
});

const UserModel = mongoose.model('User', UserSchema, "User");
export default UserModel;