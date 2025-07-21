// src/components/user/ListProduct.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import ProductCard from "./ProductCard";

const ListProduct = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!selectedCategory || selectedCategory === "") {
          const res = await axiosInstance.get("/api/product");
          setProducts(res.data);
        } else {
          const res = await axiosInstance.get("/api/product?cate=" + selectedCategory);
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      }
    };
    fetch();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {selectedCategory ? "Sản phẩm theo danh mục" : "Tất cả sản phẩm"}
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
