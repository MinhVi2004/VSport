import { useState } from "react";
import axiosInstance from "./../../utils/axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/forget/send", { email });
      toast.success("Đã gửi email khôi phục mật khẩu. Hãy kiểm tra hộp thư!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi xảy ra!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          Khôi phục mật khẩu
        </h2>
        {/* <p className="text-gray-500 text-sm mb-6 text-center">
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
        </p> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Email của bạn"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition duration-300"
          >
            Gửi email khôi phục
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
