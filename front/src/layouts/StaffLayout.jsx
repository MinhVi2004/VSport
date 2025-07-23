import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LogOut, FileText, ArrowLeft, CirclePlus  } from 'lucide-react';

const StaffLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [avatar, setAvatar] = useState(null);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: 'Đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xác nhận',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (confirm.isConfirmed) {
      localStorage.removeItem('cart');
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  useEffect(() => {
    if (user?.gender === 'Nam') {
      setAvatar('/website/male_avatar.png');
    } else {
      setAvatar('/website/female_avatar.png');
    }
  }, [user]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between border-b">
  {/* Nhân viên */}
  <div className="flex items-center gap-3">
    {avatar && (
      <img
        src={avatar}
        alt="avatar"
        className="w-11 h-11 rounded-full object-cover border"
      />
    )}
    <div>
      <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
      <p className="text-xs text-gray-500">Nhân viên</p>
    </div>
  </div>

  {/* Nút điều hướng */}
  <div className="flex items-center gap-3">
    {/* Tạo đơn */}
    <button
      onClick={() => navigate("/staff")}
      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
    >
      <CirclePlus size={18} /> Tạo đơn hàng
    </button>

    {/* Xem đơn */}
    <button
      onClick={() => navigate("/staff/order")}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
    >
      <FileText size={18} /> Xem đơn hàng
    </button>

    {/* Đăng xuất */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
    >
      <LogOut size={18} /> Đăng xuất
    </button>
  </div>
</header>


      {/* Nội dung chính */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
