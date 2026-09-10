import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldAlert, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Tag, 
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, clearCart, inventory } = useContext(AppContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleQtyChange = (itemKey, newQty) => {
    setErrorMsg('');
    const res = updateCartQty(itemKey, newQty);
    if (!res.success) {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(''), 3500);
    }
  };

  const getStockCount = (item) => {
    if (item.selectedVariant && item.selectedVariant.stock !== undefined) {
      return item.selectedVariant.stock;
    }
    const inv = inventory.find(i => i.productId === item.productId);
    return inv ? inv.quantity : 10;
  };

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.price;
    const discount = item.discount || 0;
    const finalPrice = discount > 0 ? Math.round(itemPrice * (1 - discount / 100)) : itemPrice;
    return acc + (finalPrice * item.quantity);
  }, 0);

  const shippingFee = cart.length > 0 ? 100 : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1320px] mx-auto px-4 py-8 sm:py-10">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link to="/" className="hover:text-[#0066D6] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#0066D6] transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Shopping Cart</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <ShoppingBag className="text-[#0066D6]" size={28} />
                Your Shopping Bag
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Review your items, varieties, and doorstep delivery options.
              </p>
            </div>
            {cart.length > 0 && (
              <span className="text-xs font-black bg-blue-50 text-[#0066D6] border border-blue-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xs animate-shake">
              <ShieldAlert size={18} className="shrink-0 text-red-600" />
              <span className="font-bold">{errorMsg}</span>
            </div>
          )}

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Cart Items List (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
                  
                  {/* Table Header */}
                  <div className="hidden sm:grid grid-cols-12 bg-slate-50/80 border-b border-slate-200/80 px-6 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <span className="col-span-6">Product & Variety</span>
                    <span className="col-span-2 text-center">Unit Price</span>
                    <span className="col-span-2 text-center">Quantity</span>
                    <span className="col-span-2 text-right">Subtotal</span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => {
                      const itemKey = item.cartKey || item.productId;
                      const itemPrice = item.price;
                      const discount = item.discount || 0;
                      const finalPrice = discount > 0 ? Math.round(itemPrice * (1 - discount / 100)) : itemPrice;
                      const stockLimit = getStockCount(item);
                      const hasVariant = !!item.selectedVariant;

                      return (
                        <div key={itemKey} className="p-4 sm:p-6 hover:bg-slate-50/40 transition-colors">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            
                            {/* Product Info & Variety */}
                            <div className="sm:col-span-6 flex gap-4">
                              <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-200/80 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-inner group">
                                <img 
                                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'} 
                                  alt={item.name} 
                                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                                />
                              </div>
                              <div className="min-w-0 flex flex-col justify-center">
                                <Link 
                                  to={`/product/${item.productId}`}
                                  className="text-xs sm:text-sm font-black text-slate-900 hover:text-[#0066D6] transition-colors truncate"
                                >
                                  {item.name}
                                </Link>

                                {/* Real Variant Badges */}
                                {hasVariant && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    {item.selectedVariant.color && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                        <span className="w-2 h-2 rounded-full bg-[#0066D6]" />
                                        Color: {item.selectedVariant.color}
                                      </span>
                                    )}
                                    {item.selectedVariant.size && (
                                      <span className="inline-flex items-center text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                        Size: {item.selectedVariant.size}
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    Stock limit: {stockLimit}
                                  </span>
                                  <button
                                    onClick={() => removeFromCart(itemKey)}
                                    className="text-[11px] font-bold text-red-500 hover:text-red-700 transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 size={12} /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Unit Price */}
                            <div className="sm:col-span-2 sm:text-center flex sm:block items-center justify-between text-xs font-black text-slate-800">
                              <span className="sm:hidden text-slate-400 font-semibold text-[11px]">Unit Price:</span>
                              <div>
                                <span>ETB {finalPrice.toLocaleString()}</span>
                                {discount > 0 && (
                                  <p className="text-[10px] text-slate-400 line-through font-normal">
                                    ETB {itemPrice.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
                              <span className="sm:hidden text-slate-400 font-semibold text-[11px]">Quantity:</span>
                              <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                                <button
                                  onClick={() => handleQtyChange(itemKey, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-black text-xs transition-colors disabled:opacity-30 cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-black text-slate-900 text-xs select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQtyChange(itemKey, item.quantity + 1)}
                                  disabled={item.quantity >= stockLimit}
                                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-black text-xs transition-colors disabled:opacity-30 cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Subtotal */}
                            <div className="sm:col-span-2 sm:text-right flex sm:block items-center justify-between text-xs sm:text-sm font-black text-[#0066D6]">
                              <span className="sm:hidden text-slate-400 font-semibold text-[11px]">Subtotal:</span>
                              <span>ETB {(finalPrice * item.quantity).toLocaleString()}</span>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cart Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0066D6] transition-colors"
                  >
                    <ArrowLeft size={16} /> Continue Shopping Catalog
                  </Link>

                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-xl bg-white hover:bg-red-50 transition cursor-pointer"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>

              {/* Order Summary Checkout (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 sticky top-24">
                <div>
                  <h3 className="font-black text-slate-900 text-base tracking-tight pb-1">
                    Order Summary
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Calculated with Addis Ababa door-to-door delivery.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-slate-900">ETB {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Truck size={14} className="text-[#0066D6]" /> Express Delivery:
                    </span>
                    <span className="font-bold text-slate-900">ETB {shippingFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between font-black text-base text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-[#0066D6] text-lg">ETB {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#0066D6] hover:bg-[#0052B4] text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Proceed to Secure Checkout <ArrowRight size={16} />
                </button>

                {/* Trust Badges */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>SMUNI Buyer Protection Guaranteed</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Your payments are held securely in escrow until doorstep delivery is verified.
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-400">
                    <Lock size={12} /> 256-Bit SSL Encrypted Checkout
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-12 sm:p-16 text-center max-w-xl mx-auto flex flex-col items-center justify-center shadow-xs">
              <div className="w-20 h-20 bg-blue-50 text-[#0066D6] rounded-3xl flex items-center justify-center mx-auto mb-5 border border-blue-100">
                <ShoppingBag size={36} />
              </div>
              <h2 className="font-black text-slate-900 text-xl mb-2 tracking-tight">Your Shopping Cart is Empty</h2>
              <p className="text-xs text-slate-500 max-w-sm mb-8 leading-relaxed font-medium">
                Explore our catalog for genuine electronics, fashion, and artisanal Ethiopian goods with instant doorstep delivery.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#0066D6] hover:bg-[#0052B4] text-white font-black text-xs sm:text-sm px-8 py-3.5 rounded-2xl transition shadow-md shadow-blue-500/15 active:scale-95 cursor-pointer"
              >
                Start Shopping Now <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
