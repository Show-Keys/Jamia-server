// Models/User.js
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String, // String to handle numbers with leading zeros or country codes
      required: true,
    },
    profileImage: {
      type: String, // URL or file path to the profile image
      default: "",  // Default value if no image is provided
    },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpiration: Date,
  },
  { timestamps: true }
);

const userModel = mongoose.model("Users", userSchema);

export default userModel;
