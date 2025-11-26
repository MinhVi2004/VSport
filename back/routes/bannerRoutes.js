const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const upload = require("../middleWare/upload"); // Middleware upload ảnh
const { authMiddleware, isAdmin } = require("../middleWare/auth");

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: API quản lý banner
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Lấy danh sách tất cả banner
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   image:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", bannerController.getBanners);

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Thêm banner mới (chỉ upload ảnh)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner được tạo thành công
 *       400:
 *         description: Lỗi dữ liệu hoặc file không hợp lệ
 *       401:
 *         description: Không có quyền
 */
router.post("/", authMiddleware, isAdmin, upload.single("image"), bannerController.createBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Lấy thông tin banner theo ID
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của banner
 *     responses:
 *       200:
 *         description: Banner tìm thấy
 *       404:
 *         description: Banner không tồn tại
 */
router.get("/:id", authMiddleware, isAdmin, bannerController.getBannerById);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Xóa banner theo ID
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của banner
 *     responses:
 *       200:
 *         description: Xóa banner thành công
 *       404:
 *         description: Banner không tồn tại
 */
router.delete("/:id", authMiddleware, isAdmin, bannerController.deleteBanner);

module.exports = router;
