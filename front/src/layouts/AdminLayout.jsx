import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Home, X } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [avatar, setAvatar] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  useEffect(() => { 
      setAvatar('/website/male_avatar.png');
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
  {/* Sidebar */}
  <aside
    className={`
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
      fixed md:static z-50
      top-0 left-0 w-64
      h-full
      flex flex-col
      bg-white border-r shadow-sm
      transition-transform duration-300
    `}
  >
    {/* Header */}
    <div className="p-4 border-b flex items-center justify-between md:justify-start">
      <div className="flex items-center gap-3">
        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border"
          />
        )}
        <div>
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500">Quản trị viên</p>
        </div>
      </div>
      <button
        onClick={() => setSidebarOpen(false)}
        className="md:hidden text-gray-600"
      >
        <X />
      </button>
    </div>

    {/* Menu cuộn nếu dài */}
    <div className="flex-1 overflow-y-auto p-4 space-y-2 text-gray-700 font-medium">
      <Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-600">
        <Home size={16} /> Về trang chủ
      </Link>
      <Link to="/admin" className="block hover:text-blue-600">Dashboard</Link>
      <Link to="/admin/category" className="block hover:text-blue-600">Danh Mục</Link>
      <Link to="/admin/banner" className="block hover:text-blue-600">Banner</Link>
      <Link to="/admin/product" className="block hover:text-blue-600">Sản Phẩm</Link>
      <Link to="/admin/order" className="block hover:text-blue-600"> Đơn Hàng</Link>
      <Link to="/admin/user" className="block hover:text-blue-600">Người Dùng</Link>
    </div>

    {/* Footer nằm dưới cùng */}
    <div className="border-t p-4 text-sm text-gray-600 flex justify-between items-center">
      <span>&copy; 2025 Admin</span>
      <button
        onClick={() => {
          sessionStorage.clear();
          navigate("/signin");
        }}
        className="flex items-center gap-1 text-red-500 hover:underline"
      >
        <LogOut size={16} /> Đăng xuất
      </button>
    </div>
  </aside>

  {/* Nội dung chính */}
  <main className="flex-1 overflow-y-auto p-6 md:ml-auto">
    <button
      onClick={() => setSidebarOpen(true)}
      className="md:hidden absolute top-4 left-4 bg-gray-200 p-2 rounded shadow"
    >
      <Menu size={20} />
    </button>

    <Outlet />
  </main>
</div>

  );
};

export default AdminLayout;
