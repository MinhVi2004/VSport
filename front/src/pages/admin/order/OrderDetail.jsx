import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from './../../../utils/axios';
import { X} from 'lucide-react';
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
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`api/order/${id}`, {

                     headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                     },
                });
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
        alert('Bạn chưa thay đổi trạng thái đơn hàng.');
        return;
    }

    try {
        await axiosInstance.put(`api/order/${id}`, { status });
        alert('Cập nhật trạng thái thành công!');
        navigate('/admin/orders');
    } catch (err) {
        alert('Cập nhật thất bại.');
        console.error(err);
    }
};

    if (loading) return <p className="p-6">Đang tải chi tiết đơn hàng...</p>;
    if (!order) return <p className="p-6">Không tìm thấy đơn hàng.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow relative">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
                <button
                    onClick={() => navigate('/admin/order')}
                    className="text-sm text-black-500 hover:text-gray-700"
                >
                    <X size={40} />
                </button>
            </div>
            <div className="space-y-2 mb-6">
                <p>
                    <strong>Mã đơn hàng:</strong> {order._id}
                </p>
                <p>
                    <strong>Khách hàng:</strong> {order.user?.name || 'N/A'}
                </p>
                <p>
                    <strong>Tổng tiền:</strong>{' '}
                    {order.totalAmount?.toLocaleString()}₫
                </p>
                <p>
                    <strong>Địa chỉ giao hàng:</strong>
                    {order.address.fullAddress || 'N/A'}
                </p>
                <p>
                    <strong>Ngày đặt:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString()}
                </p>

                <p>
                    <strong>Phương thức thanh toán:</strong>{' '}
                    {order.paymentMethod}
                </p>

                <p>
                    <strong>Trình trạng thanh toán:</strong>{' '}
                    {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </p>
                {/* Trạng thái đơn hàng */}
                <div>
                    <label className="font-medium mr-2">Trạng thái:</label>
                    <select
                        className="border px-3 py-1 rounded"
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
            </div>

            {/* Sản phẩm trong đơn hàng */}
            <h2 className="text-lg font-semibold mt-6 mb-2">
                Danh sách sản phẩm
            </h2>
            <table className="w-full bg-gray-50 rounded">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="text-center px-3 py-2">#</th>
                        <th className="text-left px-3 py-2">Tên SP</th>
                        <th className="text-center px-3 py-2">Size</th>
                        <th className="text-center px-3 py-2">Giá</th>
                        <th className="text-center px-3 py-2">Số lượng</th>
                        <th className="text-center px-3 py-2">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems?.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className=" text-center w-20 ">
                                <img
                                    src={item.product?.images[0].url}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                />
                            </td>
                            <td className="px-3 py-2">
                                {item.product?.name || 'SP'}
                            </td>
                            <td className="px-3 py-2 text-center">
                                {item.size === 'default' ? 'N/A' : item.size}
                            </td>
                            <td className="px-3 py-2 text-center">
                                {item.price?.toLocaleString()}₫
                            </td>
                            <td className="px-3 py-2 text-center">
                                {item.quantity}
                            </td>
                            <td className="px-3 py-2 text-center">
                                {(item.price * item.quantity).toLocaleString()}₫
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6 flex justify-end space-x-4">
                <button
    onClick={handleUpdateStatus}
    disabled={status === order.status} // Chỉ bật khi có thay đổi
    className={`px-4 py-2 rounded text-white transition ${
        status === order.status
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
    }`}
>
    Lưu trạng thái
</button>
            </div>
        </div>
    );
};

export default OrderDetail;
