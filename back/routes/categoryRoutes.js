const express = require("express");
const router = express.Router();
const upload = require("../middleWare/upload"); // Middleware upload ảnh
const categoryController = require("../controllers/categoryController");
const {authMiddleware, isAdmin} = require("./../middleWare/auth")
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", authMiddleware, isAdmin, upload.single("image"), categoryController.createCategory);
router.put("/:id", authMiddleware, isAdmin, upload.single("image"),categoryController.updateCategory);
router.delete("/:id", authMiddleware, isAdmin, categoryController.deleteCategory);

module.exports = router;
