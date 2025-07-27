import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const ListCategory = () => {
  const containerRef = useRef(null);
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

  // Kiểm tra khi resize
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;
      const isOverflowing =
        containerRef.current.scrollWidth > containerRef.current.clientWidth;
      setShowButtons(isOverflowing);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // Kiểm tra lại sau khi dữ liệu danh mục thay đổi
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;
      const isOverflowing =
        containerRef.current.scrollWidth > containerRef.current.clientWidth;
      setShowButtons(isOverflowing);
    }, 100);

    return () => clearTimeout(timeout);
  }, [trendingItems]);

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Xu hướng tìm kiếm</h2>

      <div className="relative">
        {showButtons && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:scale-105 transition"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div
          ref={containerRef}
          className="overflow-x-auto px-10 no-scrollbar scroll-smooth "
        >
          <div className="flex gap-6 w-max transition-all">
            {/* Danh mục tất cả */}
            <div
              onClick={() => handleSelectCategory("")}
              className={`cursor-pointer flex flex-col items-center min-w-[90px] 
                ${!selectedCategoryId ? "text-blue-600 font-semibold" : "text-gray-600"} 
                hover:text-blue-500 transition`}
            >
              <div
                className={`w-20 h-20 rounded-full border-2 
                  flex items-center justify-center 
                  text-blue-600 text-sm font-bold
                  shadow-sm
                  ${!selectedCategoryId ? "bg-blue-100 border-blue-500" : "bg-gray-100 border-transparent"} 
                  hover:ring-2 hover:ring-blue-300 transition`}
              >
                All
              </div>
              <span className="mt-2 text-sm text-center">Tất cả</span>
            </div>

            {/* Danh mục từng item */}
            {trendingItems.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelectCategory(item._id)}
                className={`flex flex-col items-center cursor-pointer min-w-[90px] 
                  ${
                    selectedCategoryId === item._id
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600"
                  } hover:text-blue-500 transition`}
              >
                <div
                  className={`w-20 h-20 rounded-full border-2 overflow-hidden 
                    flex items-center justify-center shadow-sm bg-white
                    ${
                      selectedCategoryId === item._id
                        ? "border-blue-500 ring-2 ring-blue-300"
                        : "border-transparent"
                    } hover:scale-105 transition`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain h-16 w-16"
                  />
                </div>
                <span className="mt-2 text-sm text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {showButtons && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:scale-105 transition"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ListCategory;
