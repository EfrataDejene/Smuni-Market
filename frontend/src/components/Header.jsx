import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  ShoppingBag,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

export default function Header() {
  const { currentUser, cart, logoutUser, categories } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 h-[68px] flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#0066D6] rounded-lg flex items-center justify-center shadow-md">
              <ShoppingBag size={20} color="white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-[17px] tracking-tight">
                <span className="text-[#0066D6]">SMUNI</span>
                <span className="text-gray-800">-Market</span>
              </span>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide -mt-0.5">
                Ethiopia's Premium Marketplace
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center max-w-[600px] mx-auto">
          <div className="flex w-full rounded-lg border border-gray-300 overflow-hidden focus-within:border-[#0066D6] focus-within:ring-1 focus-within:ring-[#0066D6] transition-all bg-white">
            <input
              type="text"
              placeholder="Search for electronics, shoes, fashion, watch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 min-w-0"
            />
            {/* Category Dropdown */}
            <div className="relative border-l border-gray-200 hidden sm:block">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                {selectedCategory}
                <ChevronDown size={14} />
              </button>
              {categoryDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-[#0066D6] transition-colors ${
                      selectedCategory === 'All Categories' ? 'bg-blue-50 text-[#0066D6] font-semibold' : 'text-gray-700'
                    }`}
                    onClick={() => handleCategorySelect('All Categories')}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-[#0066D6] transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-blue-50 text-[#0066D6] font-semibold'
                          : 'text-gray-700'
                      }`}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Search button */}
            <button type="submit" className="bg-[#0066D6] hover:bg-[#0052B4] transition-colors px-4 flex items-center justify-center">
              <Search size={18} color="white" strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* Right: Cart, Auth */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Cart */}
          <Link to="/cart" className="relative flex flex-col items-center text-gray-600 hover:text-[#0066D6] transition-colors group">
            <div className="relative">
              <ShoppingCart size={22} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium mt-0.5 group-hover:text-[#0066D6]">Cart</span>
          </Link>

          {/* User Section */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#0066D6] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066D6] font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold hidden md:inline max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden text-sm">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-800 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                    <span className="inline-block bg-blue-50 text-[#0066D6] text-[10px] px-1.5 py-0.5 rounded font-bold mt-1">
                      {currentUser.role}
                    </span>
                  </div>

                  {currentUser.role === 'Customer' && (
                    <Link
                      to="/account"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} />
                      My Account
                    </Link>
                  )}

                  {currentUser.role === 'Seller' && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Seller Dashboard
                    </Link>
                  )}

                  {currentUser.role === 'Admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Admin Control Panel
                    </Link>
                  )}

                  {currentUser.role === 'Delivery' && (
                    <Link
                      to="/delivery/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Delivery Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logoutUser();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-[#0066D6] px-2 py-1 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-[#0066D6] hover:bg-[#0052B4] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm active:scale-95 hidden sm:inline-block"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
