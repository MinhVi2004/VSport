const ProductList = ({ products, addToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-md overflow-hidden border shadow-sm flex flex-col"
        >
          <div className="aspect-square bg-white">
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 p-3">
            <div>
              <h2 className="text-md font-medium text-gray-800 line-clamp-2">
                {product.name}
              </h2>
              <p className="text-xs text-gray-500">{product.category.name}</p>
              <p className="text-md font-semibold text-blue-600 mt-1">
                {product.price.toLocaleString()} ₫
              </p>
            </div>
            <button
              className="bg-blue-500 text-white w-full mt-3 py-2 rounded hover:bg-blue-600"
              onClick={() => addToCart(product)}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
