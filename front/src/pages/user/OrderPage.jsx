import { useEffect, useState } from 'react';
import axiosInstance from './../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, PackageCheck, Truck, XCircle, CheckCircle, BadgeCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusIcons = {
  ' đang xác nhận': <Clock className="text-yellow-500" />,
  ' đang xử lý': <PackageCheck className="text-blue-500" />,
  ' đang vận chuyển': <Truck className="text-orange-500" />,
  'Đã vận chuyển': <CheckCircle className="text-green-600" />,
  'Hoàn thành': <BadgeCheck className="text-green-700" />,
  'Đã hủy': <XCircle className="text-red-500" />,
};

const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
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
      const data = res.data.reverse();
      setOrders(data);
      setFilteredOrders(data);
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

  useEffect(() => {
    let result = [...orders];
    if (statusFilter) {
      result = result.filter(o => o.status === statusFilter);
    }
    if (paymentFilter) {
      result = result.filter(o => String(o.isPaid) === paymentFilter);
    }
    setFilteredOrders(result);
  }, [statusFilter, paymentFilter, orders]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h1>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option> đang xác nhận</option>
          <option> đang xử lý</option>
          <option> đang vận chuyển</option>
          <option>Đã vận chuyển</option>
          <option>Hoàn thành</option>
          <option>Đã hủy</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Tất cả thanh toán</option>
          <option value="true">Đã thanh toán</option>
          <option value="false">Chưa thanh toán</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>Không có  đơn hàng phù hợp.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <Link
              to={`/order/${order._id}`}
              key={order._id}
              className="block rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all bg-white overflow-hidden"
            >
              <div className="p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="text-md font-semibold text-gray-800">{order._id}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold
                    ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700'
                      : order.status === 'Đã hủy' ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'}`}>
                    {statusIcons[order.status] || <Clock size={16} />}
                    <span>{order.status}</span>
                  </div>

                  <div className={`inline-block px-3 py-1 rounded-full text-center   text-xs font-semibold bg-green-100 text-green-700
                    ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Tổng tiền:</span>
                <span className="text-lg text-red-600 font-bold">
                  {order.totalAmount.toLocaleString()} đ
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