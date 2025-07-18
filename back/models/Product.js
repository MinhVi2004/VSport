const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  price: { type: Number, required: true }, // optional nếu đã có price theo size
  images: [
    {
      url: String,
      public_id: String
    }
  ],
  quantity:{
    type:Number,
    require:true,
  },
  hasVariant: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
