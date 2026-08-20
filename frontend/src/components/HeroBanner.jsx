import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 0,
    heading: ['Great Shopping', 'Starts Here'],
    subtext: 'Discover amazing products\nat the best prices.',
    cta: 'Shop Now',
    saleTitle: 'Summer Sale',
    saleDiscount: '40%',
    saleSubtext: 'on selected items',
    saleCta: 'Shop Deals',
  },
  {
    id: 1,
    heading: ['New Arrivals', 'Just Dropped'],
    subtext: 'Be the first to shop the\nlatest trends & styles.',
    cta: 'Explore Now',
    saleTitle: 'Flash Deals',
    saleDiscount: '35%',
    saleSubtext: 'for a limited time only',
    saleCta: 'Grab Now',
  },
  {
    id: 2,
    heading: ['Top Brands,', 'Best Prices'],
    subtext: 'Authentic products from\nyour favourite brands.',
    cta: 'Shop Brands',
    saleTitle: 'Weekend Sale',
    saleDiscount: '50%',
    saleSubtext: 'on electronics & fashion',
    saleCta: 'Shop Now',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  const slide = slides[current];

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-4">
      <div className="relative bg-[#EAF3FF] rounded-2xl overflow-hidden min-h-[220px] flex items-stretch">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>

        {/* Main content */}
        <div className="flex flex-1 items-center px-16">
          {/* Left text section */}
          <div className="flex-1 flex flex-col justify-center py-8 pr-4">
            <h1 className="text-[32px] font-extrabold text-gray-900 leading-tight mb-3">
              {slide.heading[0]}
              <br />
              {slide.heading[1]}
            </h1>
            <p className="text-gray-500 text-[14px] leading-relaxed mb-5 whitespace-pre-line">
              {slide.subtext}
            </p>
            <button className="bg-[#0066D6] hover:bg-[#0052B4] text-white font-semibold text-sm px-7 py-2.5 rounded-lg w-fit transition-all active:scale-95 shadow-md shadow-blue-500/20">
              {slide.cta}
            </button>
          </div>

          {/* Center: Product imagery */}
          <div className="flex-1 flex items-end justify-center relative h-[210px]">
            {/* Decorative circles in background */}
            <div className="absolute w-52 h-52 rounded-full bg-white/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-36 h-36 rounded-full bg-blue-200/30 top-4 left-1/4" />

            {/* Sneaker - left */}
            <img
              src="/sneakers.jpg"
              alt="White sneaker"
              className="absolute w-[130px] h-[130px] object-contain bottom-4 left-0 drop-shadow-xl"
              style={{ transform: 'rotate(-8deg)' }}
            />
            {/* Headphones / earbuds - center front */}
            <img
              src="/smartwatch.jpg"
              alt="Smart watch"
              className="absolute w-[150px] h-[150px] object-contain bottom-2 left-1/2 -translate-x-1/2 drop-shadow-2xl z-10"
            />
            {/* Perfume - right */}
            <img
              src="/perfume.jpg"
              alt="Perfume bottle"
              className="absolute w-[110px] h-[130px] object-contain bottom-4 right-0 drop-shadow-xl"
            />
          </div>

          {/* Right: Promo card */}
          <div className="flex-shrink-0 ml-4">
            <div className="bg-[#0052B4] rounded-xl px-6 py-5 text-white w-[180px] flex flex-col gap-1 shadow-lg">
              <p className="text-sm font-medium text-blue-200">{slide.saleTitle}</p>
              <p className="text-[13px] font-medium text-blue-100 mt-0.5">Up to</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-yellow-400">{slide.saleDiscount}</span>
                <span className="text-lg font-bold text-white">OFF</span>
              </div>
              <p className="text-[12px] text-blue-200 leading-tight">{slide.saleSubtext}</p>
              <button className="mt-3 bg-white text-[#0052B4] font-semibold text-xs px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors active:scale-95">
                {slide.saleCta}
              </button>
            </div>
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>

        {/* Pagination dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-5 h-2 bg-[#0066D6]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
