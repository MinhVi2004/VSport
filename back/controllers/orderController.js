const Order = require("./../models/Order");
const Cart = require("./../models/Cart");
const User = require("./../models/User");

const qs = require("qs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const buildOrderEmailHTML = (order) => {
  const productListHTML = order.orderItems
    .map((item) => {
      const product = item.product || {};
      const variant = item.variant || {};
      const imageUrl =
        product?.images?.[0]?.url || "https://via.placeholder.com/80";

      return `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0; display:flex; align-items:center;">
            <img src="${imageUrl}" alt="${
        product.name
      }" style="width:60px; height:60px; object-fit:cover; border-radius:8px; margin-right:10px;" />
            <div>
              <div style="font-weight:bold;">${product.name || "Sản phẩm"}</div>
              ${
                item.variant
                  ? `<div style="font-size:12px; color:#555;">Biến thể: ${variant.color} - ${variant.size}</div>`
                  : ""
              }
              <div style="font-size:12px; color:#333;">Số lượng: ${
                item.quantity
              }</div>
            </div>
          </td>
          <td style="text-align:right; font-weight:500;">
            ${item.price.toLocaleString()}₫
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; overflow:hidden; background:#fff;">
      <div style="background:#28a745; color:#fff; padding:20px; text-align:center;">
        <h2 style="margin:0;">Đặt hàng thành công!</h2>
        <p style="margin:5px 0 0;">Cảm ơn bạn đã đặt hàng tại <strong>VSport</strong>.</p>
      </div>
      <div style="padding:20px;">

        <p>Xin chào <strong>${order.user.name}</strong>,</p>
        <p>Chúng tôi đã nhận được đơn hàng của bạn. Dưới đây là thông tin chi tiết:</p>

        <h3 style="margin:20px 0 10px;">📦 Sản phẩm đã mua</h3>
        <table style="width:100%; border-collapse:collapse;">
          ${productListHTML}
        </table>

        <h3 style="margin:20px 0 10px;">📍 Địa chỉ giao hàng</h3>
        <p style="color:#333; margin:0;">${
          order.address?.fullAddress || "Không có thông tin"
        }</p>

        <h3 style="margin:20px 0 10px;">🧾 Thông tin đơn hàng</h3>
        <table style="width:100%; font-size:14px; color:#333;">
          <tr>
            <td>Mã đơn hàng:</td>
            <td style="text-align:right;"><strong>${order._id}</strong></td>
          </tr>
          <tr>
            <td>Ngày đặt hàng:</td>
            <td style="text-align:right;">${new Date(
              order.createdAt
            ).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Phương thức thanh toán:</td>
            <td style="text-align:right;">${order.paymentMethod}</td>
          </tr>
          <tr>
            <td>Trạng thái thanh toán:</td>
            <td style="text-align:right; color:${
              order.isPaid ? "#28a745" : "#dc3545"
            };">
              <strong>${
                order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"
              }</strong>
            </td>
          </tr>
          <tr>
            <td>Trạng thái đơn hàng:</td>
            <td style="text-align:right; text-transform:capitalize;">${
              order.status
            }</td>
          </tr>
        </table>

        <div style="margin-top:20px; text-align:right; font-size:16px;">
          <strong>Tổng thanh toán: ${order.totalAmount.toLocaleString()}₫</strong>
        </div>

        <p style="margin-top:30px; font-size:14px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
        <p style="margin:5px 0 0;">Trân trọng,<br/><strong>Đội ngũ VSport</strong></p>
      </div>
    </div>
  `;
};

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, orderItems, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    const newOrder = await Order.create({
      user: userId,
      address,
      orderItems,
      paymentMethod,
      totalAmount,
    });

    // Populate sau khi tạo
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("orderItems.product")
      .populate("orderItems.variant")
      .populate("address")
      .populate("user", "name email");
    //  clear cart after order
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    //? Gửi email xác nhận đơn hàng
    if (populatedOrder.user?.email) {
      const transporter = nodemailer.createTransport({
        service: "Gmail", // hoặc dùng SMTP của bên khác như Mailtrap, SendGrid...
        auth: {
          user: process.env.EMAIL_USER, // ví dụ: your-email@gmail.com
          pass: process.env.EMAIL_PASS, // mật khẩu ứng dụng
        },
      });
      const emailHTML = buildOrderEmailHTML(populatedOrder);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: populatedOrder.user.email,
        subject: "Xác nhận đơn đặt hàng - VSport",
        html: emailHTML,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Tạo đơn hàng thất bại" });
  }
};

const payOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    if (order.isPaid) {
      return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });
    }
    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();
    res.json({ message: "Thanh toán đơn hàng thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Thanh toán đơn hàng thất bại" });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    order.status = status;
    await order.save();
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cập nhật trạng thái đơn hàng thất bại" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("orderItems.product")
      .populate("orderItems.variant")
      .populate("address")
      .populate("user", "name email") // Chỉ lấy tên và email của user

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Admin: Không thể lấy đơn hàng" });
  }
};
const getAllMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product")
      .populate("orderItems.variant")
      .populate("address");

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};

const getMyOrdersById = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("orderItems.product")
      .populate("orderItems.variant")
      .populate("address")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng" });
  }
};
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("orderItems.product")
      .populate("orderItems.variant")
      .populate("address")
      .populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng" });
  }
};
const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURNURL;
const vnp_IpnUrl = process.env.VNP_IPNURL;

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

const createPaymentUrl = async (req, res) => {
  const { totalAmount, orderId, orderDesc } = req.body;

  const createDate = new Date()
    .toISOString()
    .replace(/[-T:Z.]/g, "")
    .slice(0, 14);
  const ipAddr = req.ip || "127.0.0.1";

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDesc,
    vnp_OrderType: "billpayment",
    vnp_Amount: totalAmount * 100,
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_IpnUrl,
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const secureHash = hmac.update(signData).digest("hex");
  sortedParams.vnp_SecureHash = secureHash;

  const paymentUrl = `${vnp_Url}?${qs.stringify(sortedParams, {
    encode: false,
  })}`;
  res.json({ url: paymentUrl });
};

const vnpayIpn = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const checkSum = hmac.update(signData).digest("hex");

  if (secureHash === checkSum) {
    console.log("✅ IPN hợp lệ. Giao dịch:", vnp_Params.vnp_TxnRef);
    console.log(res.orderId);
    await Order.findByIdAndUpdate(res.orderId, {
      isPaid: true,
      paymentMethod: "vnpay",
    });
    res.status(200).json({ RspCode: "00", Message: "Success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
  payOrder,
  getAllMyOrders,
  getMyOrdersById,
  createPaymentUrl,
  vnpayIpn,
  getAllOrders,
  getOrderById,
};
