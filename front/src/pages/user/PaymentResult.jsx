import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosInstance from './../../utils/axios';
import { CheckCircle, ReceiptText, ShoppingBasket, MapPin } from 'lucide-react';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const orderId = query.get('vnp_TxnRef');

        const fetchOrder = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const res = await axiosInstance.get(`/api/order/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrder(res.data);
            } catch (err) {
                console.error('Lỗi lấy đơn hàng:', err);
                navigate('/');
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [location.search]);

    if (!order) return <div className="p-4">Đang tải thông tin đơn hàng...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex flex-col items-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500 mb-2" />
                <h1 className="text-2xl font-bold text-green-600 mb-1">Thanh toán thành công!</h1>
                <p className="text-gray-600">Cảm ơn bạn đã đặt hàng.</p>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="border p-4 rounded-md mb-6 shadow-sm">
                <h2 className="font-medium mb-2 flex gap-2">
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

            {/* 2 cột */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Danh sách sản phẩm */}
                <div className="md:col-span-2 border p-4 rounded-md shadow-sm">
                    <h2 className="font-medium mb-2 flex gap-2">
                        <ShoppingBasket /> <span>Sản phẩm đã mua</span>
                    </h2>
                    {order.orderItems.map((item, index) => (
                        <div key={index} className="flex gap-4 border p-4 rounded-md mb-4">
                            <Link to={`/product/${item.product?._id}`}>
                                <img
                                    src={item.product?.images?.[0]?.url}
                                    alt={item.product?.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </Link>
                            <div className="flex-1">
                                <Link
                                    to={`/product/${item.product?._id}`}
                                    className="font-semibold text-black hover:underline"
                                >
                                    {item.product?.name}
                                </Link>
                                {item.variant && (
                                    <p className="text-sm text-gray-500">
                                        Biến thể: {item.variant.color} - {item.variant.size}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                            </div>
                            <div className="text-black font-semibold flex items-center">
                                <span>{item.price.toLocaleString()}₫</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Thông tin đơn hàng */}
                <div className="border p-4 rounded-md shadow-sm space-y-4">
                    <h2 className="font-medium mb-2 flex gap-2">
                        <ReceiptText /> <span>Thông tin đơn hàng</span>
                    </h2>
                    <p><strong>Mã đơn hàng:</strong> {order._id}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Thanh toán:</strong> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                    <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
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

export default PaymentResult;
