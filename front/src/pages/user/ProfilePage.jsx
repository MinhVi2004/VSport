import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            navigate('/signin');
        }
    }, []);

    if (!user) return <div className="text-center mt-10">Đang tải...</div>;

    return (
        <div className="flex bg-gray-50 relative justify-center items-center" style={{ height: 'calc(100vh - 5rem)' }}>
            {/* Toggle menu button (for mobile) */}
            <button
                className="absolute top-4 left-4 z-30 md:hidden bg-white border p-2 rounded-full shadow"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Main content */}
            <div className="bg-white shadow-md rounded-xl border border-gray-200 p-8 w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Hồ sơ cá nhân
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Thông tin bên trái */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user.email || ''}
                                disabled
                                className="w-full border rounded-md px-4 py-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Tên
                            </label>
                            <input
                                type="text"
                                value={user.name || ''}
                                disabled
                                className="w-full border rounded-md px-4 py-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Nút thao tác bên phải */}
                    <div class="h-full flex flex-col justify-end p-4">
  <div class="space-y-4">
    {/* <button class="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition">
      Cập nhật thông tin
    </button> */}
    <button class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition">
      Đổi mật khẩu
    </button>
  </div>
</div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
