import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const ListBanner = () => {
      const [banners, setBanners] = useState([]);
      const navigate = useNavigate(); // Hook để điều hướng
      const [isFull, setIsFull] = useState(false); // Trạng thái để kiểm tra xemĐã đủ 6 banner hay chưa

      const fetchBanners = async () => {
            try {
                  const res = await axiosInstance.get('/api/banner');
                  setBanners(res.data);
            } catch (err) {
                  console.error('Lỗi khi lấy danh sách banner:', err);
            }
      };

      useEffect(() => {
            fetchBanners();
      }, []);

      useEffect(() => {
            if (banners.length >= 6) {
                  setIsFull(true);
            } else {
                  setIsFull(false);
            }
      }, [banners]);

      const handleAdd = () => {
            if (isFull) {
                  return toast.info('Đã đủ 6 banner, không thể thêm nữa!');
            }
            navigate('/admin/banner/add');
      };
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
                        await axiosInstance.delete(`api/banner/${id}`);
                        toast.success('Xoá banner thành công');
                        fetchBanners();
                  } catch (err) {
                        console.error('Lỗi khi xoá banner:', err);
                        toast.error('Xoá thất bại!');
                  }
            }
      };

      return (
            <div className="p-6 max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Danh sách Banner</h2>
                        <button
                              onClick={handleAdd}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 flex items-center"
                        >
                              <Plus className="mr-2" />
                              Banner
                        </button>
                  </div>

                  <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100 text-gray-700 text-left">
                              <tr>
                                    <th className="px-6 py-3 border-b">Ảnh</th>
                                    <th className="px-6 py-3 border-b">
                                          Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 border-b">#</th>
                              </tr>
                        </thead>
                        <tbody>
                              {banners.length === 0 && (
                                    <tr>
                                          <td
                                                colSpan="3"
                                                className="text-center py-6 text-gray-500"
                                          >
                                                Không có banner nào.
                                          </td>
                                    </tr>
                              )}
                              {banners.map(ban => (
                                    <tr
                                          key={ban._id}
                                          onClick={() =>
                                                navigate(
                                                      `/admin/banner/update/${ban._id}`
                                                )
                                          }
                                          className="hover:bg-gray-50 cursor-pointer transition"
                                    >
                                          <td className="px-6 py-4 border-b">
                                                <img
                                                      src={ban.image}
                                                      alt={ban.name}
                                                      className="h-24 object-cover rounded-md shadow-sm border"
                                                />
                                          </td>
                                          {/* <td className="px-6 py-4 border-b text-gray-800 font-medium">
                                                {ban.name}
                                          </td> */}
                                          {/* <td className="px-6 py-4 border-b text-gray-800 font-medium mw-40">{ban.description}</td> */}
                                          <td className="px-6 py-4 border-b text-gray-600">
                                                {new Date(
                                                      ban.createdAt
                                                ).toLocaleDateString()}
                                          </td>
                                          <td>
                                                <button
                                                      onClick={e => {
                                                            e.stopPropagation(); // ✅ ngăn click lan ra ngoài
                                                            handleDelete(
                                                                  ban._id
                                                            );
                                                      }}
                                                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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

export default ListBanner;
