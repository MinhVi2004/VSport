import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      await axiosInstance.post("api/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Thêm danh mục thành công");
      navigate("/admin/category"); // ✅ đúng đường dẫn
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi thêm danh mục");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8 relative">
      {/* ✅ Nút trở về */}
      <button
        onClick={() => navigate("/admin/category")}
        className="absolute top-4 right-4 text-gray-500 hover:text-blue-300 flex items-center gap-1 transition duration-200"
      >
        <X size={40} />
      </button>

      <h1 className="text-2xl font-semibold mb-6 text-gray-700">Thêm danh mục</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Tên danh mục</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-blue-500"
            placeholder="Nhập tên danh mục"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Hình ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {preview && (
          <div className="mt-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded border"
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Thêm danh mục
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
