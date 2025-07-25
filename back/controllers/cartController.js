const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Variant = require("../models/Variant");




exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name price images"
      })
      .populate({
        path: "items.variant",
        select: "color sizes"
      });

    res.json(cart || { user: userId, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy giỏ hàng', error: err.message });
  }
};
exports.getCartCount = async (req, res) => {
    const userId = req.user._id;

    if (!userId) 
      return res.status(400).json({ error: "Missing userId" });

    try {
      const count = await Cart.countDocuments({ userId });
      return res.status(200).json({ count });
    } catch (err) {
      console.error("Get cart count error:", err);
      return res.status(500).json({ error: "Server error" });
    }

}

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, variant, size, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    // Trường hợp sản phẩm có phân loại (variant)
    if (variant) {
      const foundVariant = await Variant.findById(variant);
      if (!foundVariant) return res.status(400).json({ message: "Biến thể không tồn tại" });

      const sizeObj = foundVariant.sizes.find(s => s.size === size);
      if (!sizeObj) return res.status(400).json({ message: "Size không hợp lệ" });
      if (sizeObj.quantity < quantity) return res.status(400).json({ message: "Không đủ hàng" });

      const existingItem = cart.items.find(item =>
        item.product.equals(product) &&
        item.variant?.equals(variant) &&
        item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product, variant, size, quantity });
      }

    } else {
      // Trường hợp không có biến thể
      const foundProduct = await Product.findById(product);
      if (!foundProduct) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

      if (foundProduct.quantity < quantity)
        return res.status(400).json({ message: "Không đủ hàng" });

      const existingItem = cart.items.find(item =>
        item.product.equals(product) &&
        !item.variant && item.size === "default"
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product,
          size: "default", // gán mặc định cho sản phẩm không có phân loại
          quantity
        });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thêm vào giỏ hàng', error: err.message });
  }
};

exports.mergeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = req.body.items;
    console.log(userId);
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Nếu chưa có giỏ hàng, tạo mới
      cart = new Cart({ user: userId, items: [] });
    }

    for (const newItem of items) {
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === newItem.product &&
          item.size === newItem.size
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        cart.items.push({
          product: newItem.product,
          variant: newItem.variant || null,
          size: newItem.size,
          quantity: newItem.quantity,
        });
      }
    }

    await cart.save();

    res.status(200).json({ message: "Đã merge giỏ hàng thành công" });
  } catch (error) {
    console.error("Merge cart error:", error);
    res.status(500).json({ message: "Lỗi merge giỏ hàng", error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật sản phẩm', error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xoá sản phẩm', error: err.message });
  }
};
