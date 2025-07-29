import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/api/category');
                setCategories(res.data);
            } catch (error) {
                console.error('Không load được danh mục:', error);
                toast.error('Không thể tải danh mục!');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleAddSingleImage = e => {
        if (images.length >= 10) {
            toast.error('Chỉ thêm tối đa 10 ảnh cho 1 sản phẩm.');
            return;
        }
        const file = e.target.files[0];
        if (file) {
            setImages(prev => [...prev, file]);
            setPreviewImages(prev => [...prev, URL.createObjectURL(file)]);
        }
    };
    const handleRemoveImage = index => {
        const newImages = [...images];
        const newPreviews = [...previewImages];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (images.length === 0) {
            return toast.error('Phải chọn ít nhất 1 ảnh!');
        }

        const formData = new FormData();
        formData.append('data', JSON.stringify(form));

        images.forEach(img => {
            formData.append('images', img);
        });

        try {
            await axiosInstance.post('/api/product', formData);
            toast.success('Thêm sản phẩm thành công');
            navigate('/admin/product');
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi thêm sản phẩm');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Thêm sản phẩm</h2>
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
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Giá "
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
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

                <label className="font-semibold">Thêm ảnh sản phẩm:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddSingleImage}
                    className="w-full p-2 border rounded"
                />

                <div className="flex flex-wrap gap-2 mt-2">
                    {previewImages.map((src, idx) => (
                        <div key={idx} className="relative">
                            <img
                                src={src}
                                alt={`Ảnh ${idx + 1}`}
                                className="w-32 h-32 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs"
                                title="Xoá"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
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

export default AddProduct;
