import React from 'react';

// Giả sử bạn truyền cart JSON vào props
const CartPage = ({ cart }) => {

  const items = cart?.items || []; // nếu cart hoặc items undefined → dùng mảng rỗng

  const getProductName = item => item.product?.name || item.name || 'Unknown Product';
  const getProductImage = item => item.variant?.image || item.product?.images?.[0]?.url || '/images/default-product.png';
  const getProductPrice = item => {
    if (item.size && item.size.price) return item.size.price;
    if (item.product?.price) return item.product.price;
    if (item.price) return item.price;
    return 0;
  };
  const getProductColor = item => item.variant?.color || '';
  const getProductSize = item => typeof item.size === 'string' ? item.size : item.size?.size || '';
  const totalPrice = items.reduce((sum, item) => sum + getProductPrice(item) * item.quantity, 0);
  const getItemKey = item => item.id || `${item.product?.id || 'null'}-${item.variant?.id || 'null'}-${item.size?.id || item.size || 'null'}`;

  return (
    <div className="cart-page">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      <div className="cart-items space-y-4">
        {items.length > 0 ? (
          items.map(item => (
            <div key={getItemKey(item)} className="flex items-center gap-4 border p-4 rounded">
              <img 
                src={getProductImage(item)} 
                alt={getProductName(item)} 
                className="w-20 h-20 object-cover rounded" 
              />
              <div className="flex-1">
                <h2 className="font-semibold">{getProductName(item)}</h2>
                {getProductColor(item) && <p>Màu: {getProductColor(item)}</p>}
                {getProductSize(item) && <p>Size: {getProductSize(item)}</p>}
                <p>Giá: {getProductPrice(item).toLocaleString()}₫</p>
                <p>Số lượng: {item.quantity}</p>
                <p>Thành tiền: {(getProductPrice(item) * item.quantity).toLocaleString()}₫</p>
              </div>
            </div>
          ))
        ) : (
          <p>Giỏ hàng trống</p>
        )}
      </div>

      <div className="mt-6 text-right font-bold text-xl">
        Tổng cộng: {totalPrice.toLocaleString()}₫
      </div>
    </div>
  );
};


export default CartPage;
