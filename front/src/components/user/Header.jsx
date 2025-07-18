import { Link } from 'react-router-dom';
import { User, Phone, House, ShoppingCart, Search } from 'lucide-react';
import Swal from 'sweetalert2';

const Header = () => {

      const user = JSON.parse(sessionStorage.getItem('user'));


      const handleLogout = async () =>  {
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
                  sessionStorage.clear();
                  window.location.href = '/';
            }
      }
      return (
            <header className="text-black shadow-md">
                  <div className="container mx-auto flex justify-between items-center px-4 py-3">
                        {/* Logo */}
                        <Link
                              to="/"
                              className="text-2xl font-bold font-pattaya flex items-center gap-2"
                        >
                              <img
                                    src="/website/logo_text_trongsuot.png"
                                    alt="Logo"
                                    className="h-16"
                              />
                        </Link>
                        {/* Search Bar */}
                        <div className="flex-1 relative items-center mx-[5%] hidden md:flex">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                              <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="w-full px-4 py-1.5 pl-10 border rounded-full focus:outline-none "
                              />
                        </div>
                        {/* Navigation */}
                        <nav className="flex items-center gap-6 text-sm font-medium">
                              <Link
                                    to="/"
                                    className="flex flex-col items-center gap-1 hover:text-blue-800 transition"
                              >
                                    <House size={22} />
                                    <span className="hidden md:block">
                                          Trang chủ
                                    </span>
                              </Link>

                              <Link
                                    to="/contact"
                                    className="flex flex-col items-center gap-1 hover:text-blue-800 transition"
                              >
                                    <Phone size={22} />
                                    <span className="hidden md:block">
                                          Liên hệ
                                    </span>
                              </Link>

                              <Link
                                    to="/cart"
                                    className="flex flex-col items-center gap-1 hover:text-blue-800 transition"
                              >
                                    <ShoppingCart size={22} />
                                    <span className="hidden md:block">
                                          Giỏ hàng
                                    </span>
                              </Link>

                              {/* Nếu chưa đăng nhập */}
                              {!user && (
                                    <Link
                                          to="/signin"
                                          className="flex flex-col items-center gap-1 hover:text-blue-800 transition"
                                    >
                                          <User size={22} />
                                          <span className="hidden md:block">
                                                Đăng nhập
                                          </span>
                                    </Link>
                              )}

                              {/* Nếu đã đăng nhập */}
                              {user && (
                                    <div className="relative group min-w-[100px]">
                                          {/* Khu vực trigger hover */}
                                          <div className="flex flex-col items-center gap-1 px-2 py-1  hover:text-blue-800 transition cursor-pointer">
                                                <User size={22} />
                                                <span className="hidden md:block text-sm">
                                                      {user.name || 'Tài khoản'}
                                                </span>
                                          </div>

                                          {/* Dropdown giữ lại khi hover */}
                                          <div
                                                className="absolute top-full right-0 w-52 bg-white border rounded-xl shadow-lg 
                  opacity-0 scale-95 pointer-events-none 
                  group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto 
                  transition-all duration-200 ease-in-out z-50"
                                          >
                                                <Link
                                                      to="/profile"
                                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                      Thông tin cá nhân
                                                </Link>
                                                <Link
                                                      to="/profile/address"
                                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                      Địa chỉ
                                                </Link>
                                                <Link
                                                      to="/profile/points"
                                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                      Điểm tích lũy
                                                </Link>
                                                {/* Hiện nút admin nếu role là admin */}
                                                {user.role === 'admin' && (
                                                      <Link
                                                            to="/admin"
                                                            className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                                                      >
                                                            Vào trang Admin
                                                      </Link>
                                                )}
                                                <div className="border-t border-gray-200 w-full"></div>
                                                <button
                                                      onClick={handleLogout}
                                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-800 transition rounded-b-xl"
                                                >
                                                      Đăng xuất
                                                </button>
                                          </div>
                                    </div>
                              )}
                        </nav>
                  </div>
            </header>
      );
};

export default Header;
