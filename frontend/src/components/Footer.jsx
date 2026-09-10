import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, Mail, MapPin, ArrowRight, ShieldCheck, Heart, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-14 pb-8">
      <div className="max-w-[1320px] mx-auto px-4">
        
        {/* ── Top Newsletter Ribbon (Shadcn Card style) ── */}
        <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/80 border border-blue-500/20 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Exclusive VIP Perks
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Get Weekly Discounts & Flash Sales
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Join 40,000+ Ethiopian shoppers receiving verified merchant deals directly in their inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0066D6] hover:bg-blue-500 text-white font-black text-xs px-5 py-3 rounded-2xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {subscribed ? (
                <>
                  <Check size={15} /> Subscribed!
                </>
              ) : (
                <>
                  Subscribe <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Main Links Columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info (2 cols width on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#0066D6] to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                SMUNI<span className="text-[#0066D6]">-Market</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Ethiopia’s verified digital e-commerce ecosystem. Connecting customers, certified local vendors, and rapid door-to-door delivery personnel with secured Chapa instant settlement.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                <ShieldCheck size={13} /> 100% Escrow Guarantee
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-950/80 border border-blue-500/30 px-3 py-1 rounded-full">
                ⚡ Addis 24h Express
              </span>
            </div>
          </div>

          {/* Col 2: Customer Directory */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Shopping Directory
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Marketplace Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics & Smart Tech</Link></li>
              <li><Link to="/products?category=Clothing" className="hover:text-white transition-colors">Fashion & Habesha Wear</Link></li>
              <li><Link to="/products?deals=true" className="hover:text-amber-300 transition-colors flex items-center gap-1">⚡ Flash Deals & Sales</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Track Order Delivery</Link></li>
            </ul>
          </div>

          {/* Col 3: Partner Portals */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Partner Ecosystem
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><Link to="/register" className="hover:text-amber-300 text-amber-400 font-bold transition-colors">Register as Seller (0% Fee)</Link></li>
              <li><Link to="/seller/login" className="hover:text-white transition-colors">Seller Portal Sign In</Link></li>
              <li><Link to="/delivery/login" className="hover:text-white transition-colors">Delivery Partner Portal</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Command Panel</Link></li>
              <li><a href="#support" className="hover:text-white transition-colors">Vendor Guidelines & Rules</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Channels */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Customer Support
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone size={14} className="text-[#0066D6] shrink-0" />
                <span className="font-bold">+251 900 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#0066D6] shrink-0" />
                <span>support@smuni-market.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#0066D6] shrink-0" />
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Strip & Payment Badges ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>
            &copy; {new Date().getFullYear()} SMUNI-Market by Alyah Innovation Hub. All rights reserved.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Secured Payments:</span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">Chapa Online</span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">Telebirr</span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">CBE Birr</span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
