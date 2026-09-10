import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  ShoppingCart,
  Heart,
  Star,
  Check,
  AlertTriangle,
  Eye,
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  Truck,
  ArrowRight,
  X,
  Plus
} from 'lucide-react';

export function ProductCard({ product, onQuickView }) {
  const { addToCart, inventory, reviews } = useContext(AppContext);
  const [cartAdded, setCartAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  // Find inventory stock
  const invRecord = inventory.find(i => i.productId === product.productId);
  const stock = invRecord ? invRecord.quantity : (product.stock !== undefined ? product.stock : 12);
  const isOutOfStock = stock === 0;

  // Compute final price after discount
  const finalPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));

  // Product reviews
  const productReviews = reviews.filter(r => r.productId === product.productId);
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : (product.rating || '4.9');

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product, 1);
    if (res.success) {
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 1200);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.productId}`)}
      className="bg-white border border-slate-200/80 hover:border-[#0066D6] rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer relative select-none"
    >
      {/* ── Edge-to-Edge Image Box (No awkward gray margin) ── */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 flex flex-col gap-1 items-start z-10">
          {product.discount > 0 && (
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-md shadow-xs">
              -{product.discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs">
              HOT
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted 
              ? 'bg-red-50 text-red-500 scale-110 shadow-xs' 
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 shadow-2xs backdrop-blur-2xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={12} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center z-10">
            <span className="text-[10px] sm:text-[11px] font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Product Content ── */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 gap-1">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-bold mb-0.5">
            <span className="truncate max-w-[65px] sm:max-w-[85px]">
              {product.category || 'Store Item'}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-black text-slate-700">{avgRating}</span>
            </div>
          </div>

          {/* Product Name (2 Lines Clamp) */}
          <h3 className="text-[11px] sm:text-xs font-black text-slate-800 leading-tight line-clamp-2 group-hover:text-[#0066D6] transition-colors min-h-[26px] sm:min-h-[30px]">
            {product.name}
          </h3>

          {/* Price Strip */}
          <div className="flex items-baseline gap-1 mt-1 flex-wrap">
            <span className="text-red-600 font-black text-xs sm:text-sm">
              ETB {finalPrice.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-slate-400 text-[9px] sm:text-[10px] line-through font-semibold">
                ETB {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add To Cart Button */}
        <div className="pt-1 border-t border-slate-100 flex items-center gap-1 mt-1">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-1 h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] font-black transition-all cursor-pointer active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : cartAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-50 hover:bg-[#0066D6] text-[#0066D6] hover:text-white border border-blue-200/80 hover:border-[#0066D6]'
            }`}
          >
            {cartAdded ? (
              <>
                <Check size={12} strokeWidth={3} /> <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={12} strokeWidth={2.5} /> <span>Cart</span>
              </>
            )}
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Quick preview"
            >
              <Eye size={12} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default function FeaturedProducts({ products }) {
  const [activeTab, setActiveTab] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  // Tab Categories
  const tabs = [
    { id: 'all', label: '🔥 All Deals' },
    { id: 'deals', label: '⚡ Mega Deals' },
    { id: 'electronics', label: '📱 Electronics', categoryId: 1 },
    { id: 'clothing', label: '👗 Fashion', categoryId: 2 },
    { id: 'crafts', label: '🇪🇹 Ethiopian Crafts' }
  ];

  // Filter products by selected tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'deals') return p.discount > 0;
    if (activeTab === 'electronics') return p.categoryId === 1;
    if (activeTab === 'clothing') return p.categoryId === 2;
    if (activeTab === 'crafts') return p.categoryId === 6 || p.categoryId === 7 || (p.description && p.description.toLowerCase().includes('ethiopian'));
    return true;
  });

  return (
    <section className="max-w-[1320px] mx-auto px-2 sm:px-4 py-2 sm:py-3">
      
      {/* ── Section Header & Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 sm:mb-3 border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-red-600 rounded-full" />
          <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Marketplace Highlights
          </h2>
          <span className="text-[9px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded-full">
            {filteredProducts.length} Items
          </span>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0066D6] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3 COLUMNS ON MOBILE (grid-cols-3) & 6 COLUMNS ON DESKTOP ── */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
          <p className="text-xs font-bold text-slate-500">No products found for this filter.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-2 text-xs font-black text-[#0066D6] hover:underline"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-2.5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* ── View All Bottom CTA ── */}
      <div className="mt-3 text-center">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-[11px] sm:text-xs px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
        >
          <span>View All Products in Catalog</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* ── Quick View Modal ── */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative animate-slideDown overflow-hidden">
            
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
            >
              <X size={15} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center">
              <div className="aspect-square bg-slate-50 rounded-xl sm:rounded-2xl p-2 flex items-center justify-center border border-slate-100 overflow-hidden">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-[#0066D6] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  <ShieldCheck size={11} /> Verified Merchant
                </span>

                <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                  {quickViewProduct.name}
                </h3>

                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-base font-black text-red-600">
                    ETB {Math.round(quickViewProduct.price * (1 - (quickViewProduct.discount || 0) / 100)).toLocaleString()}
                  </span>
                  {quickViewProduct.discount > 0 && (
                    <span className="text-[11px] text-slate-400 line-through font-semibold">
                      ETB {quickViewProduct.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready for 24h Express Delivery
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#0066D6] hover:bg-[#0052B4] text-white font-black text-xs py-2 px-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      const id = quickViewProduct.productId;
                      setQuickViewProduct(null);
                      navigate(`/product/${id}`);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
