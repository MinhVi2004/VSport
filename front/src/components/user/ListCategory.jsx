import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

import axiosInstance from '../../utils/axios'; // Adjust the path as necessary

const ListCategory = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  const [trendingItems, setTrendingItems] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get("api/category");
        setTrendingItems(res.data.map(cat => ({
          name: cat.name,
          img: cat.image || '/images/default_category.png', // Giả sử có trường image trong category
        })));
      }
      catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategory();
  }, []);
  // Kiểm tra xem có cần hiển thị nút không
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      setShowButtons(contentWidth > containerWidth);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold mb-4">Xu hướng tìm kiếm</h2>

      <div className="relative">
  {/* Nút cuộn trái */}
  {showButtons && (
    <button
      onClick={() => scroll('left')}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
    >
      <ChevronLeft size={24} />
    </button>
  )}

  {/* Danh sách cuộn */}
  <div
    ref={containerRef}
    className="overflow-x-auto no-scrollbar scroll-smooth px-8"
  >
    <div
      ref={contentRef}
      className="flex gap-6 w-max"
    >
      {trendingItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center text-sm min-w-[80px]">
          <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            <img src={item.img} alt={item.name} className="object-contain h-full" />
          </div>
          <span className="mt-2 text-center">{item.name}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Nút cuộn phải */}
  {showButtons && (
    <button
      onClick={() => scroll('right')}
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
