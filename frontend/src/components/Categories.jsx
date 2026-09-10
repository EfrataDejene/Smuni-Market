import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Monitor,
  Shirt,
  Footprints,
  ShoppingBag,
  Sparkles,
  Watch,
  Sofa,
  Trophy,
  ArrowRight,
  Coffee,
  Gem
} from 'lucide-react';

const categoryPresets = [
  { name: 'Electronics', icon: Monitor, color: 'text-blue-600 bg-blue-50 border-blue-200/80', tag: 'Tech' },
  { name: 'Clothing', icon: Shirt, color: 'text-purple-600 bg-purple-50 border-purple-200/80', tag: 'Fashion' },
  { name: 'Shoes', icon: Footprints, color: 'text-amber-600 bg-amber-50 border-amber-200/80', tag: 'Footwear' },
  { name: 'Groceries', icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80', tag: 'Fresh' },
  { name: 'Beauty', icon: Sparkles, color: 'text-rose-600 bg-rose-50 border-rose-200/80', tag: 'Beauty' },
  { name: 'Home & Living', icon: Sofa, color: 'text-indigo-600 bg-indigo-50 border-indigo-200/80', tag: 'Living' },
  { name: 'Watches', icon: Watch, color: 'text-yellow-600 bg-yellow-50 border-yellow-200/80', tag: 'Luxury' },
  { name: 'Sports', icon: Trophy, color: 'text-orange-600 bg-orange-50 border-orange-200/80', tag: 'Fitness' },
];

export default function Categories() {
  const { categories, products } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section className="max-w-[1320px] mx-auto px-2 sm:px-4 py-2 sm:py-4">
      
      {/* ── Section Header Strip ── */}
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-4 bg-[#0066D6] rounded-full" />
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            Top Categories
          </h2>
          <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
            • Instant Filter
          </span>
        </div>

        <button
          onClick={() => navigate('/products')}
          className="text-xs font-bold text-[#0066D6] hover:text-[#0052B4] flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>All Departments</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* ── Mobile Horizontal Scroll / Desktop 8-Grid ── */}
      <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {categoryPresets.map((item, idx) => {
          const IconComp = item.icon;
          const dbCat = categories.find(c => c.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(c.name.toLowerCase()));
          const count = dbCat ? products.filter(p => p.categoryId === dbCat.id).length : (products.length ? Math.floor(products.length / 8) + 2 : 4);

          return (
            <button
              key={idx}
              onClick={() => navigate(`/products?category=${encodeURIComponent(dbCat ? dbCat.name : item.name)}`)}
              className="min-w-[82px] sm:min-w-0 flex-1 bg-white hover:bg-blue-50/40 border border-slate-200/80 hover:border-[#0066D6] rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-sm active:scale-95 group shrink-0"
            >
              {/* Category Icon */}
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-1.5 border transition-transform group-hover:scale-110 ${item.color}`}>
                <IconComp size={18} className="sm:size-5" />
              </div>

              {/* Title */}
              <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-[#0066D6] transition-colors truncate w-full">
                {item.name}
              </span>

              {/* Items count */}
              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                {count} items
              </span>
            </button>
          );
        })}
      </div>

    </section>
  );
}
