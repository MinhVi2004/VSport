import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from './../../../utils/axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get(`/api/user/${id}`);
            setUser(res.data);
        } catch (err) {
            toast.error('Lỗi khi lấy thông tin người dùng');
        }
    };
    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get(`/api/order/admin/user/${id}`);
            setOrders(res.data);
        } catch (err) {
            toast.error('Lỗi khi lấy danh sách đơn hàng');
        }
    };

    useEffect(() => {
        fetchUser();
        fetchOrders();
    }, [id]);

    const handleUpdateRole = async role => {
        const confirm = await Swal.fire({
            title: 'Xác nhận thay đổi phân quyền',
            text: 'Bạn có chắc chắn muốn thay đổi phân quyền?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        });
        if (confirm.isConfirmed) {
            try {
                await axiosInstance.put(`/api/user/admin/${id}/updateRole`, {
                    role,
                });
                toast.success(
                    `Đã phân quyền thành ${
                        role === 'staff' ? 'nhân viên' : 'người dùng'
                    }`
                );
                fetchUser();
            } catch {
                toast.error('Lỗi khi phân quyền');
            }
        }
    };

    const handleToggleBlockUser = async () => {
        const newStatus = !user.status;
        if (newStatus) {
            const confirm = await Swal.fire({
                title: 'Xác nhận mở khóa',
                text: 'Bạn có chắc chắn muốn mở khóa tài khoản ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xoá',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            });
            if (confirm.isConfirmed) {
                try {
                    await axiosInstance.put(`/api/user/${id}/block`, {
                        status: newStatus,
                    });
                    toast.success(
                        newStatus ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản'
                    );
                    fetchUser(); // Refresh lại dữ liệu
                } catch {
                    toast.error('Lỗi khi cập nhật trạng thái tài khoản');
                }
            }
        } else {
            const confirm = await Swal.fire({
                title: 'Xác nhận khóa',
                text: 'Bạn có chắc chắn muốn khóa tài khoản ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xoá',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            });
            if (confirm.isConfirmed) {
                try {
                    await axiosInstance.put(`/api/user/${id}/block`, {
                        status: newStatus,
                    });
                    toast.success(
                        newStatus ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản'
                    );
                    fetchUser(); // Refresh lại dữ liệu
                } catch {
                    toast.error('Lỗi khi cập nhật trạng thái tài khoản');
                }
            }
        }
    };

    if (!user) return <p className="p-6"> đang tải...</p>;

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="relative max-w-3xl mx-auto bg-white shadow-lg rounded-3xl border border-gray-200 p-8">
                {/* Nút quay lại */}
                <button
                    onClick={() => navigate('/admin/user')}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                    Thông tin người dùng
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
                    <div>
                        <span className="font-medium"> Tên:</span> {user.name}
                    </div>
                    <div>
                        <span className="font-medium"> Email:</span>{' '}
                        {user.email}
                    </div>
                    <div>
                        <span className="font-medium"> Phân quyền:</span>{' '}
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                user.role === 'staff'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {user.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium"> Loại tài khoản:</span>{' '}
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                            {user.type}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium"> Trạng thái:</span>{' '}
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                user.status
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-600'
                            }`}
                        >
                            {user.status ? ' đang hoạt động' : 'Đã bị khóa'}
                        </span>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                    {user.role === 'user' && (
                        <>
                            <button
                                onClick={() => handleUpdateRole('staff')}
                                className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                            >
                                Phân quyền thành nhân viên
                            </button>
                            <button
                                onClick={handleToggleBlockUser}
                                className={`${
                                    user.status
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-500 hover:bg-green-600'
                                } text-white px-5 py-2 rounded-xl transition`}
                            >
                                {user.status
                                    ? 'Khóa tài khoản'
                                    : 'Mở khóa tài khoản'}
                            </button>
                        </>
                    )}

                    {user.role === 'staff' && (
                        <>
                            <button
                                onClick={() => handleUpdateRole('user')}
                                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                            >
                                Phân quyền thành người dùng
                            </button>
                            <button
                                onClick={handleToggleBlockUser}
                                className={`${
                                    user.status
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-500 hover:bg-green-600'
                                } text-white px-5 py-2 rounded-xl transition`}
                            >
                                {user.status
                                    ? 'Khóa tài khoản'
                                    : 'Mở khóa tài khoản'}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Đơn hàng đã thực hiện
                </h3>

                {orders.length === 0 ? (
                    <p className="text-gray-500">
                        Người dùng chưa có đơn hàng nào.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
                            <thead className="bg-gray-100 text-left text-sm text-gray-600">
                                <tr>
                                    <th className="px-4 py-2">Mã đơn</th>
                                    <th className="px-4 py-2">Ngày đặt</th>
                                    <th className="px-4 py-2">Tổng tiền</th>
                                    <th className="px-4 py-2">Thanh toán</th>
                                    <th className="px-4 py-2">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr
                                        key={order._id}
                                        className="border-t text-sm"
                                    >
                                        <td className="px-4 py-2">
                                            {order.code || order._id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.totalAmount?.toLocaleString()}
                                            đ
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                                    order.isPaid
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {order.isPaid
                                                    ? 'Đã thanh toán'
                                                    : 'Chưa thanh toán'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-2">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                                    order.status ===
                                                    'Hoàn thành'
                                                        ? 'bg-green-100 text-green-700'
                                                        : order.status ===
                                                          ' đang xác nhận'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : order.status ===
                                                          ' đang xử lý'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : order.status ===
                                                          ' đang vận chuyển'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : order.status ===
                                                          'Đã vận chuyển'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : order.status ===
                                                          'Đã hủy'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetail;
