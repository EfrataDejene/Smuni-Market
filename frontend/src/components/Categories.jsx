import React, { useContext } from 'react';
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
  BookOpen,
  Trophy,
  Baby,
} from 'lucide-react';

const iconMap = {
  Monitor,
  Shirt,
  Footprints,
  ShoppingBag,
  Sparkles,
  Watch,
  Sofa,
  BookOpen,
  Trophy,
  Baby,
};

// Preset colors for initial icons
const colorPreset = {
  Monitor: { bg: '#DBEAFE', fg: '#2563EB' },
  Shirt: { bg: '#FCE7F3', fg: '#DB2777' },
  Footprints: { bg: '#EDE9FE', fg: '#7C3AED' },
  ShoppingBag: { bg: '#FEF3C7', fg: '#D97706' },
  Sparkles: { bg: '#FCE7F3', fg: '#EC4899' },
  Watch: { bg: '#DBEAFE', fg: '#1D4ED8' },
  Sofa: { bg: '#D1FAE5', fg: '#059669' },
  BookOpen: { bg: '#FEF3C7', fg: '#B45309' },
};

function CategoryCard({ category, onClick }) {
  const IconComponent = iconMap[category.icon] || ShoppingBag;
  const colors = colorPreset[category.icon] || { bg: '#F3F4F6', fg: '#4B5563' };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#0066D6] hover:shadow-md transition-all group min-w-[100px] shrink-0"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ backgroundColor: colors.bg }}
      >
        <IconComponent
          size={24}
          color={colors.fg}
          strokeWidth={1.8}
        />
      </div>
      <span className="text-[12px] font-semibold text-gray-700 group-hover:text-[#0066D6] text-center leading-tight transition-colors">
        {category.name}
      </span>
    </button>
  );
}

export default function Categories() {
  const { categories } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-gray-900">Shop by Categories</h2>
        <button
          onClick={() => navigate('/products')}
          className="text-[13px] font-semibold text-[#0066D6] hover:text-[#0052B4] flex items-center gap-1 transition-colors"
        >
          View All Products
          <span className="text-xs">›</span>
        </button>
      </div>

      {/* Category grid - scrollable on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
          />
        ))}
      </div>
    </section>
  );
}
