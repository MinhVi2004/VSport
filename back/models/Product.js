const mongoose = require("mongoose");
const QRCode = require("qrcode");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  hasVariant: { type: Boolean, default: false },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
productSchema.pre("save", async function (next) {
  try {
    // Nếu chưa có qrCodeUrl thì tạo mới
    if (!this.qrCodeUrl) {
      const qrData = `${process.env.FRONT_END}/staff/scan/${this._id}`; // sử dụng _id thay vì sku
      this.qrCodeUrl = await QRCode.toDataURL(qrData);
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Product", productSchema);
