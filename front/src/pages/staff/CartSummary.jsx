const CartSummary = ({ cartItems, totalAmount }) => {
  const handleCheckout = async () => {
    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const res = await axios.post("/api/order", {
      orderItems,
      address: "ID_địa_chỉ_mặc_định", // cần truyền ID address
      paymentMethod: "COD",
      totalAmount,
    });

    alert("Đặt hàng thành công!");
    window.location.reload();
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold mb-2">Giỏ hàng</h2>
        <ul className="space-y-2">
          {cartItems.map((item, idx) => (
            <li key={idx} className="flex justify-between border-b py-1">
              <span>{item.product.name} x {item.quantity}</span>
              <span>{(item.quantity * item.price).toLocaleString()}đ</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="text-lg font-bold mb-2">
          Tổng: {totalAmount.toLocaleString()}đ
        </div>
        <button
          className="w-full bg-green-500 text-white py-2 rounded"
          onClick={handleCheckout}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
