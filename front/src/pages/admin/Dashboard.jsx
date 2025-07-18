// src/pages/Dashboard.jsx
const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold ml-10 mb-6">Bảng điều khiển quản trị</h1>

      {/* Tổng quan nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Sản phẩm</h2>
          <p className="text-2xl font-bold text-blue-700">120</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Đơn hàng</h2>
          <p className="text-2xl font-bold text-green-700">56</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Người dùng</h2>
          <p className="text-2xl font-bold text-yellow-700">234</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Doanh thu</h2>
          <p className="text-2xl font-bold text-purple-700">₫123.456.000</p>
        </div>
      </div>

      {/* Bạn có thể thêm biểu đồ hoặc thông báo ở đây */}
    </div>
  );
};

export default Dashboard;
