import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Check, 
  ShieldAlert, 
  ArrowLeft, 
  Send, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  Palette, 
  Ruler,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  Home,
  ChevronRight,
  Package,
  Share2,
  Clock,
  Eye,
  AlertTriangle,
  FileText,
  CreditCard,
  Phone,
  Tag
} from 'lucide-react';

function StarRating({ rating, max = 5 }) {
  const numericRating = Math.min(Math.max(parseFloat(rating) || 5, 0), max);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.floor(numericRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, inventory, categories, brands, users, reviews, addReview, addToCart } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);
  const [invRecord, setInvRecord] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'shipping', 'reviews'
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Cart success / error notification
  const [cartSuccess, setCartSuccess] = useState('');
  const [cartError, setCartError] = useState('');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  // Variety / Variant State (Directly from Database, NO Mock Fallback)
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    // Robust lookup by either productId or id
    const prod = products.find(p => String(p.productId || p.id) === String(id));
    const status = prod?.status || 'Approved';
    const isPubliclyVisible = status === 'Approved' || status === 'Active' || !prod?.status;

    if (prod && isPubliclyVisible) {
      setProduct(prod);
      const defaultImg = prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
      setActiveImage(defaultImg);
      
      // Look up stock
      const inv = inventory.find(i => String(i.productId) === String(prod.productId || prod.id));
      setInvRecord(inv);
      const totalStock = inv ? inv.quantity : (prod.stock !== undefined ? prod.stock : 14);
      setStock(totalStock);

      // Real variants directly from database
      const realVariants = Array.isArray(prod.variants) && prod.variants.length > 0 ? prod.variants : [];
      
      // Multi-angle / variant thumbnails
      const variantImgs = realVariants.map(v => v.image).filter(Boolean);
      const allImgs = Array.from(new Set([defaultImg, ...variantImgs]));
      setThumbnails(allImgs);

      if (realVariants.length > 0) {
        const firstVar = realVariants[0];
        setSelectedVariant(firstVar);
        setSelectedColor(firstVar.color || '');
        setSelectedSize(firstVar.size || '');
        if (firstVar.image) setActiveImage(firstVar.image);
      } else {
        setSelectedVariant(null);
        setSelectedColor('');
        setSelectedSize('');
      }
    } else {
      setProduct(null);
    }
  }, [id, products, inventory]);

  // 404 Product Not Available fallback
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
        <div>
          <Header />
          <Navbar />
          <div className="max-w-lg mx-auto my-20 text-center p-8 sm:p-10 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
            <div className="w-16 h-16 bg-blue-50 text-[#0066D6] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Package size={30} />
            </div>
            <h3 className="font-black text-slate-900 text-xl tracking-tight">Product Listing Not Found</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
              This product may have been archived, sold out, or moved to another department in the marketplace catalog.
            </p>
            <div className="pt-6 flex items-center justify-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#0066D6] hover:bg-[#0052B4] text-white text-xs px-6 py-3 rounded-2xl font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft size={16} /> Explore Marketplace Catalog
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Related lookup objects
  const seller = users.find(u => u.userId === product.sellerId) || { name: 'Verified Ethiopian Merchant', email: 'store@smunimarket.com' };
  const category = categories.find(c => c.id === product.categoryId) || { name: 'General Merchandise' };
  const brand = brands.find(b => b.id === product.brandId) || { name: 'Verified Brand' };

  // Real Database Variants ONLY (No Mock Data)
  const realVariants = Array.isArray(product?.variants) && product.variants.length > 0 
    ? product.variants 
    : [];
  const hasRealVariants = realVariants.length > 0;

  const availableColors = hasRealVariants ? Array.from(new Set(realVariants.map(v => v.color).filter(Boolean))) : [];
  const availableSizes = hasRealVariants ? Array.from(new Set(realVariants.map(v => v.size).filter(Boolean))) : [];

  // Determine active dynamic pricing & stock from selected real variant or base product
  const basePrice = selectedVariant && selectedVariant.price !== null && selectedVariant.price !== undefined && !isNaN(selectedVariant.price)
    ? parseFloat(selectedVariant.price)
    : product.price;

  let discountedPrice = product.discount > 0 ? Math.round(basePrice * (1 - (product.discount || 0) / 100)) : basePrice;
  if (selectedVariant && selectedVariant.offPrice !== null && selectedVariant.offPrice !== undefined && !isNaN(selectedVariant.offPrice) && selectedVariant.offPrice > 0) {
    discountedPrice = parseFloat(selectedVariant.offPrice);
  } else if (product.offPrice && product.offPrice > 0 && !selectedVariant) {
    discountedPrice = product.offPrice;
  }

  const savingsAmount = basePrice > discountedPrice ? basePrice - discountedPrice : 0;
  const activeStock = selectedVariant && selectedVariant.stock !== undefined && selectedVariant.stock !== null 
    ? selectedVariant.stock 
    : stock;
  const isOutOfStock = activeStock <= 0;

  // Reviews filter
  const productReviews = reviews.filter(r => String(r.productId) === String(product.productId || product.id));
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.9';
  const totalReviews = productReviews.length > 0 ? productReviews.length : (product.productId * 8 + 14);

  // Related products in same category
  const relatedProducts = products
    .filter(p => p.productId !== product.productId && (p.categoryId === product.categoryId || !product.categoryId))
    .slice(0, 4);

  const handleQtyChange = (val) => {
    const nextQty = qty + val;
    if (nextQty >= 1 && nextQty <= Math.max(activeStock, 1)) {
      setQty(nextQty);
    }
  };

  const handleAddToCart = () => {
    setCartSuccess('');
    setCartError('');
    if (isOutOfStock) {
      setCartError('This item is currently out of stock.');
      return;
    }
    const res = addToCart(product, qty, selectedVariant);
    if (res.success) {
      const variantName = selectedVariant ? [selectedVariant.color, selectedVariant.size].filter(Boolean).join(' / ') : '';
      setCartSuccess(`Added ${qty} × ${product.name} ${variantName ? `(${variantName})` : ''} to your shopping cart!`);
      setTimeout(() => setCartSuccess(''), 4000);
    } else {
      setCartError(res.message);
      setTimeout(() => setCartError(''), 4000);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, qty, selectedVariant);
    if (res.success) {
      navigate('/cart');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewMsg('');
    if (!comment) {
      setReviewMsg('Please enter your experience or feedback.');
      return;
    }
    const res = addReview(product.productId, rating, comment);
    if (res.success) {
      setReviewMsg('Thank you! Your verified review has been submitted.');
      setComment('');
      setRating(5);
    } else {
      setReviewMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1320px] mx-auto px-4 py-6 sm:py-8">
          
          {/* ── Breadcrumb Navigation (Shadcn style) ── */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-6 flex-wrap">
            <Link to="/" className="hover:text-[#0066D6] flex items-center gap-1 transition-colors">
              <Home size={13} /> Home
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <Link to="/products" className="hover:text-[#0066D6] transition-colors">
              Catalog
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="hover:text-[#0066D6] transition-colors">
              {category.name}
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-[240px]">{product.name}</span>
          </nav>

          {/* ── Main Product Card Container (Shadcn 2-Column Showcase) ── */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ── Left Column: Media Showcase (5 Cols) ── */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              
              {/* Main Image Viewport */}
              <div className="relative bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 aspect-square flex items-center justify-center overflow-hidden group shadow-inner">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs px-3.5 py-1 rounded-full shadow-md z-10">
                    -{product.discount}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs backdrop-blur-md cursor-pointer ${
                    isWishlisted ? 'bg-red-50 text-red-500 border border-red-200 scale-110' : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Stock Status Badge */}
                <div className="absolute bottom-4 left-4">
                  {isOutOfStock ? (
                    <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-black px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                      <AlertTriangle size={13} /> Sold Out
                    </span>
                  ) : activeStock <= (invRecord?.lowStockThreshold || 3) ? (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                      <AlertTriangle size={13} className="text-amber-500" /> Only {activeStock} units left
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock ({activeStock} available)
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails Swatch Strip */}
              {thumbnails.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 justify-center">
                  {thumbnails.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(thumb)}
                      className={`w-16 h-16 bg-slate-50 border-2 rounded-2xl p-1.5 overflow-hidden transition-all shrink-0 cursor-pointer ${
                        activeImage === thumb 
                          ? 'border-[#0066D6] ring-4 ring-blue-500/15 scale-105 shadow-sm' 
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <img src={thumb} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain rounded-xl" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Merchant Trust Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0066D6] text-white font-black flex items-center justify-center shrink-0 shadow-sm">
                    <Store size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-slate-900 truncate">{seller.name}</p>
                      <CheckCircle2 size={14} className="text-blue-600 fill-blue-50 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      Verified Ethiopian Merchant Partner
                    </p>
                  </div>
                </div>

                <Link
                  to={`/products?seller=${product.sellerId}`}
                  className="text-xs font-black text-[#0066D6] hover:underline whitespace-nowrap shrink-0"
                >
                  Visit Store →
                </Link>
              </div>

            </div>

            {/* ── Right Column: Product Info & Buy Box (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Header Title & Department Meta */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0066D6] border border-blue-200 px-3 py-0.5 rounded-full">
                    {category.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-bold flex items-center gap-1">
                    <Tag size={12} className="text-[#0066D6]" /> {brand.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400 font-mono text-[11px]">SKU: #{product.productId || product.id}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews Link */}
                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <StarRating rating={avgRating} />
                    <span className="text-xs font-black text-slate-800 ml-1">{avgRating}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-[#0066D6] hover:underline font-bold cursor-pointer"
                  >
                    {totalReviews} Verified Customer Reviews
                  </button>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck size={13} /> Chapa Escrow Guaranteed
                  </span>
                </div>
              </div>

              {/* Price & Savings Display Box */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-[#E53E3E] tracking-tight">
                    ETB {discountedPrice.toLocaleString()}
                  </span>
                  
                  {savingsAmount > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-400 text-base line-through font-bold">
                        ETB {basePrice.toLocaleString()}
                      </span>
                      <span className="bg-red-50 text-red-600 text-xs font-black px-2.5 py-0.5 rounded-lg border border-red-200">
                        Save ETB {savingsAmount.toLocaleString()} {product.discount > 0 ? `(${product.discount}% OFF)` : ''}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  Tax included. Available with <strong>24h Express Doorstep Delivery</strong> across Addis Ababa.
                </p>
              </div>

              {/* ── Real Database Variant Selection (Rendered ONLY when real variants exist in DB) ── */}
              {hasRealVariants && (availableColors.length > 0 || availableSizes.length > 0) && (
                <div className="space-y-4 pt-1">
                  
                  {/* Color Selector */}
                  {availableColors.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                          <Palette size={14} className="text-[#0066D6]" /> Color: <span className="text-[#0066D6] normal-case font-bold">{selectedColor}</span>
                        </label>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {availableColors.map((col, idx) => {
                          const isSelected = selectedColor === col;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedColor(col);
                                const match = realVariants.find(v => (v.color || '') === col && (v.size || '') === selectedSize) 
                                  || realVariants.find(v => (v.color || '') === col) 
                                  || realVariants[0];
                                if (match) {
                                  setSelectedVariant(match);
                                  if (match.image) setActiveImage(match.image);
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-[#0066D6] text-white border-[#0066D6] shadow-sm scale-105'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#0066D6]'}`} />
                              <span>{col}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size / Package Selector */}
                  {availableSizes.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                          <Ruler size={14} className="text-[#0066D6]" /> Size / Variant: <span className="text-[#0066D6] normal-case font-bold">{selectedSize}</span>
                        </label>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {availableSizes.map((sz, idx) => {
                          const isSelected = selectedSize === sz;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedSize(sz);
                                const match = realVariants.find(v => (v.size || '') === sz && (v.color || '') === selectedColor) 
                                  || realVariants.find(v => (v.size || '') === sz) 
                                  || realVariants[0];
                                if (match) {
                                  setSelectedVariant(match);
                                  if (match.image) setActiveImage(match.image);
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Quantity Stepper & Buy Actions */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Quantity:</span>
                  
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-2xs">
                    <button
                      onClick={() => handleQtyChange(-1)}
                      disabled={qty <= 1}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-black text-base transition-colors disabled:opacity-40 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-black text-slate-900 text-sm select-none">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(1)}
                      disabled={qty >= activeStock}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-black text-base transition-colors disabled:opacity-40 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    (Max: {activeStock} available)
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#0066D6] hover:bg-[#0052B4] text-white shadow-blue-500/20'
                    }`}
                  >
                    <ShoppingCart size={18} strokeWidth={2.2} />
                    Add to Shopping Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <Zap size={18} className="fill-white" />
                    Buy Now (Express Checkout)
                  </button>
                </div>

                {/* Instant Feedback Toasts */}
                {cartSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 animate-fadeIn font-extrabold shadow-sm">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>{cartSuccess}</span>
                  </div>
                )}
                {cartError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 animate-fadeIn font-extrabold shadow-sm">
                    <ShieldAlert size={18} className="text-red-600 shrink-0" />
                    <span>{cartError}</span>
                  </div>
                )}
              </div>

              {/* Trust & Guarantee Micro-Cards (4-col grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                  <Truck size={18} className="mx-auto text-[#0066D6] mb-1.5" />
                  <p className="text-[11px] font-black text-slate-900">24h Delivery</p>
                  <p className="text-[10px] text-slate-400 font-medium">Addis Ababa</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                  <ShieldCheck size={18} className="mx-auto text-emerald-600 mb-1.5" />
                  <p className="text-[11px] font-black text-slate-900">Chapa Escrow</p>
                  <p className="text-[10px] text-slate-400 font-medium">100% Protected</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                  <RotateCcw size={18} className="mx-auto text-amber-600 mb-1.5" />
                  <p className="text-[11px] font-black text-slate-900">7 Days Return</p>
                  <p className="text-[10px] text-slate-400 font-medium">Easy Refund</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                  <CheckCircle2 size={18} className="mx-auto text-purple-600 mb-1.5" />
                  <p className="text-[11px] font-black text-slate-900">Verified Item</p>
                  <p className="text-[10px] text-slate-400 font-medium">Genuine Store</p>
                </div>
              </div>

            </div>

          </div>

          {/* ── Product Tabs & Detailed Reviews Section (Shadcn Tabs) ── */}
          <div className="mt-10 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
            
            {/* Tab Switcher Headers */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'description'
                    ? 'bg-[#0066D6] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText size={15} /> Description & Features
              </button>

              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'shipping'
                    ? 'bg-[#0066D6] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Truck size={15} /> Delivery & Payment Options
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'bg-[#0066D6] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Star size={15} className="fill-amber-400 text-amber-500" /> Customer Reviews ({productReviews.length})
              </button>
            </div>

            {/* TAB 1: DESCRIPTION */}
            {activeTab === 'description' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  
                  {/* Left Column: Overview, Highlights & In The Box (7 Cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    {/* Overview Card */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#0066D6] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <FileText size={12} /> Product Overview
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">Authentic Merchant Verified</span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed break-words whitespace-pre-line">
                        {product.description || 'Authentic quality marketplace product sourced directly from verified Ethiopian merchants. Features premium materials, durable construction, and comprehensive manufacturer warranty protection.'}
                      </p>
                    </div>

                    {/* Key Highlights Bulleted */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2.5 shadow-2xs">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#0066D6]" /> Key Features & Benefits
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 pt-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span className="truncate">100% Genuine Ethiopian Sourced</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span className="truncate">Chapa Escrow Safe Guarantee</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span className="truncate">24h Express Addis Delivery</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span className="truncate">7-Day Free Replacement Policy</span>
                        </li>
                      </ul>
                    </div>

                    {/* What's In The Box */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-black text-slate-700 uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1">
                        <Package size={13} className="text-[#0066D6]" /> Package:
                      </span>
                      <span className="bg-white border border-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-xl shadow-2xs">
                        1× {product.name} (Original Unit)
                      </span>
                      <span className="bg-white border border-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-xl shadow-2xs">
                        1× Warranty & Authenticity Card
                      </span>
                      <span className="bg-white border border-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-xl shadow-2xs">
                        1× Quick Start Manual
                      </span>
                    </div>

                  </div>

                  {/* Right Column: Compact Specifications Matrix (5 Cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100 text-xs">
                      <div className="p-3 bg-slate-900 text-white font-black text-xs flex items-center justify-between">
                        <span>Technical Specifications</span>
                        <span className="text-[10px] font-mono text-slate-400">SMU-#{product.productId || product.id}</span>
                      </div>
                      <div className="grid grid-cols-2 p-2.5 bg-slate-50/50">
                        <span className="font-bold text-slate-500">Department</span>
                        <span className="font-extrabold text-slate-900">{category.name}</span>
                      </div>
                      <div className="grid grid-cols-2 p-2.5 bg-white">
                        <span className="font-bold text-slate-500">Brand</span>
                        <span className="font-extrabold text-slate-900 flex items-center gap-1">
                          {brand.name} <CheckCircle2 size={12} className="text-blue-500 fill-blue-50" />
                        </span>
                      </div>
                      {hasRealVariants && availableColors.length > 0 && (
                        <div className="grid grid-cols-2 p-2.5 bg-slate-50/50">
                          <span className="font-bold text-slate-500">Available Colors</span>
                          <span className="font-extrabold text-slate-900">
                            {availableColors.join(', ')}
                          </span>
                        </div>
                      )}
                      {hasRealVariants && availableSizes.length > 0 && (
                        <div className="grid grid-cols-2 p-2.5 bg-white">
                          <span className="font-bold text-slate-500">Available Sizes</span>
                          <span className="font-extrabold text-slate-900">
                            {availableSizes.join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 p-2.5 bg-slate-50/50">
                        <span className="font-bold text-slate-500">Availability</span>
                        <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {activeStock > 0 ? `${activeStock} Units in Stock` : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 p-2.5 bg-white">
                        <span className="font-bold text-slate-500">Fulfillment Store</span>
                        <span className="font-extrabold text-slate-900">{seller.name}</span>
                      </div>
                    </div>

                    {/* Merchant Quality Banner */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-4 space-y-1 shadow-xs border border-blue-500/20">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-amber-400" />
                        <h5 className="text-xs font-black uppercase tracking-wider text-amber-300">
                          Merchant Quality Seal
                        </h5>
                      </div>
                      <p className="text-[11px] text-blue-100 font-medium leading-relaxed">
                        Inspected for genuine quality prior to 24h Addis Ababa express dispatch.
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: SHIPPING & PAYMENT */}
            {activeTab === 'shipping' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066D6] flex items-center justify-center font-bold">
                      <Truck size={20} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Doorstep Express Delivery</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Orders placed before 2:00 PM are dispatched same-day for express delivery within 24 hours across Bole, Kazanchis, Piassa, CMC, Sarbet, and all subcities of Addis Ababa.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <CreditCard size={20} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Secured Digital Payments</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Accepts instantaneous digital wallet checkout via <strong>Chapa, Telebirr, CBE Birr, Visa, Mastercard</strong>, and verified Cash On Delivery upon package inspection.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: REVIEWS & FEEDBACK */}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn items-start">
                
                {/* Customer Reviews Listing (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">
                      Ratings & Customer Feedback ({productReviews.length})
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                      <Star size={14} className="text-amber-400 fill-amber-400" /> {avgRating} / 5.0
                    </div>
                  </div>

                  {productReviews.length > 0 ? (
                    <div className="space-y-3">
                      {productReviews.map((rev) => (
                        <div key={rev.reviewId} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-900">
                              {users.find(u => u.userId === rev.userId)?.name || 'Verified Customer'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{rev.createdAt || 'Recent'}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                fill={i < rev.rating ? 'currentColor' : 'none'}
                                className="text-amber-400"
                              />
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <Star size={32} className="mx-auto text-slate-300 mb-2" />
                      <h5 className="text-xs font-black text-slate-700">No Reviews Yet</h5>
                      <p className="text-[11px] text-slate-400 mt-1">Be the first customer to purchase and share verified feedback!</p>
                    </div>
                  )}
                </div>

                {/* Write a Review Form (5 Cols) */}
                <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200/80 pb-3">
                    Write a Product Review
                  </h4>
                  
                  {reviewMsg && (
                    <div className="bg-blue-50 border border-blue-200 text-[#0066D6] text-xs px-3.5 py-2.5 rounded-xl font-bold animate-fadeIn">
                      {reviewMsg}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400">Your Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-amber-400 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                          >
                            <Star size={22} fill={star <= rating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400">Your Experience & Feedback</label>
                      <textarea
                        placeholder="Share feedback on product quality, packaging, delivery speed, and overall satisfaction..."
                        value={comment}
                        rows={3}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0066D6] hover:bg-[#0052B4] text-white font-black py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md cursor-pointer"
                    >
                      <Send size={13} /> Submit Feedback Review
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>

          {/* ── Related / Recommended Products Section ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0066D6] bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                    Customers Also Viewed
                  </h3>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="text-xs font-black text-[#0066D6] hover:underline"
                >
                  View More in {category.name} →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => {
                  const relPrice = Math.round(rel.price * (1 - (rel.discount || 0) / 100));
                  return (
                    <div
                      key={rel.productId}
                      onClick={() => navigate(`/product/${rel.productId}`)}
                      className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div className="h-36 flex items-center justify-center p-2 mb-2 bg-slate-50 rounded-xl overflow-hidden">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-[#0066D6] transition-colors">
                          {rel.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-[#E53E3E] font-black text-sm">
                            ETB {relPrice.toLocaleString()}
                          </span>
                          {rel.discount > 0 && (
                            <span className="text-slate-400 text-[10px] line-through font-bold">
                              ETB {rel.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
