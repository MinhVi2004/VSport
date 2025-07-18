import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/banner');
        setSlides(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy banner:', err);
      }
    };
    fetchSlides();
  }, []);

  // Tự động chạy mỗi 5s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full max-w-screen-xl mx-auto overflow-hidden">
      {/* Slide wrapper */}
      <div className="relative h-[40vh] sm:h-[60vh]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-20"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-20"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full ${
              index === current ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
