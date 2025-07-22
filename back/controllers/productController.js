const Product = require("../models/Product");
const Variant = require("../models/Variant");
const cloudinary = require("../utils/cloudinary");
const QRCode = require("qrcode");
exports.createProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.data);
    const { name, description, category, quantity, price } = productData;

    if (await Product.findOne({ name })) {
      return res.status(400).json({ message: "Tên sản phẩm đã tồn tại" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Phải chọn ít nhất một ảnh sản phẩm" });
    }

    const product = new Product({ name, description, category, price, quantity });
    await product.save();

    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `VSport/Product/${product._id}`,
      });
      uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
    }

    product.images = uploadedImages;
    await product.save();

    res.status(201).json({ message: "Tạo sản phẩm thành công", product });
  } catch (error) {
    res.status(500).json({ message: "Tạo sản phẩm thất bại", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = JSON.parse(req.body.data);
    const { name, description, category, price, quantity, keepOldImages = [] } = productData;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    const existing = await Product.findOne({ name, _id: { $ne: productId } });
    if (existing) return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại' });

    const removedImages = product.images.filter(img => !keepOldImages.includes(img.url));
    for (let img of removedImages) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.warn(`Không thể xoá ảnh ${img.public_id}:`, err.message);
      }
    }

    let updatedImages = product.images.filter(img => keepOldImages.includes(img.url));

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `VSport/Product/${product._id}`,
        });
        updatedImages.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    product.name = name;
    product.description = description;
    product.category = category;
    product.price = price;
    product.quantity = quantity;
    product.images = updatedImages;
    product.updatedAt = Date.now();

    await product.save();

    res.status(200).json({ message: 'Cập nhật sản phẩm thành công', product });
  } catch (error) {
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

exports.createVariant = async (req, res) => {
  try {
    const productId = req.params.id;
    const { color, sizes } = req.body;

    if (!color || !sizes || !req.file) {
      return res.status(400).json({ message: "Thiếu thông tin màu, size hoặc ảnh" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: `VSport/Product/${productId}/variants`,
    });

    const parsedSizes = JSON.parse(sizes).map((sz, i) => ({
      ...sz,
      sku: `VAR-${Date.now()}-${i}`
    }));

    const variant = new Variant({
      product: productId,
      color,
      image: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      sizes: parsedSizes,
    });

    await variant.save();
    res.status(201).json({ message: "Thêm biến thể thành công", variant });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm biến thể", error: error.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { color, sizes } = req.body;

    const variant = await Variant.findById(variantId);
    if (!variant || variant.product.toString() !== productId)
      return res.status(404).json({ message: "Biến thể không hợp lệ" });

    variant.color = color;
    variant.sizes = JSON.parse(sizes).map(sz => ({
      ...sz,
      sku: sz.sku || `VAR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    }));

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `VSport/Product/${productId}/variants`,
      });
      variant.image = result.secure_url;
      variant.public_id = result.public_id;
    }

    await variant.save();
    res.json({ message: "Cập nhật biến thể thành công", variant });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật biến thể", error: error.message });
  }
};

exports.getAllProductByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ category: categoryId })
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const cate = req.query.cate;
    const filter = cate ? { category: cate } : {};
    const products = await Product.find(filter).populate("category").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    const variants = await Variant.find({ product: product._id });
    res.status(200).json({ ...product.toObject(), variants });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
};
exports.getProductDetailById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name") // chỉ lấy trường name của category
      .lean(); // chuyển về object thường để dễ thao tác sau

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const variants = await Variant.find({ product: product._id }).lean();

    // Trả về toàn bộ thông tin bao gồm product và mảng variants
    res.status(200).json({
      ...product,
      variants, // bao gồm color, image, public_id, sizes (gồm size, quantity, price, qrCodeUrl)
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    const folderPrefix = `VSport/Product/${productId}`;
    await cloudinary.api.delete_resources_by_prefix(folderPrefix);
    await cloudinary.api.delete_folder(`${folderPrefix}/variants`).catch(() => {});
    await cloudinary.api.delete_folder(folderPrefix).catch(() => {});

    await Variant.deleteMany({ product: productId });
    await product.deleteOne();

    res.status(200).json({ message: "Xoá sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: "Xóa sản phẩm thất bại", error: error.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const { id: variantId } = req.params;
    const variant = await Variant.findById(variantId);
    if (!variant) return res.status(404).json({ message: "Biến thể không tồn tại" });

    await cloudinary.api.delete_resources_by_prefix(`VSport/Product/${variant.product}/variants/${variantId}`);
    await variant.deleteOne();

    res.status(200).json({ message: "Xóa biến thể thành công" });
  } catch (error) {
    res.status(500).json({ message: "Xóa biến thể thất bại", error: error.message });
  }
};