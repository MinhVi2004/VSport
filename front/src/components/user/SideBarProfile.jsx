import {
  User,
  Home,
  ShoppingCart,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const SidebarProfile = ({ onLogout, user }) => {
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col justify-between overflow-y-auto" >

      {/* Top Section */}
      <div>
        <div className="bg-blue-700 text-white px-4 py-5">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8" />
            <div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm">Số tài khoản: {user._id}</p>
            </div>
          </div>
        </div>

        <ul className="px-4 py-6 space-y-4 text-sm font-medium">
          <li className="flex items-center gap-3 cursor-pointer hover:text-blue-700">
            <Home className="w-5 h-5" />
            <span>Địa chỉ của tôi</span>
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-blue-700">
            <ShoppingCart className="w-5 h-5" />
            <span>Lịch sử mua hàng</span>
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-blue-700">
            <CreditCard className="w-5 h-5" />
            <span>Thẻ thành viên của tôi</span>
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-blue-700">
            <Settings className="w-5 h-5" />
            <span>Quản lý điểm tích lũy</span>
          </li>
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pb-6">
        <button
          className="border border-gray-400 px-4 py-2 rounded-full text-sm hover:bg-gray-100 w-full"
          onClick={onLogout}
        >
          ĐĂNG XUẤT
        </button>
      </div>
    </div>
  );
};

export default SidebarProfile;
