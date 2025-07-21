const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Không có header hoặc không bắt đầu bằng "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Chưa đăng nhập hoặc không có token" });
  }

  // Lấy token
  const token = authHeader.split(" ")[1];

  // Token trống
  if (!token) {
    return res.status(401).json({ message: "Token bị thiếu hoặc rỗng" });
  }
  // console.log("SECRET khi xác minh token:", process.env.SECRET_KEY);

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Lỗi xác minh token:", err.name, err.message);
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
};

exports.isStaff = (req, res, next) => {
  if (req.user?.role !== 'staff') {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
};