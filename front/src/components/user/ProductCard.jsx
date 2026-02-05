import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 group">
      <Link to={`/product/${product._id}`}>
        {/* Hình ảnh sản phẩm với overlay hover */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          {/* Nếu muốn badge sale */}
          {product.discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
          <h2 className="text-md font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h2>
          <div className="mt-2 flex flex-col items-center gap-1">
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.oldPrice.toLocaleString()} đ
              </span>
            )}
            <span className="text-lg font-bold text-blue-600">
              {product.price.toLocaleString()} đ
            </span>
          </div>
          {/* Button hover thêm nếu muốn */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors duration-300">
              Xem chi tiết
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
