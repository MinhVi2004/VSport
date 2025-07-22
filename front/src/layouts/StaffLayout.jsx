import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
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
      <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between border-b">
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
            <p className="text-xs text-gray-500">Nhân viên</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500 hover:underline text-sm"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
