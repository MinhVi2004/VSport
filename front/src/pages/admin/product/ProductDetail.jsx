import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`api/product/detail/${id}`);
        setProduct(res.data);
      } catch (error) {
        toast.error('Không tìm thấy sản phẩm');
        navigate('/admin/product');
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (!product) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">{product.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hình ảnh */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Hình ảnh sản phẩm:</h4>
          <div className="flex gap-2 flex-wrap">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`product-${idx}`}
                className="w-28 h-28 object-cover rounded border"
              />
            ))}
          </div>
          {/* QR Code */}  
{product.qrCodeUrl && (
  <div>
    <h4 className="font-semibold mb-2 text-gray-700">Mã QR sản phẩm:</h4>
    <img
      src={product.qrCodeUrl}
      alt="QR Code"
      className="w-40 h-40 object-contain border rounded p-2"
    />
  </div>
)}

        </div>

        {/* Thông tin */}
        <div className="space-y-2 text-gray-700">
          <p><strong>Mã sản phẩm:</strong> {product._id}</p>
          <p><strong>Mô tả:</strong> {product.description}</p>
          <p><strong>Danh mục:</strong> {product.category?.name || 'Không rõ'}</p>
          <p><strong>Giá:</strong> {product.price.toLocaleString()} đ</p>
          <p><strong>Số lượng:</strong> {product.quantity}</p>
          <p><strong>Biến thể:</strong> {product.hasVariant ? 'Có' : 'Không'}</p>
          <p><strong>Ngày tạo:</strong> {new Date(product.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
        <button
          onClick={() => navigate('/admin/product')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Quay lại danh sách
        </button>

        <button
          onClick={() => navigate(`/admin/product/update/${product._id}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cập nhật sản phẩm
        </button>

        {product.hasVariant && (
          <button
            onClick={() => navigate(`/admin/product/variant/${product._id}`)}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Quản lý biến thể
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
