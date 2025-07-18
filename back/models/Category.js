const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  public_id: { type: String, required: true }, // dùng để xoá ảnh khỏi Cloudinary
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Category", categorySchema);
