import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";

const UpdateBanner = ({ onDone }) => {
  const { id } = useParams(); // 👈 Lấy ID từ URL
  const [banner, setBanner] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axiosInstance.get(`/api/banner/${id}`);
        setBanner(res.data);
        setPreviewUrl(res.data.image); // ảnh hiện tại
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải banner");
      }
    };

    if (id) {
      fetchBanner();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.info("Bạn chưa chọn ảnh mới");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axiosInstance.put(`/api/banner/${id}`, formData);
      toast.success("Cập nhật banner thành công");
      onDone?.(); // nếu có callback thì gọi
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật banner");
    }
  };

  if (!banner) return <p className="text-gray-500">Đang tải banner...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-6 border rounded bg-white"
    >
      <h3 className="text-xl font-bold text-gray-800">Cập nhật Banner</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border p-2 rounded"
        required
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Xem trước"
          className="w-full h-48 object-cover rounded border"
        />
      )}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Lưu thay đổi
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Quay lại
        </button>
      </div>
    </form>
  );
};

export default UpdateBanner;
