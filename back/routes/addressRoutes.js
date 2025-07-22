const express = require('express');
const router = express.Router();
const addressController = require('./../controllers/addressController');
const { authMiddleware } = require('../middleWare/auth');

router.use(authMiddleware);
// Thêm địa chỉ
router.post('/',  addressController.addAddress);

// Lấy tất cả địa chỉ
router.get('/',  addressController.getUserAddresses);

// Sửa địa chỉ
router.put('/:id',  addressController.updateAddress);

// Xoá địa chỉ
router.delete('/:id',  addressController.deleteAddress);

module.exports = router;
