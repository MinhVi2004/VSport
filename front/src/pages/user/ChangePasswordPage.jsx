import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
const ChangePasswordPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if (oldPassword.length === 0 || oldPassword === null) {
            toast.warning('Vui lòng nhập mật khẩu cũ.');
            return;
        }
        if (newPassword.length < 6) {
            toast.warning('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.warning('Mật khẩu mới phải chứa ít nhất 1 chữ cái và 1 số.');
            return;
        }

        if (oldPassword === newPassword) {
            toast.warning('Mật khẩu mới phải khác mật khẩu cũ');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const result = await axiosInstance.put(
                '/api/user/change-password',
                {
                    oldPassword,
                    newPassword,
                }
            );
            if (result) {
                console.log(result);
                sessionStorage.setItem(
                    'user',
                    JSON.stringify(result.data.user)
                );
                toast.success('Đổi mật khẩu thành công!');
                navigate('/profile');
            }
        } catch (err) {
            console.log(err);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message); // <-- hiển thị message từ backend
            } else {
                toast.error('Lỗi khi thực hiện đổi mật khẩu.');
            }
        }
    };

    return (
        <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Đổi mật khẩu
                </h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu hiện tại
                    </label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Xác nhận đổi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordPage;
