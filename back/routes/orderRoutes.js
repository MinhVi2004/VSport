const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware, isAdmin } = require("./../middleWare/auth"); // cần middleware xác thực

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Quản lý đơn hàng
 */

/**
 * @swagger
 * /api/order/vnpay_ipn:
 *   get:
 *     summary: IPN callback từ VNPAY
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã tham chiếu đơn hàng
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã phản hồi từ VNPAY
 *     responses:
 *       200:
 *         description: IPN nhận thành công
 *       400:
 *         description: Lỗi xác nhận
 */

/**
 * @swagger
 * /api/order/admin:
 *   get:
 *     summary: Lấy tất cả đơn hàng (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả đơn hàng
 */

/**
 * @swagger
 * /api/order/admin/user/{id}:
 *   get:
 *     summary: Lấy đơn hàng theo userId (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của user
 */

/**
 * @swagger
 * /api/order/admin/{id}:
 *   get:
 *     summary: Lấy đơn hàng theo orderId (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 * 
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Đang giao hàng"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /api/order/create-vnpay:
 *   post:
 *     summary: Tạo link thanh toán VNPAY
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Trả về URL thanh toán VNPAY
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *               totalAmount:
 *                 type: number
 *               addressId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 */

/**
 * @swagger
 * /api/order/my:
 *   get:
 *     summary: Lấy tất cả đơn hàng của người dùng hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của user
 */

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Lấy đơn hàng của user theo orderId
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 */

/**
 * @swagger
 * /api/order/pay/{id}:
 *   put:
 *     summary: Thanh toán đơn hàng (user)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Thanh toán thành công
 */

router.get("/vnpay_ipn", orderController.vnpayIpn);
router.use(authMiddleware); // Từ đây trở đi cần auth

// 👇 Đặt route admin lên TRƯỚC
router.get("/admin", isAdmin, orderController.getAllOrders);
router.get("/admin/user/:id", isAdmin, orderController.getOrderByUserId);
router.get("/admin/:id", orderController.getOrderById);
router.put("/admin/:id", isAdmin, orderController.updateOrderStatus);

// 👇 Các route còn lại
router.post('/create-vnpay', orderController.createPaymentUrl);
router.post("/", orderController.createOrder);
router.get("/my", orderController.getAllMyOrders);
router.get("/:id", orderController.getMyOrdersById); // <- đặt sau cùng
router.put("/pay/:id", orderController.payOrder);
module.exports = router;
