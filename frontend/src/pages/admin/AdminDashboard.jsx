import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

import {
  LayoutDashboard, Users, Store, Package, Archive, ShoppingBag,
  CreditCard, Truck, BarChart2, Tag, Layers, LogOut, Menu, X,
  CheckCircle, XCircle, AlertTriangle, Edit2, Trash2, Plus, Save,
  RefreshCw, ShieldAlert, Shield, Clock, Search, Bell, Mail, Settings, ChevronRight,
  TrendingUp, Calendar, ChevronDown, Check, ArrowRight, ShieldCheck, Eye, EyeOff,
  Sliders, Download, UserCheck, FileText, ToggleLeft, ToggleRight, DollarSign,
  Phone, MapPin, Key, Copy, Navigation, UserPlus, Send, ExternalLink, Lock,
  Printer, Receipt, RotateCcw, Filter, CheckSquare, Wallet, Banknote, CheckCheck,
  FileSpreadsheet, Sparkles, BadgePercent, ArrowUpDown, Activity, ArrowUpRight, Award, Zap, TrendingDown, CircleDot
} from 'lucide-react';


// ─── Status Badge Component ───────────────────────────────────────────────────
function Badge({ label, color }) {
  const m = {
    green: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    yellow: 'bg-amber-100 text-amber-700 border border-amber-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border border-purple-200',
    gray: 'bg-slate-100 text-slate-600 border border-slate-200',
    indigo: 'bg-indigo-100 text-indigo-700 border border-indigo-200'
  };
  return <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${m[color] || m.gray}`}>{label}</span>;
}

// ─── Modern Product Details & Variants Modal ─────────────────────────────────
function AdminProductDetailsModal({ product, users, categories, inventory, updateProductStatus, deleteProduct, triggerMessage, onClose }) {
  const p = product;
  const seller = users.find(u => u.userId === p.sellerId);
  const cat = categories.find(c => c.id === p.categoryId);
  const inv = inventory.find(i => i.productId === p.productId);
  const stockCount = inv ? inv.quantity : 0;
  
  const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
  // Default to Main Product (null variant) on initial open
  const [activeVariant, setActiveVariant] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(p.status || 'Pending');

  const displayImage = activeVariant ? (activeVariant.image || p.image) : p.image;
  const displayPrice = activeVariant ? (activeVariant.price || p.price) : p.price;
  const displayStock = activeVariant?.stock !== undefined ? activeVariant.stock : stockCount;
  const originalPrice = p.discount > 0 ? Math.round(displayPrice / (1 - p.discount / 100)) : displayPrice;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              #PRD-{String(p.productId).padStart(4, '0')}
            </span>
            <Badge label={currentStatus} color={currentStatus === 'Approved' ? 'green' : currentStatus === 'Rejected' ? 'red' : 'yellow'} />
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Modal Content Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
          
          {/* Image Showcase & Gallery (Left 5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square group shadow-sm transition-all">
              <img 
                key={displayImage || 'no-img'}
                src={displayImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'} 
                alt={p.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-fadeIn" 
              />
              {p.discount > 0 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  {p.discount}% OFF
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-md">
                {activeVariant ? (
                  <span>Variant: {[activeVariant.color, activeVariant.size].filter(Boolean).join(' / ')}</span>
                ) : (
                  <span>Main Product View</span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails (Main Product + Variants) */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-extrabold uppercase text-slate-400">Photo Gallery & Swatches</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {/* Main Product Thumbnail */}
                <button
                  onClick={() => setActiveVariant(null)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    !activeVariant 
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105 shadow-sm' 
                      : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                  }`}
                  title="View Main Product Image"
                >
                  <img src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'} alt="Main Product" className="w-full h-full object-cover" />
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black px-1 rounded-bl">Main</span>
                </button>

                {/* Variant Thumbnails */}
                {hasVariants && p.variants.map((v, idx) => {
                  const isSelected = activeVariant?.id === v.id;
                  return (
                    <button
                      key={v.id || idx}
                      onClick={() => setActiveVariant(v)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        isSelected 
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105 shadow-sm' 
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                      title={`View ${v.color || ''} ${v.size || ''}`}
                    >
                      <img src={v.image || p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'} alt={v.color || `Variant ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Stock Available</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">{displayStock} Units</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Category</p>
                <p className="text-xs font-black text-slate-800 mt-0.5 truncate">{cat?.name || 'General'}</p>
              </div>
            </div>
          </div>

          {/* Details Panel (Right 7 Cols) */}
          <div className="md:col-span-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-snug">{p.name}</h2>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-2xl font-black text-indigo-600">ETB {displayPrice.toLocaleString()}</span>
                  {p.discount > 0 && (
                    <span className="text-sm font-bold text-slate-400 line-through">ETB {originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Product Variants & Main Product Selector */}
              <div className="space-y-2 border-t border-b border-slate-100 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                    Select Display Mode {hasVariants ? `(${p.variants.length} Variants)` : ''}
                  </p>
                  <span className="text-xs font-bold text-indigo-600">
                    {activeVariant ? (
                      `Selected Variant: ${[activeVariant.color, activeVariant.size].filter(Boolean).join(' / ')}`
                    ) : (
                      'Selected: Main Default Product'
                    )}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {/* Main Product Selector Pill */}
                  <button
                    onClick={() => setActiveVariant(null)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                      !activeVariant 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs ring-2 ring-indigo-500/20' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>Main Default Product</span>
                    <span className="text-[10px] opacity-75 font-semibold">ETB {p.price}</span>
                  </button>

                  {/* Variant Selector Pills */}
                  {hasVariants && p.variants.map((v, idx) => {
                    const isSelected = activeVariant?.id === v.id;
                    return (
                      <button
                        key={v.id || idx}
                        onClick={() => setActiveVariant(v)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs ring-2 ring-indigo-500/20' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {v.color && (
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 shadow-2xs" 
                            style={{ backgroundColor: v.color.toLowerCase() }} 
                          />
                        )}
                        <span>{[v.color, v.size].filter(Boolean).join(' - ') || `Variant #${idx + 1}`}</span>
                        <span className="text-[10px] opacity-75 font-semibold">ETB {v.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0">
                  <Store size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">Merchant / Store</p>
                  <p className="text-xs font-black text-slate-900 truncate">{seller?.name || 'Independent Seller'}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{seller?.email || 'No email registered'}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">Product Description</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-medium text-slate-600 leading-relaxed max-h-28 overflow-y-auto break-words whitespace-pre-wrap break-all">
                  {p.description || 'No detailed description provided by the seller.'}
                </div>
              </div>
            </div>

            {/* Approval Status Controls */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Moderation & Product Controls</p>
              <div className="grid grid-cols-3 gap-2.5">
                <button 
                  onClick={() => { 
                    updateProductStatus(p.productId, 'Approved'); 
                    setCurrentStatus('Approved');
                    triggerMessage(`Product "${p.name}" has been Approved!`); 
                  }} 
                  className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    currentStatus === 'Approved' 
                      ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-600 ring-offset-1' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle size={15} /> Approve
                </button>

                <button 
                  onClick={() => { 
                    updateProductStatus(p.productId, 'Rejected'); 
                    setCurrentStatus('Rejected');
                    triggerMessage(`Product "${p.name}" has been Rejected!`); 
                  }} 
                  className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    currentStatus === 'Rejected' 
                      ? 'bg-amber-600 text-white shadow-amber-500/25 ring-2 ring-amber-600 ring-offset-1' 
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <XCircle size={15} /> Reject
                </button>

                <button 
                  onClick={() => { 
                    if (window.confirm(`Are you sure you want to permanently delete product "${p.name}"? This action cannot be undone.`)) {
                      deleteProduct(p.productId);
                      triggerMessage(`Product "${p.name}" deleted permanently.`);
                      onClose();
                    }
                  }} 
                  className="py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-red-600 hover:bg-red-700 text-white shadow-xs"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs px-6">
          <span className="text-slate-400 font-medium">Real-time status changes sync immediately with the market catalog.</span>
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Add Delivery Person / Courier Provisioning Modal ────────────────────────
function AddDeliveryPersonModal({ isOpen, onClose, onCreateCourier, triggerMessage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('delivery123');
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState('+251 9');
  const [zone, setZone] = useState('Bole');
  const [vehicleType, setVehicleType] = useState('Motorbike');
  const [plateNumber, setPlateNumber] = useState('AA-2-');
  const [status, setStatus] = useState('Active');
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      triggerMessage('Please fill all required courier fields.');
      return;
    }
    setIsSubmitting(true);
    const res = await onCreateCourier({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      phone: phone.trim(),
      zone,
      vehicle_type: vehicleType,
      plate_number: plateNumber.trim(),
      status,
      send_email: sendEmail,
    });
    setIsSubmitting(false);
    if (res?.success) {
      triggerMessage(`✅ Courier "${name}" created successfully! Gmail: ${email}`);
      onClose();
    } else {
      triggerMessage(`❌ ${res?.message || 'Failed to create courier.'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Provision Delivery Courier</h3>
              <p className="text-[11px] text-slate-300 font-medium">Create Gmail & login credentials for delivery personnel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Courier Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Yohannes Kebede"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+251 911 234 567"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Gmail Address */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
              Courier Gmail / Email Address * <span className="text-slate-400 font-normal">(Used for Portal Login)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="courier.name@gmail.com"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password & Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black uppercase text-slate-500">
                Initial Account Password * <span className="text-slate-400 font-normal">(Min 6 chars)</span>
              </label>
              <button
                type="button"
                onClick={generateStrongPassword}
                className="text-[10px] font-black text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200 transition-colors"
              >
                ⚡ Generate Random
              </button>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2 text-xs font-mono font-bold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Operating Zone & Vehicle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Operating Zone</label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-orange-500 outline-none bg-slate-50"
              >
                <option value="Bole">Bole Subcity</option>
                <option value="Kirkos">Kirkos Subcity</option>
                <option value="Arada">Arada / Piassa</option>
                <option value="Yeka">Yeka / CMC</option>
                <option value="Lideta">Lideta Subcity</option>
                <option value="Nifas Silk">Nifas Silk / Lafto</option>
                <option value="Kolfe Keranio">Kolfe Keranio</option>
                <option value="Gullele">Gullele Subcity</option>
                <option value="Akaki Kality">Akaki Kality</option>
                <option value="Addis Ababa All">All Addis Ababa</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-orange-500 outline-none bg-slate-50"
              >
                <option value="Motorbike">🏍️ Motorbike</option>
                <option value="Delivery Van">🚐 Delivery Van</option>
                <option value="Delivery Car">🚗 Compact Car</option>
                <option value="Bicycle">🚲 Express Bicycle</option>
                <option value="Electric Scooter">🛵 Electric Scooter</option>
                <option value="Walking Courier">🚶 Walking Courier</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Plate / ID Number</label>
              <input
                type="text"
                value={plateNumber}
                onChange={e => setPlateNumber(e.target.value)}
                placeholder="AA-2-84920"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-orange-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Account Status & Welcome Email */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-slate-800 text-xs">Initial Status</p>
                <p className="text-[11px] text-slate-400">Pre-verified for instant driver portal login</p>
              </div>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold bg-white outline-none"
              >
                <option value="Active">Active (Ready)</option>
                <option value="Inactive">Inactive (Paused)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-200/60">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={e => setSendEmail(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <span className="text-[11px] font-bold text-slate-700">
                Send welcome email with login credentials directly to courier's Gmail
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black text-xs py-2 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin" size={14} /> Provisioning Courier...
                </>
              ) : (
                <>
                  <Check size={14} /> Register & Activate Courier
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Quick Reset Courier Password Modal ───────────────────────────────
function AdminResetCourierPasswordModal({ user, onClose, onResetPassword, triggerMessage }) {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      triggerMessage('Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    const res = await onResetPassword(user.userId || user.id, password);
    setIsSubmitting(false);
    if (res?.success) {
      triggerMessage(`🔑 Password for ${user.name} updated successfully.`);
      onClose();
    } else {
      triggerMessage(`❌ ${res?.message || 'Failed to update password.'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Key className="text-amber-400" size={18} />
            <h3 className="text-sm font-black">Reset Courier Password</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Courier Account</p>
            <p className="font-black text-slate-900 text-sm">{user.name}</p>
            <p className="text-slate-500 font-mono text-[11px]">{user.email}</p>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">New Password * (Min 6 chars)</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-slate-200 rounded-xl px-3 pr-10 py-2.5 text-xs font-mono font-bold focus:border-amber-500 outline-none bg-slate-50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              {isSubmitting ? 'Updating...' : 'Set New Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delivery Tracking Detail & Timeline Modal ──────────────────────────────
function DeliveryTrackingDetailModal({ orderObj, users, updateDeliveryStatus, assignDeliveryPerson, deliveryAgents, triggerMessage, onClose }) {
  if (!orderObj) return null;

  const dt = orderObj;
  const currentDriver = users.find(u => u.userId === dt.deliveryPersonId);
  const status = dt.deliveryStatus || 'Assigned';

  const steps = [
    { title: 'Order Confirmed', label: 'Order Registered in Marketplace', done: true },
    { title: 'Driver Assigned', label: dt.deliveryPersonId ? `Assigned to ${currentDriver?.name || 'Driver'}` : 'Pending Driver Dispatch', done: Boolean(dt.deliveryPersonId) },
    { title: 'Picked Up', label: 'Picked up from vendor hub', done: ['Picked Up', 'On The Way', 'Delivered'].includes(status) },
    { title: 'On The Way', label: 'In Transit to customer doorstep', done: ['On The Way', 'Delivered'].includes(status) },
    { title: 'Delivered', label: 'Delivered & COD Collected', done: status === 'Delivered', failed: status === 'Failed Delivery' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100 my-8 text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-black text-xs">
              #{dt.orderId}
            </div>
            <div>
              <h3 className="text-base font-black">Delivery Dispatch & Tracking Details</h3>
              <p className="text-[11px] text-slate-400">Order #{dt.orderId} • Customer: {dt.order?.customerName || 'Customer'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Tracker */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase text-slate-400">Delivery Status Timeline</span>
              <Badge label={status} color={status === 'Delivered' ? 'green' : status === 'Failed Delivery' ? 'red' : 'blue'} />
            </div>

            <div className="grid grid-cols-5 gap-2 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="text-center space-y-1">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                    step.failed 
                      ? 'bg-red-500 border-red-600 text-white'
                      : step.done 
                        ? 'bg-emerald-600 border-emerald-700 text-white' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {step.failed ? '✕' : step.done ? '✓' : idx + 1}
                  </div>
                  <p className={`text-[10px] font-black ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Customer & Destination</span>
              <p className="font-bold text-slate-800 text-sm">{dt.order?.customerName || 'Customer'}</p>
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Phone size={13} className="text-emerald-600" />
                <a href={`tel:${dt.order?.customerPhone || ''}`} className="hover:underline">{dt.order?.customerPhone || '+251 911 000 000'}</a>
              </div>
              <div className="flex items-start gap-2 text-slate-600 font-medium pt-1">
                <MapPin size={13} className="text-red-500 shrink-0 mt-0.5" />
                <span>{dt.order?.deliveryAddress || 'Addis Ababa, Ethiopia'}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Assigned Driver</span>
              {currentDriver ? (
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {currentDriver.name}
                  </p>
                  <p className="text-slate-500 font-medium">{currentDriver.email}</p>
                  <p className="text-slate-500 font-medium flex items-center gap-1">
                    <Phone size={12} className="text-blue-500" /> {currentDriver.phone || 'No phone'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">{currentDriver.address || 'Standard Vehicle'}</p>
                </div>
              ) : (
                <div className="text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl font-bold">
                  ⚠️ No Driver Assigned yet
                </div>
              )}
            </div>
          </div>

          {/* Order Financials & COD Details */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase text-indigo-400">Total Order Amount (COD / Prepaid)</p>
              <p className="text-xl font-black text-indigo-700 mt-0.5">ETB {(dt.order?.totalAmount || 0).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-indigo-400">Payment Status</span>
              <div className="mt-0.5">
                <Badge label={dt.payment?.paymentStatus || 'Pending'} color={dt.payment?.paymentStatus === 'Paid' ? 'green' : 'yellow'} />
              </div>
            </div>
          </div>

          {/* Quick Admin Actions inside modal */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase text-slate-400">Direct Dispatch Controls</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Reassign Driver:</label>
                <select
                  value={dt.deliveryPersonId || ''}
                  onChange={e => {
                    assignDeliveryPerson(dt.orderId, parseInt(e.target.value));
                    triggerMessage(`Order #${dt.orderId} assigned to driver.`);
                  }}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold bg-white outline-none focus:border-indigo-500"
                >
                  <option value="">Select Delivery Driver</option>
                  {deliveryAgents.map(d => <option key={d.userId || d.id} value={d.userId || d.id}>{d.name} ({d.email})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Set Delivery Status:</label>
                <select
                  value={status}
                  onChange={e => {
                    updateDeliveryStatus(dt.orderId, e.target.value);
                    triggerMessage(`Order #${dt.orderId} status set to ${e.target.value}`);
                  }}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold bg-white outline-none focus:border-indigo-500"
                >
                  <option value="Assigned">Assigned (Dispatched)</option>
                  <option value="Picked Up">Picked Up (At Merchant)</option>
                  <option value="On The Way">On The Way (In Transit)</option>
                  <option value="Delivered">Delivered (Success)</option>
                  <option value="Failed Delivery">Failed Delivery (Customer Unavailable)</option>
                  <option value="Returned">Returned (Back to Warehouse)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dt.order?.deliveryAddress || 'Addis Ababa')}`}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1.5 text-xs"
          >
            <Navigation size={14} /> Open in Google Maps
          </a>
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modern Order Details & Management Modal ─────────────────────────────────
function AdminOrderDetailModal({
  order,
  users,
  orderItems,
  products,
  payments,
  deliveryTracking,
  adminConfirmOrder,
  adminCancelOrder,
  assignDeliveryPerson,
  updateDeliveryStatus,
  triggerMessage,
  onClose,
  onOpenInvoice
}) {
  if (!order) return null;

  const customer = users.find(u => u.userId === order.userId || u.id === order.userId) || {
    name: order.customerName || 'Customer',
    email: 'customer@smuni.com',
    phone: '+251 91 100 0000',
    address: order.deliveryAddress || 'Addis Ababa, Ethiopia'
  };

  const items = orderItems.filter(oi => oi.orderId === order.orderId);
  const payment = payments.find(p => p.orderId === order.orderId) || {
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    transactionReference: 'N/A',
    amount: order.totalAmount
  };
  const tracking = deliveryTracking.find(dt => dt.orderId === order.orderId) || {
    deliveryStatus: 'Assigned',
    deliveryPersonId: null,
    notes: ''
  };
  const deliveryAgents = users.filter(u => u.role === 'Delivery');
  const assignedAgent = deliveryAgents.find(d => d.userId === tracking.deliveryPersonId || d.id === tracking.deliveryPersonId);

  const itemsSubtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const deliveryFee = order.totalAmount > itemsSubtotal ? (order.totalAmount - itemsSubtotal) : 0;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <ShoppingBag size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-black text-slate-900 text-base">#ORD-{order.orderId}</h3>
                <Badge
                  label={order.orderStatus}
                  color={order.orderStatus === 'Confirmed' ? 'green' : order.orderStatus === 'Cancelled' ? 'red' : 'yellow'}
                />
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                Placed on {order.orderDate || 'Recent'} • E-Commerce Checkout
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInvoice(order)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Print Tax Invoice"
            >
              <Printer size={14} className="text-slate-500" /> Print Invoice
            </button>
            <Link
              to={`/order/${order.orderId}`}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 text-xs flex items-center gap-1.5 transition-colors"
              title="View Live Customer Tracking Page"
            >
              <ExternalLink size={14} /> Live View
            </Link>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Info Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Customer Details</span>
                <Users size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">{customer.name || order.customerName}</p>
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                  <Mail size={12} className="text-slate-400" /> {customer.email || 'N/A'}
                </p>
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                  <Phone size={12} className="text-slate-400" /> {customer.phone || '+251 91 100 0000'}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Shipping Destination</span>
                <MapPin size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs leading-relaxed">
                  {order.deliveryAddress || customer.address || 'Addis Ababa, Bole Subcity, Ethiopia'}
                </p>
                <p className="text-[11px] font-bold text-indigo-600 mt-1 flex items-center gap-1">
                  <Truck size={12} /> Doorstep Express Delivery
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Payment Transaction</span>
                <CreditCard size={14} className="text-slate-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Badge
                    label={payment.paymentMethod === 'Chapa' ? 'Chapa (Telebirr/CBE)' : 'Cash on Delivery'}
                    color={payment.paymentMethod === 'Chapa' ? 'purple' : 'amber'}
                  />
                  <Badge
                    label={payment.paymentStatus}
                    color={payment.paymentStatus === 'Paid' ? 'green' : payment.paymentStatus === 'Refunded' ? 'gray' : 'yellow'}
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-1.5 truncate">
                  Ref: {payment.transactionReference || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Products Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Package size={14} className="text-slate-400" /> Purchased Items ({items.length})
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-center">Unit Price</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map(item => {
                    const prod = products.find(p => p.productId === item.productId) || { name: item.name || `Product #${item.productId}`, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop' };
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    return (
                      <tr key={item.itemId || item.id || item.productId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                              <img
                                src={item.image || prod.image}
                                alt={item.name || prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">{item.name || prod.name}</p>
                              {(item.color || item.size) && (
                                <span className="inline-block mt-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                  {[item.color, item.size].filter(Boolean).join(' • ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700">ETB {(item.price || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center font-extrabold text-slate-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-black text-slate-900">ETB {itemTotal.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Order Totals Summary Footer */}
              <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-200 flex flex-col items-end space-y-1.5">
                <div className="flex justify-between w-full max-w-xs text-xs font-semibold text-slate-500">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-slate-800">ETB {itemsSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-xs font-semibold text-slate-500">
                  <span>Standard Delivery Fee:</span>
                  <span className="font-bold text-slate-800">ETB {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between w-full max-w-xs text-sm font-black text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-base font-black text-indigo-600">ETB {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Dispatch Controls Box */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                  <Truck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-900">Fulfillment & Courier Dispatch</h4>
                  <p className="text-[11px] font-bold text-slate-400">Manage real-time courier allocation and delivery progression</p>
                </div>
              </div>
              <Badge
                label={tracking.deliveryStatus}
                color={tracking.deliveryStatus === 'Delivered' ? 'green' : tracking.deliveryStatus === 'On The Way' ? 'indigo' : tracking.deliveryStatus === 'Picked Up' ? 'amber' : 'blue'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">Assign Delivery Agent:</label>
                <select
                  value={tracking.deliveryPersonId || ''}
                  onChange={e => {
                    assignDeliveryPerson(order.orderId, parseInt(e.target.value));
                    triggerMessage(`Assigned order #${order.orderId} to courier.`);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 shadow-2xs"
                >
                  <option value="">-- Select Courier Agent --</option>
                  {deliveryAgents.map(d => (
                    <option key={d.userId || d.id} value={d.userId || d.id}>
                      {d.name} ({d.email || 'Delivery'})
                    </option>
                  ))}
                </select>
                {assignedAgent && (
                  <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle size={12} /> Assigned: {assignedAgent.name} ({assignedAgent.phone || '0911000000'})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">Update Delivery Status:</label>
                <select
                  value={tracking.deliveryStatus}
                  onChange={e => {
                    updateDeliveryStatus(order.orderId, e.target.value);
                    triggerMessage(`Order #${order.orderId} delivery status updated to ${e.target.value}`);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 shadow-2xs"
                >
                  <option value="Assigned">Assigned (Ready for Pickup)</option>
                  <option value="Picked Up">Picked Up (From Merchant)</option>
                  <option value="On The Way">On The Way (Out for Delivery)</option>
                  <option value="Delivered">Delivered (Completed)</option>
                  <option value="Failed Delivery">Failed Delivery (Customer Unavailable)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {order.orderStatus === 'Pending' && (
              <button
                onClick={() => {
                  adminConfirmOrder(order.orderId);
                  triggerMessage(`Confirmed Order #${order.orderId}`);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <CheckCircle size={14} /> Confirm & Approve Order
              </button>
            )}
            {order.orderStatus !== 'Cancelled' && (
              <button
                onClick={() => {
                  adminCancelOrder(order.orderId);
                  triggerMessage(`Cancelled Order #${order.orderId} and returned stock.`);
                  onClose();
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 text-xs flex items-center gap-1.5 transition-colors"
              >
                <XCircle size={14} /> Cancel & Refund Order
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Professional Printable Tax Invoice Modal ────────────────────────────────
function AdminOrderInvoiceModal({ order, users, orderItems, products, payments, onClose }) {
  if (!order) return null;

  const customer = users.find(u => u.userId === order.userId || u.id === order.userId) || {
    name: order.customerName || 'Customer',
    email: 'customer@smuni.com',
    phone: '+251 91 100 0000',
    address: order.deliveryAddress || 'Addis Ababa, Ethiopia'
  };

  const items = orderItems.filter(oi => oi.orderId === order.orderId);
  const payment = payments.find(p => p.orderId === order.orderId) || {
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    transactionReference: 'TXN-COD-PENDING',
    amount: order.totalAmount
  };

  const itemsSubtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const deliveryFee = order.totalAmount > itemsSubtotal ? (order.totalAmount - itemsSubtotal) : 0;
  const vatRate = 0.15;
  const vatAmount = Math.round(order.totalAmount * (vatRate / (1 + vatRate)));
  const netAmount = order.totalAmount - vatAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        {/* Header Action Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900">Official Commercial Tax Invoice</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 space-y-6 text-slate-900 bg-white">
          {/* Company Branding & Invoice Metadata */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                  S
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">SMUNI MARKET</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Multi-Vendor E-Commerce Platform</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Bole Subcity, Woreda 03, Addis Ababa, Ethiopia</p>
              <p className="text-[11px] text-slate-400">TIN: 0048291048 • VAT Reg: 9283749281</p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block bg-indigo-50 text-indigo-700 font-black text-xs px-3 py-1 rounded-lg border border-indigo-100">
                TAX INVOICE
              </span>
              <p className="font-mono text-xs font-black text-slate-800 pt-1">INV-ORD-{order.orderId}</p>
              <p className="text-xs text-slate-500 font-bold">Date: {order.orderDate || new Date().toLocaleDateString()}</p>
              <p className="text-xs text-slate-500 font-bold">Status: {order.orderStatus}</p>
            </div>
          </div>

          {/* Bill To & Payment Info */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Bill To Customer:</span>
              <p className="font-extrabold text-slate-900 text-sm">{customer.name || order.customerName}</p>
              <p className="text-slate-600">{customer.email || 'customer@smuni.com'}</p>
              <p className="text-slate-600">{customer.phone || '+251 91 100 0000'}</p>
              <p className="text-slate-600 leading-tight pt-1">{order.deliveryAddress || customer.address}</p>
            </div>

            <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Payment Information:</span>
              <p className="font-extrabold text-slate-900">
                Method: {payment.paymentMethod === 'Chapa' ? 'Chapa Online (Telebirr / CBE)' : 'Cash on Delivery (COD)'}
              </p>
              <p className="text-slate-600 font-mono text-[11px]">Tx Ref: {payment.transactionReference || 'N/A'}</p>
              <p className="text-slate-600">Settlement Status: <strong className="text-emerald-700">{payment.paymentStatus}</strong></p>
              <p className="text-slate-600">Currency: Ethiopian Birr (ETB)</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs">
            <thead className="bg-slate-900 text-white font-black uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5 text-left rounded-l-lg">Item Description</th>
                <th className="px-4 py-2.5 text-center">Qty</th>
                <th className="px-4 py-2.5 text-right">Unit Price (ETB)</th>
                <th className="px-4 py-2.5 text-right rounded-r-lg">Total (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => {
                const prod = products.find(p => p.productId === item.productId) || { name: item.name || `Product #${item.productId}` };
                const lineTotal = (item.price || 0) * (item.quantity || 1);
                return (
                  <tr key={idx}>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{item.name || prod.name}</p>
                      {(item.color || item.size) && (
                        <p className="text-[10px] text-slate-400">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium">{(item.price || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-black">{lineTotal.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Invoice Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Net):</span>
                <span className="font-bold text-slate-800">ETB {netAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (15% Included):</span>
                <span className="font-bold text-slate-800">ETB {vatAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Logistics:</span>
                <span className="font-bold text-slate-800">ETB {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Grand Total:</span>
                <span className="text-indigo-600">ETB {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer & Stamp */}
          <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-[10px] text-slate-400">
            <div>
              <p className="font-bold text-slate-600">Thank you for shopping with SMUNI Market!</p>
              <p>For inquiries, contact support@smunimarket.com or +251 91 100 0000</p>
            </div>
            <div className="text-center">
              <div className="w-24 border-b border-slate-300 mb-1"></div>
              <p className="font-extrabold uppercase text-slate-600">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modern Financial Payment Inspection Modal ──────────────────────────────
function AdminPaymentDetailModal({
  payment,
  orders,
  users,
  orderItems,
  products,
  adminVerifyPayment,
  onOpenRefund,
  onOpenReceipt,
  triggerMessage,
  onClose
}) {
  if (!payment) return null;

  const order = orders.find(o => o.orderId === payment.orderId) || {
    totalAmount: payment.amount,
    orderStatus: 'Confirmed',
    orderDate: payment.paymentDate,
    orderId: payment.orderId
  };
  const customer = users.find(u => u.userId === order.userId || u.id === order.userId) || {
    name: order.customerName || 'Customer',
    email: 'customer@smuni.com',
    phone: '+251 91 100 0000'
  };
  const items = orderItems.filter(oi => oi.orderId === payment.orderId);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
              <CreditCard size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-black text-slate-900 text-base">Payment #{payment.paymentId}</h3>
                <Badge
                  label={payment.paymentStatus}
                  color={payment.paymentStatus === 'Paid' ? 'green' : payment.paymentStatus === 'Refunded' ? 'gray' : 'yellow'}
                />
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Order Reference #ORD-{payment.orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Amount Card */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-5 text-white flex items-center justify-between shadow-md">
            <div>
              <p className="text-[10px] font-extrabold uppercase text-purple-200 tracking-wider">Settlement Amount</p>
              <h2 className="text-3xl font-black mt-1">ETB {payment.amount.toLocaleString()}</h2>
              <p className="text-xs text-purple-200 mt-1 flex items-center gap-1.5 font-bold">
                <ShieldCheck size={14} className="text-emerald-400" />
                Gateway Channel: {payment.paymentMethod === 'Chapa' ? 'Chapa Online (Telebirr, CBE Birr, Card)' : 'Cash on Delivery (COD)'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-purple-300">Transaction State</span>
              <div className="mt-1">
                <Badge label={payment.paymentStatus} color={payment.paymentStatus === 'Paid' ? 'green' : 'yellow'} />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Transaction Metadata</span>
              <div className="text-xs space-y-1 font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Tx Reference:</span>
                  <span className="font-mono font-bold text-slate-900 truncate max-w-[140px]">{payment.transactionReference || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Date:</span>
                  <span className="font-bold text-slate-900">{payment.paymentDate || 'Pending Settlement'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-bold text-slate-900">ETB (Ethiopian Birr)</span>
                </div>
                <div className="flex justify-between">
                  <span>Merchant Processing Fee:</span>
                  <span className="font-bold text-emerald-600">0.00 ETB (0%)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Payer / Customer Info</span>
              <div className="text-xs space-y-1 font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Payer Name:</span>
                  <span className="font-bold text-slate-900">{customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[140px]">{customer.email || 'customer@smuni.com'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-bold text-slate-900">{customer.phone || '+251 91 100 0000'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Link:</span>
                  <span className="font-mono font-bold text-blue-600">#ORD-{payment.orderId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Items */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Associated Order Items ({items.length})</span>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {items.map(item => {
                const prod = products.find(p => p.productId === item.productId) || { name: item.name || `Item #${item.productId}` };
                return (
                  <div key={item.itemId || item.id || item.productId} className="px-4 py-2.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.name || prod.name} × {item.quantity}</span>
                    <span className="font-black text-slate-900">ETB {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {payment.paymentStatus === 'Pending' && (
              <button
                onClick={() => {
                  adminVerifyPayment(payment.paymentId);
                  triggerMessage(`Payment #${payment.paymentId} marked as verified Paid.`);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <CheckCircle size={14} /> Mark as Paid / Reconciled
              </button>
            )}
            {payment.paymentStatus !== 'Refunded' && (
              <button
                onClick={() => {
                  onOpenRefund(payment);
                  onClose();
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={14} /> Issue Refund
              </button>
            )}
            <button
              onClick={() => onOpenReceipt(order)}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Receipt size={14} /> View Receipt
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Refund Confirmation Modal ───────────────────────────────────────────────
function AdminRefundModal({ payment, onConfirm, onClose }) {
  const [reason, setReason] = useState('Customer return / Order cancellation');
  const [restock, setRestock] = useState(true);

  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black mx-auto">
            <AlertTriangle size={24} />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-black text-slate-900">Confirm Payment Refund</h3>
            <p className="text-xs font-bold text-slate-500">
              Are you sure you want to refund <span className="text-red-600 font-black">ETB {payment.amount.toLocaleString()}</span> for Order #ORD-{payment.orderId}?
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Refund Reason:</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-red-500 bg-white"
              >
                <option value="Customer return / Order cancellation">Customer return / Order cancellation</option>
                <option value="Item defective / Damaged">Item defective / Damaged</option>
                <option value="Delivery failed / Customer unavailable">Delivery failed / Customer unavailable</option>
                <option value="Incorrect charge / Duplicate payment">Incorrect charge / Duplicate payment</option>
              </select>
            </div>

            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={restock}
                onChange={e => setRestock(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
              />
              <span className="text-xs font-bold text-slate-700">Restock order items back into inventory</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(payment.paymentId, reason);
                onClose();
              }}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all"
            >
              Confirm Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard Component ──────────────────────────────────────────
export default function AdminDashboard() {
  const context = useContext(AppContext);
  const {
    users, products, orders, payments, inventory, deliveryTracking,
    categories, categoriesLoading, categoriesError, brands, orderItems, updateSellerStatus, updateUserRoleAndStatus, addCategory,
    updateCategory, deleteCategory, addBrand, updateBrand, deleteBrand,
    adminConfirmOrder, adminCancelOrder, adminUpdateOrderStatus, adminUpdatePaymentStatus, adminRefundPayment, adminVerifyPayment,
    assignDeliveryPerson, updateDeliveryStatus,
    createDeliveryPerson, adminResetUserPassword,
    updateInventoryQuantity, logoutUser, currentUser, updateProductStatus, deleteProduct,
    updateProfile
  } = context;

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('May 1, 2025 - May 31, 2025');

  // Delivery Command & Fleet Management State
  const [deliverySubTab, setDeliverySubTab] = useState('dispatch'); // 'dispatch' | 'couriers' | 'failed'
  const [deliverySearch, setDeliverySearch] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('All');
  const [deliveryZoneFilter, setDeliveryZoneFilter] = useState('All');
  const [showAddCourierModal, setShowAddCourierModal] = useState(false);
  const [showCourierResetModal, setShowCourierResetModal] = useState(null);
  const [selectedTrackingDetail, setSelectedTrackingDetail] = useState(null);

  // Order Management Filtration & Modal State
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('All');
  const [orderMethodFilter, setOrderMethodFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All');
  const [orderSortBy, setOrderSortBy] = useState('newest');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [selectedOrderInvoice, setSelectedOrderInvoice] = useState(null);

  // Payment Management Filtration & Modal State
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [paymentSortBy, setPaymentSortBy] = useState('newest');
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(null);

  // Dashboard Overview & Notification State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState('30d'); // '7d' | '30d' | '90d'
  const [reportsTimeRange, setReportsTimeRange] = useState('month'); // 'week' | 'month' | 'quarter' | 'year'

  // Product Management Filtration State
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('All');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productSortBy, setProductSortBy] = useState('newest');

  // User Management Filtration State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');


  // Seller Management Filtration State
  const [sellerSearchQuery, setSellerSearchQuery] = useState('');
  const [sellerStatusFilter, setSellerStatusFilter] = useState('All');

  // Role Management Modal state
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState('Customer');

  // Modals & form state
  const [actionMsg, setActionMsg] = useState('');
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(true);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [catTypeInput, setCatTypeInput] = useState('main');
  const [catParentInput, setCatParentInput] = useState('');
  const [newParentCategoryName, setNewParentCategoryName] = useState('');
  const [catBrandInput, setCatBrandInput] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [brandNameInput, setBrandNameInput] = useState('');
  const [brandDescInput, setBrandDescInput] = useState('');

  // Settings local state
  const [siteName, setSiteName] = useState('SMUNI-Market Ethiopia');
  const [shippingFee, setShippingFee] = useState(100);
  const [lowStockDefault, setLowStockDefault] = useState(3);
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || '');
  const [adminOldPassword, setAdminOldPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [allowSellersToggle, setAllowSellersToggle] = useState(true);
  const [enableChapaToggle, setEnableChapaToggle] = useState(true);
  const [enableCodToggle, setEnableCodToggle] = useState(true);

  if (!currentUser || currentUser.role !== 'Admin') {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

  // ─── DYNAMIC CALCULATIONS FROM MOCK DATABASE ─────────────────────────────
  const sellers = users.filter(u => u.role === 'Seller');
  const customers = users.filter(u => u.role === 'Customer');
  const deliveryAgents = users.filter(u => u.role === 'Delivery');
  const pendingSellers = sellers.filter(u => u.status === 'Pending');

  const totalUsersCount = users.length;
  const totalSellersCount = sellers.length;
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalCategoriesCount = categories.length;
  const isSubcategorySection = activeSection === 'subcategories';
  const visibleCategories = categories.filter(category => isSubcategorySection ? category.parent_id : !category.parent_id);

  // ─── Dynamic Inventory & Low Stock ───
  const lowStockCount = inventory.filter(i => i.stockStatus === 'Low' || i.stockStatus === 'Out of Stock' || (i.quantity !== undefined && i.quantity <= 5)).length;

  // ─── Core Financial & Gateway Breakdowns ───
  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const chapaRevenue = payments
    .filter(p => p.paymentStatus === 'Paid' && !p.paymentMethod?.toLowerCase().includes('cod'))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const codRevenue = payments
    .filter(p => p.paymentStatus === 'Paid' && p.paymentMethod?.toLowerCase().includes('cod'))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingPaymentsCount = payments.filter(p => p.paymentStatus === 'Pending').length;

  // ─── Fulfillment Pipeline Counts ───
  const deliveredOrdersCount = deliveryTracking.filter(d => d.deliveryStatus === 'Delivered').length || orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Delivered').length;
  const processingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
  const shippedOrdersCount = deliveryTracking.filter(d => d.deliveryStatus === 'On The Way' || d.deliveryStatus === 'Picked Up').length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const cancelledOrdersCount = orders.filter(o => o.orderStatus === 'Cancelled').length;
  const deliverySuccessRate = totalOrdersCount > 0 ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100) : 100;
  const activeDriversCount = deliveryAgents.filter(u => u.status === 'Active').length || deliveryAgents.length || 4;

  // Total Action Items requiring Admin attention
  const totalActionCount = pendingOrdersCount + pendingSellers.length + (lowStockCount > 0 ? 1 : 0) + pendingPaymentsCount;

  // Time & Greeting
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Recent Orders (Top 6) with enriched customer, seller & payment info
  const recentOrdersList = orders.slice(0, 6).map(o => {
    const customer = users.find(u => u.userId === o.userId) || { name: o.customerName || 'Customer' };
    const orderItem = orderItems.find(oi => oi.orderId === o.orderId);
    const prod = products.find(p => p.productId === orderItem?.productId);
    const seller = users.find(u => u.userId === prod?.sellerId) || { name: 'Tech Store' };
    const tracking = deliveryTracking.find(dt => dt.orderId === o.orderId);
    const status = tracking?.deliveryStatus || o.orderStatus;
    const payment = payments.find(p => p.orderId === o.orderId);
    return { 
      ...o, 
      customerName: customer.name, 
      sellerName: seller.name, 
      status, 
      paymentMethod: payment?.paymentMethod || (o.paymentMethod || 'Chapa'),
      paymentStatus: payment?.paymentStatus || 'Paid'
    };
  });

  // Top Selling Categories calculation
  const topSellingCategories = categories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const catProductIds = catProducts.map(p => p.productId);
    const catItems = orderItems.filter(oi => catProductIds.includes(oi.productId));
    const catOrdersCount = [...new Set(catItems.map(oi => oi.orderId))].length;
    const catRevenue = catItems.reduce((sum, oi) => sum + (oi.price * oi.quantity), 0);
    return {
      id: cat.id,
      name: cat.name,
      productsCount: catProducts.length || 6,
      ordersCount: catOrdersCount || 12,
      revenue: catRevenue || ((cat.id + 1) * 14200)
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Top Vendors Leaderboard
  const topVendorsList = sellers.map((seller, idx) => {
    const sellerProds = products.filter(p => p.sellerId === seller.userId);
    const sellerProdIds = sellerProds.map(p => p.productId);
    const sellerItems = orderItems.filter(oi => sellerProdIds.includes(oi.productId));
    const sellerOrders = orders.filter(o => {
      const matchingItem = orderItems.find(oi => oi.orderId === o.orderId && sellerProdIds.includes(oi.productId));
      return Boolean(matchingItem);
    });
    const grossSales = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      ...seller,
      productsCount: sellerProds.length || (idx === 0 ? 14 : 8),
      ordersCount: sellerOrders.length || (idx === 0 ? 28 : 12),
      grossSales: grossSales || (totalRevenue ? Math.round(totalRevenue * (0.35 - (idx * 0.08))) : 35000),
      rating: 4.8 + (idx * 0.05)
    };
  }).sort((a, b) => b.grossSales - a.grossSales);

  // Top Performing Products
  const topPerformingProducts = products.map((prod, idx) => {
    const pItems = orderItems.filter(oi => oi.productId === prod.productId);
    const unitsSold = pItems.reduce((sum, item) => sum + (item.quantity || 1), 0) || (24 - idx * 2);
    const prodRevenue = pItems.reduce((sum, item) => sum + ((item.price || prod.price) * (item.quantity || 1)), 0) || (prod.price * (24 - idx * 2));
    const inv = inventory.find(i => i.productId === prod.productId);
    const cat = categories.find(c => c.id === prod.categoryId);
    return {
      ...prod,
      unitsSold,
      totalRevenue: prodRevenue,
      stock: inv ? inv.quantity : 18,
      categoryName: cat?.name || 'General'
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 6);

  // Chart configuration for 7d, 30d, 90d
  const chartConfigs = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      points: [25, 45, 38, 70, 92, 65, 80],
      peakDay: 'Friday (ETB ' + Math.round((totalRevenue * 0.24) || 16500).toLocaleString() + ')',
      avgDaily: 'ETB ' + Math.round((totalRevenue / 7) || 4500).toLocaleString(),
      totalPeriod: 'ETB ' + totalRevenue.toLocaleString()
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      points: [30, 65, 95, 78],
      peakDay: 'Week 3 (ETB ' + Math.round((totalRevenue * 0.38) || 42000).toLocaleString() + ')',
      avgDaily: 'ETB ' + Math.round((totalRevenue / 30) || 2100).toLocaleString(),
      totalPeriod: 'ETB ' + totalRevenue.toLocaleString()
    },
    '90d': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      points: [40, 75, 100],
      peakDay: 'Month 3 (ETB ' + Math.round((totalRevenue * 0.45) || 75000).toLocaleString() + ')',
      avgDaily: 'ETB ' + Math.round((totalRevenue / 90) || 1500).toLocaleString(),
      totalPeriod: 'ETB ' + totalRevenue.toLocaleString()
    }
  };
  const activeChartData = chartConfigs[chartTimeRange] || chartConfigs['30d'];

  // CSV Report Generator
  const exportCSVReport = (reportType = 'financial') => {
    let headers = [];
    let rows = [];
    let filename = `smuni_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'financial') {
      headers = ['Metric / Indicator', 'Amount (ETB)', 'Description'];
      rows = [
        ['Gross Merchandise Value (GMV)', totalRevenue, 'Total platform gross sales volume'],
        ['Chapa Digital Gateway (Telebirr/CBE/Cards)', chapaRevenue, 'Direct digital settlements via Chapa gateway'],
        ['Cash On Delivery (COD)', codRevenue, 'Physical cash collections via dispatch couriers'],
        ['Platform Net Commission (10%)', Math.round(totalRevenue * 0.10), 'Retained marketplace revenue'],
        ['Estimated Ethiopian VAT / Tax (15%)', Math.round(totalRevenue * 0.15), 'Estimated statutory tax allocation'],
        ['Vendor Net Disbursements (90%)', Math.round(totalRevenue * 0.90), 'Payable merchant earnings'],
        ['Total Platform Orders', totalOrdersCount, 'All processed customer orders'],
        ['Delivered Orders Count', deliveredOrdersCount, `${deliverySuccessRate}% fulfillment rate`],
        ['Catalog Inventory Valuation', totalCatalogInventoryValue, 'Total estimated value of listed inventory']
      ];
    } else if (reportType === 'products') {
      headers = ['Product ID', 'Product Title', 'Category', 'Unit Price (ETB)', 'Stock Available', 'Units Sold', 'Total Gross Sales (ETB)'];
      rows = topPerformingProducts.map(p => [
        `PRD-${p.productId}`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        p.categoryName,
        p.price,
        p.stock,
        p.unitsSold,
        p.totalRevenue
      ]);
    } else if (reportType === 'vendors') {
      headers = ['Vendor ID', 'Merchant Store', 'Email', 'Phone', 'Account Status', 'Active Listings', 'Total Orders', 'Gross Volume (ETB)'];
      rows = topVendorsList.map(v => [
        `USR-${v.userId}`,
        `"${(v.name || '').replace(/"/g, '""')}"`,
        v.email,
        v.phone || 'N/A',
        v.status,
        v.productsCount,
        v.ordersCount,
        v.grossSales
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerMessage(`${reportType.toUpperCase()} report exported successfully!`);
  };

  // ─── Dynamic Product Filtration & Metrics Calculations ───
  const pendingProductsCount = products.filter(p => (p.status || 'Pending') === 'Pending').length;
  const approvedProductsCount = products.filter(p => p.status === 'Approved').length;
  const rejectedProductsCount = products.filter(p => p.status === 'Rejected').length;
  
  const totalCatalogInventoryValue = products.reduce((sum, p) => {
    const inv = inventory.find(i => i.productId === p.productId);
    const qty = inv ? inv.quantity : 0;
    return sum + ((p.price || 0) * qty);
  }, 0);

  const filteredProducts = products.filter(p => {
    const seller = users.find(u => u.userId === p.sellerId);
    const cat = categories.find(c => c.id === p.categoryId);
    const pStatus = p.status || 'Pending';
    
    // Status Filter
    if (productStatusFilter !== 'All' && pStatus !== productStatusFilter) {
      return false;
    }
    
    // Category Filter
    if (productCategoryFilter !== 'All' && String(p.categoryId) !== String(productCategoryFilter)) {
      return false;
    }
    
    // Search Query (matches name, product ID, seller name, or category)
    if (productSearchTerm.trim()) {
      const q = productSearchTerm.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchId = `#prd-${String(p.productId).padStart(4, '0')}`.includes(q) || String(p.productId).includes(q);
      const matchSeller = seller?.name?.toLowerCase().includes(q);
      const matchCat = cat?.name?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchSeller && !matchCat) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    if (productSortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (productSortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (productSortBy === 'stock-high') {
      const invA = inventory.find(i => i.productId === a.productId)?.quantity || 0;
      const invB = inventory.find(i => i.productId === b.productId)?.quantity || 0;
      return invB - invA;
    }
    return b.productId - a.productId;
  });

  // ─── User Management Calculations ───
  const filteredUsersList = users.filter(u => {
    if (userRoleFilter !== 'All' && u.role?.toLowerCase() !== userRoleFilter.toLowerCase()) {
      return false;
    }
    if (userStatusFilter !== 'All' && u.status?.toLowerCase() !== userStatusFilter.toLowerCase()) {
      return false;
    }
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q);
      const matchId = `#usr-${String(u.userId).padStart(4, '0')}`.includes(q) || String(u.userId).includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchId) return false;
    }
    return true;
  });

  const totalUserCount = users.length;
  const customerCount = users.filter(u => u.role?.toLowerCase() === 'customer').length;
  const sellerCount = users.filter(u => u.role?.toLowerCase() === 'seller').length;
  const adminCount = users.filter(u => u.role?.toLowerCase() === 'admin').length;
  const activeUserCount = users.filter(u => u.status?.toLowerCase() === 'active').length;

  // ─── Seller Management Calculations ───
  const sellersList = users.filter(u => u.role?.toLowerCase() === 'seller');
  const filteredSellersList = sellersList.filter(s => {
    if (sellerStatusFilter !== 'All' && s.status?.toLowerCase() !== sellerStatusFilter.toLowerCase()) {
      return false;
    }
    if (sellerSearchQuery.trim()) {
      const q = sellerSearchQuery.toLowerCase();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchEmail = s.email?.toLowerCase().includes(q);
      const matchPhone = s.phone?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const activeSellersCount = sellersList.filter(s => s.status?.toLowerCase() === 'active').length;
  const pendingSellersCount = sellersList.filter(s => s.status?.toLowerCase() === 'pending').length;
  const inactiveSellersCount = sellersList.filter(s => s.status?.toLowerCase() === 'inactive' || s.status?.toLowerCase() === 'suspended').length;

  // System Alerts
  const systemAlerts = [
    { id: 1, type: 'danger', title: `Low stock alert for ${lowStockCount || 36} products`, subtitle: 'Check inventory immediately', time: '10 min ago' },
    { id: 2, type: 'warning', title: `${pendingSellers.length || 5} new seller registration requests`, subtitle: 'Pending verification', time: '1 hour ago' },
    { id: 3, type: 'info', title: '12 payments pending verification', subtitle: 'Requires manual review', time: '2 hours ago' },
    { id: 4, type: 'success', title: 'System backup completed successfully', subtitle: 'All data is secure', time: 'Today, 02:00 AM' }
  ];

  const triggerMessage = (text) => {
    setActionMsg(text);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catNameInput) return;
    const isEditing = Boolean(editingCategoryId);
    try {
      const selectedBrand = catTypeInput === 'sub' && catBrandInput ? brands.find(b => b.name.toLowerCase() === catBrandInput.trim().toLowerCase()) : null;
      const brandIdToSend = selectedBrand ? selectedBrand.id : '';

      let actualParentId = catParentInput;
      if (catTypeInput === 'sub' && catParentInput === 'other') {
        if (!newParentCategoryName) {
          triggerMessage('Please provide a name for the new parent category.');
          return;
        }
        const newParentCategory = await addCategory(newParentCategoryName, 'Layers', '', '');
        actualParentId = newParentCategory.id;
      }

      if (isEditing) {
        const category = categories.find(item => item.id === editingCategoryId);
        await updateCategory(editingCategoryId, catNameInput, catTypeInput === 'sub' ? actualParentId : '', category?.status || 'Active', brandIdToSend);
      } else {
        await addCategory(catNameInput, 'Layers', catTypeInput === 'sub' ? actualParentId : '', brandIdToSend);
      }
      setCatNameInput('');
      setCatTypeInput('main');
      setCatParentInput('');
      setNewParentCategoryName('');
      setCatBrandInput('');
      setEditingCategoryId(null);
      setShowAddCategoryModal(false);
      triggerMessage(isEditing ? 'Category updated successfully!' : 'Category created successfully!');
    } catch (error) {
      triggerMessage(error.message);
    }
  };

  const handleAddBrandSubmit = (e) => {
    e.preventDefault();
    if (!brandNameInput) return;
    addBrand(brandNameInput, brandDescInput || 'Brand partner');
    setBrandNameInput('');
    setBrandDescInput('');
    setShowAddBrandModal(false);
    triggerMessage('Brand created successfully!');
  };

  const openCategoryForm = (type) => {
    setActiveSection(type === 'sub' ? 'subcategories' : 'categories');
    setCatNameInput('');
    setCatTypeInput(type);
    setCatParentInput('');
    setNewParentCategoryName('');
    setEditingCategoryId(null);
    setShowAddCategoryModal(true);
    setSidebarMobileOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* ─── LEFT SIDEBAR (DARK NAVY #0F172A) ────────────────────────────────── */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#0F172A] text-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShoppingBag size={20} color="white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-base tracking-tight text-white">SMUNI Market</p>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Live" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enterprise Admin</p>
              </div>
            </div>
            <button onClick={() => setSidebarMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)]">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
              { id: 'users', label: 'User Directory', icon: Users, badge: users.length, badgeColor: 'bg-slate-800 text-slate-300' },
              { id: 'sellers', label: 'Vendor & Sellers', icon: Store, badge: pendingSellers.length > 0 ? `${pendingSellers.length} New` : sellers.length, badgeColor: pendingSellers.length > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300' },
              { id: 'products', label: 'Catalog & Products', icon: Package, badge: products.length, badgeColor: 'bg-slate-800 text-slate-300' },
              { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Pending` : orders.length, badgeColor: pendingOrdersCount > 0 ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300' },
              { id: 'payments', label: 'Financial Ledger', icon: CreditCard, badge: payments.length, badgeColor: 'bg-slate-800 text-slate-300' },
              { id: 'deliveries', label: 'Fleet & Logistics', icon: Truck, badge: shippedOrdersCount > 0 ? `${shippedOrdersCount} Transit` : null, badgeColor: 'bg-orange-500 text-white' },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart2, badge: null },
              { id: 'settings', label: 'Platform Settings', icon: Settings, badge: null },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarMobileOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={13} className={isActive ? 'text-white' : 'text-slate-600'} />
                  </div>
                </button>
              );
            })}

            {/* Categories Submenu */}
            <button
              onClick={() => { setCategoriesMenuOpen(open => !open); setActiveSection('categories'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                ['categories', 'subcategories'].includes(activeSection)
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3"><Layers size={17} /> Category Tree</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {categories.length}
                </span>
                <ChevronDown size={14} className={`transition-transform ${categoriesMenuOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {categoriesMenuOpen && (
              <div className="ml-4 pl-3 border-l border-slate-700 space-y-1 pt-1">
                <button
                  onClick={() => { setActiveSection('categories'); setShowAddCategoryModal(false); setSidebarMobileOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${activeSection === 'categories' && !showAddCategoryModal ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'}`}
                >
                  Category Hierarchy
                </button>
                <button
                  onClick={() => openCategoryForm('main')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Category
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <p className="text-[10px] font-extrabold text-slate-300">Addis Ababa Node</p>
                <p className="text-[9px] text-slate-500">Chapa & API 100% Live</p>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-900/50"
              title="Open Customer Marketplace"
            >
              <ExternalLink size={10} /> Live Store
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut size={16} />
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] font-mono text-slate-600">v2.4</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {sidebarMobileOpen && (
        <div onClick={() => setSidebarMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      )}

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TOP BAR */}
        <header className="bg-white/85 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-all duration-300">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button onClick={() => setSidebarMobileOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900 p-1">
              <Menu size={22} />
            </button>

            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Global search: Orders, Customers, Products, Vendors..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Live Storefront Button */}
            <Link
              to="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors shadow-2xs"
              title="Open Customer Marketplace Front"
            >
              <Store size={14} className="text-slate-500" />
              <span>Storefront</span>
              <ExternalLink size={11} className="text-slate-400" />
            </Link>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors shadow-2xs"
                title="System Notifications & Action Items"
              >
                <Bell size={17} />
                {(pendingOrdersCount + pendingSellers.length + (lowStockCount > 0 ? 1 : 0)) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {pendingOrdersCount + pendingSellers.length + (lowStockCount > 0 ? 1 : 0)}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-indigo-600" />
                      <h4 className="text-xs font-black text-slate-900">Platform Notifications</h4>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      Live Stream
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {pendingOrdersCount > 0 && (
                      <div
                        onClick={() => { setActiveSection('orders'); setNotificationsOpen(false); }}
                        className="p-3 hover:bg-blue-50/50 transition-colors cursor-pointer flex items-start gap-2.5 text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <ShoppingBag size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{pendingOrdersCount} Orders Awaiting Approval</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Requires confirmation & dispatch</p>
                        </div>
                      </div>
                    )}

                    {pendingSellers.length > 0 && (
                      <div
                        onClick={() => { setActiveSection('sellers'); setNotificationsOpen(false); }}
                        className="p-3 hover:bg-purple-50/50 transition-colors cursor-pointer flex items-start gap-2.5 text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Store size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{pendingSellers.length} Merchant Stores Pending</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting store KYC approval</p>
                        </div>
                      </div>
                    )}

                    {lowStockCount > 0 && (
                      <div
                        onClick={() => { setActiveSection('products'); setNotificationsOpen(false); }}
                        className="p-3 hover:bg-red-50/50 transition-colors cursor-pointer flex items-start gap-2.5 text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{lowStockCount} Products Low in Stock</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Inventory running low (&lt; 5 units)</p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-emerald-50/30 flex items-start gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">Database & Chapa Gateway Connected</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Ethiopian Birr transactions active</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button onClick={() => setNotificationsOpen(false)} className="text-[11px] font-bold text-slate-500 hover:text-slate-800">
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-extrabold text-slate-800 leading-tight">{currentUser?.name || 'Admin User'}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{currentUser?.role || 'Super Administrator'}</p>
                </div>
                <ChevronDown size={13} className="text-slate-400 ml-0.5" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                  <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900">{currentUser?.name || 'Admin'}</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">{currentUser?.email || 'admin@smunimarket.com'}</p>
                  </div>
                  <div className="py-1.5">
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); setActiveSection('settings'); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                    >
                      <Settings size={14} /> System Settings
                    </button>
                    <Link
                      to="/"
                      target="_blank"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                    >
                      <Store size={14} /> Open Storefront
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logoutUser();
                        navigate('/admin/login');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Action Alert Banner */}
        {actionMsg && (
          <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl font-bold flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              {actionMsg}
            </span>
            <button onClick={() => setActionMsg('')} className="text-emerald-500 hover:text-emerald-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* MAIN BODY CONTENT DEPENDING ON ACTIVE SECTION */}
        <div className="p-6 space-y-6 flex-1">
          {/* ─── 1. DASHBOARD OVERVIEW ───────────────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Operational Launchpad Hero */}
              <div className="bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
                {/* Decorative background glows */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Addis Ababa Node • Operational
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-bold">
                        <Calendar size={13} className="text-slate-400" />
                        {todayFormatted}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {timeGreeting}, {currentUser?.name || 'Administrator'}! 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      Marketplace overview: <span className="text-emerald-400 font-black">ETB {totalRevenue.toLocaleString()}</span> settled volume across <span className="text-white font-black">{totalOrdersCount}</span> orders. There are <span className="text-amber-400 font-black">{totalActionCount}</span> actionable items requiring admin review.
                    </p>
                  </div>

                  {/* Launchpad Quick Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openCategoryForm('main')}
                      className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                    >
                      <Plus size={15} /> Add Category
                    </button>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
                    >
                      <ShoppingBag size={15} className="text-blue-400" />
                      <span>Orders ({pendingOrdersCount})</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('sellers')}
                      className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
                    >
                      <Store size={15} className="text-purple-400" />
                      <span>Sellers ({pendingSellers.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('payments')}
                      className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
                    >
                      <CreditCard size={15} className="text-emerald-400" />
                      <span>Ledger</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 High-Impact Enterprise KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* 1. Gross Revenue (GMV) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Gross GMV</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Wallet size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-tight">ETB {totalRevenue.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Chapa: ETB {chapaRevenue.toLocaleString()}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp size={13} /> +18.4% MoM
                    </span>
                    <span className="text-slate-400">COD: ETB {codRevenue.toLocaleString()}</span>
                  </div>
                </div>

                {/* 2. Total Orders & AOV */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-blue-500 tracking-wider">Total Orders</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-tight">{totalOrdersCount.toLocaleString()} Orders</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Avg Order: ETB {avgOrderValue.toLocaleString()}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-blue-600 flex items-center gap-0.5">
                      <TrendingUp size={13} /> +15.6% MoM
                    </span>
                    <span className="text-amber-600 font-black">{pendingOrdersCount} Pending</span>
                  </div>
                </div>

                {/* 3. Community Accounts */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-purple-500 tracking-wider">Ecosystem Users</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Users size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-tight">{totalUsersCount.toLocaleString()} Accounts</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">{customers.length} Customers • {sellers.length} Vendors</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-purple-600 flex items-center gap-0.5">
                      <UserCheck size={13} /> Active Core
                    </span>
                    <span className="text-slate-400">{deliveryAgents.length} Couriers</span>
                  </div>
                </div>

                {/* 4. Catalog Valuation */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-teal-600 tracking-wider">Catalog Value</span>
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <Package size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-tight truncate">ETB {totalCatalogInventoryValue.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">{products.length} Products Listed</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-teal-600 flex items-center gap-0.5">
                      <CheckCircle size={13} /> {approvedProductsCount} Approved
                    </span>
                    <span className={lowStockCount > 0 ? 'text-red-500 font-black' : 'text-slate-400'}>
                      {lowStockCount} Low Stock
                    </span>
                  </div>
                </div>

                {/* 5. Fleet Delivery Rate */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-amber-500 tracking-wider">Fleet Success</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Truck size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-tight">{deliverySuccessRate}% Success</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">{deliveredOrdersCount} Delivered • {shippedOrdersCount} In Transit</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-600 flex items-center gap-0.5">
                      <Activity size={13} /> Live Dispatch
                    </span>
                    <span className="text-slate-400">{activeDriversCount} Drivers</span>
                  </div>
                </div>

                {/* 6. Action Queue Radar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-rose-500 tracking-wider">Action Queue</span>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <AlertTriangle size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black text-rose-600 leading-tight">{totalActionCount} Critical Items</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Pending approval & restock</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-rose-600 flex items-center gap-1 font-extrabold animate-pulse">
                      <CircleDot size={10} className="fill-rose-500" /> Triage Queue
                    </span>
                    <button onClick={() => setActiveSection('orders')} className="text-indigo-600 hover:underline">
                      Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Analytics Row: Revenue Velocity + Fulfillment Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Interactive Revenue Performance Chart (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                          <TrendingUp size={17} className="text-indigo-600" />
                          Marketplace Revenue Velocity
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                          ETB Gross transaction trajectory & daily settlement
                        </p>
                      </div>

                      {/* Timeframe Switcher */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold self-start sm:self-auto">
                        {[
                          { key: '7d', label: '7D' },
                          { key: '30d', label: '30D' },
                          { key: '90d', label: '90D' },
                        ].map(t => (
                          <button
                            key={t.key}
                            onClick={() => setChartTimeRange(t.key)}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              chartTimeRange === t.key
                                ? 'bg-white text-indigo-600 shadow-xs font-black'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Metric Ribbon */}
                    <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Period Peak</p>
                        <p className="font-black text-slate-800 text-xs sm:text-sm mt-0.5">{activeChartData.peakDay}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Avg Daily Gross</p>
                        <p className="font-black text-indigo-600 text-xs sm:text-sm mt-0.5">{activeChartData.avgDaily}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Period Total</p>
                        <p className="font-black text-emerald-600 text-xs sm:text-sm mt-0.5">{activeChartData.totalPeriod}</p>
                      </div>
                    </div>

                    {/* SVG Curve Chart */}
                    <div className="mt-4 h-44 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="modernRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.30" />
                            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeDasharray="4,4" strokeWidth="1" />
                        <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeDasharray="4,4" strokeWidth="1" />
                        <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeDasharray="4,4" strokeWidth="1" />

                        {/* Area Gradient */}
                        <path
                          d={
                            chartTimeRange === '7d'
                              ? "M 0 100 Q 70 80 140 70 T 280 40 T 420 20 T 500 35 L 500 130 L 0 130 Z"
                              : chartTimeRange === '90d'
                              ? "M 0 90 Q 150 60 300 40 T 500 15 L 500 130 L 0 130 Z"
                              : "M 0 95 Q 125 55 250 25 T 375 40 T 500 20 L 500 130 L 0 130 Z"
                          }
                          fill="url(#modernRevenueGrad)"
                        />
                        {/* Smooth Line */}
                        <path
                          d={
                            chartTimeRange === '7d'
                              ? "M 0 100 Q 70 80 140 70 T 280 40 T 420 20 T 500 35"
                              : chartTimeRange === '90d'
                              ? "M 0 90 Q 150 60 300 40 T 500 15"
                              : "M 0 95 Q 125 55 250 25 T 375 40 T 500 20"
                          }
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* X-Axis Labels */}
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2 px-1">
                        {activeChartData.labels.map((lbl, idx) => (
                          <span key={idx}>{lbl}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Pipeline & Payment Health (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                          <Truck size={17} className="text-amber-500" />
                          Fulfillment & Logistics Pipeline
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">Live order lifecycle breakdown</p>
                      </div>
                      <button onClick={() => setActiveSection('deliveries')} className="text-xs font-black text-indigo-600 hover:underline">
                        Fleet View
                      </button>
                    </div>

                    {/* Visual Segment Bar */}
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                        <div style={{ width: `${totalOrdersCount > 0 ? (deliveredOrdersCount / totalOrdersCount) * 100 : 50}%` }} className="bg-emerald-500" title="Delivered" />
                        <div style={{ width: `${totalOrdersCount > 0 ? (shippedOrdersCount / totalOrdersCount) * 100 : 25}%` }} className="bg-blue-500" title="In Transit" />
                        <div style={{ width: `${totalOrdersCount > 0 ? (processingOrdersCount / totalOrdersCount) * 100 : 15}%` }} className="bg-amber-500" title="Processing" />
                        <div style={{ width: `${totalOrdersCount > 0 ? (pendingOrdersCount / totalOrdersCount) * 100 : 10}%` }} className="bg-purple-500" title="Pending" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div onClick={() => setActiveSection('orders')} className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-colors">
                          <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Delivered
                          </span>
                          <span className="font-black text-emerald-900">{deliveredOrdersCount}</span>
                        </div>
                        <div onClick={() => setActiveSection('deliveries')} className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors">
                          <span className="flex items-center gap-1.5 font-bold text-blue-800">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Transit
                          </span>
                          <span className="font-black text-blue-900">{shippedOrdersCount}</span>
                        </div>
                        <div onClick={() => setActiveSection('orders')} className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors">
                          <span className="flex items-center gap-1.5 font-bold text-amber-800">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Processing
                          </span>
                          <span className="font-black text-amber-900">{processingOrdersCount}</span>
                        </div>
                        <div onClick={() => setActiveSection('orders')} className="p-2 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-100/70 transition-colors">
                          <span className="flex items-center gap-1.5 font-bold text-purple-800">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Pending
                          </span>
                          <span className="font-black text-purple-900">{pendingOrdersCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dual Gateway Split Card */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-2">Payment Settlement Split</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-700 flex items-center gap-1">
                              <CreditCard size={13} className="text-emerald-600" /> Chapa Online
                            </span>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {totalRevenue > 0 ? Math.round((chapaRevenue / totalRevenue) * 100) : 75}%
                            </span>
                          </div>
                          <p className="font-black text-slate-900 text-xs mt-1">ETB {chapaRevenue.toLocaleString()}</p>
                        </div>

                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-700 flex items-center gap-1">
                              <Banknote size={13} className="text-amber-600" /> Cash (COD)
                            </span>
                            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              {totalRevenue > 0 ? Math.round((codRevenue / totalRevenue) * 100) : 25}%
                            </span>
                          </div>
                          <p className="font-black text-slate-900 text-xs mt-1">ETB {codRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Launchpad Grid: Live Stream + Vendors/Categories + Action Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Live Orders Real-time Stream (Col 5) */}
                <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-blue-600" />
                        Live Orders Stream
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400">Incoming marketplace transactions</p>
                    </div>
                    <button onClick={() => setActiveSection('orders')} className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1">
                      View All <ChevronRight size={13} />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black">
                        <tr>
                          <th className="px-3 py-2 text-left rounded-l-lg">Order</th>
                          <th className="px-3 py-2 text-left">Customer</th>
                          <th className="px-3 py-2 text-left">Total</th>
                          <th className="px-3 py-2 text-left">Status</th>
                          <th className="px-3 py-2 text-right rounded-r-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentOrdersList.map(o => (
                          <tr key={o.orderId} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3 py-2.5">
                              <span className="font-black text-indigo-600 block">#ORD-{o.orderId}</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[80px] block">{o.sellerName}</span>
                            </td>
                            <td className="px-3 py-2.5 font-bold text-slate-800 truncate max-w-[95px]">{o.customerName}</td>
                            <td className="px-3 py-2.5 font-black text-slate-900 whitespace-nowrap">ETB {o.totalAmount.toLocaleString()}</td>
                            <td className="px-3 py-2.5">
                              <Badge
                                label={o.status}
                                color={
                                  o.status === 'Delivered' ? 'green' :
                                  o.status === 'On The Way' ? 'blue' :
                                  o.status === 'Cancelled' ? 'red' : 'yellow'
                                }
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setSelectedOrderDetail(o)}
                                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Inspect Order Details"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() => setSelectedOrderInvoice(o)}
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Print Commercial Invoice"
                                >
                                  <Receipt size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Top Merchants & Category Leaderboard (Col 4) */}
                <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-5">
                  {/* Top Vendors Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <Store size={16} className="text-purple-600" />
                        Top Merchant Stores
                      </h3>
                      <button onClick={() => setActiveSection('sellers')} className="text-xs font-black text-purple-600 hover:underline">
                        All ({sellers.length})
                      </button>
                    </div>

                    <div className="space-y-2">
                      {topVendorsList.slice(0, 3).map((v, idx) => (
                        <div key={v.userId || idx} className="p-2.5 bg-slate-50 hover:bg-purple-50/50 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-800 truncate">{v.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{v.productsCount} listings • {v.ordersCount} orders</p>
                            </div>
                          </div>
                          <span className="font-black text-xs text-slate-900 shrink-0">
                            ETB {v.grossSales.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Categories Progress */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider text-slate-400">
                        Category Velocity
                      </h3>
                      <button onClick={() => setActiveSection('categories')} className="text-xs font-bold text-indigo-600 hover:underline">
                        Tree
                      </button>
                    </div>

                    <div className="space-y-2">
                      {topSellingCategories.slice(0, 3).map(cat => (
                        <div key={cat.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-800">{cat.name}</span>
                            <span className="text-indigo-600">ETB {cat.revenue.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${totalRevenue > 0 ? Math.min(100, Math.round((cat.revenue / totalRevenue) * 100)) : 40}%` }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Action Radar & Operational Health (Col 3) */}
                <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      Action Radar
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {totalActionCount} Open
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {pendingOrdersCount > 0 && (
                      <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                            <ShoppingBag size={14} className="text-blue-600" /> Dispatch Required
                          </span>
                          <span className="text-[10px] font-black bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded-md">
                            {pendingOrdersCount}
                          </span>
                        </div>
                        <p className="text-[11px] text-blue-700 leading-snug">
                          {pendingOrdersCount} customer orders await packaging & driver dispatch.
                        </p>
                        <button
                          onClick={() => setActiveSection('orders')}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-colors text-center"
                        >
                          Review Orders
                        </button>
                      </div>
                    )}

                    {pendingSellers.length > 0 && (
                      <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                            <Store size={14} className="text-purple-600" /> Vendor KYC
                          </span>
                          <span className="text-[10px] font-black bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded-md">
                            {pendingSellers.length}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-700 leading-snug">
                          New merchant partner stores pending verification.
                        </p>
                        <button
                          onClick={() => setActiveSection('sellers')}
                          className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl transition-colors text-center"
                        >
                          Verify Vendors
                        </button>
                      </div>
                    )}

                    {lowStockCount > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber-600" /> Inventory Depletion
                          </span>
                          <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md">
                            {lowStockCount}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-700 leading-snug">
                          {lowStockCount} catalog items are low in stock (&lt; 5 units).
                        </p>
                        <button
                          onClick={() => setActiveSection('products')}
                          className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl transition-colors text-center"
                        >
                          Manage Stock
                        </button>
                      </div>
                    )}

                    {totalActionCount === 0 && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                        <CheckCircle size={24} className="text-emerald-600 mx-auto" />
                        <p className="font-black text-emerald-900 text-xs">All Clear!</p>
                        <p className="text-[11px] text-emerald-700">No pending triage items currently.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── 2. USER MANAGEMENT ─────────────────────────────────────────── */}
          {activeSection === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              {/* User KPI Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Total Registered Users */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Total Accounts</p>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Users size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{totalUserCount.toLocaleString()}</p>
                </div>

                {/* Customers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-blue-500 tracking-wider">Customers</p>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Users size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-blue-600">{customerCount.toLocaleString()}</p>
                </div>

                {/* Sellers / Merchants */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-purple-500 tracking-wider">Sellers</p>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Store size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-purple-600">{sellerCount.toLocaleString()}</p>
                </div>

                {/* Admins & Staff */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-rose-500 tracking-wider">Admins & Staff</p>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Shield size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-rose-600">{adminCount.toLocaleString()}</p>
                </div>

                {/* Active Rate */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md flex flex-col justify-between space-y-2 col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-indigo-200 tracking-wider">Active Rate</p>
                    <div className="w-8 h-8 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center font-bold">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-400">
                      {totalUserCount > 0 ? Math.round((activeUserCount / totalUserCount) * 100) : 100}%
                    </p>
                    <p className="text-[10px] text-indigo-300 font-medium mt-0.5">{activeUserCount} Active Accounts</p>
                  </div>
                </div>
              </div>

              {/* User Table Container */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 space-y-4">
                {/* Header & Reset Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">User Accounts Directory</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Manage permissions, role assignments, and account statuses directly in database. Showing <strong className="text-slate-800">{filteredUsersList.length}</strong> of {totalUserCount} accounts.
                    </p>
                  </div>

                  {(userSearchQuery || userRoleFilter !== 'All' || userStatusFilter !== 'All') && (
                    <button 
                      onClick={() => {
                        setUserSearchQuery('');
                        setUserRoleFilter('All');
                        setUserStatusFilter('All');
                      }}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <RefreshCw size={12} /> Reset User Filters
                    </button>
                  )}
                </div>

                {/* Filtration Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                  {/* Search Bar (6 cols) */}
                  <div className="sm:col-span-6 relative">
                    <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, phone, or #USR ID..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
                    />
                    {userSearchQuery && (
                      <button 
                        onClick={() => setUserSearchQuery('')} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Role Dropdown (3 cols) */}
                  <div className="sm:col-span-3">
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
                    >
                      <option value="All">All Roles</option>
                      <option value="customer">Customers ({customerCount})</option>
                      <option value="seller">Sellers / Merchants ({sellerCount})</option>
                      <option value="admin">Administrators ({adminCount})</option>
                      <option value="delivery">Delivery Staff</option>
                    </select>
                  </div>

                  {/* Status Dropdown (3 cols) */}
                  <div className="sm:col-span-3">
                    <select
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
                    >
                      <option value="All">All Account Statuses</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending Review</option>
                      <option value="inactive">Inactive / Suspended</option>
                    </select>
                  </div>
                </div>

                {/* User Directory Table */}
                {filteredUsersList.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left">User ID</th>
                          <th className="px-4 py-3 text-left">Account Member</th>
                          <th className="px-4 py-3 text-left">Email Address</th>
                          <th className="px-4 py-3 text-left">Phone Number</th>
                          <th className="px-4 py-3 text-left">Assigned Role</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-right">Account Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsersList.map(u => {
                          const initials = (u.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          return (
                            <tr key={u.userId} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-mono text-[11px] font-extrabold text-slate-500">
                                #USR-{String(u.userId).padStart(4, '0')}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-xs shadow-2xs shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900">{u.name}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Verified User</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 font-medium">{u.email}</td>
                              <td className="px-4 py-3 text-slate-500 font-mono">{u.phone || '—'}</td>
                              <td className="px-4 py-3">
                                {(() => {
                                  const rawRole = (u.role || 'Customer').toLowerCase();
                                  const roleVal = rawRole === 'admin' ? 'Admin' : rawRole === 'seller' ? 'Seller' : rawRole === 'delivery' || rawRole === 'delivery_personnel' ? 'Delivery' : 'Customer';
                                  const colorStyles = {
                                    Admin: 'bg-red-100 text-red-700 border-red-200',
                                    Seller: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                                    Delivery: 'bg-amber-100 text-amber-700 border-amber-200',
                                    Customer: 'bg-blue-100 text-blue-700 border-blue-200'
                                  };
                                  return (
                                    <span className={`px-3 py-1 text-[11px] font-extrabold rounded-full border ${colorStyles[roleVal] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                      {roleVal}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-4 py-3">
                                <Badge 
                                  label={u.status || 'Active'} 
                                  color={u.status?.toLowerCase() === 'active' ? 'green' : u.status?.toLowerCase() === 'pending' ? 'yellow' : 'red'} 
                                />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {u.status?.toLowerCase() === 'active' ? (
                                    <button
                                      onClick={async () => {
                                        await updateUserRoleAndStatus(u.userId, null, 'inactive');
                                        triggerMessage(`Suspended ${u.name}`);
                                      }}
                                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-amber-200 text-xs transition-colors"
                                    >
                                      Suspend
                                    </button>
                                  ) : (
                                    <button
                                      onClick={async () => {
                                        await updateUserRoleAndStatus(u.userId, null, 'active');
                                        triggerMessage(`Activated ${u.name}`);
                                      }}
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 text-xs transition-colors"
                                    >
                                      Activate
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <Users size={40} className="mx-auto text-slate-300" />
                    <h3 className="text-sm font-black text-slate-700">No Users Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Adjust your role or status filter to view user accounts in the directory.
                    </p>
                    <button 
                      onClick={() => {
                        setUserSearchQuery('');
                        setUserRoleFilter('All');
                        setUserStatusFilter('All');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <RefreshCw size={14} /> Reset User Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── 3. SELLER MANAGEMENT ───────────────────────────────────────── */}
          {activeSection === 'sellers' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Seller KPI Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Sellers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Registered Sellers</p>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Store size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{sellersList.length.toLocaleString()} <span className="text-xs font-bold text-slate-400">Stores</span></p>
                </div>

                {/* Approved & Active Sellers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-emerald-500 tracking-wider">Approved Active</p>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-emerald-600">{activeSellersCount.toLocaleString()} <span className="text-xs font-bold text-emerald-500">Live</span></p>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-amber-500 tracking-wider">Pending Review</p>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Clock size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-amber-600">{pendingSellersCount.toLocaleString()} <span className="text-xs font-bold text-amber-500">Action Req.</span></p>
                </div>

                {/* Suspended Sellers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-rose-400 tracking-wider">Suspended Stores</p>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <XCircle size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-rose-600">{inactiveSellersCount.toLocaleString()} <span className="text-xs font-bold text-rose-400">Blocked</span></p>
                </div>
              </div>

              {/* Seller Directory Container */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 space-y-4">
                {/* Header & Reset Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Seller Approvals & Store Moderation</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Real-time approval workflow and seller account control. Showing <strong className="text-slate-800">{filteredSellersList.length}</strong> of {sellersList.length} registered merchant stores.
                    </p>
                  </div>

                  {(sellerSearchQuery || sellerStatusFilter !== 'All') && (
                    <button 
                      onClick={() => {
                        setSellerSearchQuery('');
                        setSellerStatusFilter('All');
                      }}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <RefreshCw size={12} /> Reset Seller Filters
                    </button>
                  )}
                </div>

                {/* Filtration Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                  {/* Search Bar (8 cols) */}
                  <div className="sm:col-span-8 relative">
                    <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search sellers by store name, owner email, or phone..."
                      value={sellerSearchQuery}
                      onChange={(e) => setSellerSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
                    />
                    {sellerSearchQuery && (
                      <button 
                        onClick={() => setSellerSearchQuery('')} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Status Dropdown (4 cols) */}
                  <div className="sm:col-span-4">
                    <select
                      value={sellerStatusFilter}
                      onChange={(e) => setSellerStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
                    >
                      <option value="All">All Store Statuses ({sellersList.length})</option>
                      <option value="pending">Pending Review ({pendingSellersCount})</option>
                      <option value="active">Active & Verified ({activeSellersCount})</option>
                      <option value="inactive">Suspended Stores ({inactiveSellersCount})</option>
                    </select>
                  </div>
                </div>

                {/* Seller Table */}
                {filteredSellersList.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left">Store ID</th>
                          <th className="px-4 py-3 text-left">Store / Business Name</th>
                          <th className="px-4 py-3 text-left">Merchant Contact</th>
                          <th className="px-4 py-3 text-left">Listed Products</th>
                          <th className="px-4 py-3 text-left">Verification Status</th>
                          <th className="px-4 py-3 text-right">Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSellersList.map(s => {
                          const sellerProductsCount = products.filter(p => p.sellerId === s.userId).length;
                          const initials = (s.name || 'S').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                          return (
                            <tr key={s.userId} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-mono text-[11px] font-extrabold text-slate-500">
                                #SLR-{String(s.userId).padStart(4, '0')}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-2xs shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900">{s.name}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Merchant Store</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-bold text-slate-800">{s.email}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{s.phone || 'No Phone'}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                                  {sellerProductsCount} Items
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Badge 
                                  label={s.status || 'Active'} 
                                  color={s.status?.toLowerCase() === 'active' ? 'green' : s.status?.toLowerCase() === 'pending' ? 'yellow' : 'red'} 
                                />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {s.status?.toLowerCase() === 'pending' && (
                                    <button 
                                      onClick={async () => { 
                                        await updateSellerStatus(s.userId, 'Active'); 
                                        triggerMessage(`Approved merchant store: ${s.name}`); 
                                      }} 
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-2xs"
                                    >
                                      Approve Merchant
                                    </button>
                                  )}
                                  {s.status?.toLowerCase() === 'active' && (
                                    <button 
                                      onClick={async () => { 
                                        await updateSellerStatus(s.userId, 'Inactive'); 
                                        triggerMessage(`Suspended store: ${s.name}`); 
                                      }} 
                                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-lg border border-amber-200 text-xs transition-colors"
                                    >
                                      Suspend Store
                                    </button>
                                  )}
                                  {(s.status?.toLowerCase() === 'inactive' || s.status?.toLowerCase() === 'suspended') && (
                                    <button 
                                      onClick={async () => { 
                                        await updateSellerStatus(s.userId, 'Active'); 
                                        triggerMessage(`Reactivated store: ${s.name}`); 
                                      }} 
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors"
                                    >
                                      Reactivate Store
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setActiveSection('products');
                                      setProductSearchTerm(s.name);
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                                    title="View all products listed by this seller"
                                  >
                                    View Products
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <Store size={40} className="mx-auto text-slate-300" />
                    <h3 className="text-sm font-black text-slate-700">No Sellers Matched Filter</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Adjust your search query or seller status selector to view registered merchants.
                    </p>
                    <button 
                      onClick={() => {
                        setSellerSearchQuery('');
                        setSellerStatusFilter('All');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <RefreshCw size={14} /> Reset Seller Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── 4. PRODUCT MANAGEMENT ──────────────────────────────────────── */}
          {activeSection === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Product Statistics Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Total Products */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Total Catalog</p>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Package size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{totalProductsCount.toLocaleString()} <span className="text-xs font-bold text-slate-400">Items</span></p>
                </div>

                {/* Pending Moderation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-amber-500 tracking-wider">Pending Review</p>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <AlertTriangle size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-amber-600">{pendingProductsCount.toLocaleString()} <span className="text-xs font-bold text-amber-500">Products</span></p>
                </div>

                {/* Approved Products */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-emerald-500 tracking-wider">Approved Active</p>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-emerald-600">{approvedProductsCount.toLocaleString()} <span className="text-xs font-bold text-emerald-500">Live</span></p>
                </div>

                {/* Rejected Products */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-red-400 tracking-wider">Rejected</p>
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <XCircle size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-red-600">{rejectedProductsCount.toLocaleString()} <span className="text-xs font-bold text-red-400">Blocked</span></p>
                </div>

                {/* Total Inventory Valuation */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md flex flex-col justify-between space-y-2 col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-indigo-200 tracking-wider">Catalog Valuation</p>
                    <div className="w-8 h-8 rounded-xl bg-white/10 text-indigo-300 flex items-center justify-center font-bold">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">ETB {totalCatalogInventoryValue.toLocaleString()}</p>
                    <p className="text-[10px] text-indigo-300 font-medium mt-0.5">Est. Total Stock Value</p>
                  </div>
                </div>
              </div>

              {/* Main Product Table & Filter Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 space-y-4">
                {/* Title & Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Product Catalog & Moderation Control</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of {products.length} total products in database.
                    </p>
                  </div>

                  {/* Quick Filter Reset */}
                  {(productSearchTerm || productStatusFilter !== 'All' || productCategoryFilter !== 'All') && (
                    <button 
                      onClick={() => {
                        setProductSearchTerm('');
                        setProductStatusFilter('All');
                        setProductCategoryFilter('All');
                      }}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <RefreshCw size={12} /> Clear Filters
                    </button>
                  )}
                </div>

                {/* Advanced Filtration & Search Controls Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                  {/* Search Input (5 cols) */}
                  <div className="lg:col-span-5 relative">
                    <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Filter by name, #PRD-ID, or seller..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
                    />
                    {productSearchTerm && (
                      <button 
                        onClick={() => setProductSearchTerm('')} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Status Filter Tabs/Select (3 cols) */}
                  <div className="lg:col-span-3">
                    <select
                      value={productStatusFilter}
                      onChange={(e) => setProductStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
                    >
                      <option value="All">All Statuses ({products.length})</option>
                      <option value="Pending">Pending Moderation ({pendingProductsCount})</option>
                      <option value="Approved">Approved Live ({approvedProductsCount})</option>
                      <option value="Rejected">Rejected ({rejectedProductsCount})</option>
                    </select>
                  </div>

                  {/* Category Filter (2 cols) */}
                  <div className="lg:col-span-2">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By Filter (2 cols) */}
                  <div className="lg:col-span-2">
                    <select
                      value={productSortBy}
                      onChange={(e) => setProductSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="stock-high">Stock: Highest First</option>
                    </select>
                  </div>
                </div>

                {/* Product Catalog High-Density Table */}
                {filteredProducts.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left">Product ID</th>
                          <th className="px-4 py-3 text-left">Product & Variants</th>
                          <th className="px-4 py-3 text-left">Merchant / Seller</th>
                          <th className="px-4 py-3 text-left">Category</th>
                          <th className="px-4 py-3 text-left">Price (ETB)</th>
                          <th className="px-4 py-3 text-left">Stock Level</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-right">Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map(p => {
                          const seller = users.find(u => u.userId === p.sellerId);
                          const cat = categories.find(c => c.id === p.categoryId);
                          const inv = inventory.find(i => i.productId === p.productId);
                          const stockCount = inv ? inv.quantity : 0;
                          const hasVar = Array.isArray(p.variants) && p.variants.length > 0;
                          const pStatus = p.status || 'Pending';

                          return (
                            <tr 
                              key={p.productId} 
                              onClick={() => setSelectedProductDetails(p)}
                              className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                            >
                              <td className="px-4 py-3 font-mono text-[11px] font-extrabold text-slate-500">
                                #PRD-{String(p.productId).padStart(4, '0')}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-800">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'} 
                                    alt={p.name} 
                                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 group-hover:scale-105 transition-transform shrink-0" 
                                  />
                                  <div className="min-w-0">
                                    <p className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">{p.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {p.discount > 0 && (
                                        <span className="inline-block text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                          {p.discount}% OFF
                                        </span>
                                      )}
                                      {hasVar ? (
                                        <span className="inline-block text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                                          {p.variants.length} Variants
                                        </span>
                                      ) : (
                                        <span className="inline-block text-[9px] font-medium text-slate-400">
                                          Single SKU
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 font-medium">
                                <p className="font-bold text-slate-800 truncate max-w-[140px]">{seller?.name || 'Store Seller'}</p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{seller?.email || '—'}</p>
                              </td>
                              <td className="px-4 py-3 text-slate-500 font-medium">
                                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                                  {cat?.name || 'General'}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-black text-indigo-600">
                                ETB {p.price.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 font-bold">
                                {stockCount === 0 ? (
                                  <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold">Out of stock</span>
                                ) : stockCount < 5 ? (
                                  <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{stockCount.toLocaleString()} left</span>
                                ) : (
                                  <span className="text-emerald-600 font-bold">{stockCount.toLocaleString()} units</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <Badge label={pStatus} color={pStatus === 'Approved' ? 'green' : pStatus === 'Rejected' ? 'red' : 'yellow'} />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  {pStatus === 'Pending' && (
                                    <>
                                      <button 
                                        onClick={() => {
                                          updateProductStatus(p.productId, 'Approved');
                                          triggerMessage(`Approved "${p.name}"`);
                                        }} 
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-xs transition-colors shadow-2xs"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => {
                                          updateProductStatus(p.productId, 'Rejected');
                                          triggerMessage(`Rejected "${p.name}"`);
                                        }} 
                                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button 
                                    onClick={() => setSelectedProductDetails(p)} 
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors flex items-center gap-1"
                                  >
                                    <Eye size={13} /> View
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete product "${p.name}"?`)) {
                                        deleteProduct(p.productId);
                                        triggerMessage(`Product "${p.name}" deleted successfully.`);
                                      }
                                    }} 
                                    className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 border border-red-200"
                                    title="Delete Product"
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Empty Filter State */
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <Package size={40} className="mx-auto text-slate-300" />
                    <h3 className="text-sm font-black text-slate-700">No Products Matched Your Filter</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try adjusting your search query, status tab, or category selector to view catalog products.
                    </p>
                    <button 
                      onClick={() => {
                        setProductSearchTerm('');
                        setProductStatusFilter('All');
                        setProductCategoryFilter('All');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                    >
                      <RefreshCw size={14} /> Reset Product Filters
                    </button>
                  </div>
                )}

                {/* ─── MODERN PRODUCT DETAILS MODAL ─────────────────────────────── */}
                {selectedProductDetails && (
                  <AdminProductDetailsModal
                    product={selectedProductDetails}
                    users={users}
                    categories={categories}
                    inventory={inventory}
                    updateProductStatus={updateProductStatus}
                    deleteProduct={deleteProduct}
                    triggerMessage={triggerMessage}
                    onClose={() => setSelectedProductDetails(null)}
                  />
                )}
              </div>
            </div>
          )}

          {/* ─── 5. CATEGORY MANAGEMENT ─────────────────────────────────────── */}
          {(activeSection === 'categories' || activeSection === 'subcategories') && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">{isSubcategorySection ? 'Subcategory Management' : 'Category Management'} ({visibleCategories.length})</h2>
                <button onClick={() => { setEditingCategoryId(null); setCatNameInput(''); setCatTypeInput(isSubcategorySection ? 'sub' : 'main'); setCatParentInput(''); setCatBrandInput(''); setShowAddCategoryModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
                  <Plus size={16} /> Add {isSubcategorySection ? 'Subcategory' : 'Category'}
                </button>
              </div>

              {showAddCategoryModal && (
                <form onSubmit={handleAddCategorySubmit} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                  <p className="font-extrabold text-xs text-slate-800">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</p>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={catNameInput}
                    onChange={e => setCatNameInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                    required
                  />
                  <select
                    value={catTypeInput}
                    onChange={e => { setCatTypeInput(e.target.value); if (e.target.value === 'main') setCatParentInput(''); }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="main">Main category</option>
                    <option value="sub">Subcategory</option>
                  </select>
                  {catTypeInput === 'sub' && (
                    <>
                      <select
                        value={catParentInput}
                        onChange={e => setCatParentInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                        required
                      >
                        <option value="">Select parent category</option>
                        {categories.filter(category => category.id !== editingCategoryId && !category.parent_id).map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      {catParentInput === 'other' && (
                        <input
                          type="text"
                          placeholder="Type new parent category name"
                          value={newParentCategoryName}
                          onChange={e => setNewParentCategoryName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 mt-2"
                          required
                        />
                      )}
                      <div className="relative">
                        <input
                          list="brands-datalist"
                          value={catBrandInput}
                          onChange={e => setCatBrandInput(e.target.value)}
                          placeholder="Type or select associated brand (Optional)"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                        />
                        <datalist id="brands-datalist">
                          {Array.from(new Set(brands.map(b => b.name))).map((brandName, idx) => (
                            <option key={idx} value={brandName} />
                          ))}
                        </datalist>
                      </div>
                    </>
                  )}
                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg">Save Category</button>
                    <button type="button" onClick={() => { setShowAddCategoryModal(false); setEditingCategoryId(null); setCatNameInput(''); setCatTypeInput('main'); setCatParentInput(''); setNewParentCategoryName(''); setCatBrandInput(''); }} className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categoriesLoading && <p className="col-span-full text-xs text-slate-400">Loading categories...</p>}
                {!categoriesLoading && categoriesError && <p className="col-span-full text-xs text-red-500">{categoriesError}</p>}
                {!categoriesLoading && !categoriesError && visibleCategories.length === 0 && <p className="col-span-full text-xs text-slate-400">No {isSubcategorySection ? 'subcategories' : 'categories'} found. Add your first one.</p>}
                {!categoriesLoading && !categoriesError && visibleCategories.map(c => (
                  <div key={c.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                    <div>
                      <p className="font-extrabold text-xs text-slate-800">{c.name}</p>
                      <p className="text-[10px] text-slate-400">
  {c.parent?.name ? `Subcategory of ${c.parent.name}` : 'Main category'} 
  {c.brand_id ? ` · Brand: ${brands.find(b => b.id === c.brand_id)?.name || 'Unknown'}` : ''}
  · ID #{c.id}
</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingCategoryId(c.id); setCatNameInput(c.name); setCatTypeInput(c.parent_id ? 'sub' : 'main'); setCatParentInput(c.parent_id ? String(c.parent_id) : ''); setCatBrandInput(c.brand_id ? (brands.find(b => b.id === c.brand_id)?.name || '') : ''); setShowAddCategoryModal(true); }} className="text-indigo-500 hover:text-indigo-700">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={async () => {
                      try {
                        await deleteCategory(c.id);
                        triggerMessage(`Deleted category ${c.name}`);
                      } catch (error) {
                        triggerMessage(error.message);
                      }
                    }} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 6. BRAND MANAGEMENT ────────────────────────────────────────── */}
          {activeSection === 'brands' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Brand Management ({brands.length})</h2>
                <button onClick={() => setShowAddBrandModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
                  <Plus size={16} /> Add Brand
                </button>
              </div>

              {showAddBrandModal && (
                <form onSubmit={handleAddBrandSubmit} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                  <p className="font-extrabold text-xs text-slate-800">Add New Brand Partner</p>
                  <input
                    type="text"
                    placeholder="Brand Name"
                    value={brandNameInput}
                    onChange={e => setBrandNameInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={brandDescInput}
                    onChange={e => setBrandDescInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg">Save Brand</button>
                    <button type="button" onClick={() => setShowAddBrandModal(false)} className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Brand ID</th>
                      <th className="px-4 py-3 text-left">Brand Name</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brands.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-extrabold text-slate-900">#{b.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{b.name}</td>
                        <td className="px-4 py-3 text-slate-500">{b.description}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => { deleteBrand(b.id); triggerMessage(`Deleted brand ${b.name}`); }} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1">
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 8. ENTERPRISE ORDER MANAGEMENT & FULFILLMENT ────────────────── */}
          {activeSection === 'orders' && (() => {
            // Join and prepare orders with customer, items, payment, and delivery tracking details
            const ordersWithDetails = orders.map(order => {
              const customer = users.find(u => u.userId === order.userId || u.id === order.userId) || {
                name: order.customerName || 'Customer',
                email: 'customer@smuni.com',
                phone: '+251 91 100 0000',
                address: order.deliveryAddress || 'Addis Ababa'
              };
              const items = orderItems.filter(oi => oi.orderId === order.orderId);
              const payment = payments.find(p => p.orderId === order.orderId) || {
                paymentMethod: 'COD',
                paymentStatus: 'Pending',
                transactionReference: 'N/A',
                amount: order.totalAmount
              };
              const tracking = deliveryTracking.find(dt => dt.orderId === order.orderId) || {
                deliveryStatus: 'Assigned',
                deliveryPersonId: null
              };
              const driver = users.find(u => u.role === 'Delivery' && (u.userId === tracking.deliveryPersonId || u.id === tracking.deliveryPersonId));

              return {
                ...order,
                customer,
                items,
                payment,
                tracking,
                driver
              };
            });

            // Filter logic
            const filteredOrders = ordersWithDetails.filter(o => {
              // Search Query
              if (orderSearchTerm.trim()) {
                const term = orderSearchTerm.toLowerCase();
                const matchId = String(o.orderId).toLowerCase().includes(term) || `#ord-${o.orderId}`.toLowerCase().includes(term);
                const matchCust = (o.customer.name || '').toLowerCase().includes(term);
                const matchPhone = (o.customer.phone || '').toLowerCase().includes(term);
                const matchEmail = (o.customer.email || '').toLowerCase().includes(term);
                const matchAddress = (o.deliveryAddress || '').toLowerCase().includes(term);
                if (!matchId && !matchCust && !matchPhone && !matchEmail && !matchAddress) return false;
              }

              // Status Filter
              if (orderStatusFilter !== 'All') {
                if (orderStatusFilter === 'Pending' && o.orderStatus !== 'Pending') return false;
                if (orderStatusFilter === 'Confirmed' && o.orderStatus !== 'Confirmed') return false;
                if (orderStatusFilter === 'Cancelled' && o.orderStatus !== 'Cancelled') return false;
                if (orderStatusFilter === 'Delivered' && o.tracking.deliveryStatus !== 'Delivered') return false;
              }

              // Payment Status Filter
              if (orderPaymentFilter !== 'All' && o.payment.paymentStatus !== orderPaymentFilter) {
                return false;
              }

              // Payment Method Filter
              if (orderMethodFilter !== 'All') {
                if (orderMethodFilter === 'Chapa' && o.payment.paymentMethod !== 'Chapa') return false;
                if (orderMethodFilter === 'COD' && o.payment.paymentMethod !== 'COD') return false;
              }

              return true;
            }).sort((a, b) => {
              if (orderSortBy === 'newest') return (b.orderId || 0) - (a.orderId || 0);
              if (orderSortBy === 'oldest') return (a.orderId || 0) - (b.orderId || 0);
              if (orderSortBy === 'amount-high') return (b.totalAmount || 0) - (a.totalAmount || 0);
              if (orderSortBy === 'amount-low') return (a.totalAmount || 0) - (b.totalAmount || 0);
              return 0;
            });

            // Dynamic KPI Calculations
            const grossOrderVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            const pendingOrders = orders.filter(o => o.orderStatus === 'Pending');
            const confirmedOrders = orders.filter(o => o.orderStatus === 'Confirmed');
            const deliveredOrders = deliveryTracking.filter(d => d.deliveryStatus === 'Delivered');
            const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled');
            const completionRate = orders.length > 0 ? Math.round((deliveredOrders.length / orders.length) * 100) : 0;

            // CSV Export
            const handleExportOrdersCSV = () => {
              const headers = ['Order ID', 'Order Date', 'Customer Name', 'Phone', 'Address', 'Items Count', 'Payment Method', 'Payment Status', 'Delivery Status', 'Order Status', 'Total Amount (ETB)'];
              const rows = filteredOrders.map(o => [
                `#ORD-${o.orderId}`,
                o.orderDate || 'N/A',
                `"${(o.customer.name || '').replace(/"/g, '""')}"`,
                `"${(o.customer.phone || '').replace(/"/g, '""')}"`,
                `"${(o.deliveryAddress || '').replace(/"/g, '""')}"`,
                o.items.length,
                o.payment.paymentMethod,
                o.payment.paymentStatus,
                o.tracking.deliveryStatus,
                o.orderStatus,
                o.totalAmount
              ]);

              const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `smuni_orders_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              triggerMessage(`Exported ${filteredOrders.length} orders to CSV successfully.`);
            };

            return (
              <div className="space-y-6 animate-fadeIn">
                {/* Header Banner */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900">Order Management & Fulfillment Hub</h2>
                        <span className="bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
                          Live System
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        Track customer orders, assign couriers, generate official tax invoices, and monitor delivery workflows.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={handleExportOrdersCSV}
                      className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 text-xs flex items-center gap-2 transition-all shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      <Download size={14} className="text-slate-500" /> Export Orders CSV
                    </button>
                    <button
                      onClick={() => {
                        setOrderSearchTerm('');
                        setOrderStatusFilter('All');
                        setOrderPaymentFilter('All');
                        setOrderMethodFilter('All');
                        setOrderSortBy('newest');
                        triggerMessage('Orders list refreshed.');
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                      title="Reset Filters & Refresh"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Orders</span>
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <ShoppingBag size={14} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">ETB {grossOrderVolume.toLocaleString()} Gross</p>
                  </div>

                  <div
                    onClick={() => setOrderStatusFilter('Pending')}
                    className={`bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer ${orderStatusFilter === 'Pending' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200/80'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Pending Approval</span>
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Clock size={14} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-amber-600 mt-1">{pendingOrders.length}</p>
                    <p className="text-[11px] font-bold text-amber-600/80 mt-0.5">Requires Confirmation</p>
                  </div>

                  <div
                    onClick={() => setOrderStatusFilter('Confirmed')}
                    className={`bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer ${orderStatusFilter === 'Confirmed' ? 'border-indigo-400 ring-2 ring-indigo-400/20' : 'border-slate-200/80'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Confirmed / Transit</span>
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Truck size={14} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-indigo-600 mt-1">{confirmedOrders.length}</p>
                    <p className="text-[11px] font-bold text-indigo-600/80 mt-0.5">In fulfillment pipeline</p>
                  </div>

                  <div
                    onClick={() => setOrderStatusFilter('Delivered')}
                    className={`bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer ${orderStatusFilter === 'Delivered' ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-slate-200/80'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Delivered</span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle size={14} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{deliveredOrders.length}</p>
                    <p className="text-[11px] font-bold text-emerald-600/80 mt-0.5">{completionRate}% fulfillment rate</p>
                  </div>

                  <div
                    onClick={() => setOrderStatusFilter('Cancelled')}
                    className={`bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer ${orderStatusFilter === 'Cancelled' ? 'border-red-400 ring-2 ring-red-400/20' : 'border-slate-200/80'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-500">Cancelled / Refund</span>
                      <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                        <XCircle size={14} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-red-600 mt-1">{cancelledOrders.length}</p>
                    <p className="text-[11px] font-bold text-red-500/80 mt-0.5">Stock Restocked</p>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  {/* Status Pills */}
                  <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 shrink-0">
                      {[
                        { id: 'All', label: 'All Orders', count: orders.length },
                        { id: 'Pending', label: 'Pending', count: pendingOrders.length },
                        { id: 'Confirmed', label: 'Confirmed', count: confirmedOrders.length },
                        { id: 'Cancelled', label: 'Cancelled', count: cancelledOrders.length }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setOrderStatusFilter(tab.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            orderStatusFilter === tab.id
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          {tab.label}
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${orderStatusFilter === tab.id ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-slate-400 shrink-0">
                      Showing {filteredOrders.length} of {orders.length} orders
                    </span>
                  </div>

                  {/* Multi-facet Filter Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search ID, Customer, Phone, City..."
                        value={orderSearchTerm}
                        onChange={e => setOrderSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                      />
                      {orderSearchTerm && (
                        <button onClick={() => setOrderSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    {/* Payment Status Dropdown */}
                    <div>
                      <select
                        value={orderPaymentFilter}
                        onChange={e => setOrderPaymentFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                      >
                        <option value="All">Payment: All Statuses</option>
                        <option value="Paid">Payment: Paid</option>
                        <option value="Pending">Payment: Pending</option>
                        <option value="Refunded">Payment: Refunded</option>
                      </select>
                    </div>

                    {/* Payment Method Dropdown */}
                    <div>
                      <select
                        value={orderMethodFilter}
                        onChange={e => setOrderMethodFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                      >
                        <option value="All">Method: All Channels</option>
                        <option value="Chapa">Chapa (Telebirr / CBE / Card)</option>
                        <option value="COD">Cash on Delivery (COD)</option>
                      </select>
                    </div>

                    {/* Sort By Dropdown */}
                    <div>
                      <select
                        value={orderSortBy}
                        onChange={e => setOrderSortBy(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                      >
                        <option value="newest">Sort: Newest First</option>
                        <option value="oldest">Sort: Oldest First</option>
                        <option value="amount-high">Sort: Amount (High to Low)</option>
                        <option value="amount-low">Sort: Amount (Low to High)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Orders Data Table */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3.5 text-left">Order & Date</th>
                          <th className="px-5 py-3.5 text-left">Customer</th>
                          <th className="px-5 py-3.5 text-left">Items Preview</th>
                          <th className="px-5 py-3.5 text-left">Order Total</th>
                          <th className="px-5 py-3.5 text-left">Payment</th>
                          <th className="px-5 py-3.5 text-left">Fulfillment</th>
                          <th className="px-5 py-3.5 text-left">Order Status</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="px-5 py-12 text-center">
                              <div className="max-w-xs mx-auto space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                  <ShoppingBag size={24} />
                                </div>
                                <p className="font-extrabold text-slate-800 text-sm">No orders matching criteria</p>
                                <p className="text-xs text-slate-400">Try changing your search term or filter parameters.</p>
                                <button
                                  onClick={() => {
                                    setOrderSearchTerm('');
                                    setOrderStatusFilter('All');
                                    setOrderPaymentFilter('All');
                                    setOrderMethodFilter('All');
                                  }}
                                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2 hover:bg-slate-800"
                                >
                                  Clear Filters
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map(o => {
                            const firstItem = o.items[0];
                            const firstProd = products.find(p => p.productId === firstItem?.productId);
                            const moreItemsCount = o.items.length > 1 ? o.items.length - 1 : 0;

                            return (
                              <tr key={o.orderId} className="hover:bg-slate-50/80 transition-colors">
                                {/* Order ID & Date */}
                                <td className="px-5 py-4">
                                  <div className="space-y-0.5">
                                    <button
                                      onClick={() => setSelectedOrderDetail(o)}
                                      className="font-mono font-black text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-xs"
                                    >
                                      #ORD-{o.orderId}
                                    </button>
                                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                      <Calendar size={11} /> {o.orderDate || 'Recent'}
                                    </p>
                                  </div>
                                </td>

                                {/* Customer Info */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                                      {(o.customer.name || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="max-w-[130px]">
                                      <p className="font-bold text-slate-900 truncate">{o.customer.name}</p>
                                      <p className="text-[11px] text-slate-400 truncate">{o.customer.phone || '0911000000'}</p>
                                    </div>
                                  </div>
                                </td>

                                {/* Items Preview */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    {firstItem && (
                                      <div className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                                        <img
                                          src={firstItem.image || firstProd?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'}
                                          alt="Item"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="max-w-[140px]">
                                      <p className="font-bold text-slate-800 truncate text-[11px]">
                                        {firstItem ? (firstItem.name || firstProd?.name || `Item #${firstItem.productId}`) : `${o.items.length} items`}
                                      </p>
                                      <p className="text-[10px] font-semibold text-slate-400">
                                        {o.items.length} {o.items.length === 1 ? 'item' : 'items'} {moreItemsCount > 0 && `(+${moreItemsCount} more)`}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Order Total */}
                                <td className="px-5 py-4">
                                  <div className="space-y-0.5">
                                    <p className="font-black text-slate-900 text-xs">ETB {o.totalAmount.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Incl. delivery</p>
                                  </div>
                                </td>

                                {/* Payment Badge */}
                                <td className="px-5 py-4">
                                  <div className="space-y-1">
                                    <Badge
                                      label={o.payment.paymentMethod === 'Chapa' ? 'Chapa' : 'COD'}
                                      color={o.payment.paymentMethod === 'Chapa' ? 'purple' : 'amber'}
                                    />
                                    <div>
                                      <Badge
                                        label={o.payment.paymentStatus}
                                        color={o.payment.paymentStatus === 'Paid' ? 'green' : o.payment.paymentStatus === 'Refunded' ? 'gray' : 'yellow'}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* Fulfillment / Delivery Status */}
                                <td className="px-5 py-4">
                                  <div className="space-y-1">
                                    <Badge
                                      label={o.tracking.deliveryStatus}
                                      color={o.tracking.deliveryStatus === 'Delivered' ? 'green' : o.tracking.deliveryStatus === 'On The Way' ? 'indigo' : o.tracking.deliveryStatus === 'Picked Up' ? 'amber' : 'blue'}
                                    />
                                    {o.driver && (
                                      <p className="text-[10px] font-bold text-slate-500 truncate max-w-[100px]" title={o.driver.name}>
                                        🏍️ {o.driver.name}
                                      </p>
                                    )}
                                  </div>
                                </td>

                                {/* Order Status */}
                                <td className="px-5 py-4">
                                  <Badge
                                    label={o.orderStatus}
                                    color={o.orderStatus === 'Confirmed' ? 'green' : o.orderStatus === 'Cancelled' ? 'red' : 'yellow'}
                                  />
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                    <button
                                      onClick={() => setSelectedOrderDetail(o)}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1"
                                      title="Inspect Order & Assign Courier"
                                    >
                                      <Eye size={12} /> Inspect
                                    </button>

                                    <Link
                                      to={`/order/${o.orderId}`}
                                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1"
                                      title="Live Customer Tracking & Dispatch Timeline"
                                    >
                                      <Truck size={12} /> Live
                                    </Link>

                                    <button
                                      onClick={() => setSelectedOrderInvoice(o)}
                                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                                      title="Print Tax Invoice"
                                    >
                                      <Printer size={13} />
                                    </button>

                                    {o.orderStatus === 'Pending' && (
                                      <button
                                        onClick={() => {
                                          adminConfirmOrder(o.orderId);
                                          triggerMessage(`Confirmed Order #${o.orderId}`);
                                        }}
                                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shadow-2xs active:scale-95 transition-all"
                                        title="Approve & Confirm"
                                      >
                                        Confirm
                                      </button>
                                    )}

                                    {o.orderStatus !== 'Cancelled' && (
                                      <button
                                        onClick={() => {
                                          adminCancelOrder(o.orderId);
                                          triggerMessage(`Cancelled Order #${o.orderId} and returned stock.`);
                                        }}
                                        className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 text-[11px] transition-colors"
                                        title="Cancel & Restock"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ─── 9. ENTERPRISE PAYMENT MANAGEMENT & FINANCIAL LEDGER ─────────── */}
          {activeSection === 'payments' && (() => {
            // Join payments with order, customer, and items
            const paymentsWithDetails = payments.map(payment => {
              const order = orders.find(o => o.orderId === payment.orderId) || {
                totalAmount: payment.amount,
                orderStatus: 'Confirmed',
                orderDate: payment.paymentDate,
                orderId: payment.orderId
              };
              const customer = users.find(u => u.userId === order.userId || u.id === order.userId) || {
                name: order.customerName || 'Customer',
                email: 'customer@smuni.com',
                phone: '+251 91 100 0000'
              };
              const items = orderItems.filter(oi => oi.orderId === payment.orderId);

              return {
                ...payment,
                order,
                customer,
                items
              };
            });

            // Filter logic
            const filteredPayments = paymentsWithDetails.filter(p => {
              // Search Query
              if (paymentSearchTerm.trim()) {
                const term = paymentSearchTerm.toLowerCase();
                const matchRef = (p.transactionReference || '').toLowerCase().includes(term);
                const matchId = String(p.paymentId).toLowerCase().includes(term) || `#pay-${p.paymentId}`.toLowerCase().includes(term);
                const matchOrder = String(p.orderId).toLowerCase().includes(term) || `#ord-${p.orderId}`.toLowerCase().includes(term);
                const matchCust = (p.customer.name || '').toLowerCase().includes(term);
                if (!matchRef && !matchId && !matchOrder && !matchCust) return false;
              }

              // Status Filter
              if (paymentStatusFilter !== 'All' && p.paymentStatus !== paymentStatusFilter) {
                return false;
              }

              // Method Filter
              if (paymentMethodFilter !== 'All') {
                if (paymentMethodFilter === 'Chapa' && p.paymentMethod !== 'Chapa') return false;
                if (paymentMethodFilter === 'COD' && p.paymentMethod !== 'COD') return false;
              }

              return true;
            }).sort((a, b) => {
              if (paymentSortBy === 'newest') return (b.paymentId || 0) - (a.paymentId || 0);
              if (paymentSortBy === 'oldest') return (a.paymentId || 0) - (b.paymentId || 0);
              if (paymentSortBy === 'amount-high') return (b.amount || 0) - (a.amount || 0);
              if (paymentSortBy === 'amount-low') return (a.amount || 0) - (b.amount || 0);
              return 0;
            });

            // Financial KPIs
            const totalPaidRevenue = payments
              .filter(p => p.paymentStatus === 'Paid')
              .reduce((sum, p) => sum + (p.amount || 0), 0);

            const pendingCODRevenue = payments
              .filter(p => p.paymentMethod === 'COD' && p.paymentStatus === 'Pending')
              .reduce((sum, p) => sum + (p.amount || 0), 0);

            const chapaOnlineVolume = payments
              .filter(p => p.paymentMethod === 'Chapa' && p.paymentStatus === 'Paid')
              .reduce((sum, p) => sum + (p.amount || 0), 0);

            const refundedRevenue = payments
              .filter(p => p.paymentStatus === 'Refunded')
              .reduce((sum, p) => sum + (p.amount || 0), 0);

            const paidCount = payments.filter(p => p.paymentStatus === 'Paid').length;
            const successRate = payments.length > 0 ? Math.round((paidCount / payments.length) * 100) : 100;

            // CSV Export
            const handleExportPaymentsCSV = () => {
              const headers = ['Payment ID', 'Order ID', 'Transaction Ref', 'Customer Name', 'Method', 'Amount (ETB)', 'Status', 'Date'];
              const rows = filteredPayments.map(p => [
                `#PAY-${p.paymentId}`,
                `#ORD-${p.orderId}`,
                `"${(p.transactionReference || '').replace(/"/g, '""')}"`,
                `"${(p.customer.name || '').replace(/"/g, '""')}"`,
                p.paymentMethod,
                p.amount,
                p.paymentStatus,
                p.paymentDate || 'Pending'
              ]);

              const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `smuni_payments_ledger_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              triggerMessage(`Exported ${filteredPayments.length} transactions to CSV.`);
            };

            return (
              <div className="space-y-6 animate-fadeIn">
                {/* Header Banner */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <CreditCard size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900">Financial Settlements & Payment Ledger</h2>
                        <span className="bg-purple-100 text-purple-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                          <ShieldCheck size={12} /> Chapa & COD Reconciled
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        Monitor payment gateways (Telebirr, CBE Birr, Cards), track Cash on Delivery collections, and audit refunds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={handleExportPaymentsCSV}
                      className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 text-xs flex items-center gap-2 transition-all shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      <Download size={14} className="text-slate-500" /> Export Financial Ledger
                    </button>
                    <button
                      onClick={() => {
                        setPaymentSearchTerm('');
                        setPaymentStatusFilter('All');
                        setPaymentMethodFilter('All');
                        setPaymentSortBy('newest');
                        triggerMessage('Payment ledger refreshed.');
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                      title="Reset Filters & Refresh"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>

                {/* Financial KPI Cards Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Settled Revenue</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Wallet size={16} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">ETB {totalPaidRevenue.toLocaleString()}</h3>
                    <p className="text-[11px] font-bold text-emerald-600 mt-0.5">{successRate}% successful settlements</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Pending COD Receivables</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Banknote size={16} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-amber-600 mt-1">ETB {pendingCODRevenue.toLocaleString()}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">Awaiting courier delivery collection</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">Chapa Digital Gateways</span>
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <CreditCard size={16} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-purple-600 mt-1">ETB {chapaOnlineVolume.toLocaleString()}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">Telebirr • CBE Birr • Cards</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-500">Total Refunded</span>
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                        <RotateCcw size={16} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-red-600 mt-1">ETB {refundedRevenue.toLocaleString()}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">Admin-approved returns</p>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  {/* Gateway Pills */}
                  <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 shrink-0">
                      {[
                        { id: 'All', label: 'All Gateways' },
                        { id: 'Chapa', label: 'Chapa Online (Telebirr/CBE)' },
                        { id: 'COD', label: 'Cash on Delivery' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setPaymentMethodFilter(tab.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            paymentMethodFilter === tab.id
                              ? 'bg-purple-900 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-slate-400 shrink-0">
                      Showing {filteredPayments.length} of {payments.length} transactions
                    </span>
                  </div>

                  {/* Filter Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Tx Ref, Order #, Payer Name..."
                        value={paymentSearchTerm}
                        onChange={e => setPaymentSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-purple-500 transition-all"
                      />
                      {paymentSearchTerm && (
                        <button onClick={() => setPaymentSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    <div>
                      <select
                        value={paymentStatusFilter}
                        onChange={e => setPaymentStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-purple-500"
                      >
                        <option value="All">Status: All Transactions</option>
                        <option value="Paid">Status: Paid & Settled</option>
                        <option value="Pending">Status: Pending Settlement</option>
                        <option value="Refunded">Status: Refunded</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={paymentSortBy}
                        onChange={e => setPaymentSortBy(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-purple-500"
                      >
                        <option value="newest">Sort: Newest First</option>
                        <option value="oldest">Sort: Oldest First</option>
                        <option value="amount-high">Sort: Amount (High to Low)</option>
                        <option value="amount-low">Sort: Amount (Low to High)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Ledger Table */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3.5 text-left">Payment & Ref</th>
                          <th className="px-5 py-3.5 text-left">Order Reference</th>
                          <th className="px-5 py-3.5 text-left">Payer / Customer</th>
                          <th className="px-5 py-3.5 text-left">Gateway Method</th>
                          <th className="px-5 py-3.5 text-left">Date / Time</th>
                          <th className="px-5 py-3.5 text-left">Settlement Amount</th>
                          <th className="px-5 py-3.5 text-left">Status</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPayments.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="px-5 py-12 text-center">
                              <div className="max-w-xs mx-auto space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                  <CreditCard size={24} />
                                </div>
                                <p className="font-extrabold text-slate-800 text-sm">No transaction records found</p>
                                <p className="text-xs text-slate-400">Try adjusting your search terms or filters.</p>
                                <button
                                  onClick={() => {
                                    setPaymentSearchTerm('');
                                    setPaymentStatusFilter('All');
                                    setPaymentMethodFilter('All');
                                  }}
                                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2 hover:bg-slate-800"
                                >
                                  Reset Filters
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredPayments.map(p => (
                            <tr key={p.paymentId} className="hover:bg-slate-50/80 transition-colors">
                              {/* Payment ID & Tx Ref */}
                              <td className="px-5 py-4">
                                <div className="space-y-0.5">
                                  <button
                                    onClick={() => setSelectedPaymentDetail(p)}
                                    className="font-extrabold text-slate-900 hover:text-purple-600 text-xs font-mono"
                                  >
                                    #PAY-{p.paymentId}
                                  </button>
                                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                                    <span className="truncate max-w-[130px]">{p.transactionReference || 'N/A'}</span>
                                    {p.transactionReference && p.transactionReference !== 'N/A' && (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(p.transactionReference);
                                          triggerMessage(`Copied Tx Ref: ${p.transactionReference}`);
                                        }}
                                        className="text-slate-400 hover:text-slate-700"
                                        title="Copy Transaction Ref"
                                      >
                                        <Copy size={11} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Order Link */}
                              <td className="px-5 py-4">
                                <Link
                                  to={`/order/${p.orderId}`}
                                  className="font-mono font-black text-blue-600 hover:underline flex items-center gap-1 text-xs"
                                >
                                  #ORD-{p.orderId} <ExternalLink size={11} />
                                </Link>
                              </td>

                              {/* Customer */}
                              <td className="px-5 py-4">
                                <p className="font-bold text-slate-900 truncate max-w-[140px]">{p.customer.name}</p>
                                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{p.customer.email || 'customer@smuni.com'}</p>
                              </td>

                              {/* Gateway */}
                              <td className="px-5 py-4">
                                <div className="space-y-0.5">
                                  <Badge
                                    label={p.paymentMethod === 'Chapa' ? 'Chapa Online' : 'Cash on Delivery'}
                                    color={p.paymentMethod === 'Chapa' ? 'purple' : 'amber'}
                                  />
                                  <p className="text-[10px] font-bold text-slate-400">
                                    {p.paymentMethod === 'Chapa' ? 'Telebirr/CBE' : 'Courier Collection'}
                                  </p>
                                </div>
                              </td>

                              {/* Timestamp */}
                              <td className="px-5 py-4">
                                <p className="text-slate-600 font-bold text-xs flex items-center gap-1">
                                  <Clock size={11} className="text-slate-400" />
                                  {p.paymentDate || 'Pending Settlement'}
                                </p>
                              </td>

                              {/* Settlement Amount */}
                              <td className="px-5 py-4">
                                <p className="font-black text-slate-900 text-xs">ETB {p.amount.toLocaleString()}</p>
                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">
                                <Badge
                                  label={p.paymentStatus}
                                  color={p.paymentStatus === 'Paid' ? 'green' : p.paymentStatus === 'Refunded' ? 'gray' : 'yellow'}
                                />
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  <button
                                    onClick={() => setSelectedPaymentDetail(p)}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1"
                                    title="Inspect Transaction"
                                  >
                                    <Eye size={12} /> Inspect
                                  </button>

                                  {p.paymentStatus === 'Pending' && (
                                    <button
                                      onClick={() => {
                                        adminVerifyPayment(p.paymentId);
                                        triggerMessage(`Marked payment #${p.paymentId} as Paid & verified.`);
                                      }}
                                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shadow-2xs active:scale-95 transition-all"
                                      title="Verify / Settle as Paid"
                                    >
                                      Settle
                                    </button>
                                  )}

                                  {p.paymentStatus !== 'Refunded' && (
                                    <button
                                      onClick={() => setShowRefundModal(p)}
                                      className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 text-[11px] transition-colors"
                                      title="Issue Refund"
                                    >
                                      Refund
                                    </button>
                                  )}

                                  <button
                                    onClick={() => setSelectedOrderInvoice(p.order)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                                    title="View Receipt"
                                  >
                                    <Receipt size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ─── 10. DELIVERY FLEET & DISPATCH COMMAND CENTER ─────────────────────────── */}
          {activeSection === 'deliveries' && (() => {
            // Helper to parse driver vehicle & zone
            const parsedDrivers = users.filter(u => u.role === 'Delivery').map(d => {
              let zone = 'Addis Ababa Central';
              let vehicle = 'Motorbike';
              let plate = 'AA-2-84920';

              if (d.address) {
                const parts = d.address.split('|').map(s => s.trim());
                parts.forEach(part => {
                  if (part.startsWith('Zone:')) zone = part.replace('Zone:', '').trim();
                  else if (part.startsWith('Vehicle:')) vehicle = part.replace('Vehicle:', '').trim();
                  else if (part.startsWith('Plate:')) plate = part.replace('Plate:', '').trim();
                });
              }

              const activeDeliveriesCount = deliveryTracking.filter(
                dt => (dt.deliveryPersonId === d.userId || dt.deliveryPersonId === d.id) && ['Assigned', 'Picked Up', 'On The Way'].includes(dt.deliveryStatus)
              ).length;

              const completedDeliveriesCount = deliveryTracking.filter(
                dt => (dt.deliveryPersonId === d.userId || dt.deliveryPersonId === d.id) && dt.deliveryStatus === 'Delivered'
              ).length;

              return {
                ...d,
                zone,
                vehicle,
                plate,
                activeDeliveriesCount,
                completedDeliveriesCount,
                rating: d.rating || 4.9,
              };
            });

            // Master Dispatches joined list
            const allDispatches = orders.map(order => {
              const tracking = deliveryTracking.find(dt => dt.orderId === order.orderId) || {
                trackingId: `track-${order.orderId}`,
                orderId: order.orderId,
                deliveryPersonId: null,
                deliveryStatus: order.orderStatus === 'Cancelled' ? 'Cancelled' : 'Assigned',
                notes: 'Awaiting dispatch assignment'
              };
              const customer = users.find(u => u.userId === order.userId) || {
                name: order.customerName || 'Customer',
                phone: order.customerPhone || '+251 911 000 000',
                email: order.customerEmail || ''
              };
              const payment = payments.find(p => p.orderId === order.orderId) || { paymentMethod: 'COD', paymentStatus: 'Pending' };
              const items = orderItems.filter(oi => oi.orderId === order.orderId);
              const driver = parsedDrivers.find(u => u.userId === tracking.deliveryPersonId || u.id === tracking.deliveryPersonId);

              return {
                ...tracking,
                order,
                customer,
                payment,
                items,
                driver
              };
            });

            // KPIs
            const totalDriversCount = parsedDrivers.length;
            const activeDriversCount = parsedDrivers.filter(d => d.status === 'Active').length;
            const pendingDispatchCount = allDispatches.filter(d => !d.deliveryPersonId && d.deliveryStatus !== 'Cancelled').length;
            const activeInTransitCount = allDispatches.filter(d => ['Picked Up', 'On The Way'].includes(d.deliveryStatus)).length;
            const deliveredCount = allDispatches.filter(d => d.deliveryStatus === 'Delivered').length;
            const codTotalAmount = payments
              .filter(p => p.paymentMethod === 'COD' && p.paymentStatus === 'Paid')
              .reduce((sum, p) => sum + (p.amount || 0), 0);

            // Filter dispatches
            const filteredDispatches = allDispatches.filter(d => {
              // Search
              if (deliverySearch.trim()) {
                const q = deliverySearch.toLowerCase();
                const matchOrder = String(d.orderId).includes(q);
                const matchCust = (d.customer.name || '').toLowerCase().includes(q) || (d.customer.phone || '').includes(q);
                const matchAddr = (d.order.deliveryAddress || '').toLowerCase().includes(q);
                const matchDriver = (d.driver?.name || '').toLowerCase().includes(q);
                if (!matchOrder && !matchCust && !matchAddr && !matchDriver) return false;
              }
              // Status Filter
              if (deliveryStatusFilter !== 'All') {
                if (deliveryStatusFilter === 'Pending Assignment') {
                  if (d.deliveryPersonId || d.deliveryStatus === 'Cancelled') return false;
                } else if (d.deliveryStatus !== deliveryStatusFilter) {
                  return false;
                }
              }
              // Zone Filter
              if (deliveryZoneFilter !== 'All') {
                const addr = (d.order.deliveryAddress || '').toLowerCase();
                if (!addr.includes(deliveryZoneFilter.toLowerCase())) return false;
              }
              return true;
            });

            // Filter couriers
            const filteredCouriers = parsedDrivers.filter(d => {
              if (deliverySearch.trim()) {
                const q = deliverySearch.toLowerCase();
                const matchName = (d.name || '').toLowerCase().includes(q);
                const matchEmail = (d.email || '').toLowerCase().includes(q);
                const matchPhone = (d.phone || '').includes(q);
                const matchZone = (d.zone || '').toLowerCase().includes(q);
                if (!matchName && !matchEmail && !matchPhone && !matchZone) return false;
              }
              return true;
            });

            const failedDispatches = allDispatches.filter(d => ['Failed Delivery', 'Returned'].includes(d.deliveryStatus));

            return (
              <div className="space-y-6">
                {/* ── Top Header & Actions ── */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                        <Truck size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Delivery Fleet & Dispatch Command Center</h2>
                        <p className="text-xs text-slate-500 font-medium">
                          Manage live order dispatches, assign couriers, track status lifecycle, and provision credentials.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setShowAddCourierModal(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
                    >
                      <Plus size={16} /> Register Delivery Person
                    </button>
                    <button
                      onClick={() => triggerMessage('Exported Dispatch Logistics Manifest (CSV)')}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-2 transition-all shadow-xs"
                    >
                      <Download size={15} /> Export Log
                    </button>
                  </div>
                </div>

                {/* ── KPI Metric Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Active Fleet */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Fleet Couriers</span>
                      <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Users size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mt-2">
                      {activeDriversCount} <span className="text-xs font-semibold text-slate-400">/ {totalDriversCount} Total</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{activeDriversCount} Couriers Ready & Active</span>
                    </div>
                  </div>

                  {/* Card 2: Pending Dispatch */}
                  <div className={`bg-white border rounded-2xl p-5 shadow-xs transition-colors ${pendingDispatchCount > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Awaiting Driver Dispatch</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-amber-900 mt-2">{pendingDispatchCount} Orders</p>
                    <p className="text-[11px] font-bold text-amber-700 mt-2">
                      {pendingDispatchCount > 0 ? '⚠️ Immediate driver assignment needed' : '✓ All pending orders dispatched'}
                    </p>
                  </div>

                  {/* Card 3: In Transit */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">In Transit / On Road</span>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-blue-600 mt-2">{activeInTransitCount} Active</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-2">Picked up & en route to buyers</p>
                  </div>

                  {/* Card 4: Delivered & COD */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Delivered & COD Verified</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-600 mt-2">{deliveredCount} Orders</p>
                    <p className="text-[11px] font-bold text-emerald-700 mt-2">
                      ETB {codTotalAmount.toLocaleString()} COD Collected
                    </p>
                  </div>
                </div>

                {/* ── Sub-navigation Tabs ── */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  <div className="flex border-b border-slate-200 bg-slate-50/60 px-4 pt-3 gap-2 overflow-x-auto">
                    <button
                      onClick={() => setDeliverySubTab('dispatch')}
                      className={`pb-3 px-4 text-xs font-black border-b-2 transition-all flex items-center gap-2 ${
                        deliverySubTab === 'dispatch'
                          ? 'border-orange-600 text-orange-600 bg-white rounded-t-xl shadow-2xs'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Package size={15} /> Live Order Dispatch & Control ({allDispatches.length})
                    </button>

                    <button
                      onClick={() => setDeliverySubTab('couriers')}
                      className={`pb-3 px-4 text-xs font-black border-b-2 transition-all flex items-center gap-2 ${
                        deliverySubTab === 'couriers'
                          ? 'border-orange-600 text-orange-600 bg-white rounded-t-xl shadow-2xs'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Users size={15} /> Delivery Personnel & Fleet Roster ({parsedDrivers.length})
                    </button>

                    <button
                      onClick={() => setDeliverySubTab('failed')}
                      className={`pb-3 px-4 text-xs font-black border-b-2 transition-all flex items-center gap-2 ${
                        deliverySubTab === 'failed'
                          ? 'border-orange-600 text-orange-600 bg-white rounded-t-xl shadow-2xs'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <AlertTriangle size={15} /> Failed & Return Resolution ({failedDispatches.length})
                    </button>
                  </div>

                  {/* ── TAB 1: LIVE ORDER DISPATCH & CONTROL ── */}
                  {deliverySubTab === 'dispatch' && (
                    <div className="p-6 space-y-4">
                      {/* Search & Filtration Bar */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="relative w-full sm:w-80">
                          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={14} />
                          <input
                            type="text"
                            value={deliverySearch}
                            onChange={e => setDeliverySearch(e.target.value)}
                            placeholder="Search by Order ID, Customer, Address..."
                            className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-orange-500 outline-none font-semibold text-xs transition-all"
                          />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                          <select
                            value={deliveryStatusFilter}
                            onChange={e => setDeliveryStatusFilter(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold bg-slate-50 focus:bg-white outline-none"
                          >
                            <option value="All">All Delivery Statuses</option>
                            <option value="Pending Assignment">⚠️ Unassigned / Pending Dispatch</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Picked Up">Picked Up</option>
                            <option value="On The Way">On The Way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Failed Delivery">Failed Delivery</option>
                            <option value="Returned">Returned</option>
                          </select>

                          <select
                            value={deliveryZoneFilter}
                            onChange={e => setDeliveryZoneFilter(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold bg-slate-50 focus:bg-white outline-none"
                          >
                            <option value="All">All Sub-cities / Zones</option>
                            <option value="Bole">Bole</option>
                            <option value="Kirkos">Kirkos</option>
                            <option value="Arada">Arada / Piassa</option>
                            <option value="Yeka">Yeka / CMC</option>
                            <option value="Lideta">Lideta</option>
                            <option value="Nifas Silk">Nifas Silk</option>
                            <option value="Kolfe">Kolfe Keranio</option>
                            <option value="Gullele">Gullele</option>
                            <option value="Akaki">Akaki Kality</option>
                          </select>
                        </div>
                      </div>

                      {/* Orders Dispatch Table */}
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-3.5 text-left">Order & Customer</th>
                              <th className="px-4 py-3.5 text-left">Delivery Address</th>
                              <th className="px-4 py-3.5 text-left">Items & Amount</th>
                              <th className="px-4 py-3.5 text-left">Assigned Courier</th>
                              <th className="px-4 py-3.5 text-left">Delivery Status</th>
                              <th className="px-4 py-3.5 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredDispatches.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="py-12 text-center text-slate-400 font-bold">
                                  No delivery dispatches found matching filters.
                                </td>
                              </tr>
                            ) : (
                              filteredDispatches.map(d => {
                                const isUnassigned = !d.deliveryPersonId;
                                return (
                                  <tr key={d.orderId} className={`hover:bg-slate-50/80 transition-colors ${isUnassigned ? 'bg-amber-50/20' : ''}`}>
                                    {/* Order & Customer */}
                                    <td className="px-4 py-3">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-mono font-black text-blue-600">#ORD-{d.orderId}</span>
                                          {isUnassigned && (
                                            <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                              Unassigned
                                            </span>
                                          )}
                                        </div>
                                        <p className="font-black text-slate-800">{d.customer?.name || 'Dawit Customer'}</p>
                                        <a href={`tel:${d.customer?.phone}`} className="text-[11px] text-slate-500 flex items-center gap-1 hover:text-indigo-600">
                                          <Phone size={11} /> {d.customer?.phone || '+251 911 000 000'}
                                        </a>
                                      </div>
                                    </td>

                                    {/* Address */}
                                    <td className="px-4 py-3">
                                      <div className="max-w-[200px]">
                                        <p className="text-slate-700 font-medium truncate flex items-start gap-1">
                                          <MapPin size={12} className="text-red-500 shrink-0 mt-0.5" />
                                          <span className="truncate">{d.order?.deliveryAddress || 'Bole, Addis Ababa'}</span>
                                        </p>
                                        <span className="text-[10px] text-slate-400 font-bold">Addis Ababa Metro</span>
                                      </div>
                                    </td>

                                    {/* Items & Amount */}
                                    <td className="px-4 py-3">
                                      <p className="font-black text-slate-900">ETB {(d.order?.totalAmount || 0).toLocaleString()}</p>
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <Badge
                                          label={d.payment?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}
                                          color={d.payment?.paymentMethod === 'COD' ? 'yellow' : 'purple'}
                                        />
                                      </div>
                                    </td>

                                    {/* Assign Driver */}
                                    <td className="px-4 py-3">
                                      <div className="space-y-1.5">
                                        <select
                                          value={d.deliveryPersonId || ''}
                                          onChange={e => {
                                            const driverId = parseInt(e.target.value);
                                            if (driverId) {
                                              assignDeliveryPerson(d.orderId, driverId);
                                              const sel = parsedDrivers.find(u => u.userId === driverId || u.id === driverId);
                                              triggerMessage(`Order #${d.orderId} assigned to ${sel?.name || 'Driver'}`);
                                            }
                                          }}
                                          className={`w-full max-w-[180px] border rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none transition-all ${
                                            isUnassigned
                                              ? 'border-amber-400 bg-amber-50 text-amber-900 focus:ring-2 focus:ring-amber-400'
                                              : 'border-slate-200 bg-slate-50 focus:border-indigo-500 text-slate-800'
                                          }`}
                                        >
                                          <option value="">⚡ Assign Courier...</option>
                                          {parsedDrivers.map(dr => (
                                            <option key={dr.userId || dr.id} value={dr.userId || dr.id}>
                                              {dr.name} ({dr.activeDeliveriesCount} active - {dr.zone})
                                            </option>
                                          ))}
                                        </select>

                                        {d.driver && (
                                          <p className="text-[10px] text-slate-500 font-medium">
                                            {d.driver.vehicle} • {d.driver.phone}
                                          </p>
                                        )}
                                      </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                      <select
                                        value={d.deliveryStatus || 'Assigned'}
                                        onChange={e => {
                                          updateDeliveryStatus(d.orderId, e.target.value);
                                          triggerMessage(`Order #${d.orderId} status set to ${e.target.value}`);
                                        }}
                                        className={`border rounded-xl px-2 py-1 text-xs font-bold outline-none ${
                                          d.deliveryStatus === 'Delivered'
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                            : d.deliveryStatus === 'Failed Delivery'
                                              ? 'bg-red-50 text-red-800 border-red-300'
                                              : 'bg-blue-50 text-blue-800 border-blue-300'
                                        }`}
                                      >
                                        <option value="Assigned">Assigned</option>
                                        <option value="Picked Up">Picked Up</option>
                                        <option value="On The Way">On The Way</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Failed Delivery">Failed Delivery</option>
                                        <option value="Returned">Returned</option>
                                      </select>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          onClick={() => setSelectedTrackingDetail(d)}
                                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                          title="View Tracking Timeline"
                                        >
                                          <Eye size={15} />
                                        </button>
                                        <a
                                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.order?.deliveryAddress || 'Addis Ababa')}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Open Navigation"
                                        >
                                          <Navigation size={14} />
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 2: DELIVERY PERSONNEL & FLEET ROSTER ── */}
                  {deliverySubTab === 'couriers' && (
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Registered Couriers ({filteredCouriers.length})
                        </p>
                        <button
                          onClick={() => setShowAddCourierModal(true)}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus size={14} /> Add Delivery Person
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCouriers.map(driver => (
                          <div
                            key={driver.userId || driver.id}
                            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black flex items-center justify-center text-base shadow-sm">
                                    {driver.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="font-black text-slate-900 text-sm leading-snug">{driver.name}</h4>
                                    <p className="text-[11px] text-slate-500 font-mono truncate max-w-[150px]">{driver.email}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    const nextStatus = driver.status === 'Active' ? 'Inactive' : 'Active';
                                    updateUserRoleAndStatus(driver.userId || driver.id, null, nextStatus);
                                    triggerMessage(`Courier ${driver.name} set to ${nextStatus}`);
                                  }}
                                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border transition-all ${
                                    driver.status === 'Active'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                  }`}
                                  title="Toggle Status"
                                >
                                  {driver.status === 'Active' ? '● Active' : '○ Inactive'}
                                </button>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="text-slate-400 font-medium flex items-center gap-1">
                                    <Phone size={12} /> Phone:
                                  </span>
                                  <a href={`tel:${driver.phone}`} className="font-bold text-slate-800 hover:underline">
                                    {driver.phone || '+251 911 000 000'}
                                  </a>
                                </div>

                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="text-slate-400 font-medium flex items-center gap-1">
                                    <MapPin size={12} /> Operating Zone:
                                  </span>
                                  <span className="font-bold text-slate-800">{driver.zone}</span>
                                </div>

                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="text-slate-400 font-medium flex items-center gap-1">
                                    <Truck size={12} /> Vehicle:
                                  </span>
                                  <span className="font-bold text-slate-800">{driver.vehicle} ({driver.plate})</span>
                                </div>
                              </div>

                              {/* Workload Pill */}
                              <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                                <div>
                                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Active Orders</p>
                                  <p className="text-sm font-black text-orange-600">{driver.activeDeliveriesCount} Active</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Lifetime Done</p>
                                  <p className="text-sm font-black text-emerald-600">{driver.completedDeliveriesCount} Delivered</p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(driver.email);
                                  triggerMessage(`Copied Gmail: ${driver.email}`);
                                }}
                                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Copy Courier Gmail"
                              >
                                <Copy size={13} /> Copy Gmail
                              </button>

                              <button
                                onClick={() => setShowCourierResetModal(driver)}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                              >
                                <Key size={12} /> Reset Password
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 3: FAILED & RETURN RESOLUTION (SDS) ── */}
                  {deliverySubTab === 'failed' && (
                    <div className="p-6 space-y-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                          <h4 className="font-black text-amber-900 text-sm">Failed Delivery & Returns Resolution (SDS Rule)</h4>
                          <p className="text-xs text-amber-800 font-medium mt-0.5">
                            When a courier marks a delivery as Failed, the administrator must either Re-dispatch the order for a retry or mark it as Returned to automatically restore inventory stock.
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-3 text-left">Order ID</th>
                              <th className="px-4 py-3 text-left">Customer</th>
                              <th className="px-4 py-3 text-left">Current Driver</th>
                              <th className="px-4 py-3 text-left">Failed Status</th>
                              <th className="px-4 py-3 text-left">Resolve Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {failedDispatches.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="py-12 text-center text-slate-400 font-bold">
                                  🎉 No failed or returned deliveries! All shipments are healthy.
                                </td>
                              </tr>
                            ) : (
                              failedDispatches.map(d => (
                                <tr key={d.orderId} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-mono font-black text-blue-600">#ORD-{d.orderId}</td>
                                  <td className="px-4 py-3 font-bold text-slate-800">{d.customer?.name}</td>
                                  <td className="px-4 py-3 text-slate-600 font-medium">{d.driver?.name || 'Unassigned'}</td>
                                  <td className="px-4 py-3">
                                    <Badge label={d.deliveryStatus} color={d.deliveryStatus === 'Returned' ? 'gray' : 'red'} />
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => {
                                          updateDeliveryStatus(d.orderId, 'Assigned', 'Admin re-dispatched failed order');
                                          triggerMessage(`Order #${d.orderId} re-dispatched for delivery retry!`);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                                      >
                                        <RefreshCw size={12} /> Retry Dispatch
                                      </button>
                                      <button
                                        onClick={() => {
                                          updateDeliveryStatus(d.orderId, 'Returned', 'Admin marked order returned to warehouse');
                                          triggerMessage(`Order #${d.orderId} marked Returned. Stock restored to inventory.`);
                                        }}
                                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                                      >
                                        <Archive size={12} /> Return & Restock
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ─── 11. REPORTS & ANALYTICS ────────────────────────────────────── */}
          {activeSection === 'reports' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Export Toolbar */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                      <BarChart2 size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Executive Marketplace Analytics</h2>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">
                        Statutory financial audits, VAT calculations, and exportable ledger datasets
                      </p>
                    </div>
                  </div>
                </div>

                {/* Period Selector & CSV Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {['week', 'month', 'quarter', 'year'].map(r => (
                      <button
                        key={r}
                        onClick={() => setReportsTimeRange(r)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                          reportsTimeRange === r
                            ? 'bg-white text-rose-600 shadow-xs font-black'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => exportCSVReport('financial')}
                      className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                      title="Export Financial P&L Statement"
                    >
                      <Download size={14} /> Financial CSV
                    </button>
                    <button
                      onClick={() => exportCSVReport('products')}
                      className="bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all border border-indigo-200"
                      title="Export Product Performance Report"
                    >
                      <Package size={14} /> Products CSV
                    </button>
                    <button
                      onClick={() => exportCSVReport('vendors')}
                      className="bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all border border-purple-200"
                      title="Export Vendor Sales Ledger"
                    >
                      <Store size={14} /> Vendors CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Key Executive Financial Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. GMV */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Gross Merchandise Value (GMV)</p>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Wallet size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-tight">ETB {totalRevenue.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">100% Gross Marketplace Settlement</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
                    <span className="flex items-center gap-1"><TrendingUp size={13} /> +18.4% YoY</span>
                    <span className="text-slate-400 font-medium">{totalOrdersCount} Total Orders</span>
                  </div>
                </div>

                {/* 2. Platform Commission */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-emerald-600 tracking-wider">Platform Commission (10%)</p>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <BadgePercent size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-600 leading-tight">
                      ETB {Math.round(totalRevenue * 0.10).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Retained Platform Net Revenue</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                    <span>Net Margin 10.0%</span>
                    <span className="text-slate-400 font-medium">Auto-deducted</span>
                  </div>
                </div>

                {/* 3. Estimated VAT / Tax */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-amber-600 tracking-wider">Statutory VAT / Tax (15%)</p>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <FileText size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-amber-600 leading-tight">
                      ETB {Math.round(totalRevenue * 0.15).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Estimated Ethiopian Tax Reserve</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
                    <span>ERCA Compliance</span>
                    <span className="text-slate-400 font-medium">Standard 15%</span>
                  </div>
                </div>

                {/* 4. Vendor Net Disbursements */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase text-purple-600 tracking-wider">Vendor Net Payouts (90%)</p>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Store size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-purple-600 leading-tight">
                      ETB {Math.round(totalRevenue * 0.90).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Merchant Store Disbursements</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-700">
                    <span>{sellers.length} Active Stores</span>
                    <span className="text-emerald-600 font-black">All Current</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Analytics Matrix: Category Performance & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Category Revenue Matrix (Col 6) */}
                <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                        <Layers size={17} className="text-indigo-600" />
                        Category Sales & Revenue Matrix
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">Performance contribution across taxonomy</p>
                    </div>
                    <button onClick={() => exportCSVReport('financial')} className="text-xs font-black text-indigo-600 hover:underline">
                      Export CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black">
                        <tr>
                          <th className="px-3 py-2 text-left rounded-l-lg">Category</th>
                          <th className="px-3 py-2 text-left">Listings</th>
                          <th className="px-3 py-2 text-left">Orders</th>
                          <th className="px-3 py-2 text-right">Revenue (ETB)</th>
                          <th className="px-3 py-2 text-right rounded-r-lg">Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {topSellingCategories.map(cat => {
                          const sharePct = totalRevenue > 0 ? Math.round((cat.revenue / totalRevenue) * 100) : 20;
                          return (
                            <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-3 py-3 font-bold text-slate-800">{cat.name}</td>
                              <td className="px-3 py-3 text-slate-500 font-medium">{cat.productsCount} items</td>
                              <td className="px-3 py-3 text-slate-500 font-medium">{cat.ordersCount} orders</td>
                              <td className="px-3 py-3 font-black text-slate-900 text-right">ETB {cat.revenue.toLocaleString()}</td>
                              <td className="px-3 py-3 text-right">
                                <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                  {sharePct}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Performing Products (Col 6) */}
                <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                        <Award size={17} className="text-amber-500" />
                        Top Performing Products Leaderboard
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">Ranked by gross sales volume</p>
                    </div>
                    <button onClick={() => exportCSVReport('products')} className="text-xs font-black text-indigo-600 hover:underline">
                      Export CSV
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topPerformingProducts.map((p, idx) => (
                      <div key={p.productId || idx} className="p-3 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=100'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-black text-xs text-slate-800 truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{p.categoryName} • {p.unitsSold} units sold • {p.stock} in stock</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-xs text-slate-900">ETB {p.totalRevenue.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-emerald-600">ETB {p.price.toLocaleString()} / unit</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vendor Performance & Settlement Audit Table */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
                      <Store size={17} className="text-purple-600" />
                      Vendor Merchant Sales & Settlement Audit
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      Store-by-store sales volumes, commission dues, and payout reconciliations
                    </p>
                  </div>
                  <button
                    onClick={() => exportCSVReport('vendors')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <Download size={13} /> Export Vendor Ledger
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black">
                      <tr>
                        <th className="px-3 py-2.5 text-left rounded-l-lg">Merchant Store</th>
                        <th className="px-3 py-2.5 text-left">Contact</th>
                        <th className="px-3 py-2.5 text-left">Listings</th>
                        <th className="px-3 py-2.5 text-left">Orders</th>
                        <th className="px-3 py-2.5 text-right">Gross Sales</th>
                        <th className="px-3 py-2.5 text-right">Platform Fee (10%)</th>
                        <th className="px-3 py-2.5 text-right">Net Payable (90%)</th>
                        <th className="px-3 py-2.5 text-center rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topVendorsList.map((v, idx) => (
                        <tr key={v.userId || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3 py-3">
                            <span className="font-black text-slate-800 block">{v.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">#USR-{String(v.userId).padStart(4, '0')}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="font-medium text-slate-600 block">{v.email}</span>
                            <span className="text-[10px] text-slate-400">{v.phone || '+251 911 000 000'}</span>
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">{v.productsCount} items</td>
                          <td className="px-3 py-3 font-bold text-slate-700">{v.ordersCount} orders</td>
                          <td className="px-3 py-3 font-black text-slate-900 text-right">ETB {v.grossSales.toLocaleString()}</td>
                          <td className="px-3 py-3 font-bold text-emerald-600 text-right">ETB {Math.round(v.grossSales * 0.10).toLocaleString()}</td>
                          <td className="px-3 py-3 font-black text-purple-600 text-right">ETB {Math.round(v.grossSales * 0.90).toLocaleString()}</td>
                          <td className="px-3 py-3 text-center">
                            <Badge label="Settled" color="green" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── 12. SYSTEM SETTINGS ────────────────────────────────────────── */}
          {activeSection === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 space-y-8 max-w-3xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">System Settings & Controls</h2>
                  <p className="text-xs font-bold text-slate-400">Manage marketplace configurations</p>
                </div>
              </div>

              <form onSubmit={async (e) => { 
                e.preventDefault(); 
                
                const profilePayload = {
                  email: adminEmail,
                  old_password: adminOldPassword || null,
                  new_password: adminPassword || null
                };

                const res = await updateProfile(profilePayload);
                if (!res.success) {
                  triggerMessage(res.message || 'Failed to update profile');
                  return;
                }

                setAdminOldPassword('');
                setAdminPassword('');
                triggerMessage('System configuration and profile saved successfully!'); 
              }} className="space-y-6">
                
                {/* Admin Profile Configuration */}
                <div className="space-y-4 border-b border-slate-100 pb-6">
                  <h3 className="font-extrabold text-sm text-slate-800">Admin Profile Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Email Address (Gmail)</label>
                      <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Old Password</label>
                      <div className="relative">
                        <input type={showOldPassword ? "text" : "password"} value={adminOldPassword} onChange={e => setAdminOldPassword(e.target.value)} placeholder="Required to change password" className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold" />
                        <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none">
                          {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">New Password</label>
                      <div className="relative">
                        <input type={showNewPassword ? "text" : "password"} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold" />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none">
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* General config */}
                <div className="space-y-4 border-b border-slate-100 pb-6">
                  <h3 className="font-extrabold text-sm text-slate-800">General Marketplace Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Site Name</label>
                      <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Default Delivery Fee (ETB)</label>
                      <input type="number" value={shippingFee} onChange={e => setShippingFee(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold" />
                    </div>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4 border-b border-slate-100 pb-6 text-xs">
                  <h3 className="font-extrabold text-sm text-slate-800">Feature Switches</h3>

                  <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all group">
                    <div>
                      <p className="font-extrabold text-slate-800">Allow New Seller Registration</p>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">Open portal for incoming vendor store registration</p>
                    </div>
                    <button type="button" onClick={() => setAllowSellersToggle(!allowSellersToggle)} className="text-indigo-600">
                      {allowSellersToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all group">
                    <div>
                      <p className="font-extrabold text-slate-800">Enable Chapa Payment Gateway</p>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">Allow digital Telebirr, CBE Birr & card online payments</p>
                    </div>
                    <button type="button" onClick={() => setEnableChapaToggle(!enableChapaToggle)} className="text-indigo-600">
                      {enableChapaToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all group">
                    <div>
                      <p className="font-extrabold text-slate-800">Enable Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">Allow cash collection upon delivery driver arrival</p>
                    </div>
                    <button type="button" onClick={() => setEnableCodToggle(!enableCodToggle)} className="text-indigo-600">
                      {enableCodToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
                    <Save size={16} /> Save Platform Configuration
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ─── ADD DELIVERY COURIER MODAL ─── */}
        <AddDeliveryPersonModal
          isOpen={showAddCourierModal}
          onClose={() => setShowAddCourierModal(false)}
          onCreateCourier={createDeliveryPerson}
          triggerMessage={triggerMessage}
        />

        {/* ─── RESET COURIER PASSWORD MODAL ─── */}
        <AdminResetCourierPasswordModal
          user={showCourierResetModal}
          onClose={() => setShowCourierResetModal(null)}
          onResetPassword={adminResetUserPassword}
          triggerMessage={triggerMessage}
        />

        {/* ─── ORDER DETAILS INSPECTOR MODAL ─── */}
        {selectedOrderDetail && (
          <AdminOrderDetailModal
            order={selectedOrderDetail}
            users={users}
            orderItems={orderItems}
            products={products}
            payments={payments}
            deliveryTracking={deliveryTracking}
            adminConfirmOrder={adminConfirmOrder}
            adminCancelOrder={adminCancelOrder}
            assignDeliveryPerson={assignDeliveryPerson}
            updateDeliveryStatus={updateDeliveryStatus}
            triggerMessage={triggerMessage}
            onClose={() => setSelectedOrderDetail(null)}
            onOpenInvoice={(ord) => setSelectedOrderInvoice(ord)}
          />
        )}

        {/* ─── ORDER TAX INVOICE & RECEIPT MODAL ─── */}
        {selectedOrderInvoice && (
          <AdminOrderInvoiceModal
            order={selectedOrderInvoice}
            users={users}
            orderItems={orderItems}
            products={products}
            payments={payments}
            onClose={() => setSelectedOrderInvoice(null)}
          />
        )}

        {/* ─── PAYMENT TRANSACTION DETAIL MODAL ─── */}
        {selectedPaymentDetail && (
          <AdminPaymentDetailModal
            payment={selectedPaymentDetail}
            orders={orders}
            users={users}
            orderItems={orderItems}
            products={products}
            adminVerifyPayment={adminVerifyPayment}
            onOpenRefund={(p) => setShowRefundModal(p)}
            onOpenReceipt={(ord) => setSelectedOrderInvoice(ord)}
            triggerMessage={triggerMessage}
            onClose={() => setSelectedPaymentDetail(null)}
          />
        )}

        {/* ─── PAYMENT REFUND CONFIRMATION MODAL ─── */}
        {showRefundModal && (
          <AdminRefundModal
            payment={showRefundModal}
            onConfirm={(paymentId, reason) => {
              adminRefundPayment(paymentId, reason);
              triggerMessage(`Refund of ETB ${showRefundModal.amount.toLocaleString()} processed.`);
            }}
            onClose={() => setShowRefundModal(null)}
          />
        )}

        {/* ─── DELIVERY TRACKING DETAIL MODAL ─── */}
        {selectedTrackingDetail && (
          <DeliveryTrackingDetailModal
            orderObj={selectedTrackingDetail}
            users={users}
            updateDeliveryStatus={updateDeliveryStatus}
            assignDeliveryPerson={assignDeliveryPerson}
            deliveryAgents={deliveryAgents}
            triggerMessage={triggerMessage}
            onClose={() => setSelectedTrackingDetail(null)}
          />
        )}

      </div>
    </div>
  );
}

