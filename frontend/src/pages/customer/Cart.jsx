import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Trash2, ShoppingBag, ArrowRight, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, clearCart, inventory } = useContext(AppContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleQtyChange = (productId, newQty) => {
    setErrorMsg('');
    const res = updateCartQty(productId, newQty);
    if (!res.success) {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const getStockCount = (productId) => {
    const inv = inventory.find(i => i.productId === productId);
    return inv ? inv.quantity : 0;
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = item.price * (1 - (item.discount || 0) / 100);
    return acc + (price * item.quantity);
  }, 0);
  const shippingFee = cart.length > 0 ? 100 : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
              <ShieldAlert size={16} />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cart Items List (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 bg-slate-50 border-b border-gray-200 px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    <span className="col-span-6">Product details</span>
                    <span className="col-span-2 text-center">Unit Price</span>
                    <span className="col-span-2 text-center">Quantity</span>
                    <span className="col-span-2 text-right">Subtotal</span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-150">
                    {cart.map((item) => {
                      const finalPrice = item.price * (1 - (item.discount || 0) / 100);
                      const stockLimit = getStockCount(item.productId);
                      return (
                        <div key={item.productId} className="grid grid-cols-12 items-center px-4 py-4 hover:bg-slate-50/50 transition">
                          {/* Info */}
                          <div className="col-span-6 flex gap-3">
                            <div className="w-16 h-16 bg-slate-50 rounded border border-gray-200 p-1 flex-shrink-0 flex items-center justify-center">
                              <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xs font-bold text-gray-800 truncate">{item.name}</h3>
                              <p className="text-[10px] text-gray-400 mt-0.5">Stock limit: {stockLimit}</p>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-[10px] font-semibold text-red-500 hover:text-red-600 transition flex items-center gap-1 mt-2.5"
                              >
                                <Trash2 size={12} /> Remove
                              </button>
                            </div>
                          </div>

                          {/* Unit Price */}
                          <div className="col-span-2 text-center text-xs font-bold text-gray-700">
                            ETB {finalPrice.toLocaleString()}
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                              <button
                                onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                                className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 transition"
                              >
                                -
                              </button>
                              <span className="px-2 py-0.5 font-bold text-xs w-8 text-center bg-transparent">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
                                className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="col-span-2 text-right text-xs font-bold text-[#0066D6]">
                            ETB {(finalPrice * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cart Action Buttons */}
                <div className="flex items-center justify-between">
                  <Link
                    to="/products"
                    className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft size={16} /> Continue Shopping
                  </Link>

                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-200 px-4 py-2 rounded-lg bg-white hover:bg-red-50 transition"
                  >
                    Clear Shopping Cart
                  </button>
                </div>
              </div>

              {/* Order Summary Checkout (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit space-y-5">
                <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">
                  Summary Cost
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Cart Subtotal:</span>
                    <span className="font-semibold text-gray-800">ETB {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Addis Ababa Delivery:</span>
                    <span className="font-semibold text-gray-800">ETB {shippingFee.toLocaleString()}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-sm text-gray-900">
                    <span>Subtotal:</span>
                    <span className="text-[#0066D6]">ETB {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#0066D6] hover:bg-[#0052B4] text-white font-bold py-3 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-500/10"
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center max-w-xl mx-auto flex flex-col items-center justify-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <h2 className="font-bold text-gray-800 text-lg mb-1">Your Shopping Cart is Empty</h2>
              <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
                Before checking out, search and add products. We verify and lock stock quantities immediately when shopping.
              </p>
              <Link
                to="/products"
                className="bg-[#0066D6] hover:bg-[#0052B4] text-white font-semibold text-xs px-6 py-3 rounded-lg transition shadow-md active:scale-95"
              >
                Start Shopping Now
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
