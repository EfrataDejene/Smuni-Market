import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import HeroBanner from '../../components/HeroBanner';
import Categories from '../../components/Categories';
import FeaturedProducts from '../../components/FeaturedProducts';
import BenefitsBar from '../../components/BenefitsBar';
import Footer from '../../components/Footer';
import {
  ArrowRight,
  Flame,
  Store,
  CheckCircle2,
  Layers,
  User,
  ShoppingCart
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const VERIFIED_BRANDS = [
  { name: 'Samsung', category: 'Smartphones & Tech', logoText: 'SAMSUNG' },
  { name: 'Adidas', category: 'Sportswear & Footwear', logoText: 'adidas' },
  { name: 'Nike', category: 'Activewear & Shoes', logoText: 'NIKE' },
  { name: 'Habesha Crafts', category: 'Handmade Leather', logoText: 'HABESHA' },
  { name: 'Sheba Coffee', category: 'Highland Specialty', logoText: 'SHEBA' },
  { name: 'Nokia', category: 'Mobile & Tech', logoText: 'NOKIA' }
];

export default function Home() {
  const { products, cart, currentUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Filter approved products for display
  const approvedProducts = products.filter(p => {
    const status = p.status || 'Approved';
    return status === 'Approved' || status === 'Active';
  });

  const displayProducts = approvedProducts.slice(0, 18);
  const cartCount = cart.reduce((sum, item) => sum + (item?.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 pb-16 md:pb-0">
      <div>
        {/* ── Top Header & Desktop Navbar ── */}
        <Header />
        <Navbar />
        
        {/* ── Compact Sleek Hero Banner & Quick Deal Highlights ── */}
        <HeroBanner />

        {/* ── Shop by Department / Quick Category Slider ── */}
        <Categories />
        
        {/* ── Curated Marketplace Products (High Density 6-Grid) ── */}
        <FeaturedProducts products={displayProducts} />

        {/* ── Verified Partner Brands Showcase ── */}
        <section className="max-w-[1320px] mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-emerald-600 rounded-full" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  Verified Brands & Ethiopian Artisans
                </h3>
              </div>

              <button
                onClick={() => navigate('/products?filter=brands')}
                className="text-xs font-bold text-[#0066D6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Brands</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Brand Cards Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {VERIFIED_BRANDS.map((brand, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/products?search=${encodeURIComponent(brand.name)}`)}
                  className="p-2 sm:p-3 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-[#0066D6] transition-all flex flex-col items-center justify-center text-center cursor-pointer group active:scale-95 shadow-2xs"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                    <span className="font-black text-[10px] text-slate-800 tracking-wider">
                      {brand.logoText.slice(0, 4)}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 group-hover:text-[#0066D6] transition-colors flex items-center gap-0.5 truncate">
                    {brand.name}
                    <CheckCircle2 size={10} className="text-blue-500 fill-blue-50 shrink-0" />
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium truncate w-full">
                    {brand.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Compact Benefits / Trust Ribbon ── */}
        <BenefitsBar />

      </div>

      {/* ── Footer ── */}
      <Footer />

      {/* ── 📱 Mobile Bottom Sticky App Bar (App-Like Navigation) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-1.5 shadow-lg flex items-center justify-around">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-black transition-colors ${
            location.pathname === '/' ? 'text-[#0066D6]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store size={18} />
          <span>Home</span>
        </Link>

        {/* Categories */}
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-black transition-colors ${
            location.pathname === '/products' && !location.search.includes('deals') ? 'text-[#0066D6]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={18} />
          <span>Categories</span>
        </Link>

        {/* Flash Deals */}
        <Link
          to="/products?deals=true"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-black transition-colors ${
            location.search.includes('deals') ? 'text-red-600' : 'text-slate-500 hover:text-red-600'
          }`}
        >
          <Flame size={18} className={location.search.includes('deals') ? 'fill-red-500 text-red-500' : ''} />
          <span>Deals</span>
        </Link>

        {/* Cart with Live Badge Counter */}
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-black relative transition-colors ${
            location.pathname === '/cart' ? 'text-[#0066D6]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>

        {/* Account / Login */}
        <Link
          to={currentUser ? (currentUser.role === 'Admin' ? '/admin/dashboard' : currentUser.role === 'Seller' ? '/seller/dashboard' : currentUser.role === 'Delivery' ? '/delivery/dashboard' : '/account') : '/login'}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-black transition-colors ${
            location.pathname === '/account' || location.pathname === '/login' ? 'text-[#0066D6]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User size={18} />
          <span>{currentUser ? 'Account' : 'Sign In'}</span>
        </Link>

      </nav>

    </div>
  );
}
