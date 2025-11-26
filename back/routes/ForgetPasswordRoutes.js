const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực và khôi phục mật khẩu
 */

/**
 * @swagger
 * /api/auth/send:
 *   post:
 *     summary: Gửi email khôi phục mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "abc@example.com"
 *     responses:
 *       200:
 *         description: Email đã được gửi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email đã được gửi"
 *       404:
 *         description: Không tìm thấy tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy tài khoản!"
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Đặt lại mật khẩu bằng token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token khôi phục mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đặt lại mật khẩu thành công"
 *       400:
 *         description: Token không hợp lệ hoặc hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token không hợp lệ hoặc đã hết hạn"
 */


router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, type: "normal" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONT_END}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"VSport Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Khôi phục mật khẩu",
      html: `
        <!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: "Segoe UI", Roboto, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .header {
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
      }

      .header h1 {
        color: #007bff;
        margin: 0;
      }

      .content {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
        padding: 20px 0;
      }

      .btn {
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: 500;
      }

      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #888888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Khôi phục mật khẩu</h1>
      </div>
      <div class="content">
        <p>Xin chào <strong>${user.name}</strong>,</p>
        <p>
          Bạn vừa gửi yêu cầu khôi phục mật khẩu cho tài khoản của mình.
          Vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:
        </p>

        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" class="btn">Đặt lại mật khẩu</a>
        </p>

        <p style="color: #555;">
          Liên kết này chỉ có hiệu lực trong vòng <strong>15 phút</strong>. Nếu bạn không yêu cầu hành động này, vui lòng bỏ qua email này.
        </p>

        <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
      </div>
      <div class="footer">
        © 2025 Công ty của bạn. Mọi quyền được bảo lưu.
      </div>
    </div>
  </body>
</html>

      `,
    });

    res.json({ message: "Email đã được gửi" });
  } catch (err) {
    console.error("Lỗi khi gửi email:", err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi gửi email" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.userId, { password: hashed });

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    console.error("Lỗi khi đặt lại mật khẩu:", err);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
});

module.exports = router;
