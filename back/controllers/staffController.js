const Product = require("../models/Product");
const Variant = require("../models/Variant");
const Order = require("../models/Order");


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderItems, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    const newOrder = await Order.create({
      user: userId,
      orderItems,
      paymentMethod:"COD_IN_STORE",
      totalAmount,
      isPaid:true,
      status:"Hoàn thành",
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Tạo đơn hàng thất bại" });
  }
};


exports.getItemFromQRCode = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm theo Product trước
    const product = await Product.findById(id);
    if (product) {
      return res.status(200).json({ type: "product", item: product });
    }

    // Tìm trong Variant -> size
    const variants = await Variant.find({ "sizes._id": id });
    for (const variant of variants) {
      const size = variant.sizes.find((s) => s._id.toString() === id);
      if (size) {
        return res.status(200).json({
          type: "variant",
          variantId: variant._id,
          color: variant.color,
          size,
        });
      }
    }

    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.getOrderToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      paymentMethod: "COD_IN_STORE",
      status: "Hoàn thành",
    })
      .populate("user", "name")
      .lean();

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    };

    res.json({ orders, stats });
  } catch (err) {
    console.error("Chi tiết lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy đơn hàng tại cửa hàng hôm nay" });
  }
};
