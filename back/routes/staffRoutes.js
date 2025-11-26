const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/staffController");
const {authMiddleware, isStaff} = require("./../middleWare/auth");


router.use(authMiddleware, isStaff);


router.get("/orderToday", StaffController.getOrderToday);
router.get("/:id",  StaffController.getItemFromQRCode);
router.post("/",  StaffController.createOrder);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Quản lý chức năng của nhân viên
 */

/**
 * @swagger
 * /api/staff/orderToday:
 *   get:
 *     summary: Lấy danh sách đơn hàng hôm nay (Staff)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng hôm nay
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Lấy thông tin đơn hàng từ QR Code (Staff)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng hoặc mã QR
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Tạo đơn hàng mới (Staff)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       example: 1
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
