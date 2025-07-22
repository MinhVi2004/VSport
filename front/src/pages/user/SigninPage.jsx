import { useEffect, useState } from 'react';
import { useNavigate, useLocation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
// import axiosInstance from './../../utils/axios'; // Nếu bạn đang dùng `axiosInstance`, đổi lại cho đúng

import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc'; // Google icon
import { FaFacebook } from 'react-icons/fa';

import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const SigninPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirect =
        new URLSearchParams(location.search).get('redirect') || '/';
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '9993196520807950', //
                cookie: true,
                xfbml: true,
                version: 'v23.0', // hoặc phiên bản mới nhất
            });
        };
    }, []);
    const handleFacebookLogin = () => {
        window.FB.getLoginStatus(response => {
            if (response.status !== 'connected') {
                return window.FB.login(
                    res => {
                        if (
                            res.status === 'not_authorized' ||
                            !res.authResponse
                        ) {
                            return;
                        }

                        const accessToken = res.authResponse.accessToken;

                        // Lấy thông tin người dùng
                        window.FB.api(
                            '/me',
                            {
                                fields: 'id,name,email',
                                access_token: accessToken,
                            },
                            userInfo => {
                                handleFacebookLoginToServer(userInfo);
                            }
                        );
                    },
                    { scope: 'email,public_profile' }
                );
            } else {
                const accessToken = response.authResponse.accessToken;

                // Lấy thông tin người dùng
                window.FB.api(
                    '/me',
                    { fields: 'id,name,email', access_token: accessToken },
                    userInfo => {
                        handleFacebookLoginToServer(userInfo);
                    }
                );
            }
        });
    };
    const mergeLocalCart = async token => {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];

        if (localCart.length > 0) {
            try {
                await axios.post(BACKEND_URL+'api/cart/merge', {
                    items: localCart,
                });
                localStorage.removeItem('cart');
                console.log('Local cart đã được đồng bộ vào server.');
            } catch (mergeErr) {
                console.error('Lỗi khi đồng bộ giỏ hàng:', mergeErr);
            }
        }
    };

    const handleFacebookLoginToServer = async userInfo => {
        try {
            const res = await axios.post(BACKEND_URL + '/api/user/signinByFacebook', {
                email: userInfo.email,
                name: userInfo.name,
            });

            const token = res.data.token;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));

            mergeLocalCart(token);

            toast.success('Đăng nhập thành công!');
            navigate(redirect);
        } catch (error) {
            console.error('Lỗi đăng nhập Facebook:', error);
            toast.error('Đăng nhập bằng Facebook thất bại.');
        }
    };
    const handleGoogleLogin = async userLogin => {
        try {
            const res = await axios.post(BACKEND_URL + 'api/user/signinByGoogle', {
                email: userLogin.email,
                name: userLogin.name,
            });

            const token = res.data.token;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));

            mergeLocalCart(token);
            toast.success('Đăng nhập thành công!');
            navigate(redirect);
        } catch (error) {
            console.error('Lỗi Google login:', error);
            toast.error('Đăng nhập bằng Google thất bại.');
        }
    };
    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                console.log('Token response:', tokenResponse); // có access_token ở đây
                const { access_token } = tokenResponse;

                // Lấy thông tin người dùng từ Google
                const res = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );

                const userInfo = res.data;
                console.log('Thông tin người dùng từ Google:', userInfo);
                handleGoogleLogin(userInfo);
                // Optional: Gửi userInfo hoặc access_token về backend của bạn để xử lý đăng nhập
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        },
        onError: () => {
            console.error('Đăng nhập Google thất bại');
        },
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
            const res = await axios.post(BACKEND_URL + 'api/user/signin', {
                email,
                password,
            });
            if (res.data.user.type === "normal" && !res.data.user.isVerified) {
                toast.error('Bạn phải kích hoạt Email để đăng nhập!');
                return
            }
            const token = res.data.token;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));

            mergeLocalCart(token);

            toast.success('Đăng nhập thành công!');

            navigate(redirect);
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại.');
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
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="text-right mt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/forget-password')}
                                className=" text-blue-500 hover:underline"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    </form>
                    <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                hoặc
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-left mt-1">
                        <FcGoogle
                            className="cursor-pointer mr-2 border p-2 hover:bg-gray-100 transition duration-200"
                            size={50}
                            onClick={login}
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            // Ẩn nút mặc định
                            useOneTap={false}
                            text="signin_with" // Google yêu cầu có text nhưng ta sẽ ẩn qua CSS
                            shape="circle"
                            theme="outline"
                            width="40"
                        />
                        <FaFacebook
                            className="cursor-pointer mr-2 border p-1 hover:bg-gray-100 transition duration-200 text-blue-500"
                            size={50}
                            onClick={handleFacebookLogin}
                        />
                    </div>

                    <p className="mt-4 text-center text-gray-600">
                        Chưa có tài khoản?{' '}
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
