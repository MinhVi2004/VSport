const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  // gender:{
  //   type: String,
  //   enum: ["Nam", "Nữ"],
  // },
  point: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: ["user", "admin", "staff"],
    default: "user",
  },
  type: {
    type: String,
    enum: ["normal", "google", "facebook"],
    default: "normal",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
  },
  status:{
    type:Boolean,
    default:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
