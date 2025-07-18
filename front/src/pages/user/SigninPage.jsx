import { useState } from 'react';
import { useNavigate, useLocation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import axiosInstance from './../../utils/axios'; // Nếu bạn đang dùng `axiosInstance`, đổi lại cho đúng

const SigninPage = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const redirect = new URLSearchParams(location.search).get('redirect') || '/';
      const [formData, setFormData] = useState({
            email: '',
            password: '',
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
            const { email, password } = formData;

            // Validation
            if (!email || !password) {
                  toast.error('Vui lòng điền đầy đủ thông tin.');
                  return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                  toast.warning('Email không đúng định dạng.');
                  return;
            }

            if (password.length < 6) {
                  toast.warning('Mật khẩu phải có ít nhất 6 ký tự.');
                  return;
            }

            try {
                  const res = await axiosInstance.post('api/user/signin', {
                        email,
                        password,
                  });

                  const token = res.data.token;

                  sessionStorage.setItem('token', token);
                  sessionStorage.setItem('user', JSON.stringify(res.data.user));

                  const localCart =
                        JSON.parse(localStorage.getItem('cart')) || [];

                  if (localCart.length > 0) {
                        try {
                              await axiosInstance.post(
                                    '/api/cart/merge',
                                    { items: localCart },
                                    {
                                          headers: {
                                                Authorization: `Bearer ${token}`,
                                          },
                                    }
                              );
                              localStorage.removeItem('cart');
                              console.log(
                                    'Local cart đã được đồng bộ vào server.'
                              );
                        } catch (mergeErr) {
                              console.error(
                                    'Lỗi khi đồng bộ giỏ hàng:',
                                    mergeErr
                              );
                        }
                  }

                  toast.success('Đăng nhập thành công!');
                  
                  navigate(redirect);
            } catch (error) {
                  console.error('Lỗi đăng nhập:', error);
                  toast.error(
                        error.response?.data?.message || 'Đăng nhập thất bại.'
                  );
            }
      };

      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-blue-500 px-4">
                  <div className="bg-white shadow-xl overflow-hidden flex w-full max-w-4xl">
                        {/* Hình ảnh trái */}
                        <div className="hidden md:block w-1/2">
                              <img
                                    src="/website/signup_poster.png"
                                    alt="Signup Poster"
                                    className="h-full w-full object-cover"
                              />
                        </div>

                        {/* Form phải */}
                        <div className="w-full md:w-1/2 p-8 relative">
                              <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 transition"
                              >
                                    <X size={36} />
                              </button>
                              <h2 className="text-4xl font-bold mb-6 text-center text-gray-700 font-pattaya">
                                    Đăng nhập
                              </h2>
                              <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                              >
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
                                    <button
                                          type="submit"
                                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4  transition duration-200"
                                    >
                                          Đăng nhập
                                    </button>
                              </form>
                              <p className="mt-4 text-center text-gray-600">
  Chưa có tài khoản?{" "}
  <a
    href={`/signup?redirect=${redirect}`} // giữ redirect
    className="text-blue-500 hover:underline"
  >
    Đăng ký
  </a>
</p>

                        </div>
                  </div>
            </div>
      );
};

export default SigninPage;
