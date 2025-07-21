const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {authMiddleware, isAdmin} = require('./../middleWare/auth'); // cần middleware xác thực

router.get('/vnpay_ipn', orderController.vnpayIpn); // Không cần auth

router.use(authMiddleware); // Từ đây trở đi cần auth


router.post('/create-vnpay', orderController.createPaymentUrl);
router.post('/', orderController.createOrder);
router.get('/my', orderController.getAllMyOrders);
router.get('/:id', orderController.getMyOrdersById);


router.put('/:id', isAdmin, orderController.updateOrderStatus); 
router.get('/', isAdmin, orderController.getAllOrders);

module.exports = router;
