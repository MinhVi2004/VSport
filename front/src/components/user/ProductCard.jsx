import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-md overflow-hidden border">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square bg-white">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-2">
          <h2 className="text-md font-medium text-gray-800 line-clamp-2">
            {product.name}
          </h2>
          <p className="text-xs text-gray-400">{product.category.name}</p>
          <p className="text-md font-semibold text-blue-600 mt-1">
            {product.price.toLocaleString() } ₫
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
