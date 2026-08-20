import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, Heart, Star, Check, AlertTriangle } from 'lucide-react';

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span key={i} className="relative inline-block">
            <Star
              size={12}
              className="text-gray-200"
              fill="#E5E7EB"
              strokeWidth={0}
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? '50%' : '100%' }}
              >
                <Star
                  size={12}
                  className="text-yellow-400"
                  fill="#FFB800"
                  strokeWidth={0}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function ProductCard({ product }) {
  const { addToCart, inventory, reviews } = useContext(AppContext);
  const [cartAdded, setCartAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  // Find inventory stock for this product
  const invRecord = inventory.find(i => i.productId === product.productId);
  const stock = invRecord ? invRecord.quantity : 0;
  const isOutOfStock = stock === 0;
  const isLowStock = !isOutOfStock && stock <= (invRecord?.lowStockThreshold || 2);

  // Compute final price after discount
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  // Get average rating and reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.productId);
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.5'; // default fallback for seeding consistency
  const totalReviews = productReviews.length > 0 ? productReviews.length : 8;

  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent card click navigation
    if (isOutOfStock) {
      setToastMessage('Out of Stock!');
      setToastType('error');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }
    const res = addToCart(product, 1);
    if (res.success) {
      setCartAdded(true);
      setToastMessage('Added!');
      setToastType('success');
      setTimeout(() => {
        setCartAdded(false);
        setToastMessage('');
      }, 1500);
    } else {
      setToastMessage(res.message);
      setToastType('error');
      setTimeout(() => setToastMessage(''), 2000);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.productId}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col group cursor-pointer relative"
    >
      {/* Product image */}
      <div className="relative bg-gray-50 h-[170px] flex items-center justify-center p-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop';
          }}
        />
        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#FF4D4F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            -{product.discount}%
          </span>
        )}

        {/* Stock alerts */}
        {isOutOfStock ? (
          <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-bold text-red-600">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-1 py-0.5 rounded shadow-sm flex items-center gap-0.5">
            <AlertTriangle size={10} /> Low Stock
          </span>
        ) : null}
      </div>

      {/* Product info */}
      <div className="p-3 flex flex-col gap-1.5 flex-grow">
        <h3 className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 min-h-[32px]">
          {product.name}
        </h3>

        {/* Prices */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#0066D6] font-bold text-[14px]">
            ETB {discountedPrice.toLocaleString()}
          </span>
          {product.discount > 0 && (
            <span className="text-gray-400 text-[11px] line-through">
              ETB {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={parseFloat(avgRating)} />
          <span className="text-gray-400 text-[10px]">({totalReviews})</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-grow flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-bold border transition-all active:scale-95 ${
              isOutOfStock
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : cartAdded
                ? 'bg-[#0066D6] border-[#0066D6] text-white'
                : 'border-gray-200 text-gray-700 hover:border-[#0066D6] hover:text-[#0066D6] hover:bg-blue-50'
            }`}
          >
            {cartAdded ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                Added
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingCart size={13} strokeWidth={2} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mini Toast Notification */}
      {toastMessage && (
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded shadow-md text-[10px] font-bold text-white transition-opacity ${
          toastType === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function FeaturedProducts({ products }) {
  const navigate = useNavigate();

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-gray-900">Featured Products</h2>
        <button
          onClick={() => navigate('/products')}
          className="text-[13px] font-semibold text-[#0066D6] hover:text-[#0052B4] flex items-center gap-1 transition-colors"
        >
          View All Products
          <span className="text-xs">›</span>
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
}
