// src/components/user/ListCategory.jsx
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const ListCategory = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  const [trendingItems, setTrendingItems] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("cate");

  const handleSelectCategory = (categoryId) => {
    if (categoryId) {
      navigate(`/?cate=${categoryId}`);
    } else {
      navigate(`/`);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get("/api/category");
        setTrendingItems(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      setShowButtons(contentWidth > containerWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold mb-4">Xu hướng tìm kiếm</h2>

      <div className="relative">
        {showButtons && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div ref={containerRef} className="overflow-x-auto no-scrollbar px-8">
          <div ref={contentRef} className="flex gap-6 w-max">
            <div
              onClick={() => handleSelectCategory("")}
              className={`cursor-pointer flex flex-col items-center ${
                !selectedCategoryId ? "text-blue-600 font-bold" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                All
              </div>
              <span className="mt-2 text-center">Tất cả</span>
            </div>
            {trendingItems.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelectCategory(item._id)}
                className={`flex flex-col items-center cursor-pointer hover:text-blue-600 ${
                  selectedCategoryId === item._id ? "text-blue-600 font-semibold" : ""
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="object-contain h-full" />
                </div>
                <span className="mt-2 text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {showButtons && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ListCategory;
