const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleWare/auth");
const userController = require("../controllers/userController");

router.post("/signup", userController.signupUser);
router.post("/signin", userController.signinUser);
router.post("/signinByGoogle", userController.signinUserByGoogle);
router.post("/signinByFacebook", userController.signinUserByFacebook);
router.get("/verify-email", userController.verifyEmail)
router.get("/:id", userController.getUserById);
// router.put("/:id", userController.updateUser);
router.put("/change-password", authMiddleware, userController.changePassword);
// router.delete("/:id", userController.deleteUser);

// Route admin cần token và quyền admin

router.get("/", authMiddleware, isAdmin, userController.getAllUsers);
router.put("/:id/promote", authMiddleware, isAdmin, userController.updateUserRole);
router.put("/:id/block", authMiddleware, isAdmin, userController.blockUserRole);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
 */

/**
 * @swagger
 * /api/users/signinByGoogle:
 *   post:
 *     summary: Đăng nhập bằng Google
 *     tags: [Users]
 */

/**
 * @swagger
 * /api/users/signinByFacebook:
 *   post:
 *     summary: Đăng nhập bằng Facebook
 *     tags: [Users]
 */

/**
 * @swagger
 * /api/users/verify-email:
 *   get:
 *     summary: Xác thực email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token xác thực email
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 */

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - oldPassword
 *               - newPassword
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy tất cả người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/users/{id}/promote:
 *   put:
 *     summary: Thăng quyền người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /api/users/{id}/block:
 *   put:
 *     summary: Chặn người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

