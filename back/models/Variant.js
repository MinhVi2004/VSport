const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  sku: { type: String, unique: true }, // ví dụ: "PROD01-RED-M"
  qrCodeUrl: { type: String, default: "" },
});

const variantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: { type: String, required: true },
  image: { type: String },
  public_id: { type: String },
  sizes: [sizeSchema],
}, { timestamps: true });

module.exports = mongoose.model("Variant", variantSchema);
