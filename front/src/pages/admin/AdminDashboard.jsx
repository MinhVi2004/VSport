import { useEffect, useState } from 'react';
import axiosInstance from './../../utils/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        paid: 0,
        unpaid: 0,
        revenue: 0,
    });
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const getStatusBadge = status => {
    const base =
        'text-xs font-medium px-2 py-1 rounded-full inline-block';
    switch (status) {
        case 'Đang xác nhận':
            return `${base} bg-yellow-100 text-yellow-700`;
        case 'Đang xử lý':
            return `${base} bg-purple-100 text-purple-700`;
        case 'Đang vận chuyển':
            return `${base} bg-blue-100 text-blue-700`;
        case 'Đã vận chuyển':
            return `${base} bg-indigo-100 text-indigo-700`;
        case 'Hoàn thành':
            return `${base} bg-green-100 text-green-700`;
        case 'Đã hủy':
            return `${base} bg-red-100 text-red-600`;
        default:
            return `${base} bg-gray-100 text-gray-700`;
    }
};

    useEffect(() => {
        fetchData();
    }, []);
    const isThisWeek = date => {
        const now = new Date();
        const inputDate = new Date(date);

        const dayOfWeek = now.getDay(); // 0 (CN) → 6 (T7)

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0); // reset to 00:00:00

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // end of day

        return inputDate >= startOfWeek && inputDate <= endOfWeek;
    };

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get('/api/order/admin');
            const orderData = res.data;

            let total = orderData.length;
            let paid = orderData.filter(o => o.isPaid).length;
            let unpaid = total - paid;
            let revenue = orderData.reduce(
                (sum, o) => (o.isPaid ? sum + o.totalAmount : sum),
                0
            );

            const monthly = Array(12).fill(0);
            orderData.forEach(o => {
                const date = new Date(o.createdAt);
                const month = date.getMonth();
                if (o.isPaid) monthly[month] += o.totalAmount;
            });

            const monthlyChartData = monthly.map((value, index) => ({
                name: `Th ${index + 1}`,
                revenue: value,
            }));

            const ordersThisWeek = orderData.filter(o =>
                isThisWeek(o.createdAt)
            );

            setOrders(ordersThisWeek.reverse());
            setStats({ total, paid, unpaid, revenue });
            setMonthlyRevenue(monthlyChartData);
        } catch (err) {
            console.error('Error loading orders', err);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Thống kê đơn hàng</h1>

            {/* Tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Tổng đơn" value={stats.total} />
                <StatCard
                    title="Đã thanh toán"
                    value={stats.paid}
                    color="green"
                />
                <StatCard
                    title="Chưa thanh toán"
                    value={stats.unpaid}
                    color="red"
                />
                <StatCard
                    title="Tổng doanh thu"
                    value={stats.revenue.toLocaleString()}
                    prefix=" đ"
                />
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">
                    Doanh thu theo tháng
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={v => `${v / 1e6}tr`} />
                        <Tooltip
                            formatter={value => `${value.toLocaleString()} đ`}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="#2563eb"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Danh sách đơn hàng mới */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">
                    đơn hàng tuần này
                </h2>

                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
    <tr className="border-b bg-gray-50 text-left">
        <th className="p-2 text-left">Mã đơn</th>
        <th className="p-2 text-center">Phương thức</th>
        <th className="p-2 text-center">Ngày đặt</th>
        <th className="p-2 text-center">Tổng tiền</th>
        <th className="p-2 text-center">Thanh toán</th>
        <th className="p-2 text-center">Trạng thái</th>
    </tr>
</thead>

                        <tbody>
                            {orders.map(order => (
                                <tr
                                    key={order._id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-2">
                                        {order._id.toUpperCase()}
                                    </td>
                                    <td className="p-2 text-center">
                                        {order.paymentMethod}
                                    </td>
                                    <td className="p-2 text-center">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </td>
                                    <td className="p-2 text-center text-blue-600 font-semibold">
                                        {order.totalAmount.toLocaleString()} đ
                                    </td>
                                    <td className="p-2 text-center align-middle">
    {order.isPaid ? (
        <span className="inline-flex items-center justify-center text-green-600 font-medium">
            <CheckCircle className="w-4 h-4 mr-1" />
           Đã thanh toán
        </span>
    ) : (
        <span className="inline-flex items-center justify-center text-red-500 font-medium">
            <XCircle className="w-4 h-4 mr-1" />
            Chưa thanh toán
        </span>
    )}
</td>

                                    <td className="p-2 text-center">
    <span className={getStatusBadge(order.status)}>
        {order.status}
    </span>
</td>

                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-4 text-gray-500"
                                    >
                                        Không có đơn hàng nào gần đây.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color = 'blue', prefix = '' }) => {
    const colorClass = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
    }[color];

    return (
        <div className="bg-white rounded-xl shadow p-4 text-center">
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <p className={`text-2xl font-bold ${colorClass}`}>
                {prefix}
                {value}
            </p>
        </div>
    );
};

export default AdminDashboard;
