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
    required: function () {
    // chỉ bắt buộc địa chỉ nếu không phải mua tại cửa hàng
        return this.paymentMethod !== "COD_IN_STORE";
      },
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "vnpay", "paypal", "COD_IN_STORE"],
    default: "COD",
  },
  retryCount: {
  type: Number,
  default: 0,
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
    enum: ["Đang xác nhận", "Đang xử lý", "Đang vận chuyển", "Đã vận chuyển","Hoàn thành", "Đã hủy"],
    default: "Đang xác nhận",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
