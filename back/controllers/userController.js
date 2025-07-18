const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
// POST thêm người dùng mới
exports.signupUser = async (req, res) => {
  try {
    const { name, gender, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email đã được sử dụng, vui lòng sử dụng Email khác.",
      });
    }

    const newUser = new User({ name, email, password: hashedPassword, gender });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "Đăng ký thành công", user: userResponse });
  } catch (err) {
    res.status(400).json({ message: "Đăng ký thất bại", error: err.message });
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
      id: user._id,
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

// PUT cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ["name", "email", "gender"];
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
