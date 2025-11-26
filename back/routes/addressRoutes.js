const express = require('express');
const router = express.Router();
const addressController = require('./../controllers/addressController');
const { authMiddleware } = require('../middleWare/auth');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: API quản lý địa chỉ người dùng
 */

/**
 * @swagger
 * /api/address:
 *   post:
 *     summary: Thêm địa chỉ mới
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullAddress
 *               - city
 *               - district
 *               - ward
 *             properties:
 *               fullAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm địa chỉ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', addressController.addAddress);

/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Lấy tất cả địa chỉ của người dùng
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách địa chỉ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fullAddress:
 *                     type: string
 *                   city:
 *                     type: string
 *                   district:
 *                     type: string
 *                   ward:
 *                     type: string
 *                   phone:
 *                     type: string
 */
router.get('/', addressController.getUserAddresses);

/**
 * @swagger
 * /api/address/{id}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa chỉ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Địa chỉ không tồn tại
 */
router.put('/:id', addressController.updateAddress);

/**
 * @swagger
 * /api/address/{id}:
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa chỉ
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Địa chỉ không tồn tại
 */
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
