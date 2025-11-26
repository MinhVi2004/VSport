const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authMiddleware } = require('../middleWare/auth');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API quản lý giỏ hàng
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy danh sách sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                       variant:
 *                         type: object
 *                       size:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 */
router.get("/", cartController.getCart);

/**
 * @swagger
 * /api/cart/count:
 *   get:
 *     summary: Lấy số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Số lượng sản phẩm trong giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */
router.get("/count", cartController.getCartCount);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               size:
 *                 type: string
 *               variantId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm sản phẩm thành công
 */
router.post("/", cartController.addToCart);

/**
 * @swagger
 * /api/cart/merge:
 *   post:
 *     summary: Đồng bộ giỏ hàng localStorage với server sau khi đăng nhập
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                     variant:
 *                       type: object
 *                     size:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Đồng bộ giỏ hàng thành công
 */
router.post("/merge", cartController.mergeCart);

/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/", cartController.updateCartItem);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm trong giỏ hàng
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Sản phẩm không tồn tại
 */
router.delete("/:itemId", cartController.removeCartItem);

module.exports = router;
