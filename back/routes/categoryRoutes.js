const express = require("express");
const router = express.Router();
const upload = require("../middleWare/upload"); // Middleware upload ảnh
const categoryController = require("../controllers/categoryController");
const {isAdmin} = require("./../middleWare/auth")
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", isAdmin, upload.single("image"), categoryController.createCategory);
router.put("/:id", isAdmin, upload.single("image"),categoryController.updateCategory);
router.delete("/:id", isAdmin, categoryController.deleteCategory);

module.exports = router;
