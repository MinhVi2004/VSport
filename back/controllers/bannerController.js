const Banner = require("../models/Banner");
const cloudinary = require("../utils/cloudinary");

// Tạo banner mới (upload ảnh + lưu public_id)
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "VSport/Banner",
    });

    const banner = new Banner({
      image: result.secure_url,
      public_id: result.public_id, // LƯU ĐẦY ĐỦ
    });

    await banner.save();

    res.status(201).json(banner);
  } catch (err) {
    console.error("Lỗi khi tạo banner:", err);
    res.status(500).json({ message: "Thêm banner thất bại", error: err.message });
  }
};

// Lấy tất cả banner
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy banner theo ID
exports.getBannerById = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);

    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }

    res.status(200).json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa banner (xóa cả Cloudinary + DB)
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }

    // Xóa ảnh trên Cloudinary
    await cloudinary.uploader.destroy(banner.public_id);

    // Xóa DB
    await banner.deleteOne();

    res.json({ message: "Đã xóa banner thành công" });
  } catch (err) {
    console.error("Lỗi khi xoá banner:", err);
    res.status(500).json({ message: "Xoá banner thất bại", error: err.message });
  }
};
