import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "./../../../utils/axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/${id}`);
      setUser(res.data);
    } catch (err) {
      toast.error("Lỗi khi lấy thông tin người dùng");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleUpdateRole = async (role) => {
    try {
      await axiosInstance.put(`/api/user/admin/${id}/updateRole`, { role });
      toast.success(`Đã phân quyền thành ${role === "staff" ? "nhân viên" : "người dùng"}`);
      fetchUser();
    } catch {
      toast.error("Lỗi khi phân quyền");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.post(`/api/user/${id}/reset-password`);
      toast.success("Đã gửi email khôi phục mật khẩu");
    } catch {
      toast.error("Lỗi khi gửi khôi phục mật khẩu");
    }
  };

  if (!user) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="relative max-w-3xl mx-auto bg-white shadow-lg rounded-3xl border border-gray-200 p-8">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate("/admin/user")}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Thông tin người dùng</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
          <div>
            <span className="font-medium"> Tên:</span> {user.name}
          </div>
          <div>
            <span className="font-medium"> Email:</span> {user.email}
          </div>
          <div>
            <span className="font-medium"> Phân quyền:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "staff"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {user.role === "staff" ? "Nhân viên" : "Người dùng"}
            </span>
          </div>
          <div>
            <span className="font-medium"> Loại tài khoản:</span>{" "}
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {user.type}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {user.role === "normal" && (
            <>
              <button
                onClick={() => handleUpdateRole("staff")}
                className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
              >
                Phân quyền thành nhân viên
              </button>
              <button
                onClick={handleResetPassword}
                className="bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                Khôi phục mật khẩu
              </button>
            </>
          )}

          {user.role === "staff" && (
            <>
              <button
                onClick={() => handleUpdateRole("user")}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Phân quyền thành người dùng
              </button>
              <button
                onClick={handleResetPassword}
                className="bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                Khôi phục mật khẩu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
