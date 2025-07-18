const express = require("express");
const router = express.Router();
const upload = require("../middleWare/upload"); // Middleware upload ảnh
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", upload.single("image"), categoryController.createCategory);
router.put("/:id", upload.single("image"),categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
