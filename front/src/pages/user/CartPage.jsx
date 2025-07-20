import { useEffect, useState } from 'react';
import axiosInstance from './../../utils/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.info("Vui lòng chọn thêm sản phẩm để tiếp tục");
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.info("Vui lòng đăng nhập để tiếp tục");
      navigate('/signin?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => navigate('/');

  const fetchCart = async () => {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const res = await axiosInstance.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      } catch (err) {
        console.error('Lỗi tải giỏ hàng', err);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const mergedCart = [];

      localCart.forEach(item => {
        const key = `${item.product}-${item.size}`;
        const existing = mergedCart.find(i => `${i.product}-${i.size}` === key);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          mergedCart.push({ ...item });
        }
      });

      try {
        const detailedItems = await Promise.all(
          mergedCart.map(async item => {
            const res = await axiosInstance.get(`/api/product/${item.product}`);
            const product = res.data;
            const matchedSize = product.sizes?.find(s => s.size === item.size);
            const size = matchedSize || {
              size: item.size,
              price: product.price,
            };

            return {
              _id: `${item.product}-${item.size}`,
              product,
              size,
              quantity: item.quantity,
            };
          })
        );
        setCart({ items: detailedItems });
      } catch (err) {
        console.error('Lỗi tải sản phẩm từ local cart', err);
      }
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    const token = sessionStorage.getItem('token');

    if (token) {
      await axiosInstance.put('/api/cart', { itemId, quantity: newQty });
    } else {
      const [productId, size] = itemId.split('-');
      let cartData = JSON.parse(localStorage.getItem('cart')) || [];

      cartData = cartData.map(item =>
        item.product === productId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      );

      localStorage.setItem('cart', JSON.stringify(cartData));
    }

    fetchCart(); // sau khi update, cập nhật lại
  };

  const removeItem = async (itemId) => {
    const confirm = await Swal.fire({
      title: 'Xóa sản phẩm',
      text: 'Bạn có chắc chắn muốn bỏ sản phẩm khỏi giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
    });

    if (!confirm.isConfirmed) return;

    const token = sessionStorage.getItem('token');

    if (token) {
      await axiosInstance.delete(`/api/cart/${itemId}`);
    } else {
      const [productId, size] = itemId.split('-');
      let cartData = JSON.parse(localStorage.getItem('cart')) || [];

      cartData = cartData.filter(
        item => !(item.product === productId && item.size === size)
      );

      localStorage.setItem('cart', JSON.stringify(cartData));
    }

    fetchCart(); // sau khi xóa, cập nhật lại
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.items.reduce((sum, item) => {
    const price = item.size?.price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Danh sách sản phẩm */}
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
        {cart.items.length === 0 ? (
          <p>Chưa có sản phẩm nào trong giỏ.</p>
        ) : (
          cart.items.map(item => (
            <div
              key={item._id}
              className="flex gap-4 items-center p-4 border shadow-sm cursor-pointer rounded-sm"
            >
              <img
                src={item.product.images[0].url}
                alt={item.product.name}
                className="w-20 h-20 object-cover"
                onClick={() => navigate(`/product/${item.product._id}`)}
              />
              <div className="flex-1" onClick={() => navigate(`/product/${item.product._id}`)}>
                <h2 className="font-semibold">{item.product.name}</h2>
                {item.size && (
                  <p className="text-sm text-gray-500">
                    Kích thước: {item.size.size}
                  </p>
                )}
                <p className="text-red-600 font-medium">
                  {(item.size?.price || item.product.price).toLocaleString()}đ
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 bg-gray-200"
                  onClick={() =>
                    updateQuantity(item._id, Math.max(1, item.quantity - 1))
                  }
                >
                  <Minus size={18} />
                </button>
                <span>{item.quantity}</span>
                <button
                  className="p-1 bg-gray-200"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                className="text-red-500 ml-4 hover:underline"
                onClick={() => removeItem(item._id)}
              >
                Xoá
              </button>
            </div>
          ))
        )}
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="border p-6 shadow-md h-fit rounded-sm">
        <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
        <div className="flex justify-between mb-2">
          <span>Tạm tính:</span>
          <span>{total.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
          <span>Tổng cộng:</span>
          <span className="text-red-600">{total.toLocaleString()}đ</span>
        </div>

        <div className="mt-6 space-y-2">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-sm"
            onClick={handleCheckout}
          >
            Tiến hành đặt hàng
          </button>
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-sm"
            onClick={handleContinueShopping}
          >
            Chọn thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
