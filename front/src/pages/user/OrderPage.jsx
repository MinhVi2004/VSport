import { useEffect, useState } from 'react';
import axiosInstance from './../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, PackageCheck, Truck, XCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusIcons = {
    'Đang xác nhận': <Clock className="text-yellow-500" />,
    'Đang xử lý': <PackageCheck className="text-blue-500" />,
    'Đang vận chuyển': <Truck className="text-orange-500" />,
    'Đã vận chuyển': <CheckCircle className="text-green-600" />,
    'Đã hủy': <XCircle className="text-red-500" />,
};

const MyOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                toast.info('Vui lòng đăng nhập để xem lịch sử đơn hàng');
                navigate('/signin?redirect=/order');
                return;
            }
            const res = await axiosInstance.get('/api/order/my');
            setOrders(res.data.reverse()); // newest first
        } catch (err) {
            toast.error('Không thể tải lịch sử đơn hàng');
        }
    };

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            toast.info('Vui lòng đăng nhập');
            navigate('/');
            return;
        }
        fetchOrders();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h1>
            {orders.length === 0 ? (
                <p>Chưa có đơn hàng nào.</p>
            ) : (
                <div className="space-y-6">
  {orders.map(order => (
    <Link
      to={`/order/${order._id}`}
      key={order._id}
      className="block rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all bg-white overflow-hidden"
    >
      <div className="p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Mã đơn và Ngày tạo */}
        <div>
          <p className="text-sm text-gray-500">Mã đơn hàng</p>
          <p className="text-md font-semibold text-gray-800">{order._id}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Trạng thái đơn */}
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold
              ${
                order.status === "Đã giao"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Đang giao"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {statusIcons[order.status] || <Clock size={16} />}
            <span>{order.status}</span>
          </div>
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="bg-gray-50 border-t px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-600 font-medium">Tổng tiền:</span>
        <span className="text-lg text-red-600 font-bold">
          {order.totalAmount.toLocaleString()}₫
        </span>
      </div>
    </Link>
  ))}
</div>

            )}
        </div>
    );
};

export default MyOrderPage;
