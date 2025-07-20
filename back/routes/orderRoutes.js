const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {authMiddleware} = require('./../middleWare/auth'); // cần middleware xác thực

router.use(authMiddleware); // áp dụng middleware cho tất cả các route trong orderRoutes

router.post('/create-vnpay', orderController.createPaymentUrl);
router.get('/vnpay_ipn', orderController.vnpayIpn);

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllMyOrders);
router.get('/:id', orderController.getMyOrdersById);

module.exports = router;
