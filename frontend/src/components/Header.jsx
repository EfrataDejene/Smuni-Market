import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  Heart,
  ShieldCheck,
  Sparkles,
  Store,
  Globe,
  Truck,
  X,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Clock
} from 'lucide-react';

const POPULAR_SEARCHES = [
  'Wireless Headphones',
  'Ethiopian Traditional Wear',
  'Smart Fitness Watch',
  'Leather Handbags',
  'Running Shoes',
  'Organic Coffee Beans'
];

export default function Header() {
  const { currentUser, cart, logoutUser, categories } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const searchContainerRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchFocused(false);
    let url = `/products?search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory !== 'All Categories') {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    navigate(url);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategoryDropdownOpen(false);
    let url = `/products`;
    if (cat !== 'All Categories') {
      url += `?category=${encodeURIComponent(cat)}`;
    }
    if (searchQuery) {
      url += `${cat !== 'All Categories' ? '&' : '?'}search=${encodeURIComponent(searchQuery)}`;
    }
    navigate(url);
  };

  const cartCount = cart.reduce((sum, item) => sum + (item?.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => {
    if (!item) return sum;
    const prod = item.product || item;
    const unitPrice = prod?.price || item?.price || 0;
    const discount = prod?.discount || item?.discount || 0;
    const finalPrice = unitPrice * (1 - discount / 100);
    const qty = item?.quantity || 1;
    return sum + (finalPrice * qty);
  }, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      
      {/* ── Top Utility Ribbon ── */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left info pill */}
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              1,200+ Verified Merchants
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <Truck size={13} className="text-blue-400" /> Express 24h Doorstep Delivery in Addis Ababa
            </span>
          </div>

          {/* Right quick switchers */}
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors">
              <Globe size={13} className="text-slate-400" />
              <span>ETB (Ethiopian Birr)</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link
              to="/register"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full transition-all shadow-2xs"
            >
              <Store size={12} /> Become a Seller
            </Link>
            <Link
              to="/delivery/login"
              className="text-slate-400 hover:text-slate-200 hidden lg:inline transition-colors"
            >
              Delivery Partner
            </Link>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-slate-200 hidden lg:inline transition-colors"
            >
              Admin
            </Link>
          </div>

        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="max-w-[1320px] mx-auto px-4 h-[72px] flex items-center justify-between gap-4 md:gap-6">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066D6] via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all">
              <ShoppingBag size={22} className="text-white drop-shadow-xs" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-[#0066D6] transition-colors">
                SMUNI<span className="text-[#0066D6]">-Market</span>
              </span>
              <span className="text-[9.5px] text-slate-400 font-extrabold tracking-wider uppercase -mt-0.5">
                Premier Ethiopian Marketplace
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Command Palette */}
        <div ref={searchContainerRef} className="flex-1 max-w-[620px] relative hidden sm:block">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center w-full rounded-2xl border bg-slate-50/70 transition-all shadow-2xs ${
              searchFocused
                ? 'border-[#0066D6] bg-white ring-4 ring-blue-500/15 shadow-md'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            {/* Category Dropdown */}
            <div ref={categoryDropdownRef} className="relative border-r border-slate-200 shrink-0">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:text-[#0066D6] transition-colors whitespace-nowrap h-full cursor-pointer"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <span className="max-w-[110px] truncate">{selectedCategory}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden max-h-72 overflow-y-auto animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Select Category
                  </div>
                  <button
                    type="button"
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === 'All Categories' ? 'bg-blue-50 text-[#0066D6]' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => handleCategorySelect('All Categories')}
                  >
                    <span>All Categories</span>
                    {selectedCategory === 'All Categories' && <span className="w-1.5 h-1.5 rounded-full bg-[#0066D6]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.name ? 'bg-blue-50 text-[#0066D6]' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      <span className="truncate">{cat.name}</span>
                      {selectedCategory === cat.name && <span className="w-1.5 h-1.5 rounded-full bg-[#0066D6]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Keyword Input */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder="Search products, brands, handicrafts..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder-slate-400 min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors mr-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Keyboard shortcut hint pill */}
            <div className="hidden lg:flex items-center mr-2 pointer-events-none">
              <kbd className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md">
                ⌘K
              </kbd>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-[#0066D6] hover:bg-[#0052B4] text-white px-4 py-2.5 rounded-r-2xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Search"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
          </form>

          {/* Autocomplete / Popular Searches Dropdown */}
          {searchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#0066D6]" /> Popular Trending Searches
                </span>
                <span className="text-[10px] text-slate-400">Click to search</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {POPULAR_SEARCHES.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      setSearchQuery(term);
                      navigate(`/products?search=${encodeURIComponent(term)}`);
                    }}
                    className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-[#0066D6] border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Wishlist, Cart & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Wishlist Button */}
          <Link
            to="/products"
            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-slate-700 hover:text-[#0066D6] flex items-center justify-center transition-all group relative cursor-pointer"
            title="Wishlist"
          >
            <Heart size={18} strokeWidth={2.2} className="group-hover:scale-110 transition-transform" />
          </Link>

          {/* Cart Pill */}
          <Link
            to="/cart"
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 px-3 py-2 rounded-2xl transition-all group cursor-pointer shadow-2xs"
          >
            <div className="relative">
              <ShoppingCart size={19} className="text-slate-700 group-hover:text-[#0066D6] transition-colors" strokeWidth={2.2} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-5 h-5 bg-[#E53E3E] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            
            <div className="hidden md:flex flex-col text-left leading-tight pr-1">
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wider">Cart</span>
              <span className="text-xs font-black text-[#E53E3E]">
                ETB {Math.round(cartTotal).toLocaleString()}
              </span>
            </div>
          </Link>

          {/* Account Profile / Auth */}
          {currentUser ? (
            <div ref={profileDropdownRef} className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-2 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0066D6] to-blue-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-tight max-w-[100px]">
                  <span className="text-xs font-black text-slate-800 truncate">
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}
                  </span>
                  <span className="text-[9.5px] font-extrabold text-[#0066D6] truncate">
                    {currentUser.role || 'Member'}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Shadcn DropdownMenu architecture */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden text-xs animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <p className="font-black text-slate-900 truncate text-sm">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0066D6] px-2.5 py-0.5 rounded-md">
                      <ShieldCheck size={12} /> {currentUser.role} Account
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {currentUser.role === 'Customer' && (
                      <Link
                        to="/account"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-[#0066D6] font-bold transition-colors"
                      >
                        <PackageCheck size={16} /> My Orders & Purchases
                      </Link>
                    )}

                    {currentUser.role === 'Seller' && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-bold transition-colors"
                      >
                        <LayoutDashboard size={16} /> Seller Control Dashboard
                      </Link>
                    )}

                    {currentUser.role === 'Admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-bold transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Command Center
                      </Link>
                    )}

                    {currentUser.role === 'Delivery' && (
                      <Link
                        to="/delivery/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-bold transition-colors"
                      >
                        <LayoutDashboard size={16} /> Delivery Personnel Panel
                      </Link>
                    )}
                  </div>

                  <div className="p-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logoutUser();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={16} /> Sign Out Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-[#0066D6] px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#0066D6] to-blue-700 hover:from-[#0052B4] hover:to-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
              >
                Register <ArrowRight size={13} />
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* ── Mobile Search Bar (Only on mobile screens < sm) ── */}
      <div className="sm:hidden px-3 pb-2.5 pt-0.5">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full rounded-xl border border-slate-200/90 bg-slate-50/80 px-2.5 py-1.5 shadow-2xs focus-within:border-[#0066D6] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all"
        >
          <Search size={15} className="text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Search products, brands, crafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent placeholder-slate-400 min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={13} />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}
