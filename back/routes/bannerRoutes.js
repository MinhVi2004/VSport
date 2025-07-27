// routes/bannerRoutes.js
const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const upload = require("../middleWare/upload"); // Middleware upload ảnh
const {authMiddleware, isAdmin} = require("../middleWare/auth");

// Lấy danh sách banner
router.get("/", bannerController.getBanners);


// Thêm banner (chỉ ảnh)
router.post("/", authMiddleware, isAdmin, upload.single("image"),  bannerController.createBanner);
router.get("/:id", authMiddleware, isAdmin, bannerController.getBannerById);
router.delete("/:id", authMiddleware, isAdmin, bannerController.deleteBanner);

module.exports = router;
