import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SignupPage = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const redirect =
        new URLSearchParams(location.search).get('redirect') || '/';
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        // gender: "",
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (loading) return; // nếu đang xử lý thì bỏ qua click tiếp theo
        const { name, email, password, confirmPassword } = formData;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        const numberRegex = /\d/;
        if (numberRegex.test(name)) {
            toast.warning('Tên không được chứa số.');
            return;
        }
        if (name.length < 2) {
            toast.warning('Tên phải có ít nhất 2 ký tự.');
            return;
        }
        // if(gender === "") {
        //   toast.warning("Vui lòng chọn giới tính.");
        //   return;
        // }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warning('Email không đúng định dạng.');
            return;
        }

        if (password.length < 6) {
            toast.warning('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            toast.warning('Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            setLoading(true); // bắt đầu disable nút
            const res = await axios.post(BACKEND_URL + 'api/user/signup', {
                name,
                // gender,
                email,
                password,
                redirect,
            });

            toast.success(
                'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.'
            );

            setFormData({
                name: '',
                // gender: "",
                email: '',
                password: '',
                confirmPassword: '',
            });
            // Chờ 1.5 giây rồi mới chuyển hướng
            setTimeout(() => {
                navigate(`/signin?redirect=${redirect}`, { replace: true });
            }, 1500);
            console.log('Server trả về:', res.data);
        } catch (error) {
            console.error('Lỗi đăng ký:', error.response.data);
            toast.error(
                error.response?.data?.message || 'Lỗi kết nối đến máy chủ.'
            );
        } finally {
            setLoading(false); // mở lại nút sau khi xong
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-blue-500 px-4">
            <div className="bg-white  shadow-xl overflow-hidden flex w-full max-w-4xl">
                {/* Hình ảnh bên trái */}
                <div className="hidden md:block w-[50%]">
                    <img
                        src="/website/signup_poster.png"
                        alt="Signup Poster"
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* Form bên phải */}
                <div className="w-full md:w-[50%] p-8 relative">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition duration-200"
                    >
                        <X size={40} />
                    </button>
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-700 font-pattaya">
                        Đăng ký
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block font-medium text-gray-700"
                            >
                                Họ tên
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="mt-1 w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Nhập họ tên"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        {/* <div>
              <label className="block font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={formData.gender === "Nam"}
                    onChange={handleChange}
                    className="cursor-pointer appearance-none w-7 h-7 border-2 border-blue-500 checked:bg-blue-500 checked:border-blue-500 transition duration-200"
                  />
                  <span>Nam</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={formData.gender === "Nữ"}
                    onChange={handleChange}
                    className="cursor-pointer appearance-none w-7 h-7 border-2 border-pink-500 checked:bg-pink-500 checked:border-pink-500 transition duration-200"
                  />
                  <span>Nữ</span>
                </label>
              </div>
            </div> */}

                        <div>
                            <label
                                htmlFor="email"
                                className="block font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block font-medium text-gray-700"
                            >
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="mt-1 w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block font-medium text-gray-700"
                            >
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="mt-1 w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Xác nhận mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-semibold py-2 px-4 transition duration-200 ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-gray-600">
                        Đã có tài khoản?{' '}
                        <a
                            href="/signin"
                            className="text-blue-500 hover:underline"
                        >
                            Đăng nhập
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
