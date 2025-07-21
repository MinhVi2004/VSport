const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // email shop
      pass: process.env.EMAIL_PASS, // app password (không dùng mật khẩu thường)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // email của shop
    to: process.env.EMAIL_USER, // email nhận thông tin liên hệ
    subject: `Liên hệ từ khách hàng: ${name}`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2b6cb0;">Bạn nhận được một tin nhắn liên hệ mới</h2>
      <p><strong>Họ tên:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Nội dung:</strong></p>
      <div style="padding: 10px; background-color: #f7f7f7; border-radius: 6px;">
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
      <br/>
      <p style="font-size: 13px; color: #999;">Vui lòng trả lời email này để phản hồi khách hàng.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Gửi email thành công" });
  } catch (error) {
    res.status(500).json({ message: "Gửi email thất bại", error });
  }
});

module.exports = router;
