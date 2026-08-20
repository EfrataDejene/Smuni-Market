import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0066D6] rounded-lg flex items-center justify-center">
                <ShoppingBag size={18} color="white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                SMUNI-Market
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ethiopia's leading modern e-commerce and inventory platform. Connecting customers, sellers, and delivery personnel under one seamless ecosystem.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>&copy; {new Date().getFullYear()} Alyah Innovation Hub.</p>
              <p>Addis Ababa, Ethiopia</p>
            </div>
          </div>

          {/* Col 2: Customer Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Shopping Directory</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-white transition-colors">Browse Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics Shop</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-white transition-colors">Fashion Clothing</Link></li>
              <li><Link to="/products?deals=true" className="hover:text-white transition-colors">Hot Deals & Discounts</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Track Delivery</Link></li>
            </ul>
          </div>

          {/* Col 3: Business Partners */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Partner Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/seller/login" className="hover:text-white transition-colors">Seller Dashboard & Registration</Link></li>
              <li><Link to="/delivery/login" className="hover:text-white transition-colors">Delivery Personnel Operations</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Management Panel</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Merchant FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">System Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Channels */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Contact Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#0066D6]" />
                <span>+251 900 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#0066D6]" />
                <span>support@smuni-market.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#0066D6]" />
                <span>Bole Road, Addis Ababa, ET</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-semibold mb-1.5">ACCEPTED PAYMENTS</p>
              <div className="flex gap-2">
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-bold">Chapa Online</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-bold">Cash On Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
