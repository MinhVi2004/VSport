import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from './../../../utils/axios';
import { X, CheckCircle, Save , XCircle} from 'lucide-react';
import { toast } from 'react-toastify';
const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const statuses = [
        'Đang xác nhận',
        'Đang xử lý',
        'Đang vận chuyển',
        'Đã vận chuyển',
        'Đã hủy',
        'Hoàn thành'
    ];
    const getStatusColorClass = (status) => {
    switch (status) {
        case 'Đang xác nhận':
            return 'text-yellow-600 bg-yellow-50';
        case 'Đang xử lý':
            return 'text-purple-600 bg-purple-50';
        case 'Đang vận chuyển':
            return 'text-blue-600 bg-blue-50';
        case 'Đã vận chuyển':
            return 'text-indigo-600 bg-indigo-50';
        case 'Hoàn thành':
            return 'text-green-600 bg-green-50';
        case 'Đã hủy':
            return 'text-red-600 bg-red-50';
        default:
            return 'text-gray-700 bg-gray-50';
    }
};

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`api/order/admin/${id}`);
                setOrder(res.data);
                setStatus(res.data.status);
            } catch (err) {
                console.error('Lỗi khi lấy đơn hàng:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async () => {
        if (status === order.status) {
            toast.error('Bạn chưa thay đổi trạng thái đơn hàng.');
            return;
        }

        try {
            await axiosInstance.put(`api/order/admin/${id}`, { status });
            toast.success('Cập nhật trạng thái thành công!');
            navigate('/admin/order');
        } catch (err) {
            toast.error('Cập nhật thất bại.');
            console.error(err);
        }
    };

    if (loading) return <p className="p-6">Đang tải chi tiết đơn hàng...</p>;
    if (!order) return <p className="p-6">Không tìm thấy đơn hàng.</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    Chi tiết đơn hàng
                </h1>
                <button
                    onClick={() => navigate('/admin/order')}
                    className="text-gray-500 hover:text-gray-700 transition"
                >
                    <X size={32} />
                </button>
            </div>

            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base text-gray-700 mb-6">
                <div>
                    <strong>Mã đơn hàng:</strong> {order._id}
                </div>
                <div>
                    <strong>Khách hàng:</strong> {order.user?.name || 'N/A'}
                </div>
                <div>
                    <strong>Tổng tiền:</strong>{' '}
                    {order.totalAmount?.toLocaleString()}₫
                </div>
                <div>
                    <strong>Địa chỉ giao hàng:</strong>{' '}
                    {order.address.fullAddress || 'N/A'}
                </div>
                <div>
                    <strong>Số điện thoại: </strong>
                    {order.address.phoneNumber || 'N/A'}
                </div>
                <div>
                    <strong>Ngày đặt:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString()}
                </div>
                <div>
                    <strong>Phương thức thanh toán: </strong>{' '}
                    {order.paymentMethod}
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-medium">Trạng thái đơn hàng:</label>
                    <select
    className={`border px-3 py-1 rounded font-semibold transition ${getStatusColorClass(status)}`}
    value={status}
    onChange={e => setStatus(e.target.value)}
>

                        {statuses.map(s => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex gap-2'>
                    <strong>Trạng thái thanh toán: </strong>
                    <div className="flex items-center gap-2">
    {order.isPaid ? (
        <>
            <CheckCircle className="text-green-600" />
            <span className="text-green-600 font-semibold">Đã thanh toán</span>
        </>
    ) : (
        <>
            <XCircle className="text-red-600" />
            <span className="text-red-600 font-semibold">Chưa thanh toán</span>
        </>
    )}
</div>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Danh sách sản phẩm
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-inner border">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-3 py-2 text-center">Ảnh</th>
                            <th className="px-3 py-2">Tên sản phẩm</th>
                            <th className="px-3 py-2 text-center">Size</th>
                            <th className="px-3 py-2 text-center">Giá</th>
                            <th className="px-3 py-2 text-center">Số lượng</th>
                            <th className="px-3 py-2 text-center">
                                Thành tiền
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems?.map((item, index) => (
                            <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-3 py-2 text-center">
                                    <img
                                        src={item.product?.images[0]?.url}
                                        alt={item.product?.name}
                                        className="w-14 h-14 object-cover rounded"
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    {item.product?.name || 'SP'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    {item.size === 'default'
                                        ? 'N/A'
                                        : item.size}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    {item.price?.toLocaleString()}₫
                                </td>
                                <td className="px-3 py-2 text-center">
                                    {item.quantity}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString()}
                                    ₫
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Nút cập nhật */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleUpdateStatus}
                    disabled={status === order.status}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-white transition 
                        ${
                            status === order.status
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }
                    `}
                >
                    <Save size={18} />
                    Lưu trạng thái
                </button>
            </div>
        </div>
    );
};

export default OrderDetail;
