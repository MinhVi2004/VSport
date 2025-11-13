import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
    const [cart, setCart] = useState({ items: [] });
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('token');

    useEffect(() => {
        fetchCart();
    }, []);
    const handleCheckout = () => {
        if (cart.items.length === 0) {
            toast.info('Vui lòng chọn thêm sản phẩm để tiếp tục');
            return;
        }

        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.info('Vui lòng đăng nhập để tiếp tục');
            navigate('/signin?redirect=/cart');
        } else {
            navigate('/checkout');
        }
    };
    const handleContinueShopping = () => navigate('/');
    const fetchCart = async () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const res = await axiosInstance.get('/api/cart');
                setCart(res.data);
            } catch (err) {
                console.error('Lỗi tải giỏ hàng', err);
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCart({ items: localCart });
        }
    };

    const getItemId = item => {
        const productId = item.product._id;
        const size = getProductSize(item);
        const variant = item.variant?.color || item.color || 'default';
        return isLoggedIn ? item._id : `${productId}-${variant}-${size}`;
    };

    const getProductName = item => item.product?.name || item.name;
    const getProductImage = item =>
        item.variant?.image || item.product?.images?.[0]?.url;
    const getProductPrice = item =>
        item.size?.price || item.product?.price || item.price || 0;
    const getProductSize = item =>
        typeof item.size === 'string' ? item.size : item.size?.size || '';
    const getProductColor = item => item.variant?.color || item.color || '';

    const updateQuantity = async (itemId, newQty) => {
        const token = sessionStorage.getItem('token');

        if (token) {
            await axiosInstance.put('/api/cart', { itemId, quantity: newQty });
        } else {
            const [productId, color, size] = itemId.split('-');
            let cartData = JSON.parse(localStorage.getItem('cart')) || [];

            cartData = cartData.map(item => {
                const match =
                    item.product._id === productId &&
                    getProductSize(item) === size &&
                    getProductColor(item) === color;

                return match ? { ...item, quantity: newQty } : item;
            });

            localStorage.setItem('cart', JSON.stringify(cartData));
        }

        fetchCart();
    };

    const removeItem = async itemId => {
        const confirm = await Swal.fire({
            title: 'Xoá sản phẩm?',
            text: 'Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ',
        });

        if (!confirm.isConfirmed) return;

        const token = sessionStorage.getItem('token');

        if (token) {
            await axiosInstance.delete(`/api/cart/${itemId}`);
        } else {
            const [productId, color, size] = itemId.split('-');
            let cartData = JSON.parse(localStorage.getItem('cart')) || [];

            cartData = cartData.filter(
                item =>
                    !(
                        item.product._id === productId &&
                        getProductSize(item) === size &&
                        getProductColor(item) === color
                    )
            );

            localStorage.setItem('cart', JSON.stringify(cartData));
        }

        fetchCart();
    };

    const total = (cart.items || []).reduce(
        (sum, item) => sum + getProductPrice(item) * item.quantity,
        0
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h1>

                {cart.items.length === 0 ? (
                    <div className="text-gray-500">
                        Bạn chưa có sản phẩm nào trong giỏ hàng.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.items.map(item => {
                            const itemId = getItemId(item);
                            const productId = item.product?._id || item.product;

                            return (
                                <div
                                    key={itemId}
                                    className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4"
                                >
                                    <img
                                        src={getProductImage(item)}
                                        alt={getProductName(item)}
                                        className="w-20 h-20 object-cover rounded cursor-pointer"
                                        onClick={() =>
                                            navigate(`/product/${productId}`)
                                        }
                                    />
                                    <div className="flex-1">
                                        <h2
                                            className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${productId}`
                                                )
                                            }
                                        >
                                            {getProductName(item)}
                                        </h2>
                                        {(getProductColor(item) ||
                                            getProductSize(item) !==
                                                'default') && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {getProductColor(item)}{' '}
                                                {getProductSize(item) &&
                                                    `- ${getProductSize(item)}`}
                                            </p>
                                        )}
                                        <p className="text-red-600 font-bold mt-1">
                                            {getProductPrice(
                                                item
                                            ).toLocaleString()}
                                            đ
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                            onClick={() =>
                                                updateQuantity(
                                                    itemId,
                                                    Math.max(
                                                        1,
                                                        item.quantity - 1
                                                    )
                                                )
                                            }
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="px-2">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                            onClick={() =>
                                                updateQuantity(
                                                    itemId,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700 transition ml-4"
                                        onClick={() => removeItem(itemId)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="bg-white p-6 shadow-md rounded-lg h-fit">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                <div className="flex justify-between text-gray-700 mb-2">
                    <span>Tạm tính</span>
                    <span>{total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-4 mt-4">
                    <span>Tổng cộng</span>
                    <span className="text-red-600">
                        {total.toLocaleString()}đ
                    </span>
                </div>
                <div className="mt-6 space-y-2">
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                        onClick={handleCheckout}
                    >
                        Tiến hành đặt hàng
                    </button>
                    <button
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
                        onClick={handleContinueShopping}
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
