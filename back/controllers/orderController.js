const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const savedOrder = await order.save();
    res.status(201).json({ message: "Tạo đơn hàng thành công", order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng", error: error.message });
  }
};
