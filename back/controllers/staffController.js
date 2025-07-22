const Product = require("../models/Product");
const Variant = require("../models/Variant");

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