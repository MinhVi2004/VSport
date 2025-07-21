import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from './../../utils/axios';
import {
  CheckCircle,
  ReceiptText,
  ShoppingBasket,
  MapPin,
  ArrowLeftToLine,
} from 'lucide-react';

const PaymentResult = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axiosInstance.get(`/api/order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Lỗi lấy đơn hàng:', err);
        navigate('/');
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (!order)
    return <div className="p-6 text-center text-gray-600">Đang tải đơn hàng...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 relative bg-gray-50 min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-600 hover:text-gray-700 transition"
      >
        <ArrowLeftToLine size={22} />
        <span className="font-medium">Quay lại trang chủ</span>
      </button>

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 mt-8">
        <CheckCircle className="w-20 h-20 text-green-500 mb-3" />
        <h1 className="text-3xl font-bold text-green-600">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mt-2">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</p>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Địa chỉ giao hàng + sản phẩm */}
        <div className="md:col-span-2 space-y-6">
          {/* Địa chỉ */}
          <div className="bg-white rounded-2xl shadow p-5 border">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
              <MapPin size={20} />
              Địa chỉ giao hàng
            </h2>
            <p className="text-gray-700">{order.address.fullAddress}</p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white rounded-2xl shadow p-5 border">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
              <ShoppingBasket size={20} />
              Sản phẩm đã mua
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 border rounded-xl p-4 hover:shadow-sm transition"
                >
                  <Link to={`/product/${item.product?._id}`}>
                    <img
                      src={item.product?.images?.[0]?.url}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product?._id}`}
                      className="font-semibold text-gray-800 hover:underline"
                    >
                      {item.product?.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500">
                        Biến thể: {item.variant.color} - {item.variant.size}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right font-semibold text-gray-800">
                    {item.price.toLocaleString()}₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chi tiết đơn hàng */}
        <div className="bg-white rounded-2xl shadow p-5 border h-fit">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <ReceiptText size={20} />
            Thông tin đơn hàng
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Mã đơn hàng:</span>
              <span className="font-medium">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span>Ngày đặt hàng:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Phương thức thanh toán:</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái thanh toán:</span>
              <span
                className={`font-semibold ${
                  order.isPaid ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái đơn hàng:</span>
              <span className="capitalize font-medium">{order.status}</span>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 flex justify-between text-base font-semibold">
            <span>Tổng thanh toán:</span>
            <span className="text-xl text-black">
              {order.totalAmount.toLocaleString()}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
