import axios from "axios";
import { toast } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
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
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (code === "IS_STAFF") {
      // Nếu là staff mà truy cập route không dành cho staff → redirect về staff
      window.location.href = "/staff"; // hoặc navigate("/staff") nếu bên trong component
    } else if (status === 401 || status === 403) {
      console.log(error)
      // sessionStorage.clear();
      // window.location.href = "/signin"; // logout và điều hướng về signin
      console.log("VỀ đây")
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;
