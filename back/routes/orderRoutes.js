const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware, isAdmin } = require("./../middleWare/auth"); // cần middleware xác thực


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
