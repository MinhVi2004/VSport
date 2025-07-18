import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';
import { X, Plus } from 'lucide-react';

const AddVariant = () => {
  const { id: productId } = useParams();

  const [color, setColor] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sizes, setSizes] = useState([{ size: '', quantity: 0, price: 0 }]);
  const [product, setProduct] = useState(null);
  const [editingVariantId, setEditingVariantId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/product/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Lỗi lấy sản phẩm:', err);
        toast.error('Không lấy được dữ liệu sản phẩm');
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = field === 'size' ? value : Number(value);
    setSizes(updated);
  };

  const addSizeRow = () => {
    setSizes([...sizes, { size: '', quantity: 0, price: 0 }]);
  };

  const removeSizeRow = (index) => {
    const updated = sizes.filter((_, i) => i !== index);
    setSizes(updated);
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Bạn có chắc muốn xoá biến thể này?')) return;
    try {
      await axiosInstance.delete(`/api/product/variant/${variantId}`);
      toast.success('Đã xoá biến thể thành công');
      const res = await axiosInstance.get(`/api/product/${productId}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Lỗi xoá biến thể:', error);
      toast.error('Xoá biến thể thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!color || (!image && !editingVariantId) || sizes.length === 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const formData = new FormData();
    formData.append('color', color);
    if (image) formData.append('image', image);
    formData.append('sizes', JSON.stringify(sizes));

    try {
      if (editingVariantId) {
        await axiosInstance.put(
          `/api/product/variant/${productId}/${editingVariantId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Cập nhật biến thể thành công');
      } else {
        await axiosInstance.post(`/api/product/variant/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Thêm biến thể thành công');
      }

      setColor('');
      setImage(null);
      setPreview(null);
      setSizes([{ size: '', quantity: 0, price: 0 }]);
      setEditingVariantId(null);

      const res = await axiosInstance.get(`/api/product/${productId}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Xử lý biến thể thất bại');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thêm biến thể sản phẩm</h1>

      {product?.variants?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Biến thể hiện có</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {product.variants.map((variant, index) => (
              <div key={index} className="bg-white border rounded p-4 shadow-sm relative">
                <button
                  onClick={() => handleDeleteVariant(variant._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Xoá
                </button>
                <button
                  onClick={() => {
                    setColor(variant.color);
                    setPreview(variant.image);
                    setSizes(variant.sizes);
                    setEditingVariantId(variant._id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="absolute top-2 right-14 text-blue-500 hover:underline text-sm"
                >
                  Sửa
                </button>

                <div className="flex gap-4 mb-4 items-center">
                  <img src={variant.image} alt={variant.color} className="w-24 h-24 object-cover rounded border" />
                  <div>
                    <p className="font-semibold">Màu: <span className="text-gray-700">{variant.color}</span></p>
                    <p className="text-sm text-gray-500">Số size: {variant.sizes.length}</p>
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-1">Size</th>
                      <th className="pb-1">Số lượng</th>
                      <th className="pb-1">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variant.sizes.map((s, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td className="py-1">{s.size}</td>
                        <td className="py-1">{s.quantity}</td>
                        <td className="py-1">{s.price.toLocaleString()} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-md border">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Màu sắc</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md"
            placeholder="Ví dụ: Đỏ, Xanh..."
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Hình ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded-md"
            required={!editingVariantId} // bắt buộc nếu tạo mới
          />
          {preview && <img src={preview} className="w-32 h-32 mt-4 object-cover border rounded shadow" />}
        </div>

        <div>
          <label className="block mb-4 text-gray-700 font-semibold">Chi tiết</label>

          <div className="grid grid-cols-3 gap-x-6 text-gray-500 text-sm font-medium mb-2 px-1">
            <div>Size</div>
            <div>Số lượng</div>
            <div>Giá (VNĐ)</div>
          </div>

          <div className="space-y-4">
            {sizes.map((s, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-x-6 items-center">
                <input
                  type="text"
                  value={s.size}
                  placeholder="VD: M, L, XL"
                  onChange={(e) => handleSizeChange(idx, 'size', e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
                <input
                  type="number"
                  value={s.quantity}
                  min={0}
                  onChange={(e) => handleSizeChange(idx, 'quantity', e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
                <input
                  type="number"
                  value={s.price}
                  min={0}
                  onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
                {sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSizeRow(idx)}
                    className="col-span-3 text-red-500 hover:text-red-700 text-md text-right mt-1"
                  >
                    Xoá dòng
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSizeRow}
            className="mt-4 text-blue-600 hover:underline text-sm font-medium flex flex-row"
          >
            <Plus size={20} /> Thêm dòng
          </button>
        </div>

        {editingVariantId && (
          <button
            type="button"
            onClick={() => {
              setEditingVariantId(null);
              setColor('');
              setImage(null);
              setPreview(null);
              setSizes([{ size: '', quantity: 0, price: 0 }]);
            }}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md"
          >
            Huỷ chỉnh sửa
          </button>
        )}

        <button
          type="submit"
          className={`w-full ${editingVariantId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} transition-all duration-200 text-white font-semibold py-3 px-6 rounded-md`}
        >
          {editingVariantId ? 'Cập nhật ' : 'Thêm'}
        </button>
      </form>
    </div>
  );
};

export default AddVariant;