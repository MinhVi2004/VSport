import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // dùng icon X (bạn có thể thay bằng FontAwesome, Heroicons tùy lib)

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: "", name: "", gender: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setForm({
        email: parsedUser.email || "",
        name: parsedUser.name || "",
        gender: parsedUser.gender || "",
      });
    } else {
      navigate("/signin");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (form.name.trim() === "") {
      toast.warning("Tên không được để trống");
      return;
    }

    const token = sessionStorage.getItem("token");
    try {
      setLoading(true);
      const res = await axiosInstance.put("/api/user", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Cập nhật thông tin thành công");

      const updatedUser = { ...user, ...form };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10">Đang tải...</div>;

  return (
    <div className="relative max-w-xl mx-auto mt-10 mb-10 p-6 bg-white rounded-sm shadow-lg border border-gray-200">
      {/* Nút X */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-600 transition"
        aria-label="Đóng"
      >
        <X size={40} />
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Hồ sơ cá nhân
      </h2>

      <div className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            readOnly
            className="w-full border rounded-sm px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Tên */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tên</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-sm px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tên của bạn"
          />
        </div>

        {/* Giới tính */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Giới tính</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Nam"
                checked={form.gender === "Nam"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-gray-700">Nam</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                checked={form.gender === "Nữ"}
                onChange={handleChange}
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300"
              />
              <span className="text-gray-700">Nữ</span>
            </label>
          </div>
        </div>

        {/* Điểm */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Điểm tích lũy</label>
          <input
            type="text"
            value={user.point + " điểm"}
            disabled
            className="w-full border rounded-sm px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Nút cập nhật */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
