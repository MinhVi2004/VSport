const Order = require('./../models/Order');
const Cart = require('./../models/Cart');
const qs = require('qs'); 
const crypto = require('crypto'); 



const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, orderItems, paymentMethod, totalAmount } = req.body;

    console.log('Creating order for user:', userId);
    console.log('Order details:', {
      address,
      orderItems,
      paymentMethod,
      totalAmount,
    });
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

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const {status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    order.status = status;
    await order.save();
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Cập nhật trạng thái đơn hàng thất bại' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .populate('orderItems.product')
      .populate('orderItems.variant')
      .populate('address')
      .populate('user', 'name email'); // Chỉ lấy tên và email của user

    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Admin: Không thể lấy đơn hàng' });
  }
};
const getAllMyOrders = async (req, res) => {
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
const getMyOrdersById = async (req, res) => {
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

  const createDate = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
  const ipAddr = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDesc,
    vnp_OrderType: 'billpayment',
    vnp_Amount: totalAmount * 100,
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

  console.log('💰 VNPay Params:', sortedParams);
  console.log('🔒 Sign Data:', signData);
  console.log('🔐 Secure Hash:', secureHash);
  console.log('🌐 Payment URL:', paymentUrl);

  res.json({ url: paymentUrl });
}


const vnpayIpn = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  console.log('📥 IPN Params:', vnp_Params);
  console.log('📥 SecureHash (received):', secureHash);

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const checkSum = hmac.update(signData).digest('hex');

  console.log('🔒 IPN signData:', signData);
  console.log('🔐 IPN Calculated Checksum:', checkSum);

  if (secureHash === checkSum) {
    console.log('✅ IPN hợp lệ. Giao dịch:', vnp_Params.vnp_TxnRef);
    const orderId = vnp_Params.vnp_TxnRef;

    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paymentMethod: 'vnpay',
    });

    res.status(200).json({ RspCode: '00', Message: 'Success' });
  } else {
    console.warn('❌ IPN Checksum failed!');
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
};



module.exports = {
  createOrder,
  updateOrderStatus,
  getAllMyOrders,
  getMyOrdersById,
  createPaymentUrl,
  vnpayIpn,
  getAllOrders
};
