import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap, Flame, Clock, Star, Store, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 0,
    tag: '⚡ Mega Flash Sale',
    tagBg: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    title: 'Smart Shopping Across Ethiopia',
    subtitle: 'Electronics, handcrafted leather, and authentic fashion with 24h Addis delivery.',
    cta: 'Shop Mega Deals',
    ctaLink: '/products?deals=true',
    discountBadge: 'Up to 45% OFF',
    bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
    accentGlow: 'bg-blue-600/25',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    itemTitle: 'Studio ANC Wireless Headphones',
    price: 'ETB 3,200',
    originalPrice: 'ETB 4,800',
    rating: '4.9',
  },
  {
    id: 1,
    tag: '🔥 Tech & Wearables',
    tagBg: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    title: 'Top Gadgets & Smart Wearables',
    subtitle: '100% genuine tech gear, smart watches, and accessories with local store warranty.',
    cta: 'Explore Tech',
    ctaLink: '/products?category=Electronics',
    discountBadge: 'Save ETB 900',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    accentGlow: 'bg-indigo-600/25',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    itemTitle: 'Smart Health & Fitness Series 8',
    price: 'ETB 2,450',
    originalPrice: 'ETB 3,350',
    rating: '5.0',
  },
  {
    id: 2,
    tag: '🇪🇹 Ethiopian Artisans',
    tagBg: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
    title: 'Handcrafted Heritage & Fashion',
    subtitle: 'Pure Ethiopian leather bags, bespoke apparel, and artisan crafts from verified makers.',
    cta: 'Shop Fashion',
    ctaLink: '/products?category=Clothing',
    discountBadge: '30% OFF Today',
    bgGradient: 'from-slate-950 via-purple-950 to-slate-900',
    accentGlow: 'bg-purple-600/25',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    itemTitle: 'Handcrafted Genuine Leather Bag',
    price: 'ETB 4,150',
    originalPrice: 'ETB 5,900',
    rating: '4.8',
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 24, seconds: 15 });
  const navigate = useNavigate();

  // Auto slide advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="max-w-[1320px] mx-auto px-2 sm:px-4 py-2 sm:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        
        {/* ── Main Hero Carousel Card (8 Cols on Desktop) ── */}
        <div className={`lg:col-span-8 relative bg-gradient-to-br ${slide.bgGradient} border border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-500 min-h-[200px] sm:min-h-[280px]`}>
          
          {/* Ambient Glow */}
          <div className={`absolute -top-24 -left-24 w-80 h-80 ${slide.accentGlow} rounded-full blur-3xl pointer-events-none`} />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
            aria-label="Next Slide"
          >
            <ChevronRight size={16} />
          </button>

          {/* Top Tag & Discount Row */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md ${slide.tagBg}`}>
                <Sparkles size={11} className="fill-current" /> {slide.tag}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck size={11} /> 100% Escrow
              </span>
            </div>

            <span className="bg-red-500/90 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
              {slide.discountBadge}
            </span>
          </div>

          {/* Hero Content Body */}
          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 sm:gap-6 my-2 sm:my-3 relative z-10">
            
            {/* Left Text */}
            <div className="sm:col-span-7 space-y-1.5 sm:space-y-2.5 text-left">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                {slide.title}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-snug line-clamp-2 max-w-md">
                {slide.subtitle}
              </p>

              <div className="pt-1 flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate(slide.ctaLink)}
                  className="inline-flex items-center gap-1.5 bg-[#0066D6] hover:bg-[#0052B4] text-white text-xs sm:text-sm font-extrabold px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight size={13} />
                </button>
                <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">
                  🚚 24h Addis Delivery
                </span>
              </div>
            </div>

            {/* Right Product Image Spotlight */}
            <div className="hidden sm:flex sm:col-span-5 items-center justify-center">
              <div 
                onClick={() => navigate(slide.ctaLink)}
                className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/15 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group"
              >
                <img 
                  src={slide.image} 
                  alt={slide.itemTitle}
                  className="max-h-24 md:max-h-28 object-contain drop-shadow-lg"
                />
                <div className="mt-1 text-center w-full px-1">
                  <span className="text-[10px] text-white font-bold block truncate">
                    {slide.itemTitle}
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xs font-black text-amber-300">{slide.price}</span>
                    <span className="text-[9px] text-slate-400 line-through">{slide.originalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 relative z-10 pt-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  current === i ? 'w-6 bg-[#0066D6]' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

        </div>

        {/* ── Right Side Deal Cards (4 Cols on Desktop, Hidden/Stacked on Mobile) ── */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
          
          {/* Card 1: ⚡ Flash Deal with Countdown Timer */}
          <div 
            onClick={() => navigate('/products?deals=true')}
            className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-300/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                <Flame size={12} className="text-amber-600 fill-amber-500" /> Flash Deals
              </span>
              <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.2 rounded-full">
                -40% OFF
              </span>
            </div>

            <div className="my-1.5 flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0066D6] transition-colors leading-tight">
                  Limited Time Offers
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Daily refreshed discounts</p>
              </div>

              {/* Countdown Pills */}
              <div className="flex items-center gap-1 font-mono text-[10px] font-black text-slate-900 shrink-0">
                <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-[#0066D6] pt-1 border-t border-amber-100">
              <span>Explore Deals &rarr;</span>
              <span className="text-slate-400 text-[10px]">Ends Soon</span>
            </div>
          </div>

          {/* Card 2: 🇪🇹 Ethiopian Artisan & Local Direct */}
          <div 
            onClick={() => navigate('/products?category=Clothing')}
            className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border border-emerald-300/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                <Store size={12} /> Local Artisans
              </span>
              <span className="text-[10px] font-bold text-emerald-700">
                Direct from Makers
              </span>
            </div>

            <div className="my-1.5">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                Authentic Habesha Crafts
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">Pure highland leather & traditional wear</p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 pt-1 border-t border-emerald-100">
              <span>View Local Makers &rarr;</span>
              <span className="text-slate-400 text-[10px]">Addis Ababa</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
