import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
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
            const res = await axios.get('/api/order', {
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
                            className="block border p-4 rounded-md shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    {/* <p className="text-sm text-gray-600">Mã đơn hàng: {order._id}</p> */}
                                    <p className="text-sm text-gray-500">
                                        Ngày tạo:{' '}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 font-medium">
                                    {statusIcons[order.status] || <Clock />}
                                    <span>{order.status}</span>
                                </div>
                            </div>

                            <div className="divide-y">
                                {order.orderItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 py-3 items-center"
                                    >
                                        <img
                                            src={item.product?.images?.[0]?.url}
                                            alt={item.product?.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {item.product?.name}
                                            </p>
                                            {item.variant && (
                                                <p className="text-sm text-gray-500">
                                                    Biến thể:{' '}
                                                    {item.variant.color} -{' '}
                                                    {item.variant.size}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Số lượng: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-blue-600 font-semibold">
                                            {item.price.toLocaleString()}₫
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-right mt-4">
                                <span className="font-semibold">
                                    Tổng tiền:{' '}
                                </span>
                                <span className="text-red-600 font-bold">
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
