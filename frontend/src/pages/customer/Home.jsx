import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import HeroBanner from '../../components/HeroBanner';
import Categories from '../../components/Categories';
import FeaturedProducts from '../../components/FeaturedProducts';
import BenefitsBar from '../../components/BenefitsBar';
import Footer from '../../components/Footer';
import { Sparkles, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { products } = useContext(AppContext);
  const navigate = useNavigate();

  // Get first 6 products for display
  const displayProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />
        <HeroBanner />
        <Categories />
        
        {/* Featured Products */}
        <FeaturedProducts products={displayProducts} />

        {/* Promo Banner Section */}
        <section className="max-w-[1280px] mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-500/10">
            <div className="space-y-3 text-center md:text-left">
              <span className="bg-blue-600/50 text-yellow-300 border border-yellow-300/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles size={12} /> Seasonal Promotion
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Traditional Ethiopian Crafts & Luxury Wear
              </h2>
              <p className="text-sm text-blue-100 max-w-xl">
                Get up to 20% discount on local authentic items and brand new arrivals. Fast doorstep delivery all across Addis Ababa.
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-sm px-8 py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-yellow-400/20 whitespace-nowrap"
            >
              Shop Collection &rarr;
            </button>
          </div>
        </section>

        {/* Value Trust Section */}
        <section className="bg-white border-y border-gray-200 py-10 mt-6">
          <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0066D6] rounded-xl flex items-center justify-center mb-3">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">100% Secure Payments</h3>
              <p className="text-xs text-gray-400">Chapa certified online processing or Cash on Delivery at your gate.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0066D6] rounded-xl flex items-center justify-center mb-3">
                <Truck size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Reliable Logistics</h3>
              <p className="text-xs text-gray-400">Assigned delivery agents ensure safe and fast shipping within 24 hours.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0066D6] rounded-xl flex items-center justify-center mb-3">
                <RefreshCw size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Stock Guarantee</h3>
              <p className="text-xs text-gray-400">Direct inventory link ensures stock quantities are locked during checkout.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0066D6] rounded-xl flex items-center justify-center mb-3">
                <Star size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Verified Ratings</h3>
              <p className="text-xs text-gray-400">Write reviews and rate products only after confirming successful delivery.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
