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
            const res = await axiosInstance.get('/api/order/my', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h1>
            {orders.length === 0 ? (
                <p>Chưa có đơn hàng nào.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <Link
    to={`/order/${order._id}`}
    key={order._id}
    className="block border border-gray-200 p-4 rounded-2xl shadow hover:shadow-lg transition-all bg-white"
>
    {/* Header: Mã đơn + Trạng thái + Ngày tạo */}
    <div className="flex justify-between items-start mb-4 ">
        <div>
            {/* <p className="text-xs text-gray-400">Mã đơn hàng:</p> */}
            {/* <p className="text-sm font-medium text-gray-700">{order._id}</p> */}
            <p className="text-xs text-gray-500 mt-1">
                Ngày đặt: {new Date(order.createdAt).toLocaleString()}
            </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
            {statusIcons[order.status] || <Clock size={16} />}
            <span>{order.status}</span>
        </div>
    </div>

    {/* Danh sách sản phẩm */}
    <div className="divide-y border-t">
        {order.orderItems.map((item, index) => (
            <div
                key={index}
                className="flex gap-4 py-3 items-center"
            >
                <img
                    src={item.product?.images?.[0]?.url}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                    <p className="font-medium text-gray-800">
                        {item.product?.name}
                    </p>
                    {item.variant && (
                        <p className="text-sm text-gray-500">
                            Biến thể: {item.variant.color} - {item.variant.size}
                        </p>
                    )}
                    <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                    </p>
                </div>
                <div className="text-right text-blue-700 font-semibold whitespace-nowrap">
                    {item.price.toLocaleString()}₫
                </div>
            </div>
        ))}
    </div>

    {/* Tổng tiền */}
    <div className="text-right mt-4 border-t pt-3">
        <span className="text-gray-600">Tổng tiền: </span>
        <span className="text-red-600 text-lg font-bold">
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
