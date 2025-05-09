
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1470&q=80",
    title: "اكتشف أفضل الفنادق في اليمن",
    subtitle: "تمتع بإقامة مريحة وتجربة لا تنسى"
  },
  {
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1632&q=80",
    title: "أفضل العروض والأسعار",
    subtitle: "احجز الآن واحصل على خصومات حصرية"
  },
  {
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1470&q=80",
    title: "حجز سهل وآمن",
    subtitle: "نظام حجز سريع وموثوق لراحتك"
  }
];

const HomeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-black/40" />
          <img
            src={slide.image}
            alt={slide.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
            <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Search Bar */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
        <SearchBar />
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white"
        aria-label="السابق"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white"
        aria-label="التالي"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`انتقل إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeHero;
