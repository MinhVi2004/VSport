import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import {Check} from "lucide-react"

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    detail: "",
    isDefault: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchAddresses = async () => {
    const res = await axios.get("/api/address");
    setAddresses(res.data);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`/api/address/${editId}`, form);
    } else {
      await axios.post("/api/address", form);
    }
    resetForm();
    fetchAddresses();
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      await axios.delete(`/api/address/${id}`);
      fetchAddresses();
    }
  };

  const handleEdit = (address) => {
    setForm(address);
    setEditId(address._id);
    setIsEdit(true);
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      phoneNumber: "",
      province: "",
      district: "",
      ward: "",
      detail: "",
      isDefault: false,
    });
    setIsEdit(false);
    setEditId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Quản lý địa chỉ giao hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Danh sách địa chỉ */}
        <div className="space-y-4">
          {addresses.length === 0 && <p className="text-gray-500">Chưa có địa chỉ nào.</p>}
          {addresses.map((address) => (
            <div
              key={address._id}
              className="p-4 bg-gray-100 rounded shadow flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{address.fullName} - {address.phoneNumber}</p>
                <p className="text-sm text-gray-700">{`${address.detail}, ${address.ward}, ${address.district}, ${address.province}`}</p>
                {address.isDefault && (
                  <span className="inline-block mt-1 text-green-600 text-xs">[Mặc định]</span>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form địa chỉ */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-medium">{isEdit ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</h3>
          <input
            placeholder="Họ tên người nhận"
            className="w-full border p-2 rounded"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            placeholder="Số điện thoại"
            className="w-full border p-2 rounded"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Tỉnh / Thành phố"
              className="border p-2 rounded"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              required
            />
            <input
              placeholder="Quận / Huyện"
              className="border p-2 rounded"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              required
            />
            <input
              placeholder="Phường / Xã"
              className="border p-2 rounded col-span-2"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              required
            />
            <input
              placeholder="Số nhà, tên đường"
              className="border p-2 rounded col-span-2"
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              required
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
  {/* Hidden checkbox dùng peer để điều khiển div bên cạnh */}
  <input
    type="checkbox"
    checked={form.isDefault}
    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
    className="sr-only peer"
  />
  
  {/* Hộp checkbox hiển thị icon khi được chọn */}
  <div className="w-5 h-5 rounded border border-gray-400 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition">
    <Check className="w-4 h-4 text-white peer-checked:block hidden" />
  </div>

  <span>Đặt làm địa chỉ mặc định</span>
</label>
          <div className="flex gap-2 justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              {isEdit ? "Cập nhật" : "Thêm địa chỉ"}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
