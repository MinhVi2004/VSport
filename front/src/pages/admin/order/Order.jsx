import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const navigate = useNavigate();
    const [isPaidFilter, setIsPaidFilter] = useState('Tất cả');

    const statuses = [
        'Tất cả',
        'Đang xác nhận',
        'Đang xử lý',
        'Đang vận chuyển',
        'Đã vận chuyển',
        'Đã hủy',
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('api/order/admin');
                // console.log('fetchOrders res', res.data);
                setOrders(res.data);
            } catch (err) {
                console.error('Lỗi khi lấy đơn hàng:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchStatus =
            statusFilter === 'Tất cả' || order.status === statusFilter;
        const matchIsPaid =
            isPaidFilter === 'Tất cả' ||
            (isPaidFilter === 'true' && order.isPaid) ||
            (isPaidFilter === 'false' && !order.isPaid);
        return matchStatus && matchIsPaid;
    });

    // Màu badge theo trạng thái
    const getStatusBadge = status => {
        const base = 'text-xs font-medium px-2 py-1 rounded-full inline-block';
        switch (status) {
            case 'Đang xác nhận':
                return `${base} bg-yellow-100 text-yellow-700`;
            case 'Đang xử lý':
                return `${base} bg-purple-100 text-purple-700`;
            case 'Đang vận chuyển':
                return `${base} bg-blue-100 text-blue-700`;
            case 'Đã vận chuyển':
                return `${base} bg-green-100 text-green-700`;
            case 'Đã hủy':
                return `${base} bg-red-100 text-red-600`;
            default:
                return `${base} bg-gray-100 text-gray-700`;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📦 Quản lý đơn hàng</h1>

            {/* Filter */}
            <div className="mb-6 flex items-center gap-2">
                <label className="font-medium">Lọc theo trạng thái:</label>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md shadow-sm"
                >
                    {statuses.map(s => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <label className="font-medium ml-6">
                    Trạng thái thanh toán:
                </label>
                <select
                    value={isPaidFilter}
                    onChange={e => setIsPaidFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md shadow-sm"
                >
                    <option value="Tất cả">Tất cả</option>
                    <option value="true">Đã thanh toán</option>
                    <option value="false">Chưa thanh toán</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <p className="text-gray-500">Đang tải đơn hàng...</p>
            ) : (
                <div className="overflow-x-auto rounded shadow">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                                <th className="px-4 py-3">Mã đơn</th>
                                <th className="px-4 py-3">Khách hàng</th>
                                <th className="px-4 py-3">Tổng tiền</th>
                                <th className="px-4 py-3">Thanh toán</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr
                                        key={order._id}
                                        className="border-b hover:bg-gray-50 cursor-pointer transition"
                                        onClick={() =>
                                            navigate(
                                                `/admin/order/${order._id}`
                                            )
                                        }
                                    >
                                        <td className="px-4 py-3 text-blue-600 font-medium">
                                            #{order._id.toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.user?.name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-black font-semibold">
                                            {order.totalAmount?.toLocaleString()}
                                            ₫
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.isPaid ? (
                                                <span className="text-green-600 font-medium">
                                                    Đã thanh toán
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-medium">
                                                    Chưa thanh toán
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={getStatusBadge(
                                                    order.status
                                                )}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-6 text-gray-500 italic"
                                    >
                                        Không có đơn hàng nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
