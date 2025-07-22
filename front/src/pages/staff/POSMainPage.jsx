import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import CartSummary from "./CartSummary";
import QRScanner from "./QRScanner";
import axiosInstance from "./../../utils/axios";

const POSMainPage = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axiosInstance.get("/api/product");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setTotalAmount(total);
  }, [cartItems]);

  const addToCart = (product) => {
    const existing = cartItems.find(
      (item) => item.product._id === product._id
    );
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { product, quantity: 1, price: product.price }]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Bên trái: Danh sách sản phẩm (70%) */}
      <div className="w-[70%] border-r overflow-y-auto p-4">
        <ProductList products={products} addToCart={addToCart} />
      </div>

      {/* Bên phải: Giỏ hàng + Thông tin đơn hàng (30%) */}
      <div className="w-[30%] flex flex-col justify-between p-4 relative">
        {/* QR Scanner cố định */}
        <div className="absolute top-4 right-4 w-40 h-40 z-10">
          <QRScanner onProductScanned={addToCart} />
        </div>

        <CartSummary cartItems={cartItems} totalAmount={totalAmount} />
      </div>
    </div>
  );
};

export default POSMainPage;
