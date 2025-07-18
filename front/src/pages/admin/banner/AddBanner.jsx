import { useState } from "react";
import axiosInstance  from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBanner = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 👉 Dùng để hiển thị ảnh
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file)); // 👉 Tạo URL tạm thời
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.info("Vui lòng chọn ảnh!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axiosInstance.post("api/banner", formData);
      toast.success("Thêm banner thành công");
      navigate("/admin/banner");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm banner");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Thêm Banner Mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2"
          required
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded border"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tải lên
        </button>
      </form>
    </div>
  );
};

export default AddBanner;
