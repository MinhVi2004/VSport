// src/pages/VerifyEmail.jsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, XCircle } from "lucide-react"; // Icon đẹp

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      if (!token) {
        toast.error("Không tìm thấy token xác minh.");
        setStatus("error");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}api/user/verify-email?token=${token}`);
        toast.success(res.data.message || "Xác minh thành công!");
        setStatus("success");

        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn.");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        {loading ? (
          <p className="text-gray-600">Đang xác minh tài khoản...</p>
        ) : status === "success" ? (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-600 mb-2">Xác minh thành công!</h2>
            <p className="text-gray-600">Bạn sẽ được chuyển sang trang đăng nhập trong giây lát...</p>
          </>
        ) : (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Xác minh thất bại</h2>
            <p className="text-gray-600">Token không hợp lệ hoặc đã hết hạn.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
