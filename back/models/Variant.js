const mongoose = require("mongoose");
const QRCode = require("qrcode");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  qrCodeUrl: { type: String, default: "" },
});
// sizeSchema.pre("save", async function (next) {
//   try {
//     // Nếu chưa có qrCodeUrl thì tạo mới
//     if (!this.qrCodeUrl) {
//       const qrData = `${process.env.FRONT_END}/staff/scan/${this._id}`; // sử dụng _id thay vì sku
//       this.qrCodeUrl = await QRCode.toDataURL(qrData);
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const variantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: { type: String, required: true },
  image: String,
  public_id: String,
  sizes: [sizeSchema],
}, { timestamps: true });

module.exports = mongoose.model("Variant", variantSchema);
