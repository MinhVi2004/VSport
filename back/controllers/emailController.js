// server/controllers/emailController.js
import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    res.status(500).json({ message: "Error sending email", error: err });
  }
};
