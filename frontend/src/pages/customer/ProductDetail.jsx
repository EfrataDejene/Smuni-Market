import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShoppingCart, Star, Heart, Check, ShieldAlert, ArrowLeft, Send } from 'lucide-react';

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
  
  // Cart success notice
  const [cartSuccess, setCartSuccess] = useState('');
  const [cartError, setCartError] = useState('');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const prod = products.find(p => p.productId === parseInt(id));
    if (prod) {
      setProduct(prod);
      setActiveImage(prod.image);
      // Generate some dummy thumbnails for gallery demonstration
      setThumbnails([
        prod.image,
        'https://images.unsplash.com/photo-1460353581641-37baddff0d21?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop'
      ]);

      // Look up stock
      const inv = inventory.find(i => i.productId === prod.productId);
      setInvRecord(inv);
      setStock(inv ? inv.quantity : 0);
    }
  }, [id, products, inventory]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div>
          <Header />
          <Navbar />
          <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800">Product Not Found</h3>
            <p className="text-xs text-gray-400 mt-2">The product you are trying to view does not exist or has been deleted.</p>
            <Link to="/products" className="mt-4 inline-block bg-[#0066D6] hover:bg-[#0052B4] text-white text-xs px-4 py-2 rounded-lg font-bold">
              Back to Catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Joins
  const seller = users.find(u => u.userId === product.sellerId) || { name: 'Verified Merchant' };
  const category = categories.find(c => c.id === product.categoryId) || { name: 'General' };
  const brand = brands.find(b => b.id === product.brandId) || { name: 'Generic' };

  // Price calculations
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  // Reviews filter
  const productReviews = reviews.filter(r => r.productId === product.productId);
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.5';

  const handleQtyChange = (val) => {
    const nextQty = qty + val;
    if (nextQty >= 1 && nextQty <= stock) {
      setQty(nextQty);
    }
  };

  const handleAddToCart = () => {
    setCartSuccess('');
    setCartError('');
    if (stock <= 0) {
      setCartError('This item is currently out of stock.');
      return;
    }
    const res = addToCart(product, qty);
    if (res.success) {
      setCartSuccess(`Successfully added ${qty} item(s) to your cart!`);
      setTimeout(() => setCartSuccess(''), 3000);
    } else {
      setCartError(res.message);
      setTimeout(() => setCartError(''), 3000);
    }
  };

  const handleBuyNow = () => {
    if (stock <= 0) return;
    const res = addToCart(product, qty);
    if (res.success) {
      navigate('/cart');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewMsg('');
    if (!comment) {
      setReviewMsg('Please enter a feedback comment.');
      return;
    }
    const res = addReview(product.productId, rating, comment);
    if (res.success) {
      setReviewMsg('Review posted successfully!');
      setComment('');
      setRating(5);
    } else {
      setReviewMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-xs font-semibold mb-6"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>

          {/* Product Detail Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Gallery Column (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 h-[350px] flex items-center justify-center relative overflow-hidden">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-2.5 py-0.5 rounded shadow">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <div className="flex gap-2.5 justify-center">
                {thumbnails.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`w-16 h-16 bg-slate-50 border rounded-lg p-1 overflow-hidden transition-all ${
                      activeImage === thumb ? 'border-[#0066D6] ring-1 ring-[#0066D6]' : 'border-gray-200'
                    }`}
                  >
                    <img src={thumb} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info & Purchase Column (7 Cols) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-blue-50 text-[#0066D6] px-2.5 py-0.5 rounded font-bold">{category.name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500 font-medium">Brand: <strong className="text-gray-700">{brand.name}</strong></span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500 font-medium">Seller: <strong className="text-gray-700">{seller.name}</strong></span>
                </div>

                {/* Name */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < Math.floor(parseFloat(avgRating)) ? 'currentColor' : 'none'}
                        className="stroke-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{avgRating} / 5.0</span>
                  <span className="text-gray-400 text-xs">({productReviews.length} reviews)</span>
                </div>

                <hr className="border-gray-200" />

                {/* Prices */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase">Pricing</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-[#0066D6]">
                      ETB {discountedPrice.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-gray-400 text-sm line-through font-semibold">
                        ETB {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase">Description</p>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Purchase Box */}
              <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 mt-6 space-y-4">
                {/* Stock indicator */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500">Stock Availability:</span>
                  {stock === 0 ? (
                    <span className="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded border border-red-200">
                      Out of Stock
                    </span>
                  ) : stock <= (invRecord?.lowStockThreshold || 2) ? (
                    <span className="bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded border border-amber-200">
                      Low Stock ({stock} left)
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      In Stock ({stock} available)
                    </span>
                  )}
                </div>

                {/* Quantity + Buy CTA */}
                {stock > 0 && (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Qty Selector */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => handleQtyChange(-1)}
                        className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-bold text-gray-800 text-xs w-10 text-center select-none">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(1)}
                        className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full sm:flex-1 bg-white hover:bg-blue-50 text-[#0066D6] border border-[#0066D6] font-bold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </button>

                    {/* Buy Now button */}
                    <button
                      onClick={handleBuyNow}
                      className="w-full sm:flex-1 bg-[#0066D6] hover:bg-[#0052B4] text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors active:scale-95 shadow-md shadow-blue-500/10"
                    >
                      Buy It Now
                    </button>
                  </div>
                )}

                {/* Notifications */}
                {cartSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2.5 rounded-lg flex items-center gap-2">
                    <Check size={16} className="text-emerald-600" />
                    <span className="font-semibold">{cartSuccess}</span>
                  </div>
                )}
                {cartError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-lg flex items-center gap-2">
                    <ShieldAlert size={16} className="text-red-600" />
                    <span className="font-semibold">{cartError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews & Submission Area */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews list (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Customer Feedback ({productReviews.length})
              </h2>

              {productReviews.length > 0 ? (
                <div className="space-y-5">
                  {productReviews.map((rev) => (
                    <div key={rev.reviewId} className="space-y-2 pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-800">
                          {users.find(u => u.userId === rev.userId)?.name || 'Verified Purchaser'}
                        </span>
                        <span className="text-[10px] text-gray-400">{rev.createdAt}</span>
                      </div>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < rev.rating ? 'currentColor' : 'none'}
                            className="stroke-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-400">No reviews yet. Be the first to purchase and review this item!</p>
                </div>
              )}
            </div>

            {/* Review submission (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Write a Review
              </h2>
              {reviewMsg && (
                <div className="bg-blue-50 border border-blue-200 text-[#0066D6] text-xs px-3 py-2 rounded-lg mb-4 font-semibold">
                  {reviewMsg}
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Rating Star</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-yellow-400 focus:outline-none"
                      >
                        <Star size={22} fill={star <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Your Review Comments</label>
                  <textarea
                    placeholder="Describe your purchase quality, delivery speed, merchant response, etc."
                    value={comment}
                    rows={4}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6] focus:ring-1 focus:ring-[#0066D6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Send size={13} /> Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
