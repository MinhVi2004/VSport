import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square bg-white overflow-hidden">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h2 className="text-md font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h2>
          <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>
          <p className="text-lg font-bold text-blue-600 mt-2">
            {product.price.toLocaleString()} ₫
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
