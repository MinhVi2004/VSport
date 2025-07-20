import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import {
    Clock,
    PackageCheck,
    Truck,
    XCircle,
    CheckCircle,
    MapPin,
    ReceiptText,
    ShoppingBasket,
} from 'lucide-react';
import { Link } from 'react-router-dom';
const statusIcons = {
    'Đang xác nhận': <Clock className="text-yellow-500" />,
    'Đang xử lý': <PackageCheck className="text-blue-500" />,
    'Đang vận chuyển': <Truck className="text-orange-500" />,
    'Đã vận chuyển': <CheckCircle className="text-green-600" />,
    'Đã hủy': <XCircle className="text-red-500" />,
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            toast.info('Vui lòng đăng nhập');
            navigate('/');
            return;
        }

        const fetchOrder = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    toast.info('Vui lòng đăng nhập để xem chi tiết đơn hàng');
                    navigate('/signin?redirect=/order');
                    return;
                }

                const res = await axios.get(`/api/order/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setOrder(res.data);
            } catch {
                toast.error('Không thể tải đơn hàng');
            }
        };

        fetchOrder();
    }, [id]);

    if (!order) return <div className="p-4">Đang tải...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Chi tiết đơn hàng</h1>

            {/* Địa chỉ giao hàng */}
            <div className="border p-4 rounded-md mb-6 shadow-sm">
                <h2 className="font-medium mb-2 flex gap-2">
                    {' '}
                    <MapPin /> <span>Địa chỉ giao hàng</span>
                </h2>
                <p>
                    {order.address.fullName} - {order.address.phoneNumber}
                </p>
                <p>
                    {order.address.detail}, {order.address.ward},{' '}
                    {order.address.district}, {order.address.province}
                </p>
            </div>

            {/* 2 cột: trái = sản phẩm, phải = thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Danh sách sản phẩm */}
                <div className="md:col-span-2 border p-4 rounded-md shadow-sm">
                    <h2 className="font-medium mb-2 flex gap-2">
                        {' '}
                        <ShoppingBasket /> <span>Sản phẩm đã mua</span>
                    </h2>
                    {order.orderItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex gap-4 border p-4 rounded-md mb-4"
                        ><Link
                                    to={`/product/${item.product?._id}`}
                                    className="font-semibold text-black cursor-pointer"
                                >
                                    <img
                                src={item.product?.images?.[0]?.url}
                                alt={item.product?.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                                </Link>
                            
                            <div className="flex-1 ">
                                <Link
                                    to={`/product/${item.product?._id}`}
                                    className="font-semibold text-black cursor-pointer"
                                >
                                    {item.product?.name}
                                </Link>

                                {item.variant && (
                                    <p className="text-sm text-gray-500">
                                        Biến thể: {item.variant.color} -{' '}
                                        {item.variant.size}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    SL: {item.quantity}
                                </p>
                            </div>
                            <div className="text-black-600 font-semibold flex items-center">
                                <span>{item.price.toLocaleString()}₫</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Thông tin đơn hàng */}
                <div className="border p-4 rounded-md shadow-sm space-y-4">
                    <h2 className="font-medium mb-2 flex gap-2">
                        {' '}
                        <ReceiptText /> <span>Thông tin đơn hàng</span>
                    </h2>
                    <p>
                        <span className="font-semibold">Mã đơn hàng:</span>{' '}
                        {order._id}
                    </p>
                    <p>
                        <span className="font-semibold">Thời gian:</span>{' '}
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                        {/* <span className="font-semibold">Trạng thái:</span> */}
                        {statusIcons[order.status] || <Clock />}
                        <span>{order.status}</span>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-end gap-3">
                        <p className="font-semibold text-lg">Tổng tiền:</p>
                        <p className="text-black font-bold text-xl">
                            {order.totalAmount.toLocaleString()}₫
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
