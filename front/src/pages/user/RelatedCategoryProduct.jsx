// src/components/RelatedCategoryProduct.jsx
import { Link } from 'react-router-dom';
import ProductCard from '../../components/user/ProductCard';

const RelatedCategoryProduct = ({ products, currentProductId }) => {
  if (!products || products.length === 0) return null;

  const filtered = products.filter(p => p._id !== currentProductId);

  if (filtered.length === 0) return null;

  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-xl font-bold mb-4">Có thể bạn cũng thích</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedCategoryProduct;
