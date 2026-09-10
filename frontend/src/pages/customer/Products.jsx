import { useState, useEffect, useMemo, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Star, 
  ShieldCheck, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Check, 
  AlertTriangle,
  Zap, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  Home, 
  Layers, 
  Sparkles, 
  LayoutGrid, 
  Grid3X3, 
  List,
  Tag, 
  CheckCircle2, 
  Package, 
  RotateCcw,
  Truck,
  Palette,
  Ruler,
  Store,
  RefreshCw,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';

// Star Rating Display Component
function StarRating({ rating, max = 5, size = 12 }) {
  const numericRating = Math.min(Math.max(parseFloat(rating) || 5, 0), max);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(numericRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

// Category Icon Map for Ethiopian E-Commerce
const CATEGORY_ICONS = {
  'electronics': '📱',
  'habesha wear': '👗',
  'ethiopian leather': '👜',
  'ethiopian coffee': '☕',
  'spices & honey': '🍯',
  'footwear & shoes': '👟',
  'footwear': '👟',
  'luxury watches': '⌚',
  'watches': '⌚',
  'beauty & cosmetics': '🌿',
  'beauty': '🌿'
};

const COLOR_PALETTES = [
  { name: 'Black', hex: '#0f172a' },
  { name: 'White', hex: '#ffffff', border: true },
  { name: 'Brown', hex: '#78350f' },
  { name: 'Gold', hex: '#d97706' },
  { name: 'Silver', hex: '#94a3b8' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Green', hex: '#15803d' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Beige', hex: '#d4b996' }
];

// Product Card (Standard Grid View)
function StandardProductCard({ product, onQuickView }) {
  const { addToCart, inventory, reviews } = useContext(AppContext);
  const [cartAdded, setCartAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(product.image);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveImg(product.image);
  }, [product.image]);

  const invRecord = inventory.find(i => String(i.productId) === String(product.productId || product.id));
  const stock = invRecord ? invRecord.quantity : (product.stock !== undefined ? product.stock : 14);
  const isOutOfStock = stock === 0;
  const isLowStock = !isOutOfStock && stock <= 4;

  const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
  const savingsAmount = product.price > discountedPrice ? product.price - discountedPrice : 0;

  const productReviews = reviews.filter(r => String(r.productId) === String(product.productId || product.id));
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : (product.rating || '4.9');
  const totalReviews = productReviews.length > 0 ? productReviews.length : (product.productId * 7 + 12);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product, 1);
    if (res.success) {
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 1400);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.productId || product.id}`)}
      className="bg-white border border-slate-200/90 hover:border-[#0066D6] rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative select-none"
    >
      {/* ── Edge-to-Edge Image Viewport ── */}
      <div className="relative aspect-square w-full bg-slate-100/90 overflow-hidden">
        <img
          src={activeImg}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.discount > 0 && (
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
              -{product.discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Flame size={10} className="fill-slate-950 text-slate-950" /> HOT
            </span>
          )}
        </div>

        {/* Top Right Actions: Wishlist & Quick View */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs backdrop-blur-xs cursor-pointer ${
              isWishlisted 
                ? 'bg-red-50 text-red-500 scale-110 shadow-sm border border-red-200' 
                : 'bg-white/85 hover:bg-white text-slate-400 hover:text-red-500 hover:scale-105'
            }`}
            aria-label="Wishlist"
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-500 hover:text-[#0066D6] hover:scale-105 flex items-center justify-center transition-all shadow-xs backdrop-blur-xs cursor-pointer opacity-0 group-hover:opacity-100 sm:flex"
            title="Quick View"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-xl shadow-xs">
              Sold Out
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-amber-500/90 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
              <AlertTriangle size={10} /> Only {stock} left
            </span>
          </div>
        ) : null}

        {/* Color Variations Preview Strip (if available) */}
        {product.colors && product.colors.length > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-full shadow-2xs z-10">
            <Palette size={10} className="text-[#0066D6]" />
            <span className="text-[9px] font-black text-slate-700">{product.colors.length}</span>
          </div>
        )}
      </div>

      {/* ── Product Content ── */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2">
        <div className="space-y-1">
          {/* Category & Verified Merchant */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className="truncate max-w-[120px]">
              {product.category || 'Store Collection'}
            </span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5 shrink-0">
              <ShieldCheck size={11} /> Verified
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-[13px] font-black text-slate-900 leading-snug line-clamp-2 min-h-[34px] group-hover:text-[#0066D6] transition-colors">
            {product.name}
          </h3>

          {/* Price Strip */}
          <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
            <span className="text-red-600 font-black text-sm sm:text-base">
              ETB {discountedPrice.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-slate-400 text-[10px] sm:text-xs line-through font-semibold">
                ETB {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <StarRating rating={avgRating} />
            <span className="text-slate-700 font-extrabold text-[11px]">{avgRating}</span>
            <span className="text-slate-400 text-[10px] font-medium">({totalReviews})</span>
          </div>
        </div>

        {/* Quick Add To Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 h-8 sm:h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : cartAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-blue-50 hover:bg-[#0066D6] text-[#0066D6] hover:text-white border border-blue-200/90 hover:border-[#0066D6] shadow-2xs'
            }`}
          >
            {cartAdded ? (
              <>
                <Check size={14} strokeWidth={3} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={13} strokeWidth={2.4} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { products, categories, brands, inventory, addToCart, productsLoading, categoriesLoading } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Primary Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pricePreset, setPricePreset] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Layout and Pagination states
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'compact', 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedModalVariant, setSelectedModalVariant] = useState(null);

  // Sync state with URL params on initial load
  useEffect(() => {
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const brandParam = searchParams.get('brand');
    const dealsParam = searchParams.get('deals');
    const sortParam = searchParams.get('sort');
    const minP = searchParams.get('minPrice');
    const maxP = searchParams.get('maxPrice');
    const stockParam = searchParams.get('inStock');

    if (catParam) setSelectedCat(catParam);
    if (searchParam) setSearchQuery(searchParam);
    if (brandParam) setSelectedBrand(brandParam);
    if (dealsParam === 'true') setHasDiscountOnly(true);
    if (sortParam) setSortBy(sortParam);
    if (minP) setMinPrice(minP);
    if (maxP) setMaxPrice(maxP);
    if (stockParam === 'true') setInStockOnly(true);
  }, [searchParams]);

  // Handle category chip / filter selection
  const handleCategorySelect = (catName) => {
    setSelectedCat(catName);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (catName) {
      newParams.set('category', catName);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  // Handle brand selection
  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (brandName) {
      newParams.set('brand', brandName);
    } else {
      newParams.delete('brand');
    }
    setSearchParams(newParams);
  };

  // Preset Price Filter
  const handlePricePreset = (preset) => {
    setPricePreset(preset);
    setCurrentPage(1);
    if (preset === 'under1000') {
      setMinPrice('');
      setMaxPrice('1000');
    } else if (preset === '1k-5k') {
      setMinPrice('1000');
      setMaxPrice('5000');
    } else if (preset === '5k-20k') {
      setMinPrice('5000');
      setMaxPrice('20000');
    } else if (preset === '20k-50k') {
      setMinPrice('20000');
      setMaxPrice('50000');
    } else if (preset === 'above50k') {
      setMinPrice('50000');
      setMaxPrice('');
    } else {
      setMinPrice('');
      setMaxPrice('');
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCat('');
    setSelectedBrand('');
    setSelectedColor('');
    setPricePreset('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setInStockOnly(false);
    setHasDiscountOnly(false);
    setFreeDeliveryOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Active filter count
  const activeFilters = useMemo(() => {
    const list = [];
    if (selectedCat) list.push({ key: 'category', label: `Dept: ${selectedCat}`, clear: () => handleCategorySelect('') });
    if (selectedBrand) list.push({ key: 'brand', label: `Brand: ${selectedBrand}`, clear: () => handleBrandSelect('') });
    if (selectedColor) list.push({ key: 'color', label: `Color: ${selectedColor}`, clear: () => setSelectedColor('') });
    if (searchQuery) list.push({ key: 'search', label: `"${searchQuery}"`, clear: () => setSearchQuery('') });
    if (minPrice || maxPrice) {
      list.push({ 
        key: 'price', 
        label: `ETB ${minPrice || '0'} – ${maxPrice ? maxPrice : 'Max'}`, 
        clear: () => { setMinPrice(''); setMaxPrice(''); setPricePreset('all'); } 
      });
    }
    if (minRating > 0) list.push({ key: 'rating', label: `Rating: ${minRating}★+`, clear: () => setMinRating(0) });
    if (inStockOnly) list.push({ key: 'inStock', label: 'In Stock Only', clear: () => setInStockOnly(false) });
    if (hasDiscountOnly) list.push({ key: 'deals', label: 'Mega Deals', clear: () => setHasDiscountOnly(false) });
    return list;
  }, [selectedCat, selectedBrand, selectedColor, searchQuery, minPrice, maxPrice, minRating, inStockOnly, hasDiscountOnly]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const status = product.status || 'Approved';
      if (status !== 'Approved' && status !== 'Active') {
        return false;
      }

      // Keyword Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (product.name || '').toLowerCase().includes(q);
        const matchDesc = (product.description || '').toLowerCase().includes(q);
        const matchCat = (product.category || '').toLowerCase().includes(q);
        const matchBrand = (product.brand || '').toLowerCase().includes(q);
        const matchFeatures = Array.isArray(product.features) && product.features.some(f => f.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchBrand && !matchFeatures) return false;
      }

      // Category filter
      if (selectedCat) {
        const catObj = categories.find(c => c.name.toLowerCase() === selectedCat.toLowerCase());
        const matchId = catObj && product.categoryId === catObj.id;
        const matchName = product.category && product.category.toLowerCase().includes(selectedCat.toLowerCase());
        if (!matchId && !matchName) return false;
      }

      // Brand filter
      if (selectedBrand) {
        const brandObj = brands.find(b => b.name.toLowerCase() === selectedBrand.toLowerCase());
        const matchId = brandObj && product.brandId === brandObj.id;
        const matchName = product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase();
        if (!matchId && !matchName) return false;
      }

      // Color filter
      if (selectedColor) {
        const colors = Array.isArray(product.colors) ? product.colors : [];
        const hasColor = colors.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()));
        const variantColor = Array.isArray(product.variants) && product.variants.some(v => (v.color || '').toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor && !variantColor) return false;
      }

      // Price filter
      const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
      if (minPrice && discountedPrice < parseFloat(minPrice)) return false;
      if (maxPrice && discountedPrice > parseFloat(maxPrice)) return false;

      // Rating filter
      if (minRating > 0) {
        const r = parseFloat(product.rating) || 4.9;
        if (r < minRating) return false;
      }

      // Deals filter
      if (hasDiscountOnly && (!product.discount || product.discount === 0)) return false;

      // Stock filter
      if (inStockOnly) {
        const invRecord = inventory.find(i => String(i.productId) === String(product.productId || product.id));
        const stock = invRecord ? invRecord.quantity : (product.stock !== undefined ? product.stock : 12);
        if (stock <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = Math.round(a.price * (1 - (a.discount || 0) / 100));
      const priceB = Math.round(b.price * (1 - (b.discount || 0) / 100));
      const ratingA = parseFloat(a.rating) || 4.9;
      const ratingB = parseFloat(b.rating) || 4.9;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      if (sortBy === 'rating') return ratingB - ratingA;
      if (sortBy === 'popular') return (b.productId * 8 + 20) - (a.productId * 8 + 20);
      return (b.productId || b.id || 0) - (a.productId || a.id || 0);
    });
  }, [products, categories, brands, inventory, searchQuery, selectedCat, selectedBrand, selectedColor, minPrice, maxPrice, minRating, hasDiscountOnly, inStockOnly, sortBy]);

  // Paginated Results
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    if (itemsPerPage === 999) return filteredProducts;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
          
          {/* ── Breadcrumb & Top Stats ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold flex-wrap">
              <Link to="/" className="hover:text-[#0066D6] flex items-center gap-1 transition-colors">
                <Home size={13} /> Home
              </Link>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="text-slate-900 font-bold">Catalog</span>
              {selectedCat && (
                <>
                  <ChevronRight size={13} className="text-slate-400" />
                  <span className="text-[#0066D6] font-bold">{selectedCat}</span>
                </>
              )}
            </nav>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px]">
                <ShieldCheck size={13} /> Official Marketplace Catalog
              </span>
              <span>•</span>
              <span><strong>{products.length}</strong> Total Verified Items</span>
            </div>
          </div>

          {/* ── Visual Department Hero Carousel ── */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#0066D6]" /> Browse By Category
              </span>
              {selectedCat && (
                <button
                  onClick={() => handleCategorySelect('')}
                  className="text-xs font-bold text-[#0066D6] hover:underline cursor-pointer"
                >
                  View All Departments
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                  !selectedCat 
                    ? 'bg-[#0066D6] text-white border-[#0066D6] shadow-sm scale-102' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <span>🔥</span>
                <span>All Items</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${!selectedCat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {products.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                const isSelected = selectedCat.toLowerCase() === cat.name.toLowerCase();
                const icon = CATEGORY_ICONS[cat.name.toLowerCase()] || '🛍️';

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                      isSelected 
                        ? 'bg-[#0066D6] text-white border-[#0066D6] shadow-sm scale-102' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main Catalog Layout (Sidebar + Main Grid) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ── Left Sticky Desktop Sidebar (3 Cols) ── */}
            <aside className="hidden lg:block lg:col-span-3 space-y-5 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs sticky top-24">
              
              {/* Header & Reset */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#0066D6]" /> Filter Catalog
                </span>
                {activeFilters.length > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={12} /> Clear ({activeFilters.length})
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Search Catalog</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by keyword, brand..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 focus:bg-white transition-all"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Department Hierarchy */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Department</label>
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      !selectedCat ? 'bg-blue-50 text-[#0066D6] font-extrabold border border-blue-100' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Departments</span>
                    <span className="text-[10px] text-slate-400">{products.length}</span>
                  </button>
                  {categories.map(cat => {
                    const count = products.filter(p => p.categoryId === cat.id).length;
                    const isSelected = selectedCat.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-blue-50 text-[#0066D6] font-extrabold border border-blue-100' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Brand</label>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleBrandSelect('')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !selectedBrand ? 'bg-blue-50 text-[#0066D6] font-extrabold border border-blue-100' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map(brand => {
                    const count = products.filter(p => p.brandId === brand.id || (p.brand && p.brand.toLowerCase() === brand.name.toLowerCase())).length;
                    const isSelected = selectedBrand.toLowerCase() === brand.name.toLowerCase();
                    return (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandSelect(brand.name)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected ? 'bg-blue-50 text-[#0066D6] font-extrabold border border-blue-100' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{brand.name}</span>
                        <span className="text-[10px] text-slate-400">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Controls */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Price Range (ETB)</label>
                
                {/* Numeric Inputs */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPricePreset('custom');
                      setCurrentPage(1);
                    }}
                    className="w-1/2 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] bg-slate-50/50"
                  />
                  <span className="text-slate-400 text-xs font-bold">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPricePreset('custom');
                      setCurrentPage(1);
                    }}
                    className="w-1/2 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] bg-slate-50/50"
                  />
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePricePreset('under1000')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      pricePreset === 'under1000' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    &lt; ETB 1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricePreset('1k-5k')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      pricePreset === '1k-5k' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    1K – 5K
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricePreset('5k-20k')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      pricePreset === '5k-20k' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    5K – 20K
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePricePreset('above50k')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      pricePreset === 'above50k' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    50K+
                  </button>
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Color Swatch</label>
                  {selectedColor && (
                    <button onClick={() => setSelectedColor('')} className="text-[10px] text-red-500 font-bold hover:underline">
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PALETTES.map((col, idx) => {
                    const isSelected = selectedColor.toLowerCase() === col.name.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(isSelected ? '' : col.name)}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                          col.border ? 'border border-slate-300' : ''
                        } ${isSelected ? 'scale-120 ring-2 ring-[#0066D6] ring-offset-2' : 'hover:scale-110'}`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {isSelected && (
                          <Check size={11} className={col.name === 'White' || col.name === 'Silver' ? 'text-slate-900' : 'text-white'} strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Minimum Rating</label>
                <div className="space-y-1">
                  {[4.5, 4.0, 3.5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                      className={`w-full text-left px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        minRating === stars ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <StarRating rating={stars} size={11} />
                        <span className="text-[11px] font-extrabold">{stars} & up</span>
                      </div>
                      {minRating === stars && <Check size={12} className="text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Toggles */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded text-[#0066D6] focus:ring-[#0066D6] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
                    In Stock Items Only
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={hasDiscountOnly}
                    onChange={(e) => {
                      setHasDiscountOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded text-[#0066D6] focus:ring-[#0066D6] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 flex items-center gap-1">
                    <Zap size={13} className="text-red-500 fill-red-500" /> Mega Discount Deals
                  </span>
                </label>
              </div>

            </aside>

            {/* ── Right Product Catalog Main Grid (9 Cols) ── */}
            <main className="lg:col-span-9 space-y-4">
              
              {/* ── Control Bar: Layout Switcher, Sort, Active Chips ── */}
              <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Results summary & Mobile filter trigger */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMobileFilterOpen(true)}
                      className="lg:hidden bg-[#0066D6] text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Filter size={14} />
                      <span>Filters {activeFilters.length > 0 ? `(${activeFilters.length})` : ''}</span>
                    </button>

                    <p className="text-xs font-bold text-slate-600">
                      Showing <span className="text-slate-900 font-black">{totalItems > 0 ? `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, totalItems)}` : '0'}</span> of <span className="text-slate-900 font-black">{totalItems}</span> items
                    </p>
                  </div>

                  {/* Sort & Layout View Mode Switchers */}
                  <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
                    
                    {/* View Modes */}
                    <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          viewMode === 'grid' ? 'bg-white text-[#0066D6] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Standard 3/4-Column Grid"
                      >
                        <LayoutGrid size={15} />
                      </button>
                      <button
                        onClick={() => setViewMode('compact')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          viewMode === 'compact' ? 'bg-white text-[#0066D6] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="High-Density Compact Grid"
                      >
                        <Grid3X3 size={15} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          viewMode === 'list' ? 'bg-white text-[#0066D6] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Horizontal List View"
                      >
                        <List size={15} />
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 px-2.5 py-1 rounded-xl">
                      <ArrowUpDown size={13} className="text-slate-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer pr-1"
                      >
                        <option value="newest">🆕 Newest Arrivals</option>
                        <option value="popular">🔥 Most Popular</option>
                        <option value="discount">⚡ Highest Discount %</option>
                        <option value="price_asc">💵 Price: Low to High</option>
                        <option value="price_desc">💰 Price: High to Low</option>
                        <option value="rating">⭐ Customer Rating</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Active Filter Chips Bar */}
                {activeFilters.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Active Filters:</span>
                    {activeFilters.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-blue-50 text-[#0066D6] border border-blue-200/80 px-2.5 py-0.5 rounded-full text-xs font-bold"
                      >
                        {f.label}
                        <button onClick={f.clear} className="hover:text-red-600 cursor-pointer">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={resetFilters}
                      className="text-xs font-black text-red-500 hover:text-red-600 hover:underline ml-1 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}

              </div>

              {/* ── Product Grid Showcase ── */}
              {productsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : paginatedProducts.length > 0 ? (
                <div>
                  {viewMode === 'list' ? (
                    <div className="space-y-3 sm:space-y-4">
                      {paginatedProducts.map((prod) => (
                        <ListProductCard
                          key={prod.productId || prod.id}
                          product={prod}
                          onQuickView={(p) => {
                            setQuickViewProduct(p);
                            setSelectedModalVariant(p.variants && p.variants.length > 0 ? p.variants[0] : null);
                          }}
                        />
                      ))}
                    </div>
                  ) : viewMode === 'compact' ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-3">
                      {paginatedProducts.map((prod) => (
                        <StandardProductCard
                          key={prod.productId || prod.id}
                          product={prod}
                          onQuickView={(p) => {
                            setQuickViewProduct(p);
                            setSelectedModalVariant(p.variants && p.variants.length > 0 ? p.variants[0] : null);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Default Standard Responsive Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                      {paginatedProducts.map((prod) => (
                        <StandardProductCard
                          key={prod.productId || prod.id}
                          product={prod}
                          onQuickView={(p) => {
                            setQuickViewProduct(p);
                            setSelectedModalVariant(p.variants && p.variants.length > 0 ? p.variants[0] : null);
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* ── Pagination Controls ── */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          currentPage === 1 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer active:scale-95'
                        }`}
                      >
                        <ChevronLeft size={14} /> Previous
                      </button>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          const isActive = currentPage === pageNum;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                isActive 
                                  ? 'bg-[#0066D6] text-white shadow-xs scale-105' 
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          currentPage === totalPages 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-[#0066D6] hover:bg-[#0052B4] text-white cursor-pointer active:scale-95 shadow-xs'
                        }`}
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                /* Empty Results State */
                <div className="bg-white border border-slate-200/90 rounded-3xl p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[380px] shadow-xs">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0066D6] flex items-center justify-center mb-4 border border-blue-100">
                    <SlidersHorizontal size={28} />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg sm:text-xl mb-1">
                    No Matching Marketplace Products Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mb-6 font-medium leading-relaxed">
                    We couldn't find items matching your active combination of filters. Try broadening your criteria or reset the search filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#0066D6] hover:bg-[#0052B4] text-white font-extrabold text-xs px-7 py-3 rounded-2xl transition-all active:scale-95 shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCcw size={14} /> Reset All Catalog Filters
                  </button>
                </div>
              )}

            </main>

          </div>

        </div>
      </div>

      {/* ── Interactive Quick View Dialog ── */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative animate-slideDown overflow-hidden">
            
            {/* Close */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-center">
              
              {/* Media Viewport */}
              <div className="aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 overflow-hidden relative">
                <img
                  src={selectedModalVariant?.image || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="max-h-full max-w-full object-contain"
                />
                {quickViewProduct.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    -{quickViewProduct.discount}% OFF
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0066D6] px-2.5 py-0.5 rounded-md">
                  <ShieldCheck size={12} /> Verified Merchant Item
                </span>

                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {quickViewProduct.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                  {quickViewProduct.description || 'Authentic quality product available for instant purchase with door-to-door express delivery in Ethiopia.'}
                </p>

                {/* Real-time Dynamic Variant Price */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xl font-black text-red-600">
                    ETB {(selectedModalVariant?.price || Math.round(quickViewProduct.price * (1 - (quickViewProduct.discount || 0) / 100))).toLocaleString()}
                  </span>
                  {quickViewProduct.discount > 0 && !selectedModalVariant && (
                    <span className="text-xs text-slate-400 line-through font-bold">
                      ETB {quickViewProduct.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Color and Variant selector (if variants exist) */}
                {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Available Options:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickViewProduct.variants.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedModalVariant(v)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            selectedModalVariant?.id === v.id 
                              ? 'bg-[#0066D6] text-white border-[#0066D6]' 
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {[v.color, v.size].filter(Boolean).join(' - ') || `Option ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Notice */}
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock • Ready for 24h Express Delivery
                </div>

                {/* Actions */}
                <div className="pt-3 flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, 1, selectedModalVariant);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#0066D6] hover:bg-[#0052B4] text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      const id = quickViewProduct.productId || quickViewProduct.id;
                      setQuickViewProduct(null);
                      navigate(`/product/${id}`);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ── Mobile Filter Slide-Over Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-80 max-w-[85%] bg-white h-full p-5 space-y-5 overflow-y-auto shadow-2xl ml-auto animate-slideDown flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-black text-slate-900 text-base flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-[#0066D6]" /> Filter Products
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Department</label>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold ${
                      !selectedCat ? 'bg-blue-50 text-[#0066D6]' : 'text-slate-600'
                    }`}
                  >
                    All Departments
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold ${
                        selectedCat.toLowerCase() === cat.name.toLowerCase() ? 'bg-blue-50 text-[#0066D6]' : 'text-slate-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePricePreset('under1000')}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border ${
                      pricePreset === 'under1000' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    &lt; ETB 1K
                  </button>
                  <button
                    onClick={() => handlePricePreset('1k-5k')}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border ${
                      pricePreset === '1k-5k' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    1K – 5K
                  </button>
                  <button
                    onClick={() => handlePricePreset('5k-20k')}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border ${
                      pricePreset === '5k-20k' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    5K – 20K
                  </button>
                  <button
                    onClick={() => handlePricePreset('above50k')}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border ${
                      pricePreset === 'above50k' ? 'bg-[#0066D6] text-white border-[#0066D6]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    50K+
                  </button>
                </div>
              </div>

              {/* Special Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#0066D6]"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDiscountOnly}
                    onChange={(e) => setHasDiscountOnly(e.target.checked)}
                    className="rounded text-[#0066D6]"
                  />
                  <span>Mega Deals & Discounts</span>
                </label>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#0066D6] text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Show Results
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
