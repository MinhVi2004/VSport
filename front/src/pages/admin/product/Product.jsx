// src/pages/admin/ListProduct.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// Lucide icons
import {  Layers, Trash2, Plus } from 'lucide-react';

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        const res = await axiosInstance.get('/api/product');
        setProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async id => {
        const confirm = await Swal.fire({
            title: 'Xác nhận xoá',
            text: 'Bạn có chắc chắn muốn xoá?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        });

        if (confirm.isConfirmed) {
            try {
                await axiosInstance.delete(`api/product/${id}`);
                toast.success('Xoá sản phẩm thành công');
                fetchProducts();
            } catch (err) {
                console.error('Lỗi khi xoá sản phẩm:', err);
                toast.error('Xoá thất bại!');
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
                    Danh sách sản phẩm
                </h2>

                <button
                    onClick={() => navigate('/admin/product/add')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Thêm sản phẩm mới
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-gray-700 text-sm">
                        <tr>
                            <th className="px-6 py-3 text-left">Ảnh</th>
                            <th className="px-6 py-3 text-left">
                                Tên sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left">Ngày tạo</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 && (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    Không có sản phẩm nào.
                                </td>
                            </tr>
                        )}
                        {products.map(pro => (
                            <tr
                                key={pro._id}
                                onClick={() =>
                                    navigate(`/admin/product/${pro._id}`)
                                }
                                className="hover:bg-gray-50 transition cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <img
                                        src={
                                            pro.images?.[0]?.url ||
                                            '/default.png'
                                        }
                                        alt={pro.name}
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {pro.name}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {/* <Calendar
                                        size={16}
                                        className="text-gray-500"
                                    /> */}
                                    {new Date(
                                        pro.createdAt
                                    ).toLocaleDateString()}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col gap-2 items-center">
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                navigate(
                                                    `/admin/product/variant/${pro._id}`
                                                );
                                            }}
                                            className="bg-green-500 text-white px-3 py-1 min-w-36 rounded-md flex items-center gap-1 hover:bg-green-700 transition"
                                        >
                                            <Layers size={16} />
                                            Thêm biến thể
                                        </button>
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDelete(pro._id);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 min-w-36 rounded-md flex items-center justify-center gap-1 hover:bg-red-700 transition"
                                        >
                                            <Trash2 size={16} />
                                            Xoá
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListProduct;
