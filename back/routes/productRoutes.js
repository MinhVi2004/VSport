const express = require("express");
const router = express.Router();
const upload = require("../middleWare/upload");
const productController = require("../controllers/productController");
const {authMiddleware, isAdmin} = require("../middleWare/auth")
// Sản phẩm
router.post("/", authMiddleware, isAdmin, upload.array("images",10), productController.createProduct);
router.put("/:id", authMiddleware, isAdmin, upload.array("images", 10), productController.updateProduct);

router.get("/", productController.getAllProducts);
// Đặt cụ thể trước chung chung để tránh nhầm route
router.get("/category/:id", productController.getAllProductByCategory);
router.get("/cart/:id", productController.getProductCartById);
router.get("/:id", productController.getProductById); // để cuối cùng

router.delete("/:id", productController.deleteProduct);

// Biến thể
router.post("/variant/:id", authMiddleware, isAdmin,upload.single("image"), productController.createVariant);
router.put("/variant/:productId/:variantId", authMiddleware, isAdmin,upload.single("image"), productController.updateVariant);
router.delete("/variant/:id", authMiddleware, isAdmin,productController.deleteVariant);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm và biến thể
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Tạo sản phẩm mới (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 */

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *   delete:
 *     summary: Xoá sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá sản phẩm thành công
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */

/**
 * @swagger
 * /api/product/category/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo danh mục
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm theo danh mục
 */

/**
 * @swagger
 * /api/product/cart/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo ID cho cart
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm cho giỏ hàng
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Thông tin chi tiết sản phẩm
 */

/**
 * @swagger
 * /api/product/variant/{id}:
 *   post:
 *     summary: Tạo biến thể sản phẩm (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               color:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     price:
 *                       type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo biến thể thành công
 */

/**
 * @swagger
 * /api/product/variant/{productId}/{variantId}:
 *   put:
 *     summary: Cập nhật biến thể sản phẩm (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               color:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     price:
 *                       type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật biến thể thành công
 */

/**
 * @swagger
 * /api/product/variant/{id}:
 *   delete:
 *     summary: Xoá biến thể sản phẩm (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID biến thể
 *     responses:
 *       200:
 *         description: Xoá biến thể thành công
 */
