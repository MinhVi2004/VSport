import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
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
    ArrowLeftToLine,
} from 'lucide-react';

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
    const handlePayment = async () => {
        try {
            const res = await axiosInstance.post('/api/order/create-vnpay', {
                orderId: id,
                totalAmount: order.totalAmount,
                retry: true, // thông báo cho backend rằng đây là thanh toán lại
            });

            if (res.data.url) {
                window.location.href = res.data.url; // chuyển hướng đến VNPAY
            } else {
                toast.error('Không lấy được link thanh toán');
            }
        } catch (err) {
            toast.error('Lỗi khi tạo thanh toán');
            console.error(err);
        }
    };

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

                const res = await axiosInstance.get(`/api/order/${id}`);
                setOrder(res.data);
            } catch {
                toast.error('Không thể tải đơn hàng');
            }
        };

        fetchOrder();
    }, [id]);

    if (!order)
        return (
            <div className="p-6 text-center text-gray-600">
                đang tải đơn hàng...
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen relative">
            {/* Back button */}
            <button
                onClick={() => navigate('/order')}
                className="absolute top-6 left-6 flex items-center gap-2 text-black-600 hover:text-gray-700 transition"
            >
                <ArrowLeftToLine size={22} />
                <span className="font-medium">Quay lại</span>
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10 mt-10">
                {/* <CheckCircle className="w-20 h-20 text-green-500 mb-3" /> */}
                <h1 className="text-3xl font-bold text-black-600">
                    Chi tiết đơn hàng
                </h1>
                {/* <p className="text-gray-600 mt-2">Cảm ơn bạnĐã đặt hàng tại cửa hàng của chúng tôi.</p> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Trái: danh sách sản phẩm */}
                <div className="md:col-span-3 space-y-6">
                    {/* Danh sách sản phẩm */}
                    <div className="bg-white rounded-2xl shadow p-5 border">
                        <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                            <ShoppingBasket size={20} /> Sản phẩm đã mua
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
                                                Biến thể: {item.variant.color} -{' '}
                                                {item.variant.size}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1">
                                            Số lượng: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right font-semibold text-gray-800">
                                        {item.price.toLocaleString()} đ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Phải: địa chỉ + thông tin đơn hàng */}
                <div className="space-y-6 md:col-span-2">
                    {/* địa chỉ giao hàng */}
                    <div className="bg-white rounded-2xl shadow p-5 border">
                        <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                            <MapPin size={20} />Địa chỉ giao hàng
                        </h2>
                        <p className="text-gray-700 font-medium">
                            {order.address.fullName} -{' '}
                            {order.address.phoneNumber}
                        </p>
                        <p className="text-gray-600">
                            {order.address.detail}, {order.address.ward},{' '}
                            {order.address.district}, {order.address.province}
                        </p>
                    </div>

                    {/* Thông tin đơn hàng */}
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
                                <span>Thời gian đặt:</span>
                                <span>
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phương thức thanh toán:</span>
                                <span className="capitalize">
                                    {order.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Trạng thái thanh toán:</span>
                                <span
                                    className={`font-semibold ${
                                        order.isPaid
                                            ? 'text-green-600'
                                            : 'text-red-500'
                                    }`}
                                >
                                    {order.isPaid
                                        ? 'Đã thanh toán'
                                        : 'Chưa thanh toán'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Trạng thái đơn hàng:</span>
                                <span className="flex items-center gap-1 font-medium">
                                    {statusIcons[order.status] || <Clock />}{' '}
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4 flex justify-between text-base font-semibold">
                            <span>Tổng thanh toán:</span>
                            <span className="text-xl text-black">
                                {order.totalAmount.toLocaleString()} đ
                            </span>
                        </div>
                        {!order.isPaid && (
                            <div className="mt-6">
                                <button
                                    onClick={handlePayment}
                                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    Thanh toán ngay
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
