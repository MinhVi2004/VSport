import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
    });

    const [images, setImages] = useState([]); // file images mới
    const [previewImages, setPreviewImages] = useState([]); // preview url
    // const [oldImages, setOldImages] = useState([]); // từ server

    // Get product data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    axiosInstance.get('/api/category'),
                    axiosInstance.get(`/api/product/${id}`),
                ]);
                setCategories(catRes.data);

                const { name, description, category, price, quantity, images } =
                    prodRes.data;

                setForm({
                    name,
                    description,
                    category: category?._id || '',
                    price,
                    quantity,
                });

                const previewsFromServer = (images || []).map(img => ({
                    url: img.url,
                    isOld: true, // để phân biệt khi gửi form nếu cần
                }));

                setPreviewImages(previewsFromServer);
            } catch (error) {
                toast.error('Không tìm thấy sản phẩm');
                navigate('/admin/product');
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddImage = e => {
        if (previewImages.length >= 10) {
            return toast.error('Chỉ tối đa 10 ảnh');
        }

        const file = e.target.files[0];
        if (file) {
            setImages(prev => [...prev, file]);
            setPreviewImages(prev => [
                ...prev,
                { url: URL.createObjectURL(file), isOld: false },
            ]);
        }
    };

    const handleRemoveImage = index => {
        const removed = previewImages[index];
        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);

        // Nếu ảnh bị xoá là ảnh mới (chưa upload)
        if (!removed.isOld) {
            const newImages = [...images];
            const fileIndex = previewImages
                .filter(img => !img.isOld)
                .indexOf(removed);
            if (fileIndex !== -1) {
                newImages.splice(fileIndex, 1);
                setImages(newImages);
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append(
            'data',
            JSON.stringify({
                ...form,
                keepOldImages: previewImages
                    .filter(img => img.isOld)
                    .map(img => img.url), // Gửi URL của ảnh cũ còn giữ
            })
        );

        images.forEach(img => {
            formData.append('images', img); // Ảnh mới
        });

        try {
            await axiosInstance.put(`/api/product/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Cập nhật sản phẩm thành công');
            navigate(`/admin/product/${id}`);
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi cập nhật sản phẩm');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tên sản phẩm"
                    required
                    className="w-full p-2 border rounded"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả sản phẩm"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    type="number"
                    placeholder="Giá gốc sản phẩm"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    type="number"
                    placeholder="Số lượng"
                    required
                    className="w-full p-2 border rounded"
                />
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* <div>
                              <label className="font-semibold">
                                    Ảnh sản phẩm hiện tại:
                              </label>
                              <div className="flex gap-2 flex-wrap">
                                    {oldImages.map((img, idx) => (
                                          <img
                                                key={idx}
                                                src={img.url}
                                                alt={`old-img-${idx}`}
                                                className="w-20 h-20 object-cover border rounded"
                                          />
                                    ))}
                              </div>
                        </div> */}

                <div>
                    <label className="font-semibold mt-4">Thêm ảnh mới:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddImage}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {previewImages.map((img, idx) => (
                            <div key={idx} className="relative">
                                <img
                                    src={img.url}
                                    alt={`preview-${idx}`}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/product')}
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                        Trở về
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Lưu sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;
