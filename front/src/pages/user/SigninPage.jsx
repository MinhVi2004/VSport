import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SigninPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '9993196520807950',
        cookie: true,
        xfbml: true,
        version: 'v23.0',
      });
    };
  }, []);

  const handleRedirectAfterLogin = (user, token) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', user.role);

    toast.success(' đăng nhập thành công!');
    if (user.role === 'staff') {
      navigate('/staff');
    } else {
      navigate(redirect);
    }
  };

  const mergeLocalCart = async token => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (localCart.length > 0) {
      try {
        await axios.post(`${BACKEND_URL}/api/cart/merge`, { items: localCart }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('cart');
         // Xoá localStorage.cart
      localStorage.removeItem('cart');

      // Lấy lại cart từ server
      const res = await axios.get(`${BACKEND_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serverCart = res.data.items || [];

      // Tính cartQuantity
      const cartQuantity = serverCart.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));

      // Phát event để component khác update
      window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        console.error('Lỗi khi đồng bộ giỏ hàng:', err);
      }
    }
  };

  const handleFacebookLogin = () => {
    window.FB.getLoginStatus(response => {
      if (response.status !== 'connected') {
        window.FB.login(res => {
          if (res.authResponse) {
            const accessToken = res.authResponse.accessToken;
            window.FB.api('/me', {
              fields: 'id,name,email',
              access_token: accessToken,
            }, userInfo => handleFacebookLoginToServer(userInfo));
          }
        }, { scope: 'email,public_profile' });
      } else {
        const accessToken = response.authResponse.accessToken;
        window.FB.api('/me', {
          fields: 'id,name,email',
          access_token: accessToken,
        }, userInfo => handleFacebookLoginToServer(userInfo));
      }
    });
  };

  const handleFacebookLoginToServer = async userInfo => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/signinByFacebook`, {
        email: userInfo.email,
        name: userInfo.name,
      });

      const { user, token } = res.data;
      await mergeLocalCart(token);
      handleRedirectAfterLogin(user, token);
    } catch (error) {
      toast.error(' đăng nhập bằng Facebook thất bại.');
    }
  };

  const handleGoogleLogin = async userLogin => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/signinByGoogle`, {
        email: userLogin.email,
        name: userLogin.name,
      });

      const { user, token } = res.data;
      await mergeLocalCart(token);
      handleRedirectAfterLogin(user, token);
    } catch (error) {
      toast.error(' đăng nhập bằng Google thất bại.');
    }
  };

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const { access_token } = tokenResponse;
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        handleGoogleLogin(res.data);
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin người dùng từ Google.');
      }
    },
    onError: () => {
      toast.error(' đăng nhập Google thất bại.');
    },
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    
    if (loading) return; 
    e.preventDefault();
    const { email, password } = formData;

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
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/user/signin`, { email, password });
      const { user, token } = res.data;

      if (user.type === 'normal' && !user.isVerified) {
        toast.error('Bạn phải kích hoạt Email để đăng nhập!');
        return;
      }

      await mergeLocalCart(token);
      handleRedirectAfterLogin(user, token);
    } catch (error) {
      toast.error(error.response?.data?.message || ' đăng nhập thất bại.');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-blue-500 px-4">
      <div className="bg-white shadow-xl overflow-hidden flex w-full max-w-4xl">
        <div className="hidden md:block w-1/2">
          <img src="/website/signup_poster.png" alt="Signup Poster" className="h-full w-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-8 relative">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            <X size={36} />
          </button>

          <h2 className="text-4xl font-bold mb-6 text-center text-gray-700 font-pattaya"> đăng nhập</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="mt-1 w-full border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-2 px-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? ' đang xử lý...' : ' đăng nhập'}
            </button>
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate('/forget-password')}
                className="text-blue-500 hover:underline"
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
              <span className="bg-white px-2 text-gray-500">hoặc</span>
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <FcGoogle className="cursor-pointer border p-2 hover:bg-gray-100" size={50} onClick={login} />
            <FaFacebook className="cursor-pointer border p-2 text-blue-500 hover:bg-gray-100" size={50} onClick={handleFacebookLogin} />
          </div>

          <p className="mt-4 text-center text-gray-600">
            Chưa có tài khoản?{' '}
            <a href={`/signup?redirect=${redirect}`} className="text-blue-500 hover:underline">
              đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
