import {Plus} from "lucide-react";
const ProductList = ({ products, addToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow hover:shadow-md transition p-3 flex flex-col"
        >
          <div className="aspect-square overflow-hidden rounded">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-2 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-gray-800 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {product.category.name}
              </p>
              <p className="text-blue-600 font-semibold mt-1">
                {product.price.toLocaleString()} ₫
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-center"
                onClick={() => addToCart(product)}
              >
                <Plus className="inline-block mr-2" /> Thêm
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;