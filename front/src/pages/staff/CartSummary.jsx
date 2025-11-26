import axiosInstance from "./../../utils/axios";
import { toast } from "react-toastify";
import { CheckCircle, ShoppingBasket } from "lucide-react";

const CartSummary = ({ cartItems, totalAmount }) => {
  const handleCheckout = async () => {
  if (cartItems.length === 0) return toast.error("Giỏ hàng trống!");

  const orderItems = cartItems.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.price,
  }));

  try {
    await axiosInstance.post("/api/staff", {
      orderItems,
      paymentMethod: "COD_IN_STORE",
      isPaid:true,
      totalAmount,
      status: "Hoàn thành",
    });

    toast.success("Tạo đơn hàng thành công!");
    setTimeout(() => {
      window.location.reload(); 
    }, 1700);
  } catch (error) {
    console.error(error);
    const message =
      error.response?.data?.message || "Đã xảy ra lỗi khi tạo đơn hàng!";
    toast.error(message);
  }
};


  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-4 flex gap-2 items-center">
          <ShoppingBasket /> Giỏ hàng
        </h2>

        <ul className="divide-y space-y-4">
          {cartItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 border p-2 rounded-md shadow-sm bg-white"
            >
              <img
                src={item.product.images?.[0]?.url || "/default.jpg"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-gray-500">
                  đơn giá: {item.price.toLocaleString()} đ
                </div>
                <div className="text-sm text-gray-500">
                  Số lượng: {item.quantity}
                </div>
              </div>
              <div className="text-right font-semibold text-green-700">
                {(item.quantity * item.price).toLocaleString()} đ
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <div className="text-lg font-bold mb-3 text-right">
          Tổng cộng: {totalAmount.toLocaleString()} đ
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-center"
            onClick={handleCheckout}
          >
            <CheckCircle className="inline-block mr-2" /> Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
