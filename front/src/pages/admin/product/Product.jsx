// src/pages/admin/ListProduct.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const ListProduct = () => {
      const [products, setProducts] = useState([]);
      const navigate = useNavigate();

      const fetchProducts = async () => {
            const res = await axiosInstance.get('api/product');
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
            <div className="p-6 max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                              Danh sách sản phẩm
                        </h2>
                        <button
                              onClick={() => navigate('/admin/product/add')}
                              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
                        >
                              <Plus className="w-5 h-5 mr-2" />
                              Thêm sản phẩm
                        </button>
                  </div>

                  <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100 text-gray-700 text-left">
                              <tr>
                                    <th className="px-6 py-3 border-b">Ảnh</th>
                                    <th className="px-6 py-3 border-b">
                                          Tên sản phẩm
                                    </th>
                                    <th className="px-6 py-3 border-b">
                                          Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 border-b text-center">#</th>
                              </tr>
                        </thead>
                        <tbody>
                              {products.length === 0 && (
                                    <tr>
                                          <td
                                                colSpan="3"
                                                className="text-center py-6 text-gray-500"
                                          >
                                                Không có sản phẩm nào.
                                          </td>
                                    </tr>
                              )}
                              {products.map(pro => (
                                    <tr
                                          key={pro._id}
                                          onClick={() =>
                                                navigate(
                                                      `/admin/product/${pro._id}`
                                                )
                                          }
                                          className="hover:bg-gray-50 cursor-pointer transition"
                                    >
                                          <td className="px-6 py-4 border-b">
                                                <img
                                                     src={pro.images?.[0]?.url || '/default.png'}
                                                      alt={pro.name}
                                                      className="w-20 h-20 object-cover rounded-md shadow-sm border"
                                                />
                                          </td>
                                          <td className="px-6 py-4 border-b text-gray-800 font-medium">
                                                {pro.name}
                                          </td>
                                          {/* <td className="px-6 py-4 border-b text-gray-800 font-medium mw-40">{pro.description}</td> */}
                                          <td className="px-6 py-4 border-b text-gray-600">
                                                {new Date(
                                                      pro.createdAt
                                                ).toLocaleDateString()}
                                          </td>
                                          <td className='text-center'>
                                                <button
                                                      onClick={e => {
                                                            e.stopPropagation(); // ✅ ngăn click lan ra ngoài
                                                            navigate(
                                                                  `/admin/product/variant/${pro._id}`
                                                            )
                                                      }}
                                                      className="bg-blue-600 text-white w-20 py-1 rounded hover:bg-blue-700 mb-1"
                                                >
                                                      Thêm
                                                </button>
                                                <button
                                                      onClick={e => {
                                                            e.stopPropagation(); // ✅ ngăn click lan ra ngoài
                                                            handleDelete(
                                                                  pro._id
                                                            );
                                                      }}
                                                      className="bg-red-600 text-white w-20 py-1 rounded hover:bg-red-700"
                                                >
                                                      Xóa
                                                </button>
                                          </td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>
            </div>
      );
};

export default ListProduct;
