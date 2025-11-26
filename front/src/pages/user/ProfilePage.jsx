import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isNormal, setIsNormal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.type === 'normal') setIsNormal(true);
        } else {
            navigate('/signin');
        }
    }, []);

    if (!user)
        return (
            <div className="text-center mt-10 text-gray-600"> đang tải...</div>
        );

    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[calc(100vh-10rem)] relative px-4">
            {/* Toggle menu (mobile) */}
            <button
                className="absolute top-4 left-4 z-30 md:hidden bg-white border p-2 rounded-full shadow"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Profile Card */}
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Hồ sơ cá nhân
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    {/* User Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user.email || ''}
                                disabled
                                className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed text-gray-700"
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
                                className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed text-gray-700"
                            />
                        </div>
                        {isNormal && (
                            <button
                                onClick={() => navigate('/change-password')}
                                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Đổi mật khẩu
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
