import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarProfile from './../../components/user/SideBarProfile';
import { Menu } from 'lucide-react'; // icon menu

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

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    if (!user) return <div className="text-center mt-10">Đang tải...</div>;

    return (
        <div className="flex bg-gray-50 relative"  style={{ height: 'calc(100vh - 5rem)' }}>
            {/* Sidebar (ẩn trên mobile, hiện trên md) */}
            <div
                className={`fixed z-20 top-0 left-0 h-full bg-white shadow-md transition-transform transform md:relative md:translate-x-0
                ${
                    sidebarOpen
                        ? 'translate-x-0 w-64'
                        : '-translate-x-full md:w-64'
                }
            `}
            >
                <SidebarProfile onLogout={handleLogout} user={user} />
            </div>

            {/* Toggle button (chỉ hiện trên mobile) */}
            <button
                className="absolute top-4 left-4 z-30 md:hidden bg-white border p-2 rounded-full shadow"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Main content */}
            <div className="flex-1 p-6">
                <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Hồ sơ cá nhân
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user.email || ''}
                                disabled
                                className="w-full border rounded-sm px-4 py-2 bg-gray-100 cursor-not-allowed"
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
                                className="w-full border rounded-sm px-4 py-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Nút đổi mật khẩu */}
                        <div className="pt-4">
                            <button
                                onClick={() =>
                                    navigate('/profile/changePassword')
                                }
                                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-600 transition duration-200"
                            >
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
