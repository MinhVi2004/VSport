import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import {
    FileText,
    User,
    Clock,
    CreditCard,
    Wallet,
    CheckCircle,
    XCircle,ShoppingBasket 
} from 'lucide-react';

const formatCurrency = value => {
    if (!value && value !== 0) return '';
    return value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};

const OrderStaffDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(`/api/order/admin/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error('Lỗi khi tải chi tiết đơn hàng:', error);
            }
        };
        fetchOrder();
    }, [id]);

    if (!order) {
        return (
            <div className="p-6 text-gray-600">
                Đang tải chi tiết đơn hàng...
            </div>
        );
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bên trái: Danh sách sản phẩm */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-semibold mb-4 flex gap-2">
                    <ShoppingBasket size={30}/> Sản phẩm trong đơn hàng
                </h2>
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 text-center">#</th>
                            <th className="px-4 py-2 text-center">Ảnh</th>
                            <th className="px-4 py-2 text-left">
                                Tên sản phẩm
                            </th>
                            <th className="px-4 py-2 text-center">Số lượng</th>
                            <th className="px-4 py-2 text-center">Đơn giá</th>
                            <th className="px-4 py-2 text-center">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(order.orderItems) &&
                        order.orderItems.length > 0 ? (
                            order.orderItems.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={item.product.images[0].url}
                                            className="w-20"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-md">
                                        {item.product?.name ||
                                            'Sản phẩm không xác định'}
                                    </td>
                                    <td className="px-4 py-2 text-lg text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-2 text-lg text-center">
                                        {formatCurrency(item.price)}
                                    </td>
                                    <td className="px-4 py-2 text-green-600 text-lg text-center">
                                        {formatCurrency(
                                            item.quantity * item.price
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center py-4 text-gray-500"
                                >
                                    Không có sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bên phải: Thông tin đơn hàng */}
            <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2 text-lg">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <strong className='text-lg'>Mã đơn:</strong> {order._id.toUpperCase()}
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <strong className='text-lg'>Thu ngân:</strong> {order.user?.name || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <strong className='text-lg'>Ngày tạo:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <strong className='text-lg'>Thanh toán:</strong>
                    {order.isPaid ? (
                        <div className="text-green-600 font-semibold ml-1 flex gap-2 text-lg">
                            <CheckCircle /> Đã thanh toán
                        </div>
                    ) : (
                        <div className="text-red-500 font-semibold ml-1 flex gap-2 text-lg">
                            <XCircle /> Chưa thanh toán
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <Wallet className="w-4 h-4 text-gray-500" />
                    <strong >Tổng tiền:</strong>
                    <span className="text-green-600 font-semibold text-lg">
                        {formatCurrency(order.totalAmount)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderStaffDetail;
