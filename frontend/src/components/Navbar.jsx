import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Sparkles, Layers, Flame, ShieldCheck, Phone, Zap, Tag, Star, Truck } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { categories } = useContext(AppContext);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Flash Deals', path: '/products?deals=true', icon: Flame, badge: 'HOT', badgeColor: 'bg-red-500' },
    { label: 'New Arrivals', path: '/products?sort=newest', icon: Sparkles },
    { label: 'Top Sellers', path: '/products?sort=popular', icon: Star },
    { label: 'Verified Brands', path: '/products?filter=brands', icon: Tag },
    { label: 'Track Delivery', path: '/account', icon: Truck },
  ];

  return (
    <nav className="bg-white border-b border-slate-200/80 shadow-2xs hidden md:block relative z-40">
      <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-between">
        
        <ul className="flex items-center gap-1">
          {/* All Categories Mega Button */}
          <li ref={dropdownRef} className="relative py-2 pr-2">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="bg-gradient-to-r from-[#0066D6] to-blue-700 hover:from-[#0052B4] hover:to-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Layers size={16} />
              <span>All Departments</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {categoriesOpen && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn"
              >
                <div className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Browse Departments</span>
                  <span className="text-blue-600 font-bold">{categories.length} Categories</span>
                </div>
                <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoriesOpen(false);
                        navigate(`/products?category=${encodeURIComponent(cat.name)}`);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#0066D6] rounded-xl transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#0066D6] transition-colors" />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="text-xs text-slate-300 group-hover:text-[#0066D6] group-hover:translate-x-0.5 transition-all">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>

          {/* Curated Navigation Items */}
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            const IconComp = link.icon;

            return (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold transition-all relative group ${
                    isActive
                      ? 'text-[#0066D6]'
                      : 'text-slate-600 hover:text-[#0066D6]'
                  }`}
                >
                  {IconComp && <IconComp size={14} className={link.badge ? 'text-amber-500 fill-amber-400' : 'text-slate-400 group-hover:text-[#0066D6] transition-colors'} />}
                  <span>{link.label}</span>

                  {link.badge && (
                    <span className={`${link.badgeColor || 'bg-red-500'} text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-2xs`}>
                      {link.badge}
                    </span>
                  )}

                  {/* Active Underline Pill */}
                  {isActive ? (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#0066D6] rounded-full" />
                  ) : (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#0066D6] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Support & Security Indicator */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 py-2">
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full text-[11px]">
            <ShieldCheck size={13} />
            <span>Escrow Protected</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Phone size={13} className="text-[#0066D6]" />
            <span>Hotline: <strong className="text-slate-900 font-extrabold">+251 900 123 456</strong></span>
          </div>
        </div>

      </div>
    </nav>
  );
}
