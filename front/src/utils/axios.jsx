import axios from "axios";
import { toast } from "react-toastify";
const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
});
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi token hết hạn hoặc không hợp lệ
axiosInstance.interceptors.response.use(
  (response) => response, // Trả response nếu không có lỗi
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      console.warn("Token hết hạn hoặc không hợp lệ.");

      // Xóa token
      sessionStorage.clear();

      
      // Hiển thị thông báo lỗi
      toast.error("Phiên đăng nhập đã hết hạn. Đang chuyển hướng đến trang đăng nhập...");

      // Delay 1 chút rồi mới chuyển trang
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500); // 1.5 giây
      return Promise.reject("Token hết hạn. Vui lòng đăng nhập lại.");
    }

    // Nếu là lỗi khác, tiếp tục ném lỗi để xử lý bên ngoài
    return Promise.reject(error);
  }
);

export default axiosInstance;
