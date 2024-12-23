import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  uname: { type: String, required: true },
  pnumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminCode: { type: String }, // Optional field for admin code
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;