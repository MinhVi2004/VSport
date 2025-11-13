const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
// POST thêm người dùng mới
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, redirect } = req.body;

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email đã được sử dụng, vui lòng sử dụng Email khác.",
      });
    }

    // Tạo payload & token xác minh
    const payload = { name, email };
    const verifyToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "15m" });

    // // Tạo URL xác minh
    // const verifyUrl = `${process.env.FRONT_END}/verify-email?token=${verifyToken}&redirected=${encodeURIComponent(redirect)}`;

    // // Cấu hình Nodemailer
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    //   connectionTimeout: 20000, // 20s
    //   greetingTimeout: 20000,
    //   socketTimeout: 20000,
    // });


    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Xác minh tài khoản của bạn",
    //   html: `<div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 10px;">
    //     <h2 style="color: #2e7d32;">Xin chào <strong>${name}</strong>,</h2>
    //     <p style="font-size: 16px;">
    //       Cảm ơn bạn đã đăng ký tài khoản. Vui lòng bấm vào nút bên dưới để xác minh email và kích hoạt tài khoản:
    //     </p>
    //     <div style="text-align: center; margin: 30px 0;">
    //       <a href="${verifyUrl}" 
    //         style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
    //         Kích hoạt tài khoản
    //       </a>
    //     </div>
    //     <p style="font-size: 14px; color: #777;">
    //       Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.
    //     </p>
    //     <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    //     <p style="font-size: 12px; color: #aaa; text-align: center;">
    //       © 2025 V-Sport. Mọi quyền được bảo lưu.
    //     </p>
    //   </div>`,
    // };

    // // Gửi email trước
    // await transporter.sendMail(mailOptions);

    // Nếu gửi thành công thì mới tạo user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isVerified: false, verifyToken });
    // Cập nhật trạng thái xác minh
    newUser.isVerified = true;
    newUser.verifyToken = undefined; // Xoá token sau khi dùng
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "Đăng ký thành công, vui lòng kiểm tra email để xác minh.", user: userResponse });
  } catch (err) {
    console.error("Lỗi đăng ký:", err.message);
    res.status(400).json({ message: "Đăng ký thất bại", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token không hợp lệ." });
    }

    // Tìm user có token trùng khớp
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng hoặc token đã hết hạn." });
    }

    // Cập nhật trạng thái xác minh
    user.isVerified = true;
    user.verifyToken = undefined; // Xoá token sau khi dùng
    await user.save();

    return res.status(200).json({ message: "Tài khoản đã được xác minh thành công!" });
  } catch (error) {
    console.error("Lỗi xác minh email:", error);
    return res.status(500).json({ message: "Lỗi máy chủ. Không thể xác minh email." });
  }
};
exports.signinUserByGoogle = async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email, type: "google" });

    if (!user) {
      // Nếu đã tồn tại email nhưng với type khác (ví dụ: email), thì báo lỗi
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          message: "Email này đã được đăng ký bằng phương thức khác",
        });
      }

      // Nếu chưa tồn tại, tạo mới
      user = new User({ name, email, password: "google-auth", type: "google" });
      await user.save();
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Đăng nhập thành công",
      user: userData,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: "Đăng nhập thất bại", error: err.message });
  }
};
exports.signinUserByFacebook = async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email, type: "facebook" });

    if (!user) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          message: "Email này đã được đăng ký bằng phương thức khác",
        });
      }

      user = new User({
        name,
        email,
        password: "facebook-auth",
        type: "facebook",
      });
      await user.save();
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Đăng nhập thành công",
      user: userData,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: "Đăng nhập thất bại", error: err.message });
  }
};
//Signin user
exports.signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Tạo payload (nội dung muốn mã hóa)
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    // console.log("SECRET khi tạo token:", process.env.SECRET_KEY);
    // Tạo token
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    // Trả về token + user (không có mật khẩu)
    const userData = user.toObject();
    delete userData.password;
    res.json({
      message: "Đăng nhập thành công",
      user: userData,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
  }
};

// GET tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Không trả về password
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng",
      error: err.message,
    });
  }
};

// GET người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy người dùng", error: err.message });
  }
};

// PUT cập nhật role người dùng
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Vui lòng cung cấp role mới" });
    }

    const allowedRoles = ["admin", "staff", "user"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({ message: "Cập nhật quyền thành công", user: userResponse });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật quyền", error: err.message });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
    }

    // 3. Hash mật khẩu mới và cập nhật
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

     res.json({ message: 'Đổi mật khẩu thành công' , user: user});
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Lỗi khi đổi mật khẩu", error: err.message });
  }
};
exports.blockUserRole = async (req, res) => {
  try {
    const { status  } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Vui lòng cung cấp trạng thái (true/false)" });
    }


    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status  },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({ message: "Cập nhật trạng thái thành công", user: userResponse });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật trạng thái", error: err.message });
  }
};

// PUT cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ["name", "email"];
    const updateData = {};
    for (let field of allowedFields) {
      if (req.body[field]) updateData[field] = req.body[field];
    }
    await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const updatedUser = updated.toObject();
    delete updatedUser.password;

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
  }
};

// DELETE người dùng
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Đã xóa người dùng" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Xóa người dùng thất bại", error: err.message });
  }
};
