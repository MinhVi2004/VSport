import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const navigate = useNavigate();

  const statuses = [
    "Tất cả",
    "Đang xác nhận",
    "Đang xử lý",
    "Đang vận chuyển",
    "Đã vận chuyển",
    "Đã hủy",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("api/order");
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Danh sách đơn hàng</h1>

      {/* Filter */}
      <div className="mb-4">
        <label className="font-medium mr-2">Lọc theo trạng thái:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow-md">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Mã đơn</th>
                <th className="text-left px-4 py-2">Khách hàng</th>
                <th className="text-left px-4 py-2">Số tiền</th>
                <th className="text-left px-4 py-2">Trạng thái</th>
                <th className="text-left px-4 py-2">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/admin/order/${order._id}`)}
                  >
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                    <td className="px-4 py-2 text-blue-600 font-medium">
                      {order.totalAmount?.toLocaleString()}₫
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
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
