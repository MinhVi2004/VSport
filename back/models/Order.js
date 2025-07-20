const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String },
    },
  ],
  address:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "MoMo", "PayPal"],
    default: "COD",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  status: {
    type: String,
    enum: ["Đang xác nhận", "Đang xử lý", "Đang vận chuyển", "Đã vận chuyển", "Đã hủy"],
    default: "Đang xác nhận",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
