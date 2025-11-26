import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ListCategory = () => {
      const [categories, setCategories] = useState([]);
      const navigate = useNavigate();
      const fetchCategories = async () => {
            try {
                  const res = await axiosInstance.get('/api/category');
                  setCategories(res.data);
            } catch (err) {
                  console.error('Lỗi khi lấy danh sách danh mục:', err);
            }
      };

      useEffect(() => {
            fetchCategories();
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
                        await axiosInstance.delete(`api/category/${id}`);
                        toast.success("Xoá danh mục thành công");
                        fetchCategories();
                  } catch (err) {
                        console.error('Lỗi khi xoá danh mục:', err);
                        toast.error('Xoá thất bại!');
                  }
            }
      };
      return (
            <div className="p-6 max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                              Danh sách danh mục
                        </h2>
                        <button
                              onClick={() => navigate('/admin/category/add')}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                        >
                              <Plus />
                              Danh mục
                        </button>
                  </div>

                  <div className="overflow-x-auto shadow-md rounded-lg bg-white">
                        <table className="min-w-full border-collapse">
                              <thead className="bg-gray-100 text-gray-700 text-left">
                                    <tr>
                                          <th className="px-6 py-3 border-b">
                                                Ảnh
                                          </th>
                                          <th className="px-6 py-3 border-b">
                                                Tên danh mục
                                          </th>
                                          <th className="px-6 py-3 border-b">
                                                Ngày tạo
                                          </th>
                                          <th className="px-6 py-3 border-b">
                                                #
                                          </th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {categories.map(cat => (
                                          <tr
                                                key={cat._id}
                                                onClick={() =>
                                                      navigate(
                                                            `/admin/category/update/${cat._id}`
                                                      )
                                                }
                                                className="hover:bg-gray-50 cursor-pointer transition"
                                          >
                                                <td className="px-6 py-4 border-b">
                                                      <img
                                                            src={cat.image}
                                                            alt={cat.name}
                                                            className="w-16 h-16 object-cover rounded-md shadow-sm border"
                                                      />
                                                </td>
                                                <td className="px-6 py-4 border-b text-gray-800 font-medium">
                                                      {cat.name}
                                                </td>
                                                <td className="px-6 py-4 border-b text-gray-600">
                                                      {new Date(
                                                            cat.createdAt
                                                      ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                      <button
                                                            onClick={ e => {
                                                                        e.stopPropagation(); // ✅ ngăn click lan ra ngoài
                                                                        handleDelete(
                                                                              cat._id
                                                                        );
                                                                  }}
                                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                                      >
                                                            Xóa
                                                      </button>
                                                </td>
                                          </tr>
                                    ))}
                                    {categories.length === 0 && (
                                          <tr>
                                                <td
                                                      colSpan="3"
                                                      className="text-center py-6 text-gray-500"
                                                >
                                                      Không có danh mục nào.
                                                </td>
                                          </tr>
                                    )}
                              </tbody>
                        </table>
                  </div>
            </div>
      );
};

export default ListCategory;
