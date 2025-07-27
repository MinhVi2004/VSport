// controllers/categoryController.js
const Category = require("../models/Category");
const cloudinary = require("../utils/cloudinary");
// Lấy tất cả category
exports.getAllCategories = async (req, res) => {
      try {
            const categories = await Category.find();
            // console.log("Full category: " + categories)
            res.json(categories);
      } catch (error) {
            res.status(500).json({ message: "Error fetching categories", error });
      }
};
// Lấy category by Id
exports.getCategoryById = async (req, res) => {
      try {
            const id = req.params.id;
            const category = await Category.findById(id);
            if (!category) {
                  return res.status(404).json({ message: "Category not found" });
            }
            res.json(category);
      } catch (error) {
            res.status(500).json({ message: "Error fetching categories", error });
      }
};
// Tạo category mới
exports.createCategory = async (req, res) => {
  try {
    if (!req.file) 
      return res.status(400).json({ message: "No image uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "VSport/Category",
    });

    const { name } = req.body;
    const category = new Category({ 
      name, 
      image: result.secure_url,
      public_id: result.public_id, // lưu lại để xoá sau này
    });

    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(400).json({ message: "Error creating category", error });
  }
};


// PUT cập nhật category (có thể cập nhật ảnh nếu cần)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });

    let updateData = { name: req.body.name };

    if (req.file) {
      // Xoá ảnh cũ
      if (category.public_id) {
        await cloudinary.uploader.destroy(category.public_id);
      }

      // Upload ảnh mới
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "VSport/Category",
      });

      updateData.image = result.secure_url;
      updateData.public_id = result.public_id;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: "Cập nhật thành công", category: updated });
  } catch (error) {
    res.status(400).json({ message: "Cập nhật thất bại", error });
  }
};




// Xoá category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });

    // Xoá ảnh trên Cloudinary
    if (category.public_id) {
      await cloudinary.uploader.destroy(category.public_id);
    }

    // Xoá trong DB
    await category.deleteOne();
    res.json({ message: "Đã xoá danh mục" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting category", error });
  }
};
