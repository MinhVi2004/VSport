const Order = require('./../models/Order');
const Cart = require('./../models/Cart');

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

exports.createPaymentUrl = async (req, res) => {
  const { amount, orderId, orderDesc } = req.body;

  const createDate = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
  const ipAddr = req.ip || '127.0.0.1';

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDesc,
    vnp_OrderType: 'billpayment',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_IpnUrl,
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const secureHash = hmac.update(signData).digest('hex');
  sortedParams.vnp_SecureHash = secureHash;

  const paymentUrl = `${vnp_Url}?${qs.stringify(sortedParams, { encode: false })}`;
  res.json({ url: paymentUrl });
}

exports.vnpayIpn = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const checkSum = hmac.update(signData).digest('hex');

  if (secureHash === checkSum) {
    console.log('✅ IPN hợp lệ. Giao dịch:', vnp_Params.vnp_TxnRef);
    // TODO: cập nhật đơn hàng thành "đã thanh toán"
    res.status(200).json({ RspCode: '00', Message: 'Success' });
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
}


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, orderItems, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' });
    }

    const newOrder = await Order.create({
      user: userId,
      address,
      orderItems,
      paymentMethod,
      totalAmount,
    });

    // Optionally clear cart after order
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Tạo đơn hàng thất bại' });
  }
};

exports.getAllMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product')
      .populate('orderItems.variant')
      .populate('address');

    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Không thể lấy đơn hàng' });
  }
};
exports.getMyOrdersById = async (req, res) => {
  try {
    const orders = await Order.findById(req.params.id)
      .populate('orderItems.product')
      .populate('orderItems.variant')
      .populate('address');

    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Không thể lấy đơn hàng' });
  }
};
