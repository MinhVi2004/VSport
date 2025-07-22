// layouts/UserRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function UserRoute() {
  const user = JSON.parse(sessionStorage.getItem("user")); // Lưu user vào sessionStorage sau login

  // Nếu là nhân viên → chuyển hướng sang /staff
  if (user?.role === "staff") {
    return <Navigate to="/staff" />;
  }

  return <Outlet />;
}
