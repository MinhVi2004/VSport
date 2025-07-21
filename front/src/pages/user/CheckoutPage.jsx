import { useState, useEffect } from 'react';
import axiosInstance from './../../utils/axios';
import { MapPin, Edit, Trash2, CheckCircle, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        province: '',
        district: '',
        ward: '',
        detail: '',
        isDefault: false,
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));

    const fetchAddresses = async () => {
        try {
            const res = await axiosInstance.get('/api/address');
            setAddresses(res.data);
        } catch {
            toast.error('Không thể tải địa chỉ');
        }
    };

    const fetchCart = async () => {
        try {
            const res = await axiosInstance.get('/api/cart');
            if (res.data?.items.length === 0) {
                toast.info('Giỏ hàng trống, vui lòng chọn thêm sản phẩm');
                navigate('/');
                return;
            }
            setCartItems(res.data?.items || []);
        } catch {
            toast.error('Không thể tải giỏ hàng');
        }
    };

    useEffect(() => {
        if (!user) {
            toast.info('Vui lòng đăng nhập');
            navigate('/');
            return;
        }
        console.log('cartitem' + cartItems);
        // if(cartItems.length === 0) {
        //   toast.info('Giỏ hàng trống, vui lòng chọn thêm sản phẩm');
        //   navigate('/');
        //   return;
        // }
        fetchAddresses();
        fetchCart();
    }, []);

    const handleAddressSelect = address => {
        setSelectedAddress(address);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axiosInstance.put(`/api/address/${editId}`, form);
                toast.success('Cập nhật địa chỉ thành công');
            } else {
                await axiosInstance.post('/api/address', form);
                toast.success('Thêm địa chỉ thành công');
            }
            setFormVisible(false);
            resetForm();
            fetchAddresses();
        } catch {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleEdit = address => {
        setForm(address);
        setEditId(address._id);
        setIsEdit(true);
        setFormVisible(true);
    };

    const handleDelete = async id => {
        if (confirm('Xác nhận xóa địa chỉ này?')) {
            await axiosInstance.delete(`/api/address/${id}`);
            fetchAddresses();
        }
    };

    const resetForm = () => {
        setForm({
            fullName: '',
            phoneNumber: '',
            province: '',
            district: '',
            ward: '',
            detail: '',
            isDefault: false,
        });
        setIsEdit(false);
        setEditId(null);
    };

    // const handleConfirm = async () => {
    //     if (!selectedAddress) {
    //         toast.warning('Vui lòng chọn địa chỉ giao hàng');
    //         return;
    //     }
    //     try {
    //         const orderData = {
    //             address: selectedAddress._id,
    //             orderItems: cartItems.map(item => ({
    //                 product: item.product._id,
    //                 variant: item.variant?._id,
    //                 size: item.size,
    //                 quantity: item.quantity,
    //                 price: item.product.price,
    //             })),
    //             totalAmount: totalPrice,
    //             paymentMethod: 'COD', // hoặc thêm dropdown chọn MoMo/PayPal nếu cần
    //         };
    //         const token = sessionStorage.getItem('token');
    //         await axiosInstance.post('/api/order', orderData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         toast.success('Đặt hàng thành công!');
    //         navigate('/'); // hoặc chuyển sang trang lịch sử đơn hàng
    //     } catch (err) {
    //         console.error(err);
    //         toast.error('Đặt hàng thất bại!');
    //     }
    // };
    const handleConfirm = async () => {
        if (!selectedAddress) {
            toast.warning('Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const orderItems = cartItems.map(item => ({
                product: item.product._id,
                variant: item.variant?._id,
                size: item.size,
                quantity: item.quantity,
                price: item.product.price,
            }));

            // Tạo đơn hàng chưa thanh toán
            const createOrderRes = await axiosInstance.post(
                '/api/order',
                {
                    orderItems,
                    address: selectedAddress._id,
                    paymentMethod: "vnpay",
                    totalAmount: 10,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const orderId = createOrderRes.data._id;
            const res = await axiosInstance.post(
                '/api/order/create-vnpay',
                {
                    orderId,
                    totalAmount: 10,
                    orderDesc: 'Thanh toan bang VNPay',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Redirect đến trang hiển thị QR code
            navigate('/payment', { state: { qrUrl: res.data.url } });
        } catch (err) {
            console.error(err);
            toast.error('Tạo mã QR thanh toán thất bại!');
        }
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-[90%] max-w-6xl mx-auto">
            {/* LEFT: Address Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
                    <button
                        onClick={() => {
                            resetForm();
                            setFormVisible(true);
                        }}
                        className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                        <Plus size={18} className="mr-1" /> Thêm địa chỉ
                    </button>
                </div>
                {/* Danh sách địa chỉ */}
                <div className="space-y-4 mt-4">
                    {addresses.map(address => (
                        <div
                            key={address._id}
                            className={`border rounded-sm p-4 cursor-pointer transition-all ${
                                selectedAddress?._id === address._id
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'hover:shadow'
                            }`}
                            onClick={() => handleAddressSelect(address)}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold flex items-center gap-1">
                                    <MapPin
                                        size={16}
                                        className="text-blue-600"
                                    />
                                    {address.fullName}
                                </p>
                                {address.isDefault && (
                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                        Mặc định
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-700">
                                {address.phoneNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                                {address.detail}, {address.ward},{' '}
                                {address.district}, {address.province}
                            </p>

                            <div className="mt-2 flex gap-3 text-sm text-blue-600">
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleEdit(address);
                                    }}
                                    className="flex items-center gap-1 hover:underline"
                                >
                                    <Edit size={16} /> Sửa
                                </button>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(address._id);
                                    }}
                                    className="flex items-center gap-1 hover:underline text-red-500"
                                >
                                    <Trash2 size={16} /> Xoá
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {formVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-sm p-6 w-[95%] max-w-lg shadow-xl relative">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setFormVisible(false);
                                }}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            >
                                ✕
                            </button>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-lg font-semibold text-center">
                                    {isEdit
                                        ? 'Cập nhật địa chỉ'
                                        : 'Thêm địa chỉ mới'}
                                </h3>

                                <input
                                    placeholder="Họ tên"
                                    className="w-full border p-2 rounded"
                                    value={form.fullName}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            fullName: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <input
                                    placeholder="Số điện thoại"
                                    className="w-full border p-2 rounded"
                                    value={form.phoneNumber}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            phoneNumber: e.target.value,
                                        })
                                    }
                                    required
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        placeholder="Tỉnh / TP"
                                        className="border p-2 rounded"
                                        value={form.province}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                province: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <input
                                        placeholder="Quận / Huyện"
                                        className="border p-2 rounded"
                                        value={form.district}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                district: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <input
                                        placeholder="Phường / Xã"
                                        className="border p-2 rounded col-span-2"
                                        value={form.ward}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                ward: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <input
                                        placeholder="Số nhà, đường"
                                        className="border p-2 rounded col-span-2"
                                        value={form.detail}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                detail: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={form.isDefault}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                isDefault: e.target.checked,
                                            })
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600">
                                        <Check className="w-4 h-4 text-white peer-checked:block hidden" />
                                    </div>
                                    <span>Đặt làm địa chỉ mặc định</span>
                                </label>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm();
                                            setFormVisible(false);
                                        }}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        {isEdit ? 'Cập nhật' : 'Thêm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Address Form
        {formVisible && (
          <form onSubmit={handleSubmit} className="mt-4 bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-base font-medium">{isEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
            <input
              placeholder="Họ tên"
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
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Tỉnh / TP"
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
                placeholder="Số nhà, đường"
                className="border p-2 rounded col-span-2"
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
                required
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600">
                <Check className="w-4 h-4 text-white peer-checked:block hidden" />
              </div>
              <span>Đặt làm địa chỉ mặc định</span>
            </label>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {isEdit ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setFormVisible(false);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </form>
        )} */}
            </div>

            {/* RIGHT: Cart Summary */}
            <div className="border rounded-sm p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    Chi tiết đơn hàng
                </h2>
                {cartItems.length === 0 ? (
                    <p>Giỏ hàng trống</p>
                ) : (
                    <>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 border-b pb-4"
                                >
                                    <img
                                        src={item.product.images[0]?.url}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {item.product.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            SL: {item.quantity}
                                        </p>
                                        {item.variant && (
                                            <p className="text-sm text-gray-500">
                                                Biến thể: {item.variant.color} -{' '}
                                                {item.variant.size}
                                            </p>
                                        )}
                                    </div>
                                    <div className="font-bold text-blue-600">
                                        {item.product.price.toLocaleString()}₫
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-right text-lg font-semibold">
                            Tổng tiền:{' '}
                            <span className="text-red-600">
                                {totalPrice.toLocaleString()}₫
                            </span>
                        </div>

                        <button
                            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            onClick={handleConfirm}
                        >
                            <CheckCircle size={20} /> Xác nhận thanh toán
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
