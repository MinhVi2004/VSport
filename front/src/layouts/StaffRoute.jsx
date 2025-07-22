// src/components/StaffRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import {toast} from "react-toastify";

const StaffRoute = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  if (!storedUser) {
    // Chưa đăng nhập
    toast.error("Bạn cần đăng nhập để truy cập trang này.");
    return <Navigate to="/signin" />;
  }

  if (storedUser.role !== "staff") {
    toast.error("Bạn không có quyền truy cập trang này.");
    // Không phải admin
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default StaffRoute;
