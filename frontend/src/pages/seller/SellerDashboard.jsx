import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  LayoutDashboard, Package, Plus, Archive, ShoppingBag, BarChart2,
  LogOut, Menu, X, TrendingUp, AlertTriangle, CheckCircle, XCircle, Edit2,
  Trash2, Eye, Save, Upload, Star, DollarSign, Users, Search, Bell,
  MessageSquare, User, Settings, ChevronDown, ChevronRight, ChevronLeft, Layers,
  Tag, ShieldCheck, ArrowUpRight, Clock, FileText, Check, Send, Download,
  ToggleLeft, ToggleRight, Store, MapPin, Phone, Mail, ShieldAlert, Award, Truck,
  Wallet, Receipt, Printer, ExternalLink, Activity, CircleDot, RotateCcw, Filter,
  CheckCheck, Sparkles, BadgePercent, ArrowUpDown, TrendingDown, RefreshCw, FileSpreadsheet,
  Box, CreditCard, List, Grid, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ,
  CheckSquare, Square, Percent, Zap, Share2, Boxes, Warehouse, History,
  PackagePlus, PackageCheck, AlertCircle, ArrowDownRight, Building2
} from 'lucide-react';

// ─── Status Badge Component ───────────────────────────────────────────────────
function Badge({ label, color }) {
  const m = {
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    yellow: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    red: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    gray: 'bg-slate-100 text-slate-600 border border-slate-200'
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${m[color] || m.gray}`}>
      {label}
    </span>
  );
}

// ─── Detailed Product View Modal ─────────────────────────────────────────────
function SellerProductDetailsModal({ product, categories, inventory, onClose }) {
  const p = product;
  const cat = categories.find(c => c.id === p.categoryId);
  const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
  const stockCount = inv ? inv.quantity : 0;
  
  const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
  const [activeVariant, setActiveVariant] = useState(null);

  const displayImage = activeVariant ? (activeVariant.image || p.image) : p.image;
  const displayPrice = activeVariant ? (activeVariant.offPrice || activeVariant.price || p.price) : (p.offPrice || p.price);
  const displayStock = activeVariant?.stock !== undefined ? activeVariant.stock : stockCount;
  const originalPrice = p.discount > 0 ? Math.round(displayPrice / (1 - p.discount / 100)) : (p.price || displayPrice);

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              #PRD-{String(p.productId).padStart(4, '0')}
            </span>
            <Badge 
              label={p.status || 'Pending'} 
              color={p.status === 'Approved' ? 'green' : p.status === 'Rejected' ? 'red' : 'yellow'} 
            />
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors cursor-pointer"
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
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
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
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Photo Gallery & Swatches</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveVariant(null)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    !activeVariant 
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105 shadow-sm' 
                      : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <img src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'} alt="Main" className="w-full h-full object-cover" />
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black px-1 rounded-bl">Main</span>
                </button>

                {hasVariants && p.variants.map((v, idx) => {
                  const isSelected = activeVariant?.id === v.id;
                  return (
                    <button
                      key={v.id || idx}
                      onClick={() => setActiveVariant(v)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105 shadow-sm' 
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <img src={v.image || p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'} alt="Variant" className="w-full h-full object-cover" />
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
                  <span className="text-2xl font-black text-indigo-600">ETB {Number(displayPrice).toLocaleString()}</span>
                  {p.discount > 0 && (
                    <span className="text-sm font-bold text-slate-400 line-through">ETB {Number(originalPrice).toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Product Variants Selector */}
              <div className="space-y-2 border-t border-b border-slate-100 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                    Select Display Mode {hasVariants ? `(${p.variants.length} Variants)` : ''}
                  </p>
                  <span className="text-xs font-bold text-indigo-600 truncate max-w-[200px]">
                    {activeVariant ? (
                      `Selected: ${[activeVariant.color, activeVariant.size].filter(Boolean).join(' / ')}`
                    ) : (
                      'Selected: Main Product'
                    )}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setActiveVariant(null)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      !activeVariant 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs ring-2 ring-indigo-500/20' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>Default Item</span>
                    <span className="text-[10px] opacity-75 font-semibold">ETB {p.price}</span>
                  </button>

                  {hasVariants && p.variants.map((v, idx) => {
                    const isSelected = activeVariant?.id === v.id;
                    return (
                      <button
                        key={v.id || idx}
                        onClick={() => setActiveVariant(v)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs ring-2 ring-indigo-500/20' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {v.color && (
                          <span 
                            className="w-3 h-3 rounded-full border border-slate-300 shrink-0 shadow-2xs" 
                            style={{ backgroundColor: v.color.toLowerCase() }} 
                          />
                        )}
                        <span>{[v.color, v.size].filter(Boolean).join(' - ') || `Variant #${idx + 1}`}</span>
                        <span className="text-[10px] opacity-75 font-semibold">ETB {v.offPrice || v.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">Product Description</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-medium text-slate-600 leading-relaxed max-h-28 overflow-y-auto break-words whitespace-pre-wrap">
                  {p.description || 'No detailed description provided.'}
                </div>
              </div>

              {/* Features List */}
              {Array.isArray(p.features) && p.features.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">Key Highlights</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {p.features.map((feat, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle size={11} className="text-emerald-500" /> {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button 
                onClick={onClose} 
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Product Delete Confirmation Modal ──────────────────────────────────────
function SellerProductDeleteModal({ product, onClose, onConfirm }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Delete Product Listing?</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <img src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
          <div className="min-w-0">
            <p className="font-extrabold text-xs text-slate-900 truncate">{product.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">#PRD-{String(product.productId).padStart(4, '0')} • ETB {Number(product.price).toLocaleString()}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Removing this product will permanently delete it from the marketplace catalog, remove associated stock records, and unpublish all active variants.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
          >
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inventory Restock & Stock Adjustment Modal ──────────────────────────────
function SellerInventoryAdjustModal({ product, inventoryItem, categories, onClose, onSave }) {
  if (!product) return null;
  const currentQty = inventoryItem?.quantity ?? 0;
  const currentThreshold = inventoryItem?.lowStockThreshold ?? 5;
  const cat = categories?.find(c => c.id === product.categoryId);

  const [mode, setMode] = useState('add'); // 'add' | 'set' | 'deduct'
  const [adjustmentValue, setAdjustmentValue] = useState('10');
  const [newThreshold, setNewThreshold] = useState(String(currentThreshold));
  const [reason, setReason] = useState('supplier_restock');
  const [warehouseHub, setWarehouseHub] = useState('Addis Ababa Central Depot');
  const [notes, setNotes] = useState('');

  const numVal = Math.max(0, parseInt(adjustmentValue) || 0);
  let resultingQty = currentQty;
  if (mode === 'add') resultingQty = currentQty + numVal;
  else if (mode === 'deduct') resultingQty = Math.max(0, currentQty - numVal);
  else if (mode === 'set') resultingQty = numVal;

  const parsedThreshold = Math.max(1, parseInt(newThreshold) || 5);
  const resultingStatus = resultingQty === 0 ? 'Out of Stock' : resultingQty <= parsedThreshold ? 'Low Stock' : 'In Stock';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      productId: product.productId,
      quantity: resultingQty,
      lowStockThreshold: parsedThreshold,
      mode,
      delta: mode === 'add' ? numVal : mode === 'deduct' ? -numVal : (resultingQty - currentQty),
      reason,
      warehouseHub,
      notes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/80 shadow-2xs">
              <Boxes size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Stock Adjustment & Warehouse Flow</h3>
              <p className="text-[11px] text-slate-500 font-medium">Record restocks, physical counts, or write-offs with audit trails</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Product Summary Card */}
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} 
              alt={product.name} 
              className="w-13 h-13 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs" 
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-black text-indigo-700 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100">
                  #PRD-{String(product.productId).padStart(4, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-500">{cat?.name || 'General'}</span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 truncate mt-0.5">{product.name}</p>
              <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                ETB {Number(product.price).toLocaleString()} <span className="text-slate-400 font-normal">/ unit</span>
              </p>
            </div>
            <div className="text-right shrink-0 bg-white px-3 py-1.5 rounded-xl border border-slate-200/70 shadow-2xs">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">Current Stock</span>
              <span className="text-sm font-black text-slate-900">{currentQty} <span className="text-[10px] font-bold text-slate-400">units</span></span>
            </div>
          </div>

          {/* Adjustment Mode Switcher */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Adjustment Operation Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode('add')}
                className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  mode === 'add' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <PackagePlus size={14} /> + Add Units
              </button>
              <button
                type="button"
                onClick={() => { setMode('set'); setAdjustmentValue(String(currentQty)); }}
                className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  mode === 'set' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <SlidersHorizontal size={14} /> Exact Count
              </button>
              <button
                type="button"
                onClick={() => setMode('deduct')}
                className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  mode === 'deduct' 
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Trash2 size={14} /> - Deduct
              </button>
            </div>
          </div>

          {/* Value Input & Quick Preset Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                {mode === 'add' ? 'Units to Add (Inbound)' : mode === 'deduct' ? 'Units to Deduct (Write-off)' : 'New Total Exact Count'}
              </label>
              <span className="text-[10px] text-slate-400 font-bold">Quick Presets</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="number"
                  min="0"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl font-mono font-black text-sm text-slate-900 outline-none focus:border-indigo-500 transition-all"
                  required
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">units</span>
              </div>
              <div className="flex items-center gap-1">
                {mode === 'add' && [5, 10, 25, 50, 100].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAdjustmentValue(String(val))}
                    className={`px-2 py-2 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
                      parseInt(adjustmentValue) === val 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' 
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    +{val}
                  </button>
                ))}
                {mode === 'deduct' && [1, 2, 5, 10, 20].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAdjustmentValue(String(val))}
                    className={`px-2 py-2 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
                      parseInt(adjustmentValue) === val 
                        ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold' 
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    -{val}
                  </button>
                ))}
                {mode === 'set' && [0, 10, 25, 50, 100].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAdjustmentValue(String(val))}
                    className={`px-2 py-2 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
                      parseInt(adjustmentValue) === val 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' 
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    ={val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Calculation Preview Card */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Inventory Outcome</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm text-slate-400">{currentQty} units</span>
                <span className="text-slate-400">→</span>
                <span className="font-mono text-base font-black text-white">{resultingQty} units</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  resultingQty > currentQty ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  resultingQty < currentQty ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {resultingQty >= currentQty ? `+${resultingQty - currentQty}` : `${resultingQty - currentQty}`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">New Stock Status</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mt-0.5 ${
                resultingStatus === 'In Stock' ? 'bg-emerald-500 text-slate-950' :
                resultingStatus === 'Low Stock' ? 'bg-amber-400 text-slate-950' :
                'bg-rose-500 text-white'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {resultingStatus}
              </span>
            </div>
          </div>

          {/* Reason & Warehouse Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Adjustment Reason Code</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="supplier_restock">📦 Supplier Restock (PO Inbound)</option>
                <option value="audit_count">🔍 Physical Count / Audit Verification</option>
                <option value="damaged_goods">⚠️ Damaged Goods / Scrap Write-off</option>
                <option value="customer_return">↩️ Customer Return Restock</option>
                <option value="store_transfer">🔄 Store / Warehouse Transfer</option>
                <option value="manual_correction">📝 Manual Inventory Correction</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Storage Warehouse Hub</label>
              <select
                value={warehouseHub}
                onChange={(e) => setWarehouseHub(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Addis Ababa Central Depot">🏢 Addis Ababa Central Depot (Main)</option>
                <option value="Bole Regional Hub">🏬 Bole Regional Hub (East)</option>
                <option value="Mercato Distribution Store">🏪 Mercato Distribution Store (Wholesale)</option>
                <option value="Adama Logistics Center">🚚 Adama Logistics Center (Express Hub)</option>
                <option value="Hawassa Distribution Center">🏭 Hawassa Distribution Center</option>
              </select>
            </div>
          </div>

          {/* Safety Stock Threshold & Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Safety Alert Threshold</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 font-mono"
                  placeholder="5"
                />
                <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">units</span>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Reference / Audit Note (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. PO #88391 from Supplier, shelf verification..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} /> Commit & Record Movement
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ─── Seller Order Details & Fulfillment Modal ────────────────────────────────
function SellerOrderDetailModal({ order, orderItems, products, users, deliveryTracking, onClose }) {
  const o = order;
  if (!o) return null;

  const customer = (users && users.find(u => u.userId === o.userId)) || {
    name: o.customerName || 'Valued Customer',
    email: o.customerEmail || 'customer@smunimarket.com',
    phone: o.customerPhone || '+251 911 000 000'
  };

  const myItems = orderItems.filter(oi => oi.orderId === o.orderId);
  const tracking = deliveryTracking?.find(dt => dt.orderId === o.orderId);
  const deliveryStatus = tracking?.deliveryStatus || o.orderStatus || 'Confirmed';

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              #ORD-{o.orderId}
            </span>
            <Badge 
              label={deliveryStatus} 
              color={
                deliveryStatus === 'Delivered' ? 'green' : 
                deliveryStatus === 'On The Way' ? 'blue' : 
                deliveryStatus === 'Cancelled' ? 'red' : 'yellow'
              } 
            />
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Customer & Delivery Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Customer Details</p>
              <p className="font-black text-xs text-slate-900">{customer.name}</p>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {customer.email}</p>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {customer.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Delivery Destination</p>
              <p className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <MapPin size={13} className="text-rose-500" /> {o.shippingAddress || 'Bole, Addis Ababa, Ethiopia'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Payment: <span className="font-bold text-slate-700">{o.paymentMethod || 'Chapa Online'}</span></p>
              <p className="text-[11px] text-slate-500 font-medium">Order Date: <span className="font-bold text-slate-700">{o.orderDate || 'Today'}</span></p>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Items in this Order ({myItems.length})</p>
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black">
                  <tr>
                    <th className="px-3.5 py-2.5 text-left">Item Details</th>
                    <th className="px-3.5 py-2.5 text-center">Qty</th>
                    <th className="px-3.5 py-2.5 text-right">Unit Price</th>
                    <th className="px-3.5 py-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myItems.map((item, idx) => {
                    const prod = products.find(p => p.productId === item.productId);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-3.5 py-2.5 flex items-center gap-2.5">
                          <img 
                            src={item.image || prod?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} 
                            alt={item.name} 
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200" 
                          />
                          <div>
                            <p className="font-extrabold text-slate-800 line-clamp-1">{item.name || prod?.name || 'Product'}</p>
                            {(item.variantColor || item.variantSize) && (
                              <p className="text-[10px] text-slate-400">Variant: {[item.variantColor, item.variantSize].filter(Boolean).join(' / ')}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 text-center font-bold text-slate-800">{item.quantity || 1}</td>
                        <td className="px-3.5 py-2.5 text-right font-medium text-slate-600">ETB {(item.price || 1000).toLocaleString()}</td>
                        <td className="px-3.5 py-2.5 text-right font-black text-slate-900">ETB {((item.price || 1000) * (item.quantity || 1)).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50/90 font-black border-t border-slate-200">
                  <tr>
                    <td colSpan="3" className="px-3.5 py-2.5 text-right text-slate-600">Total Order Amount:</td>
                    <td className="px-3.5 py-2.5 text-right text-indigo-600 font-black text-sm">ETB {(o.totalAmount || 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs px-6">
          <Link
            to={`/order/${o.orderId}`}
            target="_blank"
            className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1.5"
          >
            <ExternalLink size={13} /> Live Customer Tracking
          </Link>
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Seller Order Packing Slip & Invoice Modal ──────────────────────────────
function SellerOrderReceiptModal({ order, orderItems, products, sellerName, storeName, onClose }) {
  const o = order;
  if (!o) return null;
  const myItems = orderItems.filter(oi => oi.orderId === o.orderId);

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100 my-8">
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-indigo-600" />
            <h3 className="font-black text-sm text-slate-900">Commercial Packing Slip & Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()} 
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer size={14} /> Print Voucher
            </button>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Store & Customer Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{storeName || 'SMUNI Merchant Store'}</h2>
              <p className="text-slate-500 font-medium">{sellerName} (Verified Merchant)</p>
              <p className="text-slate-400 text-[11px] mt-1">Bole Road, Addis Ababa, Ethiopia</p>
              <p className="text-slate-400 text-[11px]">SMUNI Multi-Vendor Marketplace</p>
            </div>
            <div className="text-right space-y-1">
              <span className="inline-block bg-slate-900 text-white font-mono font-black text-xs px-3 py-1 rounded-lg">
                #ORD-{o.orderId}
              </span>
              <p className="text-slate-400 text-[11px]">Date: {o.orderDate || new Date().toISOString().split('T')[0]}</p>
              <p className="text-slate-400 text-[11px]">Payment: <span className="font-bold text-slate-800">{o.paymentMethod || 'Chapa'}</span></p>
            </div>
          </div>

          {/* Recipient info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Ship To (Customer)</p>
            <p className="font-black text-slate-800 text-sm mt-0.5">{o.customerName || 'Valued Customer'}</p>
            <p className="text-slate-500">{o.shippingAddress || 'Addis Ababa, Ethiopia'}</p>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black">
                <tr>
                  <th className="px-4 py-2.5 text-left">Item Description</th>
                  <th className="px-4 py-2.5 text-center">Quantity</th>
                  <th className="px-4 py-2.5 text-right">Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myItems.map((item, idx) => {
                  const prod = products.find(p => p.productId === item.productId);
                  return (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {item.name || prod?.name || 'Product Item'}
                        {(item.variantColor || item.variantSize) && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Option: {[item.variantColor, item.variantSize].filter(Boolean).join(' / ')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{item.quantity || 1}</td>
                      <td className="px-4 py-3 text-right text-slate-600">ETB {(item.price || 1000).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-black text-slate-900">ETB {((item.price || 1000) * (item.quantity || 1)).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 font-black border-t border-slate-200">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right text-slate-700">Subtotal Amount:</td>
                  <td className="px-4 py-3 text-right text-slate-900 text-sm">ETB {(o.totalAmount || 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-center pt-4 border-t border-slate-100 text-slate-400 text-[11px]">
            <p className="font-bold text-slate-600">Thank you for shopping on SMUNI Market!</p>
            <p>For inquiries, contact seller support at support@smunimarket.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN SELLER DASHBOARD COMPONENT ─────────────────────────────────────────
export default function SellerDashboard() {
  const context = useContext(AppContext);
  const {
    currentUser, logoutUser, products, inventory, orders, orderItems, payments,
    categories, brands, addProduct, updateProduct, deleteProduct, updateInventoryQuantity
  } = context;

  const navigate = useNavigate();

  // Navigation states
  const { section, id } = useParams();
  const activeSection = section || 'dashboard';
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const setActiveSection = (newSection) => navigate(newSection === 'dashboard' ? '/seller/dashboard' : `/seller/dashboard/${newSection}`);
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(true);

  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  
  // All Products Catalog Advanced State
  const [catalogViewMode, setCatalogViewMode] = useState('grid');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');
  const [catalogStockFilter, setCatalogStockFilter] = useState('all');
  const [catalogSortBy, setCatalogSortBy] = useState('newest');
  const [selectedCatalogProductIds, setSelectedCatalogProductIds] = useState([]);

  // Inventory Control Center Advanced State
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStatusTab, setInventoryStatusTab] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked'
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('all');
  const [inventoryWarehouseFilter, setInventoryWarehouseFilter] = useState('all');
  const [inventorySortBy, setInventorySortBy] = useState('lowest_stock');
  const [selectedInventoryProductIds, setSelectedInventoryProductIds] = useState([]);
  const [adjustingInventoryProduct, setAdjustingInventoryProduct] = useState(null);
  const [inventoryActiveView, setInventoryActiveView] = useState('table'); // 'table' | 'movement_logs'
  const [inventoryStockLogs, setInventoryStockLogs] = useState(() => {
    const saved = localStorage.getItem('seller_inventory_movement_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'LOG-001',
        productId: 1,
        productName: 'Samsung Galaxy A54 5G',
        sku: '#PRD-0001',
        delta: 25,
        type: 'Inbound Restock',
        reason: 'Supplier Restock (PO Inbound)',
        warehouseHub: 'Addis Ababa Central Depot',
        date: new Date(Date.now() - 3600000 * 4).toLocaleDateString() + ' ' + new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        notes: 'Batch shipment from Bole logistics center'
      },
      {
        id: 'LOG-002',
        productId: 2,
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        sku: '#PRD-0002',
        delta: -2,
        type: 'Damage Write-off',
        reason: 'Damaged Goods / Scrap',
        warehouseHub: 'Bole Regional Hub',
        date: new Date(Date.now() - 3600000 * 20).toLocaleDateString() + ' ' + new Date(Date.now() - 3600000 * 20).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        notes: 'Water damaged packaging during transit'
      },
      {
        id: 'LOG-003',
        productId: 3,
        productName: 'Nike Air Max 270 React Sneakers',
        sku: '#PRD-0003',
        delta: 50,
        type: 'Inbound Restock',
        reason: 'Supplier Restock (PO Inbound)',
        warehouseHub: 'Mercato Distribution Store',
        date: new Date(Date.now() - 3600000 * 44).toLocaleDateString() + ' ' + new Date(Date.now() - 3600000 * 44).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        notes: 'New seasonal arrival warehouse load'
      }
    ];
  });
  const [allProductsSearch, setAllProductsSearch] = useState('');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30d');
  const [analyticsChartMetric, setAnalyticsChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  
  // Reports & Financial Statements State
  const [reportsActiveTab, setReportsActiveTab] = useState('settlement'); // 'settlement' | 'sku_margins' | 'logistics' | 'tax'
  const [reportGenType, setReportGenType] = useState('financial');
  const [reportGenPeriod, setReportGenPeriod] = useState('this_month');
  const [reportGenFormat, setReportGenFormat] = useState('csv');

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Form states for Add/Edit product
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodFeatures, setProdFeatures] = useState([]);
  const [prodPrice, setProdPrice] = useState('');
  const [prodOffPrice, setProdOffPrice] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodSubCatId, setProdSubCatId] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [variantType, setVariantType] = useState('none');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [variants, setVariants] = useState([]);
  const [mainVariantId, setMainVariantId] = useState(null);

  const handleSetMainVariant = (v) => {
    setMainVariantId(v.id);
    if (v.price) setProdPrice(v.price);
    if (v.offPrice !== undefined && v.offPrice !== null) setProdOffPrice(v.offPrice);
    if (v.stock !== undefined && v.stock !== '') setProdStock(v.stock);
    if (v.image) setProdImage(v.image);
  };

  const descWordCount = prodDesc.trim() ? prodDesc.trim().split(/\s+/).length : 0;

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const localPreviewUrl = URL.createObjectURL(file);
      callback(localPreviewUrl);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok && data.url) {
          callback(data.url);
          triggerMessage("Image successfully uploaded to Cloudinary!");
        } else {
          console.error("Cloudinary upload failed:", data.error);
          triggerMessage("Cloudinary upload fallback to local preview.", 'info');
          const reader = new FileReader();
          reader.onloadend = () => callback(reader.result);
          reader.readAsDataURL(file);
        }
      } catch (err) {
        console.error("Upload error:", err);
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  // Seller Profile editable state
  const [sellerNameState, setSellerNameState] = useState(currentUser?.name || 'Selam Tesfaye');
  const [storeNameState, setStoreNameState] = useState(currentUser?.storeName || 'SMUNI Addis Fashion');
  const [sellerPhoneState, setSellerPhoneState] = useState(currentUser?.phone || '+251 911 234 567');
  const [sellerEmailState, setSellerEmailState] = useState(currentUser?.email || 'habesha@seller.com');
  const [sellerAddressState, setSellerAddressState] = useState('Bole Road, Addis Ababa, Ethiopia');
  const [sellerTinState, setSellerTinState] = useState('TIN-004928172');

  // Messages State
  const [selectedMessageId, setSelectedMessageId] = useState(1);
  const [replyInput, setReplyInput] = useState('');
  const [mockMessages, setMockMessages] = useState([
    {
      id: 1,
      customerName: 'Abebe Kebede',
      customerAvatar: 'A',
      subject: 'Question about Classic Wrist Watch sizing & warranty',
      date: 'May 31, 2025 - 10:45 AM',
      unread: true,
      thread: [
        { sender: 'customer', text: 'Hello, is the Classic Wrist Watch waterproof up to 50m?' },
        { sender: 'seller', text: 'Hi Abebe! Yes, it comes with 5ATM water resistance and 1-year warranty.' }
      ]
    },
    {
      id: 2,
      customerName: 'Selamawit Assefa',
      customerAvatar: 'S',
      subject: 'Women\'s Handbag color availability',
      date: 'May 30, 2025 - 02:15 PM',
      unread: true,
      thread: [
        { sender: 'customer', text: 'Do you have the leather handbag in dark tan color?' }
      ]
    },
    {
      id: 3,
      customerName: 'Yonas Berhanu',
      customerAvatar: 'Y',
      subject: 'Delivery timeline for Men\'s Casual Shoes',
      date: 'May 29, 2025 - 04:30 PM',
      unread: false,
      thread: [
        { sender: 'customer', text: 'Hi! I placed order #ORD-10256. Can I expect delivery today?' },
        { sender: 'seller', text: 'Hello Yonas, your order is currently out with our delivery agent Dawit!' }
      ]
    }
  ]);

  // Settings Toggles
  const [emailNewOrderToggle, setEmailNewOrderToggle] = useState(true);
  const [lowStockAlertToggle, setLowStockAlertToggle] = useState(true);
  const [smsNotificationToggle, setSmsNotificationToggle] = useState(false);
  const [autoAcceptToggle, setAutoAcceptToggle] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setSelectedVariant(null);
    setIsDescExpanded(false);
  }, [id]);

  const [actionMsg, setActionMsg] = useState('');

  if (!currentUser || currentUser.role !== 'Seller') {
    navigate('/seller/login');
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/seller/login');
  };

  // ─── DYNAMIC CALCULATIONS FROM MOCK DATABASE ─────────────────────────
  const sellerId = currentUser.userId;
  const sellerName = sellerNameState;
  const storeName = storeNameState;

  // Products belonging to this seller
  const myProducts = products.filter(p => p.sellerId === sellerId);
  const myProductIds = myProducts.map(p => p.productId);

  // Orders containing this seller's products
  const myOrderItems = orderItems.filter(oi => myProductIds.includes(oi.productId));
  const myOrderIds = [...new Set(myOrderItems.map(oi => oi.orderId))];
  const myOrders = orders.filter(o => myOrderIds.includes(o.orderId));

  // Unique customer count
  const myCustomerIds = [...new Set(myOrders.map(o => o.userId))];
  const totalCustomersCount = myCustomerIds.length || 312;

  // Calculated Stats
  const totalOrdersCount = myOrders.length || 158;
  const totalProductsCount = myProducts.length || 42;
  const totalRevenue = myOrderItems.reduce((sum, oi) => sum + (oi.price * oi.quantity), 0) || 98450;
  const netPayout = Math.round(totalRevenue * 0.95);
  const avgOrderValue = Math.round(totalRevenue / (totalOrdersCount || 1));

  // Order status counts
  const pendingOrdersCount = myOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length || 2;
  const inTransitOrdersCount = myOrders.filter(o => o.orderStatus === 'On The Way' || o.orderStatus === 'Processing').length || 1;
  const deliveredOrdersCount = myOrders.filter(o => o.orderStatus === 'Delivered').length || 3;

  // Stock stats
  const totalStockUnits = myProducts.reduce((sum, p) => {
    const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
    return sum + (inv?.quantity || 0);
  }, 0);

  const totalStockValuation = myProducts.reduce((sum, p) => {
    const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
    return sum + (p.price * (inv?.quantity || 0));
  }, 0);

  // Low Stock Items for this seller
  const lowStockItems = inventory.filter(inv => myProductIds.includes(inv.productId) && (inv.stockStatus === 'Low' || inv.stockStatus === 'Out of Stock' || inv.quantity < 5));

  // Recent Orders for this seller
  const recentOrders = myOrders.slice(0, 5).map(o => {
    const items = myOrderItems.filter(oi => oi.orderId === o.orderId);
    const amount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0) || o.totalAmount;
    return { ...o, displayAmount: amount };
  });

  // Best Selling Products for this seller
  const bestSellingProducts = myProducts.map(prod => {
    const soldItems = myOrderItems.filter(oi => oi.productId === prod.productId);
    const unitsSold = soldItems.reduce((sum, oi) => sum + oi.quantity, 0) || 28;
    const revenue = soldItems.reduce((sum, oi) => sum + (oi.price * oi.quantity), 0) || (prod.price * 15);
    return { ...prod, unitsSold, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const triggerMessage = (text) => {
    setActionMsg(text);
    setTimeout(() => setActionMsg(''), 3500);
  };

  // CSV Exporters
  const exportOrdersCSV = () => {
    const headers = ['Order ID,Customer Name,Date,Payment Method,Total Amount (ETB),Order Status'];
    const rows = myOrders.map(o => `"#ORD-${o.orderId}","${o.customerName || 'Customer'}","${o.orderDate || ''}","${o.paymentMethod || 'Chapa'}","${o.totalAmount || 0}","${o.orderStatus || 'Confirmed'}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `store_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerMessage('Store orders CSV statement exported!');
  };

  const exportCatalogCSV = (prodsToExport = myProducts) => {
    const headers = ['Product ID,Name,Category,Brand,Price (ETB),Off Price (ETB),Discount %,Stock Units,Platform Status,Variants Count'];
    const rows = prodsToExport.map(p => {
      const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
      const cat = categories.find(c => c.id === p.categoryId)?.name || 'General';
      const br = brands.find(b => b.id === p.brandId)?.name || 'Generic';
      const stock = inv?.quantity || 0;
      const varCount = Array.isArray(p.variants) ? p.variants.length : 0;
      return `"#PRD-${p.productId}","${(p.name || '').replace(/"/g, '""')}","${cat}","${br}","${p.price || 0}","${p.offPrice || ''}","${p.discount || 0}","${stock}","${p.status || 'Pending'}","${varCount}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `merchant_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerMessage('Product catalog CSV exported successfully!');
  };

  const handleDuplicateProduct = (prod) => {
    const newProd = {
      name: `${prod.name} (Copy)`,
      description: prod.description,
      price: prod.price,
      offPrice: prod.offPrice,
      discount: prod.discount,
      categoryId: prod.categoryId,
      subCategoryId: prod.subCategoryId,
      brandId: prod.brandId,
      image: prod.image,
      stock: 10,
      lowStockThreshold: 3,
      variants: prod.variants ? JSON.parse(JSON.stringify(prod.variants)) : [],
      features: prod.features ? [...prod.features] : [],
      status: 'Pending'
    };
    addProduct(newProd);
    triggerMessage(`Duplicated "${prod.name}" as new draft listing!`);
  };

  const handleBulkDelete = () => {
    if (selectedCatalogProductIds.length === 0) return;
    selectedCatalogProductIds.forEach(id => deleteProduct(id));
    triggerMessage(`Deleted ${selectedCatalogProductIds.length} products successfully!`);
    setSelectedCatalogProductIds([]);
  };

  const handleBulkRestock = () => {
    if (selectedCatalogProductIds.length === 0) return;
    selectedCatalogProductIds.forEach(id => {
      const inv = inventory.find(i => Number(i.productId) === Number(id));
      const currentQty = inv ? inv.quantity : 0;
      updateInventoryQuantity(id, currentQty + 10, 3);
    });
    triggerMessage(`Added +10 stock to ${selectedCatalogProductIds.length} selected items!`);
    setSelectedCatalogProductIds([]);
  };

  useEffect(() => {
    localStorage.setItem('seller_inventory_movement_logs', JSON.stringify(inventoryStockLogs));
  }, [inventoryStockLogs]);

  // Inventory Control Center Handlers
  const handleSaveInventoryAdjustment = ({ productId, quantity, lowStockThreshold, mode, delta, reason, warehouseHub, notes }) => {
    updateInventoryQuantity(productId, quantity, lowStockThreshold);
    const prod = myProducts.find(p => Number(p.productId) === Number(productId));
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      productId,
      productName: prod?.name || `Product #${productId}`,
      sku: `#PRD-${String(productId).padStart(4, '0')}`,
      delta: delta,
      type: mode === 'add' ? 'Inbound Restock' : mode === 'deduct' ? 'Damage Write-off' : 'Audit Adjustment',
      reason: reason === 'supplier_restock' ? 'Supplier Restock (PO Inbound)'
        : reason === 'audit_count' ? 'Physical Inventory Count'
        : reason === 'damaged_goods' ? 'Damaged Goods / Scrap'
        : reason === 'customer_return' ? 'Customer Return Restock'
        : reason === 'store_transfer' ? 'Store / Warehouse Transfer'
        : 'Manual Correction',
      warehouseHub,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || 'Direct warehouse adjustment'
    };
    setInventoryStockLogs(prev => [newLog, ...prev]);
    setAdjustingInventoryProduct(null);
    triggerMessage(`Updated stock for "${prod?.name || 'Product'}" to ${quantity} units!`);
  };

  const handleBatchRestockInventory = (addQty) => {
    if (selectedInventoryProductIds.length === 0) return;
    selectedInventoryProductIds.forEach(id => {
      const inv = inventory.find(i => Number(i.productId) === Number(id));
      const currentQty = inv ? inv.quantity : 0;
      const threshold = inv?.lowStockThreshold || 5;
      const nextQty = currentQty + addQty;
      updateInventoryQuantity(id, nextQty, threshold);

      const prod = myProducts.find(p => Number(p.productId) === Number(id));
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}-${id}`,
        productId: id,
        productName: prod?.name || `Product #${id}`,
        sku: `#PRD-${String(id).padStart(4, '0')}`,
        delta: addQty,
        type: 'Batch Restock',
        reason: 'Bulk Restock Action',
        warehouseHub: inventoryWarehouseFilter !== 'all' ? inventoryWarehouseFilter : 'Addis Ababa Central Depot',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: `Batch added +${addQty} units across ${selectedInventoryProductIds.length} items`
      };
      setInventoryStockLogs(prev => [newLog, ...prev]);
    });
    triggerMessage(`Added +${addQty} stock to ${selectedInventoryProductIds.length} selected items!`);
    setSelectedInventoryProductIds([]);
  };

  const handleExportInventoryCSV = (itemsToExport = null) => {
    const list = itemsToExport || myProducts;
    if (!list.length) {
      triggerMessage('No inventory items to export.');
      return;
    }
    const headers = ['Product ID', 'SKU', 'Product Name', 'Category', 'Unit Price (ETB)', 'Stock Quantity', 'Safety Threshold', 'Stock Status', 'Line Valuation (ETB)'];
    const rows = list.map(p => {
      const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
      const cat = categories.find(c => c.id === p.categoryId);
      const qty = inv?.quantity || 0;
      const threshold = inv?.lowStockThreshold || 5;
      const status = qty === 0 ? 'Out of Stock' : qty <= threshold ? 'Low Stock' : 'In Stock';
      const valuation = qty * p.price;
      return [
        p.productId,
        `#PRD-${String(p.productId).padStart(4, '0')}`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${cat?.name || 'General'}"`,
        p.price,
        qty,
        threshold,
        status,
        valuation
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smuni_seller_inventory_manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerMessage(`Exported ${list.length} inventory records to CSV manifest!`);
  };

  // Custom Report Generation and Export Handler
  const handleGenerateAndExportReport = (type = reportGenType, period = reportGenPeriod, format = reportGenFormat) => {
    let headers = [];
    let rows = [];
    let filename = `smuni_seller_${type}_report_${period}`;

    if (type === 'financial') {
      headers = ['Period', 'Month', 'Orders Count', 'Items Shipped', 'Gross Sales (ETB)', 'Platform Fee (5%)', 'Net Merchant Payout (ETB)', 'Settlement Status', 'Disbursement Method'];
      rows = [
        ['2025-05', 'May 2025', myOrders.length || 18, 54, totalRevenue, Math.round(totalRevenue * 0.05), netPayout, 'Settled & Paid', 'Telebirr SuperApp Merchant'],
        ['2025-04', 'April 2025', 24, 72, 84200, 4210, 79990, 'Settled & Paid', 'CBE Birr Account'],
        ['2025-03', 'March 2025', 19, 58, 68500, 3425, 65075, 'Settled & Paid', 'Telebirr SuperApp Merchant'],
        ['2025-02', 'February 2025', 15, 42, 52300, 2615, 49685, 'Settled & Paid', 'CBE Birr Account'],
        ['2025-01', 'January 2025', 12, 36, 41800, 2090, 39710, 'Settled & Paid', 'Telebirr SuperApp Merchant']
      ];
    } else if (type === 'product_sales') {
      headers = ['Product ID', 'SKU', 'Product Title', 'Category', 'Unit Price (ETB)', 'Units Sold', 'Gross Revenue (ETB)', 'Returns/Refunds', 'Net Margin Contribution (ETB)'];
      rows = myProducts.map((p, idx) => {
        const cat = categories.find(c => c.id === p.categoryId);
        const unitsSold = (idx + 1) * 8 + 4;
        const gross = unitsSold * p.price;
        const returns = idx === 1 ? 1 : 0;
        const net = gross - (returns * p.price) - Math.round(gross * 0.05);
        return [
          p.productId,
          `#PRD-${String(p.productId).padStart(4, '0')}`,
          `"${(p.name || '').replace(/"/g, '""')}"`,
          `"${cat?.name || 'General'}"`,
          p.price,
          unitsSold,
          gross,
          returns,
          net
        ];
      });
    } else if (type === 'inventory_valuation') {
      headers = ['Product ID', 'SKU', 'Product Name', 'Category', 'Stock on Hand', 'Unit Price (ETB)', 'Safety Alert Threshold', 'Stock Status', 'Total Asset Valuation (ETB)'];
      rows = myProducts.map(p => {
        const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
        const cat = categories.find(c => c.id === p.categoryId);
        const qty = inv?.quantity || 0;
        const threshold = inv?.lowStockThreshold || 5;
        const status = qty === 0 ? 'Out of Stock' : qty <= threshold ? 'Low Stock' : 'In Stock';
        return [
          p.productId,
          `#PRD-${String(p.productId).padStart(4, '0')}`,
          `"${(p.name || '').replace(/"/g, '""')}"`,
          `"${cat?.name || 'General'}"`,
          qty,
          p.price,
          threshold,
          status,
          qty * p.price
        ];
      });
    } else if (type === 'tax_withholding') {
      headers = ['Tax Period', 'Gross Commercial Revenue (ETB)', 'Marketplace Platform Fee (5%)', 'Estimated 2% Withholding Tax (MoR)', 'VAT / TOT Computation (ETB)', 'Net Seller Remittance', 'Filing Status'];
      rows = [
        ['2025-Q2 (Apr - Jun)', totalRevenue, Math.round(totalRevenue * 0.05), Math.round(totalRevenue * 0.02), Math.round(totalRevenue * 0.15), Math.round(totalRevenue * 0.93), 'Compliant & Reconciled'],
        ['2025-Q1 (Jan - Mar)', 162600, 8130, 3252, 24390, 151218, 'Filed & Audited'],
        ['2024-Annual Total', 485000, 24250, 9700, 72750, 451050, 'Annual Declaration Complete']
      ];
    }

    if (format === 'json') {
      const jsonData = rows.map(r => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = r[i]; });
        return obj;
      });
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `${filename}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    triggerMessage(`Generated and downloaded ${type.replace('_', ' ').toUpperCase()} statement (${period})!`);
  };

  // Dynamic Chart Configs
  const chartConfigs = {
    '7d': {
      path: 'M 0 100 C 100 80, 200 50, 300 35 C 400 60, 500 25, 600 20 C 650 15, 700 10, 700 10',
      area: 'M 0 100 C 100 80, 200 50, 300 35 C 400 60, 500 25, 600 20 C 650 15, 700 10, 700 10 L 700 160 L 0 160 Z',
      ordersPath: 'M 0 120 C 100 105, 200 75, 300 55 C 400 70, 500 40, 600 30 C 650 25, 700 20, 700 20',
      ordersArea: 'M 0 120 C 100 105, 200 75, 300 55 C 400 70, 500 40, 600 30 C 650 25, 700 20, 700 20 L 700 160 L 0 160 Z',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      growth: '+18.4% velocity',
      ordersGrowth: '+22.1% orders'
    },
    '30d': {
      path: 'M 0 140 C 100 120, 200 110, 300 70 C 400 90, 500 40, 600 50 C 650 30, 700 20, 700 20',
      area: 'M 0 140 C 100 120, 200 110, 300 70 C 400 90, 500 40, 600 50 C 650 30, 700 20, 700 20 L 700 160 L 0 160 Z',
      ordersPath: 'M 0 145 C 100 130, 200 115, 300 80 C 400 95, 500 50, 600 60 C 650 40, 700 28, 700 28',
      ordersArea: 'M 0 145 C 100 130, 200 115, 300 80 C 400 95, 500 50, 600 60 C 650 40, 700 28, 700 28 L 700 160 L 0 160 Z',
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
      growth: '+14.2% monthly',
      ordersGrowth: '+12.5% orders'
    },
    '90d': {
      path: 'M 0 150 C 120 130, 240 100, 360 80 C 480 60, 560 30, 640 25 C 670 20, 700 15, 700 15',
      area: 'M 0 150 C 120 130, 240 100, 360 80 C 480 60, 560 30, 640 25 C 670 20, 700 15, 700 15 L 700 160 L 0 160 Z',
      ordersPath: 'M 0 155 C 120 135, 240 110, 360 90 C 480 70, 560 40, 640 35 C 670 30, 700 25, 700 25',
      ordersArea: 'M 0 155 C 120 135, 240 110, 360 90 C 480 70, 560 40, 640 35 C 670 30, 700 25, 700 25 L 700 160 L 0 160 Z',
      labels: ['Month 1', 'Month 2', 'Month 3'],
      growth: '+26.8% quarterly',
      ordersGrowth: '+19.4% orders'
    },
    '12m': {
      path: 'M 0 155 C 80 140, 160 125, 240 110 C 320 90, 400 75, 480 60 C 560 40, 630 25, 700 15',
      area: 'M 0 155 C 80 140, 160 125, 240 110 C 320 90, 400 75, 480 60 C 560 40, 630 25, 700 15 L 700 160 L 0 160 Z',
      ordersPath: 'M 0 160 C 80 145, 160 130, 240 120 C 320 100, 400 85, 480 70 C 560 50, 630 35, 700 25',
      ordersArea: 'M 0 160 C 80 145, 160 130, 240 120 C 320 100, 400 85, 480 70 C 560 50, 630 35, 700 25 L 700 160 L 0 160 Z',
      labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      growth: '+38.5% annual',
      ordersGrowth: '+31.0% orders'
    }
  };

  // Product submit handler
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!prodName || !prodCatId || !prodBrandId) return;

    let effectivePrice = prodPrice;
    let effectiveOffPrice = prodOffPrice;
    let effectiveStock = prodStock;

    if (variants.length > 0) {
      const mainVar = variants.find(v => v.id === mainVariantId) || variants[0];
      if (mainVar) {
        if (!effectivePrice && mainVar.price) effectivePrice = mainVar.price;
        if ((effectiveOffPrice === '' || effectiveOffPrice === null) && mainVar.offPrice) effectiveOffPrice = mainVar.offPrice;
        if ((effectiveStock === '' || effectiveStock === undefined) && mainVar.stock !== undefined) effectiveStock = mainVar.stock;
      }
    }

    const basePrice = parseFloat(effectivePrice || 100);
    const offPrice  = (effectiveOffPrice !== '' && effectiveOffPrice !== null && effectiveOffPrice !== undefined) ? parseFloat(effectiveOffPrice) : null;
    const discountPct = (offPrice !== null && offPrice < basePrice)
      ? Math.round(((basePrice - offPrice) / basePrice) * 100)
      : 0;

    const defaultCover = (variants.find(v => v.image)?.image) || prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';

    if (editingProduct) {
      updateProduct(editingProduct.productId, {
        name:          prodName,
        description:   prodDesc,
        price:         basePrice,
        offPrice:      offPrice,
        discount:      discountPct,
        categoryId:    parseInt(prodCatId),
        subCategoryId: prodSubCatId ? parseInt(prodSubCatId) : null,
        brandId:       parseInt(prodBrandId),
        image:         defaultCover,
        variants:      variants,
        features:      prodFeatures,
        stock:         prodStock !== '' ? parseInt(prodStock) : undefined,
        status:        'Pending'
      });
      if (prodStock !== '') updateInventoryQuantity(editingProduct.productId, parseInt(prodStock), 3);
      triggerMessage(`Product "${prodName}" updated successfully!`);
    } else {
      addProduct({
        name:          prodName,
        description:   prodDesc,
        price:         basePrice,
        offPrice:      offPrice,
        discount:      discountPct,
        categoryId:    parseInt(prodCatId),
        subCategoryId: prodSubCatId ? parseInt(prodSubCatId) : null,
        brandId:       parseInt(prodBrandId),
        image:         defaultCover,
        stock:         parseInt(prodStock || 0),
        lowStockThreshold: 3,
        variants:      variants,
        features:      prodFeatures,
      });
      triggerMessage(`Product "${prodName}" created and queued for review!`);
    }

    setEditingProduct(null);
    setProdName(''); setProdDesc(''); setProdPrice(''); setProdOffPrice(''); setProdCatId(''); setProdSubCatId(''); setProdBrandId(''); setProdImage(''); setProdStock(''); setVariantType('none'); setVariants([]); setProdFeatures([]);
    setActiveSection('all_products');
  };

  const startEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdFeatures(prod.features || []);
    setProdPrice(prod.price);
    const offPriceVal = prod.offPrice != null
      ? prod.offPrice
      : (prod.discount > 0 ? Math.round(parseFloat(prod.price) * (1 - prod.discount / 100)) : '');
    setProdOffPrice(offPriceVal !== '' ? String(offPriceVal) : '');
    setProdCatId(String(prod.categoryId || ''));
    setProdSubCatId(String(prod.subCategoryId || ''));
    setProdBrandId(String(prod.brandId || ''));
    setProdImage(prod.image);
    setVariants(prod.variants || []);
    setMainVariantId(prod.variants?.[0]?.id || null);
    
    let vType = 'none';
    if (prod.variants?.length > 0) {
      const hasColor = prod.variants.some(v => v.color);
      const hasSize = prod.variants.some(v => v.size);
      if (hasColor && hasSize) vType = 'both';
      else if (hasColor) vType = 'color';
      else if (hasSize) vType = 'size';
    }
    setVariantType(vType);

    const inv = inventory.find(i => Number(i.productId) === Number(prod.productId));
    setProdStock(inv?.quantity || 10);
    setActiveSection('add_product');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyInput) return;
    setMockMessages(prev => prev.map(m => {
      if (m.id === selectedMessageId) {
        return {
          ...m,
          thread: [...m.thread, { sender: 'seller', text: replyInput }]
        };
      }
      return m;
    }));
    setReplyInput('');
    triggerMessage('Reply sent to customer!');
  };

  const activeMessageObj = mockMessages.find(m => m.id === selectedMessageId) || mockMessages[0];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* ─── LEFT SIDEBAR (DARK NAVY #0F172A) ────────────────────────────────── */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#0F172A] text-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <ShoppingBag size={20} color="white" />
              </div>
              <div>
                <p className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  SMUNI-Market
                  <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-bold px-1.5 py-0.5 rounded">Vendor</span>
                </p>
                <p className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">{storeName}</p>
              </div>
            </div>
            <button onClick={() => setSidebarMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white cursor-pointer">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            <button
              onClick={() => { setActiveSection('dashboard'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </button>

            {/* Products Dropdown */}
            <div>
              <button
                onClick={() => setProductsSubmenuOpen(!productsSubmenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ['all_products', 'add_product', 'categories', 'brands'].includes(activeSection)
                    ? 'text-white bg-slate-800/80'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={17} />
                  <span>Products</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-black">
                    {myProducts.length}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${productsSubmenuOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {productsSubmenuOpen && (
                <div className="ml-7 my-1 space-y-1 border-l border-slate-800 pl-3">
                  {[
                    { id: 'all_products', label: 'All Catalog' },
                    { id: 'add_product', label: 'Add New Product' },
                    { id: 'categories', label: 'Categories' },
                    { id: 'brands', label: 'Brands' },
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { setActiveSection(sub.id); setSidebarMobileOpen(false); }}
                      className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        activeSection === sub.id ? 'text-indigo-400 font-extrabold bg-indigo-950/40' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Inventory */}
            <button
              onClick={() => { setActiveSection('inventory'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'inventory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Archive size={17} />
                <span>Inventory Control</span>
              </div>
              {lowStockItems.length > 0 && (
                <span className="bg-rose-500/90 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                  {lowStockItems.length} Low
                </span>
              )}
            </button>

            {/* Orders */}
            <button
              onClick={() => { setActiveSection('orders'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={17} />
                <span>Orders & Dispatch</span>
              </div>
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingOrdersCount} Active
              </span>
            </button>

            {/* Sales & Analytics */}
            <button
              onClick={() => { setActiveSection('sales_analytics'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'sales_analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <BarChart2 size={17} />
              <span>Sales & Analytics</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => { setActiveSection('reports'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'reports' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <FileText size={17} />
              <span>Financial Reports</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => { setActiveSection('messages'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'messages' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={17} />
                <span>Customer Inbox</span>
              </div>
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">3</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => { setActiveSection('profile'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <User size={17} />
              <span>Merchant Profile</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => { setActiveSection('settings'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Settings size={17} />
              <span>Store Preferences</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info & Live Node */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/products"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 shadow-xs"
          >
            <Store size={14} className="text-emerald-400" />
            <span>Open Public Storefront</span>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-500 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Addis Ababa Hub
            </span>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={13} /> Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {sidebarMobileOpen && (
        <div onClick={() => setSidebarMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs" />
      )}

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button onClick={() => setSidebarMobileOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900 p-1 cursor-pointer">
              <Menu size={22} />
            </button>

            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, catalog items, customers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Storefront Link */}
            <Link 
              to="/products"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <Store size={14} /> Storefront Preview
            </Link>

            {/* Notifications Popover */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="Store Notifications"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors cursor-pointer"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {pendingOrdersCount + lowStockItems.length || 3}
                </span>
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-3 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 pb-2 flex items-center justify-between">
                      <p className="text-xs font-black text-slate-900">Merchant Notifications</p>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                        {pendingOrdersCount + lowStockItems.length} Urgent
                      </span>
                    </div>

                    <div className="py-2 px-2 space-y-1 max-h-72 overflow-y-auto">
                      {pendingOrdersCount > 0 && (
                        <div 
                          onClick={() => { setActiveSection('orders'); setNotificationsOpen(false); }}
                          className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                        >
                          <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5"><ShoppingBag size={14} /></span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{pendingOrdersCount} New Orders Awaiting Dispatch</p>
                            <p className="text-[10px] text-slate-400">Click to inspect and print commercial packing slips</p>
                          </div>
                        </div>
                      )}

                      {lowStockItems.length > 0 && (
                        <div 
                          onClick={() => { setActiveSection('inventory'); setNotificationsOpen(false); }}
                          className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                        >
                          <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg shrink-0 mt-0.5"><AlertTriangle size={14} /></span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{lowStockItems.length} Low Stock Catalog Alerts</p>
                            <p className="text-[10px] text-slate-400">Inventory units below critical safety threshold</p>
                          </div>
                        </div>
                      )}

                      <div 
                        onClick={() => { setActiveSection('messages'); setNotificationsOpen(false); }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                      >
                        <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5"><MessageSquare size={14} /></span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">3 Customer Inquiries in Inbox</p>
                          <p className="text-[10px] text-slate-400">Respond promptly to boost store conversion score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Messages Quick Access */}
            <button 
              onClick={() => setActiveSection('messages')}
              title="Customer Messages Inbox"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors cursor-pointer"
            >
              <MessageSquare size={18} />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                3
              </span>
            </button>

            {/* Interactive Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full py-1.5 px-3 transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {sellerName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-extrabold text-slate-800 leading-tight">Hi, {sellerName.split(' ')[0]}</p>
                  <p className="text-[10px] text-indigo-600 font-extrabold">Verified Merchant</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 bg-slate-50/50">
                      <p className="text-xs font-black text-slate-900">{sellerName}</p>
                      <p className="text-[11px] font-medium text-slate-400 truncate">{currentUser?.email || 'seller@smunimarket.com'}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <Store size={10} /> Active Merchant Store
                      </span>
                    </div>

                    <div className="py-1.5 px-1.5 space-y-0.5">
                      <button 
                        onClick={() => { setActiveSection('profile'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User size={15} className="text-slate-400" /> My Merchant Profile
                      </button>

                      <button 
                        onClick={() => { setActiveSection('settings'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Settings size={15} className="text-slate-400" /> Store Preferences
                      </button>

                      <button 
                        onClick={() => { setActiveSection('sales_analytics'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <BarChart2 size={15} className="text-slate-400" /> Sales Analytics
                      </button>
                    </div>

                    <div className="pt-1.5 px-1.5">
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                        className="w-full text-left px-3 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} /> Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Action Alert Banner */}
        {actionMsg && (
          <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl font-bold flex items-center justify-between shadow-xs animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              {actionMsg}
            </span>
            <button onClick={() => setActionMsg('')} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* MAIN BODY DEPENDING ON ACTIVE SECTION */}
        <div className="p-6 space-y-6 flex-1">
          {/* ─── 1. DASHBOARD OVERVIEW ───────────────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <>
              {/* OPERATIONAL LAUNCHPAD HERO BANNER */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={11} /> Verified Merchant Node
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">| Addis Ababa, Ethiopia</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Welcome back, {sellerName.split(' ')[0]} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Your store <span className="font-black text-indigo-300">{storeName}</span> is performing in the top 10% this week. You have <span className="text-amber-300 font-bold">{pendingOrdersCount} orders ready for fulfillment</span>.
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => { setEditingProduct(null); setActiveSection('add_product'); }}
                    className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={15} /> Add New Product
                  </button>
                  <button
                    onClick={exportOrdersCSV}
                    className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Download size={15} /> Export Orders
                  </button>
                </div>

                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* 6 HIGH-IMPACT MERCHANT KPI CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* 1. Gross Revenue */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">ETB</span>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp size={10} /> +14%
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Gross Sales</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">ETB {totalRevenue.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Net: ETB {netPayout.toLocaleString()}</p>
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><ShoppingBag size={16} /></span>
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                      {pendingOrdersCount} Pending
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Orders</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{totalOrdersCount}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">AOV: ETB {avgOrderValue}</p>
                  </div>
                </div>

                {/* 3. Customer Reach */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Users size={16} /></span>
                    <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">Buyers</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Store Reach</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{totalCustomersCount}</p>
                    <p className="text-[9px] text-emerald-600 font-bold mt-0.5">24.8% Repeat Rate</p>
                  </div>
                </div>

                {/* 4. Active Catalog */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Package size={16} /></span>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Catalog Items</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{myProducts.length}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{categories.length} Categories</p>
                  </div>
                </div>

                {/* 5. Stock Asset Value */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><Archive size={16} /></span>
                    <span className="text-[10px] font-extrabold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">In Hub</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Stock Valuation</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">ETB {Math.round(totalStockValuation).toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{totalStockUnits} Units Total</p>
                  </div>
                </div>

                {/* 6. Action Radar */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><AlertTriangle size={16} /></span>
                    <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">Attention</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Store Queue</p>
                    <p className="text-lg font-black text-rose-600 mt-0.5">{pendingOrdersCount + lowStockItems.length} Items</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{lowStockItems.length} Low Stock</p>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE REVENUE VELOCITY CHART & FULFILLMENT PIPELINE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Cols: Interactive Revenue Curve */}
                <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                        <Activity size={16} className="text-indigo-600" /> Revenue Velocity & Order Trajectory
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">Real-time performance metrics computed from verified store transactions</p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      {['7d', '30d', '90d'].map(tf => (
                        <button
                          key={tf}
                          onClick={() => setAnalyticsTimeframe(tf)}
                          className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                            analyticsTimeframe === tf 
                              ? 'bg-white text-indigo-600 shadow-xs' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {tf.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Total Net Earned</p>
                      <p className="text-2xl font-black text-slate-900 mt-0.5">ETB {netPayout.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <TrendingUp size={13} /> {chartConfigs[analyticsTimeframe]?.growth || '+14.2%'}
                      </span>
                    </div>
                  </div>

                  {/* SVG Line & Area Chart */}
                  <div className="h-44 w-full pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sellerGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="40" x2="700" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="140" x2="700" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <path d={chartConfigs[analyticsTimeframe]?.area || chartConfigs['30d'].area} fill="url(#sellerGrad)" />
                      <path d={chartConfigs[analyticsTimeframe]?.path || chartConfigs['30d'].path} fill="none" stroke="#4F46E5" strokeWidth="3.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[10px] font-extrabold uppercase text-slate-400 pt-2 border-t border-slate-100">
                    {chartConfigs[analyticsTimeframe]?.labels.map((lbl, idx) => (
                      <span key={idx}>{lbl}</span>
                    ))}
                  </div>
                </div>

                {/* Right 4 Cols: Store Fulfillment Pipeline */}
                <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                        <Truck size={16} className="text-indigo-600" /> Dispatch Pipeline
                      </h3>
                      <button onClick={() => setActiveSection('orders')} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                        Manage
                      </button>
                    </div>

                    <div className="space-y-4 mt-4">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-700 flex items-center gap-1.5"><CircleDot size={12} className="text-amber-500" /> Pending Dispatch</span>
                          <span className="text-slate-900 font-black">{pendingOrdersCount} Orders</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, pendingOrdersCount * 25)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-700 flex items-center gap-1.5"><Truck size={12} className="text-blue-500" /> Out for Delivery</span>
                          <span className="text-slate-900 font-black">{inTransitOrdersCount} Orders</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, inTransitOrdersCount * 30)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-700 flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-500" /> Delivered & Settled</span>
                          <span className="text-slate-900 font-black">{deliveredOrdersCount} Orders</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, deliveredOrdersCount * 20)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>Platform Commission:</span>
                      <span className="text-slate-900">5.0%</span>
                    </div>
                    <div className="flex justify-between font-black text-indigo-600">
                      <span>Vendor Payout Share:</span>
                      <span>95.0% Direct</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-COLUMN OPERATIONAL FEEDS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Recent Store Orders (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-indigo-600" /> Recent Store Orders
                      </h3>
                      <button onClick={() => setActiveSection('orders')} className="text-xs font-extrabold text-indigo-600 hover:underline cursor-pointer">
                        View All ({myOrders.length})
                      </button>
                    </div>

                    <div className="space-y-2.5 mt-3">
                      {recentOrders.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No orders recorded yet.</p>
                      ) : (
                        recentOrders.map(o => (
                          <div key={o.orderId} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-150 hover:bg-slate-50 transition-all">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-indigo-600">#ORD-{o.orderId}</span>
                                <Badge label={o.orderStatus || 'Confirmed'} color={o.orderStatus === 'Delivered' ? 'green' : 'yellow'} />
                              </div>
                              <p className="text-xs font-bold text-slate-700">{o.customerName || 'Customer'}</p>
                              <p className="text-[10px] text-slate-400">{o.orderDate || 'Today'}</p>
                            </div>

                            <div className="text-right space-y-1">
                              <span className="font-black text-xs text-slate-900 block">ETB {(o.displayAmount || 2450).toLocaleString()}</span>
                              <div className="flex items-center gap-1 justify-end">
                                <button
                                  onClick={() => setSelectedOrderDetail(o)}
                                  title="Inspect Order"
                                  className="p-1 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  onClick={() => setSelectedOrderReceipt(o)}
                                  title="Print Packing Slip"
                                  className="p-1 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Printer size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Best-Selling Products Leaderboard (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <Award size={16} className="text-amber-500" /> Top Sellers
                      </h3>
                      <button onClick={() => setActiveSection('all_products')} className="text-xs font-extrabold text-indigo-600 hover:underline cursor-pointer">
                        Catalog
                      </button>
                    </div>

                    <div className="space-y-2.5 mt-3">
                      {bestSellingProducts.map((prod, idx) => (
                        <div key={prod.productId} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-700 font-black text-[10px] flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <img src={prod.image} alt={prod.name} className="w-8 h-8 object-cover rounded-lg border border-slate-200 bg-white shrink-0" />
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-800 truncate">{prod.name}</p>
                              <p className="text-[10px] text-slate-400">{prod.unitsSold} units sold</p>
                            </div>
                          </div>
                          <span className="font-black text-xs text-indigo-600 shrink-0">
                            ETB {prod.revenue.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Inventory Depletion Alerts (3 Cols) */}
                <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-500" /> Low Stock Radar
                      </h3>
                      <button onClick={() => setActiveSection('inventory')} className="text-xs font-extrabold text-indigo-600 hover:underline cursor-pointer">
                        Restock
                      </button>
                    </div>

                    <div className="space-y-2.5 mt-3">
                      {(lowStockItems.length > 0 ? lowStockItems : myProducts.slice(0, 4)).map((item, idx) => {
                        const prod = myProducts.find(p => p.productId === item.productId) || item;
                        return (
                          <div key={idx} className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-extrabold text-xs text-slate-800 truncate max-w-[130px]">{prod.name}</p>
                              <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                                {item.quantity !== undefined ? item.quantity : 2} left
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-400">ETB {prod.price}</span>
                              <button 
                                onClick={() => {
                                  updateInventoryQuantity(prod.productId, (item.quantity || 2) + 15, 3);
                                  triggerMessage(`Restocked +15 units for ${prod.name}`);
                                }}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                              >
                                + Quick Add 15
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── 2. ALL PRODUCTS (UPGRADED ENTERPRISE CATALOG) ────────────────── */}
          {activeSection === 'all_products' && (() => {
            // Computed Filtered & Sorted Catalog
            const filteredCatalogProducts = myProducts.filter(p => {
              const q = allProductsSearch.toLowerCase().trim();
              const cat = categories.find(c => c.id === p.categoryId);
              const br = brands.find(b => b.id === p.brandId);
              const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
              const stock = inv ? inv.quantity : 0;

              const matchesSearch = !q || 
                p.name.toLowerCase().includes(q) || 
                String(p.productId).includes(q) || 
                (cat && cat.name.toLowerCase().includes(q)) || 
                (br && br.name.toLowerCase().includes(q)) ||
                (p.features && p.features.some(f => f.toLowerCase().includes(q)));

              const statusToCheck = p.status || 'Pending';
              const matchesStatus = statusFilter === 'All Status' || 
                (statusFilter === 'Discounted' ? p.discount > 0 :
                 statusFilter === 'Low Stock' ? stock < 5 :
                 statusFilter === 'In Stock' ? stock > 0 :
                 statusToCheck === statusFilter);

              const matchesCategory = catalogCategoryFilter === 'all' || p.categoryId === parseInt(catalogCategoryFilter);

              const matchesStock = catalogStockFilter === 'all' || 
                (catalogStockFilter === 'in_stock' && stock > 0) ||
                (catalogStockFilter === 'low_stock' && stock > 0 && stock <= 5) ||
                (catalogStockFilter === 'out_of_stock' && stock === 0);

              return matchesSearch && matchesStatus && matchesCategory && matchesStock;
            }).sort((a, b) => {
              const invA = inventory.find(i => Number(i.productId) === Number(a.productId))?.quantity || 0;
              const invB = inventory.find(i => Number(i.productId) === Number(b.productId))?.quantity || 0;
              const priceA = Number(a.offPrice || a.price);
              const priceB = Number(b.offPrice || b.price);

              if (catalogSortBy === 'price_asc') return priceA - priceB;
              if (catalogSortBy === 'price_desc') return priceB - priceA;
              if (catalogSortBy === 'stock_asc') return invA - invB;
              if (catalogSortBy === 'stock_desc') return invB - invA;
              if (catalogSortBy === 'name_asc') return a.name.localeCompare(b.name);
              if (catalogSortBy === 'discount_desc') return (b.discount || 0) - (a.discount || 0);
              return b.productId - a.productId;
            });

            const approvedCount = myProducts.filter(p => p.status === 'Approved' || p.status === 'Active').length;
            const pendingCount = myProducts.filter(p => p.status === 'Pending').length;
            const rejectedCount = myProducts.filter(p => p.status === 'Rejected').length;
            const onSaleCount = myProducts.filter(p => p.discount > 0).length;

            const isAllSelected = filteredCatalogProducts.length > 0 && selectedCatalogProductIds.length === filteredCatalogProducts.length;

            const toggleSelectAll = () => {
              if (isAllSelected) {
                setSelectedCatalogProductIds([]);
              } else {
                setSelectedCatalogProductIds(filteredCatalogProducts.map(p => p.productId));
              }
            };

            const toggleSelectProduct = (pId) => {
              if (selectedCatalogProductIds.includes(pId)) {
                setSelectedCatalogProductIds(selectedCatalogProductIds.filter(id => id !== pId));
              } else {
                setSelectedCatalogProductIds([...selectedCatalogProductIds, pId]);
              }
            };

            const hasActiveFilters = allProductsSearch || statusFilter !== 'All Status' || catalogCategoryFilter !== 'all' || catalogStockFilter !== 'all' || catalogSortBy !== 'newest';

            return (
              <div className="space-y-6">
                {/* ── TOP HEADER WITH KPI & ACTIONS ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Product Catalog & Listings
                      </h2>
                      <span className="text-xs bg-indigo-50 text-indigo-700 font-black px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
                        <Package size={13} /> {myProducts.length} Items Listed
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-100 hidden sm:inline-flex items-center gap-1">
                        ETB {Math.round(totalStockValuation).toLocaleString()} Total Valuation
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Manage product attributes, swatches, variations, inventory availability, and review statuses
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    {/* View Switcher */}
                    <div className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
                      <button
                        onClick={() => setCatalogViewMode('grid')}
                        title="Grid Card View"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${catalogViewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        onClick={() => setCatalogViewMode('table')}
                        title="Table List View"
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${catalogViewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <List size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => exportCatalogCSV(filteredCatalogProducts)}
                      className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-extrabold px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Download size={14} /> Export CSV
                    </button>

                    <button 
                      onClick={() => { setEditingProduct(null); setActiveSection('add_product'); }} 
                      className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus size={16} /> Add Product
                    </button>
                  </div>
                </div>

                {/* ── 6 QUICK STATUS TABS WITH LIVE PILLS ── */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {[
                    { id: 'All Status', label: 'All Listings', count: myProducts.length, color: 'indigo' },
                    { id: 'Approved', label: 'Approved & Live', count: approvedCount, color: 'emerald' },
                    { id: 'Pending', label: 'Pending Review', count: pendingCount, color: 'amber' },
                    { id: 'Rejected', label: 'Rejected', count: rejectedCount, color: 'rose' },
                    { id: 'Low Stock', label: 'Low Stock Radar', count: lowStockItems.length, color: 'rose' },
                    { id: 'Discounted', label: 'Special Deals / Sale', count: onSaleCount, color: 'purple' },
                  ].map(tab => {
                    const isActive = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                          isActive 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* ── ADVANCED FILTER & SORT TOOLBAR ── */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                    {/* Search Input (5 cols) */}
                    <div className="lg:col-span-5 relative">
                      <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search by title, SKU #PRD-..., brand, tags..." 
                        value={allProductsSearch}
                        onChange={(e) => setAllProductsSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all" 
                      />
                      {allProductsSearch && (
                        <button onClick={() => setAllProductsSearch('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Category Filter (3 cols) */}
                    <div className="lg:col-span-3">
                      <select 
                        value={catalogCategoryFilter} 
                        onChange={(e) => setCatalogCategoryFilter(e.target.value)} 
                        className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 cursor-pointer transition-all"
                      >
                        <option value="all">All Product Categories</option>
                        {categories.filter(c => !c.parent_id).map(c => {
                          const count = myProducts.filter(p => p.categoryId === c.id).length;
                          return (
                            <option key={c.id} value={c.id}>
                              {c.name} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Stock Status (2 cols) */}
                    <div className="lg:col-span-2">
                      <select 
                        value={catalogStockFilter} 
                        onChange={(e) => setCatalogStockFilter(e.target.value)} 
                        className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 cursor-pointer transition-all"
                      >
                        <option value="all">All Stock Status</option>
                        <option value="in_stock">In Stock (&gt; 0)</option>
                        <option value="low_stock">Low Stock (≤ 5)</option>
                        <option value="out_of_stock">Out of Stock (0)</option>
                      </select>
                    </div>

                    {/* Sort By (2 cols) */}
                    <div className="lg:col-span-2">
                      <select 
                        value={catalogSortBy} 
                        onChange={(e) => setCatalogSortBy(e.target.value)} 
                        className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 cursor-pointer transition-all"
                      >
                        <option value="newest">Sort: Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="stock_desc">Stock: High to Low</option>
                        <option value="stock_asc">Stock: Depleting First</option>
                        <option value="discount_desc">Highest Discount %</option>
                        <option value="name_asc">Alphabetical (A-Z)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filter Indicators & Clear button */}
                  {hasActiveFilters && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-400 font-bold text-[11px]">Filtered: {filteredCatalogProducts.length} of {myProducts.length} items</span>
                        {statusFilter !== 'All Status' && (
                          <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                            Status: {statusFilter} <button onClick={() => setStatusFilter('All Status')} className="cursor-pointer"><X size={10}/></button>
                          </span>
                        )}
                        {catalogCategoryFilter !== 'all' && (
                          <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                            Category: {categories.find(c => c.id === parseInt(catalogCategoryFilter))?.name} <button onClick={() => setCatalogCategoryFilter('all')} className="cursor-pointer"><X size={10}/></button>
                          </span>
                        )}
                        {catalogStockFilter !== 'all' && (
                          <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                            Stock: {catalogStockFilter.replace('_', ' ')} <button onClick={() => setCatalogStockFilter('all')} className="cursor-pointer"><X size={10}/></button>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setAllProductsSearch('');
                          setStatusFilter('All Status');
                          setCatalogCategoryFilter('all');
                          setCatalogStockFilter('all');
                          setCatalogSortBy('newest');
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-black text-[11px] hover:underline cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* ── FLOATING BULK ACTIONS TOOLBAR (WHEN ITEMS SELECTED) ── */}
                {selectedCatalogProductIds.length > 0 && (
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs">
                        {selectedCatalogProductIds.length}
                      </span>
                      <p className="text-xs font-bold text-slate-200">
                        Products selected for batch action
                      </p>
                      <button
                        onClick={toggleSelectAll}
                        className="text-[11px] font-extrabold text-indigo-300 hover:text-white underline cursor-pointer"
                      >
                        {isAllSelected ? 'Deselect All' : `Select All ${filteredCatalogProducts.length}`}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBulkRestock}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Archive size={13} className="text-emerald-400" /> +10 Stock to All
                      </button>
                      <button
                        onClick={() => {
                          const selectedObjs = myProducts.filter(p => selectedCatalogProductIds.includes(p.productId));
                          exportCatalogCSV(selectedObjs);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download size={13} /> Export Selected
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Trash2 size={13} /> Delete Selected
                      </button>
                    </div>
                  </div>
                )}

                {/* ── PRODUCTS DISPLAY: ZERO STATE ── */}
                {filteredCatalogProducts.length === 0 ? (
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                      <Package size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-base">No Products Found in Catalog</h3>
                      <p className="text-xs text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                        {hasActiveFilters
                          ? "No items match your active search and filter combinations. Try resetting filters to view all products."
                          : "Your product catalog is currently empty. Click below to add your first product listing to the SMUNI marketplace."}
                      </p>
                    </div>
                    {hasActiveFilters ? (
                      <button 
                        onClick={() => {
                          setAllProductsSearch('');
                          setStatusFilter('All Status');
                          setCatalogCategoryFilter('all');
                          setCatalogStockFilter('all');
                          setCatalogSortBy('newest');
                        }}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <RotateCcw size={14} /> Clear All Filters
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setEditingProduct(null); setActiveSection('add_product'); }}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus size={14} /> Add First Product
                      </button>
                    )}
                  </div>
                ) : catalogViewMode === 'grid' ? (
                  /* ── GRID CARD VIEW ── */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredCatalogProducts.map(p => {
                      const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
                      const cat = categories.find(c => c.id === p.categoryId);
                      const isPending = p.status === 'Pending';
                      const isRejected = p.status === 'Rejected';
                      const stockCount = inv?.quantity || 0;
                      const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
                      const isSelected = selectedCatalogProductIds.includes(p.productId);

                      const displayPrice = p.offPrice || p.price;
                      const originalPrice = p.discount > 0 ? Math.round(displayPrice / (1 - p.discount / 100)) : p.price;

                      return (
                        <div 
                          key={p.productId} 
                          onClick={() => setSelectedProductDetails(p)} 
                          className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group relative ${
                            isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200/80 hover:border-indigo-300'
                          }`}
                        >
                          {/* Image Container */}
                          <div className="relative h-48 bg-slate-50 overflow-hidden flex items-center justify-center">
                            {p.image ? (
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                            ) : (
                              <Package size={44} className="text-slate-300" />
                            )}
                            
                            {/* Checkbox for batch select */}
                            <div 
                              onClick={(e) => { e.stopPropagation(); toggleSelectProduct(p.productId); }}
                              className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-300 flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 transition-transform"
                            >
                              {isSelected ? (
                                <CheckSquare size={16} className="text-indigo-600 fill-indigo-50" />
                              ) : (
                                <Square size={14} className="text-slate-400" />
                              )}
                            </div>

                            {/* Discount Ribbon */}
                            {p.discount > 0 && (
                              <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md z-10">
                                -{p.discount}% OFF
                              </div>
                            )}

                            {/* Review Status Pill */}
                            <div className="absolute bottom-2.5 left-2.5 z-10">
                              <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-lg backdrop-blur-md border shadow-xs ${
                                isPending ? 'bg-amber-500/90 text-white border-amber-400/50' : 
                                isRejected ? 'bg-rose-500/90 text-white border-rose-400/50' : 
                                'bg-emerald-500/90 text-white border-emerald-400/50'
                              }`}>
                                {isPending ? 'Pending Review' : isRejected ? 'Rejected' : 'Approved'}
                              </span>
                            </div>

                            {/* Variant Badge */}
                            {hasVariants && (
                              <div className="absolute bottom-2.5 right-2.5 z-10 bg-slate-900/85 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-white/20">
                                {p.variants.length} Variants
                              </div>
                            )}
                          </div>

                          {/* Details Body */}
                          <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[120px]">
                                  {cat?.name || 'General'}
                                </span>
                                <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                  #PRD-{String(p.productId).padStart(4, '0')}
                                </span>
                              </div>
                              <h3 className="font-extrabold text-slate-800 text-xs leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                {p.name}
                              </h3>

                              {/* Features Pill */}
                              {Array.isArray(p.features) && p.features.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {p.features.slice(0, 2).map((f, i) => (
                                    <span key={i} className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                                      {f}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Price & Stock Meter */}
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <div className="flex items-baseline justify-between">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-black text-indigo-600 text-sm">
                                    ETB {Number(displayPrice).toLocaleString()}
                                  </span>
                                  {p.discount > 0 && (
                                    <span className="text-[10px] font-bold text-slate-400 line-through">
                                      ETB {Number(originalPrice).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  stockCount > 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                                  stockCount > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                                  'bg-rose-50 text-rose-700 border border-rose-200/60'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${stockCount > 10 ? 'bg-emerald-500' : stockCount > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                  {stockCount > 0 ? `${stockCount} in stock` : 'Out of stock'}
                                </span>
                              </div>

                              {/* Action Footer Buttons */}
                              <div className="grid grid-cols-3 gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setSelectedProductDetails(p); }}
                                  title="Inspect Product"
                                  className="py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); startEditProduct(p); setActiveSection('add_product'); }}
                                  title="Edit Product"
                                  className="py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmProduct(p); }}
                                  title="Delete Listing"
                                  className="py-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ── TABLE LIST VIEW ── */
                  <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black border-b border-slate-200/80">
                          <tr>
                            <th className="px-4 py-3.5 text-center w-10">
                              <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleSelectAll}
                                className="rounded border-slate-300 text-indigo-600 cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-3.5 text-left">Product & Brand</th>
                            <th className="px-4 py-3.5 text-left">Category</th>
                            <th className="px-4 py-3.5 text-left">Variants</th>
                            <th className="px-4 py-3.5 text-right">Price (ETB)</th>
                            <th className="px-4 py-3.5 text-center">Stock Level</th>
                            <th className="px-4 py-3.5 text-center">Status</th>
                            <th className="px-4 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredCatalogProducts.map(p => {
                            const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
                            const cat = categories.find(c => c.id === p.categoryId);
                            const br = brands.find(b => b.id === p.brandId);
                            const stockCount = inv?.quantity || 0;
                            const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
                            const isSelected = selectedCatalogProductIds.includes(p.productId);

                            return (
                              <tr key={p.productId} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectProduct(p.productId)}
                                    className="rounded border-slate-300 text-indigo-600 cursor-pointer"
                                  />
                                </td>

                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <img src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} alt={p.name} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0" />
                                    <div className="min-w-0">
                                      <p className="font-extrabold text-slate-900 truncate max-w-[200px]">{p.name}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#PRD-{String(p.productId).padStart(4, '0')}</span>
                                        {br && <span className="text-[10px] text-slate-400 font-semibold">{br.name}</span>}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-4 py-3">
                                  <span className="font-bold text-slate-700">{cat?.name || 'General'}</span>
                                </td>

                                <td className="px-4 py-3">
                                  {hasVariants ? (
                                    <div className="flex items-center gap-1">
                                      {p.variants.slice(0, 3).map((v, idx) => (
                                        <span
                                          key={idx}
                                          className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-2xs"
                                          style={{ backgroundColor: (v.color || '#CBD5E1').toLowerCase() }}
                                          title={v.color || v.size}
                                        />
                                      ))}
                                      {p.variants.length > 3 && (
                                        <span className="text-[10px] text-slate-400 font-bold ml-1">+{p.variants.length - 3}</span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-medium">Standard</span>
                                  )}
                                </td>

                                <td className="px-4 py-3 text-right">
                                  <div className="font-black text-slate-900">
                                    ETB {Number(p.offPrice || p.price).toLocaleString()}
                                  </div>
                                  {p.discount > 0 && (
                                    <span className="text-[10px] text-rose-600 font-extrabold">
                                      -{p.discount}%
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-3 text-center">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        const nextQty = Math.max(0, stockCount - 1);
                                        updateInventoryQuantity(p.productId, nextQty, 3);
                                        triggerMessage(`Decreased stock for ${p.name}`);
                                      }}
                                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer transition-colors"
                                    >
                                      -
                                    </button>
                                    <span className={`font-mono font-black text-xs px-1.5 min-w-[28px] ${stockCount <= 5 ? 'text-rose-600' : 'text-slate-800'}`}>
                                      {stockCount}
                                    </span>
                                    <button
                                      onClick={() => {
                                        const nextQty = stockCount + 5;
                                        updateInventoryQuantity(p.productId, nextQty, 3);
                                        triggerMessage(`Added +5 stock for ${p.name}`);
                                      }}
                                      className="w-6 h-6 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black flex items-center justify-center cursor-pointer transition-colors"
                                    >
                                      +5
                                    </button>
                                  </div>
                                </td>

                                <td className="px-4 py-3 text-center">
                                  <Badge 
                                    label={p.status || 'Pending'} 
                                    color={p.status === 'Approved' ? 'green' : p.status === 'Rejected' ? 'red' : 'yellow'} 
                                  />
                                </td>

                                <td className="px-4 py-3 text-right">
                                  <div className="inline-flex items-center gap-1 justify-end">
                                    <button
                                      onClick={() => setSelectedProductDetails(p)}
                                      title="Inspect Product"
                                      className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button
                                      onClick={() => { startEditProduct(p); setActiveSection('add_product'); }}
                                      title="Edit Product"
                                      className="p-1.5 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmProduct(p)}
                                      title="Delete Product"
                                      className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ─── 3. ADD / EDIT PRODUCT ─────────────────────────────────────── */}
          {activeSection === 'add_product' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Marketplace Listing'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Add specifications, variations (colors & sizes), and media for customer view</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setActiveSection('all_products')} 
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Back to Catalog
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Inputs (8 Cols) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
                  <form onSubmit={handleProductSubmit} className="space-y-6 text-xs">
                    
                    {/* Basic Info */}
                    <div className="space-y-4 p-5 bg-slate-50 border border-slate-150 rounded-2xl">
                      <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-200 pb-2 mb-4">
                        Basic Product Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase">Product Name *</label>
                          <input 
                            type="text" 
                            required 
                            value={prodName} 
                            onChange={e => setProdName(e.target.value)} 
                            placeholder="e.g. Premium Leather Jacket" 
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold bg-white" 
                          />
                        </div>
                          
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase flex justify-between">
                            <span>Detailed Description</span>
                            <span className={descWordCount > 500 ? 'text-rose-500 font-black' : 'text-slate-400'}>{descWordCount} / 500 words</span>
                          </label>
                          <textarea 
                            placeholder="Write a detailed description highlighting craftsmanship, materials, warranty, and fit..." 
                            rows="4" 
                            value={prodDesc} 
                            onChange={e => {
                              const text = e.target.value;
                              const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                              if (words <= 500) {
                                setProdDesc(text);
                              } else {
                                if (text.length < prodDesc.length) setProdDesc(text);
                              }
                            }} 
                            className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-indigo-500 font-medium ${descWordCount > 500 ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'}`}
                          />
                        </div>

                        {/* Features List */}
                        <div className="space-y-2 mt-2 p-4 bg-white border border-slate-200 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Feature Highlights (Max 15 tags)</label>
                            <span className="text-[10px] font-bold text-slate-400">{prodFeatures.length} / 15 added</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              id="newFeatureInput"
                              placeholder="e.g. Genuine Ethiopian Leather" 
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-medium text-xs"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = e.target.value.trim();
                                  if (val && prodFeatures.length < 15) {
                                    setProdFeatures([...prodFeatures, val]);
                                    e.target.value = '';
                                  }
                                }
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('newFeatureInput');
                                const val = input.value.trim();
                                if (val && prodFeatures.length < 15) {
                                  setProdFeatures([...prodFeatures, val]);
                                  input.value = '';
                                }
                              }}
                              disabled={prodFeatures.length >= 15}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:bg-slate-300 transition-colors cursor-pointer"
                            >
                              Add Tag
                            </button>
                          </div>
                          
                          {prodFeatures.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                              {prodFeatures.map((feat, idx) => (
                                <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                                  {feat}
                                  <button type="button" onClick={() => setProdFeatures(prodFeatures.filter((_, i) => i !== idx))} className="hover:bg-indigo-200 rounded-full p-0.5 text-indigo-800 cursor-pointer"><X size={10}/></button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Category *</label>
                            <select required value={prodCatId} onChange={e => { setProdCatId(e.target.value); setProdSubCatId(''); }} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold bg-white text-xs cursor-pointer">
                              <option value="">Select Category</option>
                              {categories.filter(c => !c.parent_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Subcategory (Optional)</label>
                            <select value={prodSubCatId} onChange={e => setProdSubCatId(e.target.value)} disabled={!prodCatId} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold bg-white text-xs disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer">
                              <option value="">Select Subcategory</option>
                              {categories.filter(c => c.parent_id === parseInt(prodCatId)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Brand Partner *</label>
                            <select required value={prodBrandId} onChange={e => setProdBrandId(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold bg-white text-xs cursor-pointer">
                              <option value="">Select Brand</option>
                              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Pricing & Stock Fallback */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Standard Price (ETB) *</label>
                            <input 
                              type="number" 
                              required={variants.length === 0}
                              placeholder="2500" 
                              value={prodPrice} 
                              onChange={e => setProdPrice(e.target.value)} 
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-black text-indigo-700 bg-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Sale Off Price (ETB)</label>
                            <input 
                              type="number" 
                              placeholder="2100" 
                              value={prodOffPrice} 
                              onChange={e => setProdOffPrice(e.target.value)} 
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-black text-emerald-700 bg-emerald-50/50" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Total Stock (Units) *</label>
                            <input 
                              type="number" 
                              required={variants.length === 0}
                              placeholder="20" 
                              value={prodStock} 
                              onChange={e => setProdStock(e.target.value)} 
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold bg-white" 
                            />
                          </div>
                        </div>

                        {/* Main Cover Image Upload */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase">Main Product Image</label>
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden bg-white shrink-0">
                              {prodImage ? (
                                <>
                                  <img src={prodImage} className="w-full h-full object-cover" alt="Preview" />
                                  <button type="button" onClick={() => setProdImage('')} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 cursor-pointer"><X size={10}/></button>
                                </>
                              ) : (
                                <Package size={24} className="text-slate-300" />
                              )}
                            </div>
                            <div className="space-y-2 flex-1">
                              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
                                <Upload size={14} /> Upload Main Photo
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => setProdImage(url))} />
                              </label>
                              <input 
                                type="url" 
                                placeholder="Or paste external image URL..." 
                                value={prodImage} 
                                onChange={e => setProdImage(e.target.value)} 
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Variety & Option Management */}
                    <div className="space-y-4 p-5 bg-gradient-to-r from-indigo-50/70 via-blue-50/40 to-slate-50 border border-indigo-100 rounded-2xl shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-200/80 pb-4 gap-3">
                        <div>
                          <h3 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
                            <Layers size={16} className="text-indigo-600" /> Variety & Option Management
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Add multi-variants (color, size, unique price, individual photo)
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <select 
                            value={variantType} 
                            onChange={e => {
                              setVariantType(e.target.value);
                              if (e.target.value === 'none') setVariants([]);
                            }} 
                            className="px-3.5 py-2 border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-bold bg-white text-xs text-indigo-900 shadow-xs cursor-pointer"
                          >
                            <option value="none">Single Standard Item</option>
                            <option value="color">Colors Only</option>
                            <option value="size">Sizes Only</option>
                            <option value="both">Both Colors & Sizes</option>
                          </select>
                          
                          {variantType !== 'none' && (
                            <button 
                              type="button" 
                              onClick={() => {
                                const newId = Date.now();
                                const newV = { id: newId, size: '', color: '', image: '', price: prodPrice || '', offPrice: prodOffPrice || '', stock: 10 };
                                setVariants([...variants, newV]);
                                if (variants.length === 0) setMainVariantId(newId);
                              }} 
                              className="text-xs font-black bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Plus size={15} /> Add Variant
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {variantType === 'none' ? (
                        <div className="text-center py-6 bg-white/60 border border-dashed border-indigo-200 rounded-xl">
                          <p className="text-slate-500 text-xs font-semibold">No variety options configured. Product will be listed as a single standard item.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {variants.map((v, idx) => {
                            const isMain = mainVariantId === v.id || (mainVariantId === null && idx === 0);
                            return (
                              <div 
                                key={v.id} 
                                className={`flex flex-wrap md:flex-nowrap items-start gap-4 p-4 rounded-xl transition-all shadow-xs relative ${
                                  isMain 
                                    ? 'bg-white border-2 border-amber-400 ring-2 ring-amber-400/20' 
                                    : 'bg-white border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {/* Main Badge */}
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                                  {isMain ? (
                                    <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                      <Star size={11} fill="currentColor" /> Main Featured
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleSetMainVariant(v)}
                                      className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-300 px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <Star size={11} className="text-slate-400" /> Set Main
                                    </button>
                                  )}
                                </div>

                                {/* Variant Image Upload */}
                                <div className="w-16 h-16 shrink-0 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden bg-slate-50 group mt-1">
                                   {v.image ? (
                                      <>
                                        <img src={v.image} className="w-full h-full object-cover" alt="Var" />
                                        <button type="button" onClick={() => { const nv = [...variants]; nv[idx].image=''; setVariants(nv); }} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 cursor-pointer"><X size={10}/></button>
                                      </>
                                   ) : (
                                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                        <Upload size={14} />
                                        <span className="text-[8px] font-bold mt-1">Image</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, res => { const nv = [...variants]; nv[idx].image = res; setVariants(nv); })} />
                                      </label>
                                   )}
                                </div>

                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-4 sm:pt-0">
                                  {(variantType === 'color' || variantType === 'both') && (
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold text-slate-500 uppercase">Color</label>
                                      <input type="text" placeholder="e.g. Navy Blue" value={v.color} onChange={e => {
                                        const newV = [...variants]; newV[idx].color = e.target.value; setVariants(newV);
                                      }} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-extrabold text-xs" />
                                    </div>
                                  )}
                                  {(variantType === 'size' || variantType === 'both') && (
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-extrabold text-slate-500 uppercase">Size / Spec</label>
                                      <input type="text" placeholder="e.g. Large / 42" value={v.size} onChange={e => {
                                        const newV = [...variants]; newV[idx].size = e.target.value; setVariants(newV);
                                      }} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-extrabold text-xs" />
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-extrabold text-slate-500 uppercase">Price (ETB)</label>
                                    <input type="number" placeholder="2450" value={v.price} onChange={e => {
                                      const newV = [...variants]; newV[idx].price = e.target.value; setVariants(newV);
                                    }} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-black text-xs text-indigo-700" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-extrabold text-slate-500 uppercase">Sale Off (ETB)</label>
                                    <input type="number" placeholder="2000" value={v.offPrice} onChange={e => {
                                      const newV = [...variants]; newV[idx].offPrice = e.target.value; setVariants(newV);
                                    }} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-black text-xs bg-emerald-50 focus:bg-white text-emerald-700" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-extrabold text-slate-500 uppercase">Stock Units</label>
                                    <input type="number" placeholder="5" value={v.stock} onChange={e => {
                                      const newV = [...variants]; newV[idx].stock = e.target.value; setVariants(newV);
                                    }} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-bold text-xs" />
                                  </div>
                                </div>
                                <button type="button" onClick={() => {
                                  const newV = variants.filter(vari => vari.id !== v.id); setVariants(newV);
                                }} className="mt-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer" title="Delete variant">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={descWordCount > 500} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-extrabold text-xs py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer">
                        <Save size={16} /> {editingProduct ? 'Update Product Listing' : 'Publish Product Listing'}
                      </button>
                      <button type="button" onClick={() => setActiveSection('all_products')} className="bg-white border border-slate-200 text-slate-600 font-bold text-xs py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Customer Preview Card (4 Cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="sticky top-20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <Eye size={13} className="text-indigo-600" /> Live Customer Card Preview
                      </p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                        Store View
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md space-y-3">
                      <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
                        <img 
                          src={prodImage || (variants.find(v => v.image)?.image) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                          {editingProduct ? 'Pending Review' : 'New Listing'}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {categories.find(c => c.id === parseInt(prodCatId))?.name || 'General Category'}
                          </p>
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 mt-0.5">
                            {prodName || 'Product Title Appears Here'}
                          </h4>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-indigo-600">
                            ETB {Number(prodOffPrice || prodPrice || 0).toLocaleString()}
                          </span>
                          {prodOffPrice && prodPrice && (
                            <span className="text-xs font-bold text-slate-400 line-through">
                              ETB {Number(prodPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {prodFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {prodFeatures.slice(0, 3).map((f, i) => (
                              <span key={i} className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── 4. CATEGORIES (SELLER VIEW) ────────────────────────────────── */}
          {activeSection === 'categories' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
              <h2 className="text-lg font-black text-slate-900">Product Categories in My Store ({categories.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const catProds = myProducts.filter(p => p.categoryId === cat.id);
                  return (
                    <div key={cat.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-800">{cat.name}</span>
                        <Badge label={`${catProds.length} Products`} color="blue" />
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        {catProds.slice(0, 3).map(p => (
                          <div key={p.productId} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-semibold truncate max-w-[140px]">{p.name}</span>
                            <span className="font-black text-slate-900">ETB {p.price.toLocaleString()}</span>
                          </div>
                        ))}
                        {catProds.length === 0 && <p className="text-[11px] text-slate-400 italic">No products in this category yet</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 5. BRANDS (SELLER VIEW) ────────────────────────────────────── */}
          {activeSection === 'brands' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
              <h2 className="text-lg font-black text-slate-900">Brand Partners & Collections ({brands.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {brands.map(b => {
                  const brandProds = myProducts.filter(p => p.brandId === b.id);
                  return (
                    <div key={b.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-extrabold text-sm text-slate-800">{b.name}</p>
                          <p className="text-[10px] text-slate-400">{b.description}</p>
                        </div>
                        <Badge label={`${brandProds.length} Listed`} color="purple" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 6. INVENTORY & WAREHOUSE CONTROL CENTER ────────────────────── */}
          {activeSection === 'inventory' && (() => {
            const inStockItemsList = myProducts.filter(p => {
              const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
              return (inv?.quantity || 0) > 10;
            });
            const lowStockItemsList = myProducts.filter(p => {
              const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
              const qty = inv?.quantity || 0;
              const threshold = inv?.lowStockThreshold || 5;
              return qty > 0 && qty <= threshold;
            });
            const outOfStockItemsList = myProducts.filter(p => {
              const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
              return (inv?.quantity || 0) === 0;
            });
            const overstockedItemsList = myProducts.filter(p => {
              const inv = inventory.find(i => Number(i.productId) === Number(p.productId));
              return (inv?.quantity || 0) > 50;
            });

            const totalCatalogCount = myProducts.length || 1;
            const inStockPercent = Math.round((inStockItemsList.length / totalCatalogCount) * 100);
            const lowStockPercent = Math.round((lowStockItemsList.length / totalCatalogCount) * 100);
            const outOfStockPercent = Math.max(0, 100 - inStockPercent - lowStockPercent);

            const filteredInventory = myProducts.filter(prod => {
              const inv = inventory.find(i => Number(i.productId) === Number(prod.productId));
              const cat = categories.find(c => c.id === prod.categoryId);
              const qty = inv?.quantity || 0;
              const threshold = inv?.lowStockThreshold || 5;

              // Search filter
              const q = inventorySearch.toLowerCase().trim();
              const matchesSearch = !q || 
                prod.name.toLowerCase().includes(q) ||
                String(prod.productId).includes(q) ||
                `#prd-${String(prod.productId).padStart(4, '0')}`.toLowerCase().includes(q) ||
                (cat?.name && cat.name.toLowerCase().includes(q)) ||
                (prod.brand && prod.brand.toLowerCase().includes(q));

              // Status Tab filter
              let matchesStatus = true;
              if (inventoryStatusTab === 'in_stock') matchesStatus = qty > 10;
              else if (inventoryStatusTab === 'low_stock') matchesStatus = qty > 0 && qty <= threshold;
              else if (inventoryStatusTab === 'out_of_stock') matchesStatus = qty === 0;
              else if (inventoryStatusTab === 'overstocked') matchesStatus = qty > 50;

              // Category filter
              const matchesCategory = inventoryCategoryFilter === 'all' || String(prod.categoryId) === String(inventoryCategoryFilter);

              return matchesSearch && matchesStatus && matchesCategory;
            }).sort((a, b) => {
              const invA = inventory.find(i => Number(i.productId) === Number(a.productId))?.quantity || 0;
              const invB = inventory.find(i => Number(i.productId) === Number(b.productId))?.quantity || 0;
              const valA = invA * a.price;
              const valB = invB * b.price;

              if (inventorySortBy === 'lowest_stock') return invA - invB;
              if (inventorySortBy === 'highest_stock') return invB - invA;
              if (inventorySortBy === 'highest_valuation') return valB - valA;
              if (inventorySortBy === 'name_asc') return a.name.localeCompare(b.name);
              if (inventorySortBy === 'price_high') return b.price - a.price;
              return 0;
            });

            const isAllFilteredSelected = filteredInventory.length > 0 && filteredInventory.every(p => selectedInventoryProductIds.includes(p.productId));

            const toggleSelectAllFiltered = () => {
              if (isAllFilteredSelected) {
                setSelectedInventoryProductIds([]);
              } else {
                setSelectedInventoryProductIds(filteredInventory.map(p => p.productId));
              }
            };

            const toggleSelectProduct = (productId) => {
              setSelectedInventoryProductIds(prev => 
                prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
              );
            };

            const resetFilters = () => {
              setInventorySearch('');
              setInventoryStatusTab('all');
              setInventoryCategoryFilter('all');
              setInventoryWarehouseFilter('all');
              setInventorySortBy('lowest_stock');
            };

            const hasActiveFilters = inventorySearch !== '' || inventoryStatusTab !== 'all' || inventoryCategoryFilter !== 'all' || inventoryWarehouseFilter !== 'all' || inventorySortBy !== 'lowest_stock';

            return (
              <div className="space-y-6">
                
                {/* ── Header & Action Commands ── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
                        <Boxes size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          Inventory & Warehouse Control
                          <span className="text-xs bg-emerald-50 text-emerald-700 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {totalStockUnits.toLocaleString()} Units on Hand
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          Real-time warehouse telemetry, inline replenishment, and multi-hub stock movements
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* View Switcher: Stock Table vs Audit Log */}
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => setInventoryActiveView('table')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                          inventoryActiveView === 'table'
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <List size={14} /> Stock Catalog
                      </button>
                      <button
                        type="button"
                        onClick={() => setInventoryActiveView('movement_logs')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                          inventoryActiveView === 'movement_logs'
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <History size={14} /> Movement Logs
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {inventoryStockLogs.length}
                        </span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerMessage('Synchronized live inventory levels across all warehouse depots!')}
                      className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                      title="Sync Warehouse Data"
                    >
                      <RefreshCw size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportInventoryCSV()}
                      className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200 flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                    >
                      <FileSpreadsheet size={15} className="text-emerald-600" /> Export Manifest
                    </button>

                    <button
                      type="button"
                      onClick={() => { setEditingProduct(null); setActiveSection('add_product'); }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <Plus size={15} /> Add SKU
                    </button>
                  </div>
                </div>

                {/* ── Executive Inventory Telemetry KPIs ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Total Units */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Stock on Hand</span>
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Boxes size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 mt-2">{totalStockUnits.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] font-bold text-slate-500">
                      <span>Across {myProducts.length} Active SKUs</span>
                      <span className="text-indigo-600">100% Tracked</span>
                    </div>
                  </div>

                  {/* Stock Valuation */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Warehouse Asset Valuation</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-600 mt-2">ETB {Math.round(totalStockValuation).toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] font-bold text-slate-500">
                      <span>Inventory Capital Value</span>
                      <span className="text-emerald-700 font-extrabold">Active Asset</span>
                    </div>
                  </div>

                  {/* Low Stock Warnings */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Low Stock Warnings</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${lowStockItemsList.length > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                        <AlertTriangle size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-amber-600 mt-2">{lowStockItemsList.length}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] font-bold text-slate-500">
                      <span className="text-amber-700 font-extrabold">≤ Reorder Threshold</span>
                      <button onClick={() => setInventoryStatusTab('low_stock')} className="text-amber-700 underline text-[10px] cursor-pointer">Filter low</button>
                    </div>
                  </div>

                  {/* Out of Stock */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-rose-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Depleted / Stockouts</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${outOfStockItemsList.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-50 text-slate-400'}`}>
                        <XCircle size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-rose-600 mt-2">{outOfStockItemsList.length}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px] font-bold text-slate-500">
                      <span className="text-rose-600">0 Units Available</span>
                      <span className="text-[10px] text-rose-600 font-extrabold">Lost Sales Risk</span>
                    </div>
                  </div>

                </div>

                {/* ── Stock Health Distribution Bar ── */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Activity size={15} className="text-indigo-600" />
                      <span className="font-black text-xs">Warehouse Inventory Health Composition</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Healthy ({inStockItemsList.length} • {inStockPercent}%)
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-700 font-extrabold">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Low Stock ({lowStockItemsList.length} • {lowStockPercent}%)
                      </span>
                      <span className="flex items-center gap-1.5 text-rose-700 font-extrabold">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Out of Stock ({outOfStockItemsList.length} • {outOfStockPercent}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div 
                      style={{ width: `${inStockPercent}%` }} 
                      className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-500 relative group cursor-pointer"
                      title={`Healthy Stock: ${inStockItemsList.length} items (${inStockPercent}%)`}
                      onClick={() => setInventoryStatusTab('in_stock')}
                    />
                    <div 
                      style={{ width: `${lowStockPercent}%` }} 
                      className="bg-amber-400 hover:bg-amber-500 transition-all duration-500 relative group cursor-pointer"
                      title={`Low Stock Warnings: ${lowStockItemsList.length} items (${lowStockPercent}%)`}
                      onClick={() => setInventoryStatusTab('low_stock')}
                    />
                    <div 
                      style={{ width: `${outOfStockPercent}%` }} 
                      className="bg-rose-500 hover:bg-rose-600 transition-all duration-500 relative group cursor-pointer"
                      title={`Out of Stock: ${outOfStockItemsList.length} items (${outOfStockPercent}%)`}
                      onClick={() => setInventoryStatusTab('out_of_stock')}
                    />
                  </div>
                </div>

                {/* ── Status Tab Navigation Bar ── */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { key: 'all', label: 'All Inventory', count: myProducts.length, icon: Boxes, color: 'indigo' },
                    { key: 'in_stock', label: 'Healthy Stock', count: inStockItemsList.length, icon: CheckCircle, color: 'emerald' },
                    { key: 'low_stock', label: 'Low Stock Warnings', count: lowStockItemsList.length, icon: AlertTriangle, color: 'amber' },
                    { key: 'out_of_stock', label: 'Out of Stock', count: outOfStockItemsList.length, icon: XCircle, color: 'rose' },
                    { key: 'overstocked', label: 'High Volume (>50)', count: overstockedItemsList.length, icon: Sparkles, color: 'purple' },
                  ].map(tab => {
                    const isActive = inventoryStatusTab === tab.key;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setInventoryStatusTab(tab.key)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                        {tab.label}
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* ── Omni-Search & Multi-Facet Toolbar ── */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    
                    {/* Search Field */}
                    <div className="md:col-span-4 relative">
                      <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by SKU #PRD-XXXX, Title, Category..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold transition-all"
                      />
                      {inventorySearch && (
                        <button
                          type="button"
                          onClick={() => setInventorySearch('')}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <div className="md:col-span-3">
                      <select
                        value={inventoryCategoryFilter}
                        onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold cursor-pointer text-slate-700"
                      >
                        <option value="all">All Departments ({myProducts.length})</option>
                        {categories.filter(c => !c.parent_id).map(cat => {
                          const count = myProducts.filter(p => p.categoryId === cat.id).length;
                          return (
                            <option key={cat.id} value={cat.id}>
                              {cat.name} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Warehouse Hub Filter */}
                    <div className="md:col-span-3">
                      <select
                        value={inventoryWarehouseFilter}
                        onChange={(e) => setInventoryWarehouseFilter(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold cursor-pointer text-slate-700"
                      >
                        <option value="all">🏢 All Warehouse Hubs</option>
                        <option value="Addis Ababa Central Depot">🏢 Addis Ababa Central Depot</option>
                        <option value="Bole Regional Hub">🏬 Bole Regional Hub (East)</option>
                        <option value="Mercato Distribution Store">🏪 Mercato Distribution Store</option>
                        <option value="Adama Logistics Center">🚚 Adama Logistics Center</option>
                        <option value="Hawassa Distribution Center">🏭 Hawassa Distribution Center</option>
                      </select>
                    </div>

                    {/* Sort Options */}
                    <div className="md:col-span-2">
                      <select
                        value={inventorySortBy}
                        onChange={(e) => setInventorySortBy(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold cursor-pointer text-slate-700"
                      >
                        <option value="lowest_stock">📉 Lowest Stock First</option>
                        <option value="highest_stock">📈 Highest Stock First</option>
                        <option value="highest_valuation">💰 Highest Asset Value</option>
                        <option value="name_asc">🔤 Product Name (A-Z)</option>
                        <option value="price_high">💵 Unit Price (High-Low)</option>
                      </select>
                    </div>

                  </div>

                  {/* Active Filter Chips */}
                  {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Active Filters:</span>
                      {inventorySearch && (
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          Search: "{inventorySearch}"
                          <button onClick={() => setInventorySearch('')} className="hover:text-indigo-900 cursor-pointer"><X size={10} /></button>
                        </span>
                      )}
                      {inventoryStatusTab !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          Status: {inventoryStatusTab}
                          <button onClick={() => setInventoryStatusTab('all')} className="hover:text-indigo-900 cursor-pointer"><X size={10} /></button>
                        </span>
                      )}
                      {inventoryCategoryFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          Category: {categories.find(c => String(c.id) === String(inventoryCategoryFilter))?.name || inventoryCategoryFilter}
                          <button onClick={() => setInventoryCategoryFilter('all')} className="hover:text-indigo-900 cursor-pointer"><X size={10} /></button>
                        </span>
                      )}
                      {inventoryWarehouseFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          Hub: {inventoryWarehouseFilter}
                          <button onClick={() => setInventoryWarehouseFilter('all')} className="hover:text-indigo-900 cursor-pointer"><X size={10} /></button>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-[10px] font-extrabold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-auto"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Floating Batch Operations Bar ── */}
                {selectedInventoryProductIds.length > 0 && (
                  <div className="sticky top-4 z-40 bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-xs">
                        {selectedInventoryProductIds.length} Selected
                      </span>
                      <button
                        type="button"
                        onClick={toggleSelectAllFiltered}
                        className="text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer"
                      >
                        {isAllFilteredSelected ? 'Deselect All' : `Select All ${filteredInventory.length}`}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider hidden sm:inline">Bulk Replenish:</span>
                      
                      <button
                        type="button"
                        onClick={() => handleBatchRestockInventory(10)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={13} /> +10 Units
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchRestockInventory(25)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={13} /> +25 Units
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchRestockInventory(50)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={13} /> +50 Units
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleExportInventoryCSV(myProducts.filter(p => selectedInventoryProductIds.includes(p.productId)))}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Download size={13} /> Export Selected
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedInventoryProductIds([])}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl cursor-pointer"
                        title="Clear selection"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Main Display View: Stock Table vs Movement Audit Log ── */}
                {inventoryActiveView === 'table' ? (
                  
                  /* ── TAB 1: INVENTORY CATALOG TABLE ── */
                  <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50/90 text-slate-400 uppercase text-[10px] font-black border-b border-slate-200/80">
                          <tr>
                            <th className="px-4 py-3.5 text-left w-10">
                              <input
                                type="checkbox"
                                checked={isAllFilteredSelected}
                                onChange={toggleSelectAllFiltered}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-3.5 text-left">Product & SKU</th>
                            <th className="px-4 py-3.5 text-left">Category & Brand</th>
                            <th className="px-4 py-3.5 text-right">Unit Price / Line Valuation</th>
                            <th className="px-4 py-3.5 text-center">Stock Health & Status</th>
                            <th className="px-4 py-3.5 text-center">Inline Stock Editor</th>
                            <th className="px-4 py-3.5 text-right">Warehouse Actions</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {filteredInventory.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-12 text-slate-400">
                                <Boxes size={40} className="mx-auto mb-2 text-slate-300 opacity-60" />
                                <p className="font-extrabold text-sm text-slate-600">No inventory items found</p>
                                <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search queries</p>
                                {hasActiveFilters && (
                                  <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-3 px-4 py-1.5 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-xl border border-indigo-100 cursor-pointer"
                                  >
                                    Reset Filters
                                  </button>
                                )}
                              </td>
                            </tr>
                          ) : (
                            filteredInventory.map(prod => {
                              const inv = inventory.find(i => Number(i.productId) === Number(prod.productId));
                              const cat = categories.find(c => c.id === prod.categoryId);
                              const stockCount = inv?.quantity || 0;
                              const threshold = inv?.lowStockThreshold || 5;
                              const lineValuation = stockCount * prod.price;
                              const isSelected = selectedInventoryProductIds.includes(prod.productId);

                              const isLow = stockCount > 0 && stockCount <= threshold;
                              const isOut = stockCount === 0;
                              const isHealthy = stockCount > threshold;

                              return (
                                <tr 
                                  key={prod.productId} 
                                  className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}
                                >
                                  {/* Checkbox */}
                                  <td className="px-4 py-3">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleSelectProduct(prod.productId)}
                                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                  </td>

                                  {/* Product Details & SKU */}
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 group">
                                        <img 
                                          src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} 
                                          alt={prod.name} 
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                        />
                                        {isOut && (
                                          <div className="absolute inset-0 bg-rose-950/60 flex items-center justify-center text-white text-[8px] font-black uppercase">
                                            Out
                                          </div>
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-extrabold text-slate-900 truncate max-w-[200px]" title={prod.name}>
                                          {prod.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="font-mono text-[9px] font-black text-indigo-700 bg-indigo-50/80 px-1.5 py-0.2 rounded border border-indigo-100">
                                            #PRD-{String(prod.productId).padStart(4, '0')}
                                          </span>
                                          {Array.isArray(prod.variants) && prod.variants.length > 0 && (
                                            <span className="text-[9px] font-bold text-slate-400">
                                              {prod.variants.length} Variants
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Category & Brand */}
                                  <td className="px-4 py-3">
                                    <div>
                                      <span className="font-extrabold text-slate-700 block">{cat?.name || 'General Department'}</span>
                                      <span className="text-[10px] text-slate-400 font-semibold">{prod.brand || 'Official Merchant'}</span>
                                    </div>
                                  </td>

                                  {/* Unit Price & Line Valuation */}
                                  <td className="px-4 py-3 text-right">
                                    <div>
                                      <span className="font-black text-slate-900 block">
                                        ETB {Number(prod.price).toLocaleString()}
                                      </span>
                                      <span className="font-mono text-[10px] font-bold text-slate-400 block mt-0.5">
                                        Valuation: <strong className="text-indigo-600 font-black">ETB {Math.round(lineValuation).toLocaleString()}</strong>
                                      </span>
                                    </div>
                                  </td>

                                  {/* Stock Health & Status Level */}
                                  <td className="px-4 py-3 text-center">
                                    <div className="inline-flex flex-col items-center gap-1">
                                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                                        isHealthy ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' :
                                        isLow ? 'bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse' :
                                        'bg-rose-50 text-rose-700 border-rose-200/80'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-500' : isLow ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                        {stockCount} Units
                                      </span>
                                      <span className="text-[9px] font-bold text-slate-400">
                                        Alert at ≤ {threshold}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Inline Stepper & Direct Editable Input */}
                                  <td className="px-4 py-3 text-center">
                                    <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextQty = Math.max(0, stockCount - 1);
                                          updateInventoryQuantity(prod.productId, nextQty, threshold);
                                          triggerMessage(`Decreased stock for ${prod.name} (${nextQty} units left)`);
                                        }}
                                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer transition-colors border border-slate-200 shadow-2xs"
                                        title="Deduct 1 unit"
                                      >
                                        -
                                      </button>

                                      <input
                                        type="number"
                                        min="0"
                                        value={stockCount}
                                        onChange={(e) => {
                                          const val = Math.max(0, parseInt(e.target.value) || 0);
                                          updateInventoryQuantity(prod.productId, val, threshold);
                                        }}
                                        className="w-12 text-center font-mono font-black text-xs bg-white py-0.5 border border-slate-200 rounded-md outline-none focus:border-indigo-500 text-slate-900"
                                        title="Direct stock edit"
                                      />

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextQty = stockCount + 1;
                                          updateInventoryQuantity(prod.productId, nextQty, threshold);
                                          triggerMessage(`Added +1 stock for ${prod.name} (Total: ${nextQty})`);
                                        }}
                                        className="w-6 h-6 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-black flex items-center justify-center cursor-pointer transition-colors border border-slate-200 shadow-2xs"
                                        title="Add 1 unit"
                                      >
                                        +1
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextQty = stockCount + 5;
                                          updateInventoryQuantity(prod.productId, nextQty, threshold);
                                          triggerMessage(`Added +5 stock for ${prod.name} (Total: ${nextQty})`);
                                        }}
                                        className="px-1.5 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] cursor-pointer transition-colors border border-indigo-200/60"
                                        title="Add 5 units"
                                      >
                                        +5
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextQty = stockCount + 10;
                                          updateInventoryQuantity(prod.productId, nextQty, threshold);
                                          triggerMessage(`Added +10 stock for ${prod.name} (Total: ${nextQty})`);
                                        }}
                                        className="px-1.5 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] cursor-pointer transition-colors border border-indigo-200/60"
                                        title="Add 10 units"
                                      >
                                        +10
                                      </button>
                                    </div>
                                  </td>

                                  {/* Action Controls */}
                                  <td className="px-4 py-3 text-right">
                                    <div className="inline-flex items-center gap-1.5 justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setAdjustingInventoryProduct(prod)}
                                        title="Adjust Stock / Restock Shipment"
                                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black rounded-lg border border-indigo-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        <Boxes size={13} /> Restock
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedProductDetails(prod)}
                                        title="Inspect Listing Specs"
                                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                      >
                                        <Eye size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => { startEditProduct(prod); setActiveSection('add_product'); }}
                                        title="Edit Listing Details"
                                        className="p-1.5 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                      >
                                        <Edit2 size={13} />
                                      </button>
                                    </div>
                                  </td>

                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Table Footer Summary */}
                    <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-500">
                      <div>
                        Showing <strong className="text-slate-800">{filteredInventory.length}</strong> of <strong className="text-slate-800">{myProducts.length}</strong> total inventory listings
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Filtered Valuation: <strong className="text-indigo-600">ETB {Math.round(filteredInventory.reduce((acc, p) => acc + (p.price * (inventory.find(i => Number(i.productId) === Number(p.productId))?.quantity || 0)), 0)).toLocaleString()}</strong></span>
                        <button
                          type="button"
                          onClick={() => handleExportInventoryCSV(filteredInventory)}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1 font-black"
                        >
                          <Download size={13} /> Export Current View
                        </button>
                      </div>
                    </div>
                  </div>

                ) : (

                  /* ── TAB 2: WAREHOUSE STOCK MOVEMENT & AUDIT LOGS ── */
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <History size={18} className="text-indigo-600" />
                          Warehouse Stock Movement & Audit Logs
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Complete chronological record of inbound purchase shipments, audits, returns, and write-offs
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Clear local movement log history?')) {
                              setInventoryStockLogs([]);
                              triggerMessage('Cleared movement logs');
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Clear Log History
                        </button>
                      </div>
                    </div>

                    {inventoryStockLogs.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <History size={40} className="mx-auto mb-2 text-slate-300 opacity-60" />
                        <p className="font-extrabold text-sm text-slate-600">No stock movements recorded yet</p>
                        <p className="text-xs text-slate-400 mt-0.5">Stock adjustments made in the catalog will appear here automatically</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {inventoryStockLogs.map(log => (
                          <div 
                            key={log.id} 
                            className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-all"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                log.delta > 0 ? 'bg-emerald-100 text-emerald-700' :
                                log.delta < 0 ? 'bg-rose-100 text-rose-700' :
                                'bg-indigo-100 text-indigo-700'
                              }`}>
                                {log.delta > 0 ? <PackagePlus size={20} /> : log.delta < 0 ? <Trash2 size={18} /> : <SlidersHorizontal size={18} />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-xs text-slate-900">{log.productName}</span>
                                  <span className="font-mono text-[9px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                                    {log.sku}
                                  </span>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    log.delta > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    log.delta < 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  }`}>
                                    {log.reason}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  {log.notes} • <span className="font-bold text-slate-700">{log.warehouseHub}</span>
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`font-mono text-base font-black ${
                                log.delta > 0 ? 'text-emerald-600' :
                                log.delta < 0 ? 'text-rose-600' :
                                'text-indigo-600'
                              }`}>
                                {log.delta > 0 ? `+${log.delta}` : `${log.delta}`} Units
                              </span>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {log.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                )}

              </div>
            );
          })()}

          {/* ─── 7. ORDERS ──────────────────────────────────────────────────── */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    Orders Received & Shipment Control
                    <span className="text-xs bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {myOrders.length} Total Orders
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Track fulfillment, inspect shipments, and generate customer packing slips</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={exportOrdersCSV}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Download size={15} /> Export Orders (CSV)
                  </button>
                </div>
              </div>

              {/* Order Status KPI Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Total Store Orders</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{myOrders.length}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">All time processed</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Pending Dispatch</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">{pendingOrdersCount}</p>
                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Requires Shipment</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">In Transit</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">{inTransitOrdersCount}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Out with Delivery</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Delivered & Settled</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{deliveredOrdersCount}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Completed</p>
                </div>
              </div>

              {/* Orders Table Container */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by #ORD ID, customer name, destination..." 
                      value={orderSearchTerm} 
                      onChange={e => setOrderSearchTerm(e.target.value)} 
                      className="w-full pl-10 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold bg-slate-50/80 focus:bg-white transition-all" 
                    />
                  </div>
                  <select 
                    value={orderStatusFilter} 
                    onChange={e => setOrderStatusFilter(e.target.value)} 
                    className="px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold bg-slate-50 cursor-pointer min-w-[150px]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black">
                      <tr>
                        <th className="px-4 py-3 text-left">Order Details</th>
                        <th className="px-4 py-3 text-left">Customer & Address</th>
                        <th className="px-4 py-3 text-left">Items Ordered</th>
                        <th className="px-4 py-3 text-right">Order Total</th>
                        <th className="px-4 py-3 text-center">Fulfillment Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myOrders.filter(o => {
                        const matchesSearch = String(o.orderId).includes(orderSearchTerm) || 
                          (o.customerName && o.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
                          (o.shippingAddress && o.shippingAddress.toLowerCase().includes(orderSearchTerm.toLowerCase()));
                        const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
                        return matchesSearch && matchesStatus;
                      }).map(o => {
                        const items = myOrderItems.filter(oi => oi.orderId === o.orderId);
                        return (
                          <tr key={o.orderId} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-extrabold text-xs text-indigo-600 block">#ORD-{o.orderId}</span>
                              <p className="text-[10px] text-slate-400 font-medium">{o.orderDate || 'Today'}</p>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                                {o.paymentMethod || 'Chapa'}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <p className="font-extrabold text-slate-900">{o.customerName || 'Valued Customer'}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{o.shippingAddress || 'Addis Ababa, Ethiopia'}</p>
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {items.slice(0, 3).map((it, idx) => (
                                  <img 
                                    key={idx} 
                                    src={it.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} 
                                    alt={it.name} 
                                    className="w-7 h-7 rounded-lg object-cover border border-slate-200" 
                                    title={it.name}
                                  />
                                ))}
                                <span className="text-[10px] text-slate-500 font-bold ml-1">
                                  {items.length} item{items.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <span className="font-black text-slate-900 block">ETB {(o.totalAmount || 2450).toLocaleString()}</span>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <Badge 
                                label={o.orderStatus || 'Confirmed'} 
                                color={
                                  o.orderStatus === 'Delivered' ? 'green' : 
                                  o.orderStatus === 'On The Way' ? 'blue' : 
                                  o.orderStatus === 'Cancelled' ? 'red' : 'yellow'
                                } 
                              />
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedOrderDetail(o)}
                                  title="View Order Details"
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye size={12} /> Inspect
                                </button>
                                <button
                                  onClick={() => setSelectedOrderReceipt(o)}
                                  title="Print Packing Slip / Receipt"
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Printer size={12} /> Slip
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── 8. SALES & ANALYTICS ─────────────────────────────────────── */}
          {activeSection === 'sales_analytics' && (() => {
            const currentChart = chartConfigs[analyticsTimeframe] || chartConfigs['30d'];
            const isRevenueMetric = analyticsChartMetric === 'revenue';

            const activePath = isRevenueMetric ? currentChart.path : (currentChart.ordersPath || currentChart.path);
            const activeArea = isRevenueMetric ? currentChart.area : (currentChart.ordersArea || currentChart.area);
            const activeGrowth = isRevenueMetric ? currentChart.growth : (currentChart.ordersGrowth || currentChart.growth);

            // Calculate category shares dynamically
            const categoryRevenues = categories.filter(c => !c.parent_id).map(cat => {
              const catProds = myProducts.filter(p => p.categoryId === cat.id);
              const count = catProds.length;
              const estRev = catProds.reduce((sum, p) => sum + (p.price * 12), 0) || Math.round(totalRevenue * (count / (myProducts.length || 1)));
              return {
                id: cat.id,
                name: cat.name,
                count,
                revenue: estRev
              };
            });
            const totalCatRev = categoryRevenues.reduce((s, c) => s + c.revenue, 0) || 1;

            return (
              <div className="space-y-6">
                
                {/* ── Header with Live Controls ── */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
                        <BarChart2 size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          Sales & Commercial Intelligence
                          <span className="text-xs bg-emerald-50 text-emerald-700 font-black px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          Store turnover, profit settlement, payment method distribution, and geographic demand
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Timeframe Selector */}
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
                      {[
                        { id: '7d', label: '7 Days' },
                        { id: '30d', label: '30 Days' },
                        { id: '90d', label: '90 Days' },
                        { id: '12m', label: '12 Months' },
                      ].map(tf => (
                        <button
                          key={tf.id}
                          type="button"
                          onClick={() => setAnalyticsTimeframe(tf.id)}
                          className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                            analyticsTimeframe === tf.id 
                              ? 'bg-white text-indigo-700 shadow-xs' 
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerMessage('Refreshed commercial analytics and conversion telemetry')}
                      className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                      title="Refresh Analytics"
                    >
                      <RefreshCw size={15} />
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleGenerateAndExportReport('financial', analyticsTimeframe, 'csv')}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Download size={14} /> Export Statement
                    </button>
                  </div>
                </div>

                {/* ── Top Financial & Performance KPIs ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  
                  {/* Gross Revenue */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">Gross Sales</span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        +14.2%
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2">ETB {totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Total customer checkouts</p>
                  </div>

                  {/* Net Payout */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-emerald-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">Net Settlement</span>
                      <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                        95% Payout
                      </span>
                    </div>
                    <p className="text-xl font-black text-emerald-600 mt-2">ETB {netPayout.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">After 5% commission</p>
                  </div>

                  {/* Total Orders */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-purple-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">Total Orders</span>
                      <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                        +8.6%
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2">{totalOrdersCount}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Completed shipments</p>
                  </div>

                  {/* Average Order Value */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">Avg Order Value</span>
                      <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        AOV
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2">ETB {avgOrderValue.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Average cart amount</p>
                  </div>

                  {/* Conversion Rate */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-amber-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">Store Conversion</span>
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Top 8%
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2">3.8%</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">28.4% repeat buyer rate</p>
                  </div>

                  {/* Fulfillment Rate */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-teal-200 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">Fulfillment SLA</span>
                      <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        98.4%
                      </span>
                    </div>
                    <p className="text-xl font-black text-teal-600 mt-2">&lt; 24 hrs</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Avg delivery dispatch</p>
                  </div>

                </div>

                {/* ── Dynamic Interactive Chart Area ── */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-600" />
                        Commercial Growth & Velocity Trajectory
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Audited volume trend comparing period performance across {analyticsTimeframe}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Metric Toggle: Revenue vs Orders */}
                      <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => setAnalyticsChartMetric('revenue')}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            isRevenueMetric ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          💰 Revenue (ETB)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnalyticsChartMetric('orders')}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            !isRevenueMetric ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          📦 Order Count
                        </button>
                      </div>

                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {activeGrowth}
                      </span>
                    </div>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="w-full h-64 pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sellerAnalyticsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isRevenueMetric ? '#4F46E5' : '#7C3AED'} stopOpacity="0.35" />
                          <stop offset="100%" stopColor={isRevenueMetric ? '#4F46E5' : '#7C3AED'} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      <line x1="0" y1="30" x2="700" y2="30" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="0" y1="75" x2="700" y2="75" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="0" y1="120" x2="700" y2="120" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="4 4" />

                      {/* Area Fill */}
                      <path
                        d={activeArea}
                        fill="url(#sellerAnalyticsGradient)"
                      />

                      {/* Trend Curve Line */}
                      <path
                        d={activePath}
                        fill="none"
                        stroke={isRevenueMetric ? '#4F46E5' : '#7C3AED'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Hoverable Data Points */}
                      <circle cx="0" cy="140" r="4" fill={isRevenueMetric ? '#4F46E5' : '#7C3AED'} />
                      <circle cx="175" cy="100" r="4" fill={isRevenueMetric ? '#4F46E5' : '#7C3AED'} />
                      <circle cx="350" cy="70" r="4" fill={isRevenueMetric ? '#4F46E5' : '#7C3AED'} />
                      <circle cx="525" cy="45" r="4" fill={isRevenueMetric ? '#4F46E5' : '#7C3AED'} />
                      <circle cx="700" cy="20" r="6" fill={isRevenueMetric ? '#4F46E5' : '#7C3AED'} stroke="#FFFFFF" strokeWidth="2.5" />
                    </svg>
                  </div>

                  {/* Horizontal Labels */}
                  <div className="flex justify-between text-xs font-black text-slate-400 pt-3 border-t border-slate-100">
                    {currentChart.labels.map((lbl, idx) => (
                      <span key={idx}>{lbl}</span>
                    ))}
                  </div>
                </div>

                {/* ── Multi-Dimensional Breakdown Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* 1. Payment Method Breakdown */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <CreditCard size={16} className="text-indigo-600" />
                          Payment Channels
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">Customer settlement distribution</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        100% Share
                      </span>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      {[
                        { method: 'Telebirr SuperApp', percent: 46, amount: Math.round(totalRevenue * 0.46), color: 'bg-indigo-600' },
                        { method: 'CBE Birr & CBE Online', percent: 30, amount: Math.round(totalRevenue * 0.30), color: 'bg-purple-600' },
                        { method: 'Chapa / Bank Cards', percent: 14, amount: Math.round(totalRevenue * 0.14), color: 'bg-emerald-600' },
                        { method: 'Cash on Delivery (COD)', percent: 10, amount: Math.round(totalRevenue * 0.10), color: 'bg-amber-500' },
                      ].map((pm, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-extrabold">
                            <span className="text-slate-800">{pm.method}</span>
                            <span className="text-slate-600">
                              ETB {pm.amount.toLocaleString()} <span className="text-slate-400 text-[10px]">({pm.percent}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${pm.color} rounded-full`} style={{ width: `${pm.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Department / Category Breakdown */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Layers size={16} className="text-indigo-600" />
                          Category Revenue Share
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">Departmental sales volume</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {categoryRevenues.length} Active
                      </span>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      {categoryRevenues.slice(0, 4).map((cat, idx) => {
                        const pct = Math.max(8, Math.round((cat.revenue / totalCatRev) * 100));
                        const colors = ['bg-indigo-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-500'];
                        return (
                          <div key={cat.id || idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-extrabold">
                              <span className="text-slate-800 truncate max-w-[140px]">{cat.name}</span>
                              <span className="text-slate-600">
                                ETB {cat.revenue.toLocaleString()} <span className="text-slate-400 text-[10px]">({pct}%)</span>
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${colors[idx % colors.length]} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Geographic Hub Performance */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <MapPin size={16} className="text-indigo-600" />
                          Geographic Logistics Hubs
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">Regional customer destinations</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        Ethiopia Nodes
                      </span>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      {[
                        { region: 'Addis Ababa (Metropolitan)', percent: 56, orders: Math.round(totalOrdersCount * 0.56) },
                        { region: 'Hawassa & Southern Corridor', percent: 18, orders: Math.round(totalOrdersCount * 0.18) },
                        { region: 'Adama Logistics Hub', percent: 14, orders: Math.round(totalOrdersCount * 0.14) },
                        { region: 'Bahir Dar & North Hub', percent: 12, orders: Math.round(totalOrdersCount * 0.12) },
                      ].map((reg, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-extrabold">
                            <span className="text-slate-800">{reg.region}</span>
                            <span className="text-slate-600">
                              {reg.orders} Orders <span className="text-slate-400 text-[10px]">({reg.percent}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 rounded-full" style={{ width: `${reg.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ── Best Selling Products Leaderboard ── */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Award size={18} className="text-amber-500" />
                        Top Performing Products Leaderboard
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Ranked by gross revenue generated across the active period
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                      Top 5 SKU Champions
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {myProducts.slice(0, 5).map((prod, idx) => {
                      const inv = inventory.find(i => Number(i.productId) === Number(prod.productId));
                      const cat = categories.find(c => c.id === prod.categoryId);
                      const estimatedUnits = (idx + 1) * 16 + 8;
                      const prodRevenue = prod.price * estimatedUnits;

                      return (
                        <div 
                          key={prod.productId} 
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 px-3 rounded-2xl transition-colors"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                              idx === 0 ? 'bg-amber-100 text-amber-800 shadow-xs' :
                              idx === 1 ? 'bg-slate-200 text-slate-700' :
                              idx === 2 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              #{idx + 1}
                            </span>
                            <img 
                              src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} 
                              alt={prod.name} 
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs" 
                            />
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-slate-900 truncate max-w-[240px]">
                                {prod.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[9px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                                  #PRD-{String(prod.productId).padStart(4, '0')}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">{cat?.name || 'General'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Units Shipped</span>
                              <span className="font-black text-xs text-slate-800">{estimatedUnits} units</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Gross Revenue</span>
                              <span className="font-black text-xs text-slate-900">ETB {prodRevenue.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block">Inventory</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {inv?.quantity || 0} in stock
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ─── 9. REPORTS & FINANCIAL STATEMENTS ─────────────────────────── */}
          {activeSection === 'reports' && (() => {
            return (
              <div className="space-y-6">
                
                {/* ── Header & Primary Statement Export ── */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
                        <FileText size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          Financial Statements & Audits
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-black px-2.5 py-0.5 rounded-full border border-indigo-100">
                            Ethiopian MoR Compliant
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          Audited transaction statements, platform commission accounting, and tax withholding documentation
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleGenerateAndExportReport('financial', 'this_month', 'csv')}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Download size={14} /> Download Settlement CSV
                    </button>
                  </div>
                </div>

                {/* ── Custom Report Generator Toolcard ── */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 border border-indigo-900/50">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-400" />
                      <h3 className="text-sm font-black tracking-tight text-white">Custom Statement & Export Generator</h3>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">
                      Instant Data Pipeline
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    
                    {/* Report Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Statement Type</label>
                      <select
                        value={reportGenType}
                        onChange={(e) => setReportGenType(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="financial" className="text-slate-900">💰 Monthly Settlement Statement</option>
                        <option value="product_sales" className="text-slate-900">📦 SKU Sales & Margin Report</option>
                        <option value="inventory_valuation" className="text-slate-900">🏢 Warehouse Asset Valuation</option>
                        <option value="tax_withholding" className="text-slate-900">🏛️ Tax & 2% Withholding Statement</option>
                      </select>
                    </div>

                    {/* Period Range */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Reporting Period</label>
                      <select
                        value={reportGenPeriod}
                        onChange={(e) => setReportGenPeriod(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="this_month" className="text-slate-900">Current Month (May 2025)</option>
                        <option value="last_month" className="text-slate-900">Last Month (April 2025)</option>
                        <option value="q2" className="text-slate-900">Q2 2025 (Apr - Jun)</option>
                        <option value="q1" className="text-slate-900">Q1 2025 (Jan - Mar)</option>
                        <option value="ytd" className="text-slate-900">Year-to-Date (YTD 2025)</option>
                      </select>
                    </div>

                    {/* Format Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Export Format</label>
                      <select
                        value={reportGenFormat}
                        onChange={(e) => setReportGenFormat(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="csv" className="text-slate-900">📊 Excel Spreadsheet (CSV)</option>
                        <option value="json" className="text-slate-900">⚙️ JSON Structured Data</option>
                      </select>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleGenerateAndExportReport()}
                        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
                      >
                        <Download size={14} /> Generate & Download
                      </button>
                    </div>

                  </div>
                </div>

                {/* ── Report Category Switcher Tabs ── */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'settlement', label: 'Monthly Financial Settlements', icon: Receipt },
                    { id: 'sku_margins', label: 'SKU Margins & Performance', icon: PackageCheck },
                    { id: 'logistics', label: 'Fulfillment & Logistics SLA', icon: Truck },
                    { id: 'tax', label: 'Tax & Withholding Audit', icon: ShieldCheck },
                  ].map(tab => {
                    const isActive = reportsActiveTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setReportsActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* ── TAB CONTENT ── */}
                {reportsActiveTab === 'settlement' && (
                  
                  /* ── TAB 1: MONTHLY FINANCIAL SETTLEMENTS ── */
                  <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs space-y-4">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-slate-900">Audited Monthly Settlement Statements</h3>
                        <p className="text-xs text-slate-400 font-medium">Certified monthly statements with platform fee breakdown</p>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        Total Payouts to Date: ETB {(totalRevenue * 3.8).toLocaleString()}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b border-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left">Statement Period</th>
                            <th className="px-4 py-3 text-center">Orders / Units</th>
                            <th className="px-4 py-3 text-right">Gross Sales (ETB)</th>
                            <th className="px-4 py-3 text-right">Fee (5%)</th>
                            <th className="px-4 py-3 text-right">Net Payout (ETB)</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-left">Payout Account</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {[
                            { period: 'May 2025', orders: myOrders.length || 18, units: 54, gross: totalRevenue, fee: Math.round(totalRevenue * 0.05), net: netPayout, status: 'Settled & Paid', method: 'Telebirr SuperApp' },
                            { period: 'April 2025', orders: 24, units: 72, gross: 84200, fee: 4210, net: 79990, status: 'Settled & Paid', method: 'CBE Birr Account' },
                            { period: 'March 2025', orders: 19, units: 58, gross: 68500, fee: 3425, net: 65075, status: 'Settled & Paid', method: 'Telebirr SuperApp' },
                            { period: 'February 2025', orders: 15, units: 42, gross: 52300, fee: 2615, net: 49685, status: 'Settled & Paid', method: 'CBE Birr Account' },
                            { period: 'January 2025', orders: 12, units: 36, gross: 41800, fee: 2090, net: 39710, status: 'Settled & Paid', method: 'Telebirr SuperApp' },
                          ].map((stmt, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3.5 font-extrabold text-slate-900">
                                {stmt.period}
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span className="font-bold text-slate-700">{stmt.orders} orders</span>
                                <span className="text-[10px] text-slate-400 block font-normal">{stmt.units} items</span>
                              </td>
                              <td className="px-4 py-3.5 text-right font-black text-slate-900">
                                ETB {stmt.gross.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5 text-right font-mono text-rose-600 font-bold">
                                -ETB {stmt.fee.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5 text-right font-black text-emerald-600">
                                ETB {stmt.net.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <Check size={11} /> {stmt.status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-slate-600 font-bold">
                                {stmt.method}
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleGenerateAndExportReport('financial', stmt.period.toLowerCase().replace(' ', '_'), 'csv')}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                  title="Download CSV Statement"
                                >
                                  <Download size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                )}

                {reportsActiveTab === 'sku_margins' && (
                  
                  /* ── TAB 2: SKU MARGINS & PERFORMANCE ── */
                  <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs space-y-4">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-900">SKU Profit Contribution & Margin Statement</h3>
                        <p className="text-xs text-slate-400 font-medium">Individual product revenue, refunds, and net margins</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGenerateAndExportReport('product_sales', 'ytd', 'csv')}
                        className="text-xs font-black text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download size={13} /> Export All SKUs
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b border-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left">Product Listing</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-right">Unit Price</th>
                            <th className="px-4 py-3 text-center">Units Sold</th>
                            <th className="px-4 py-3 text-right">Gross Sales</th>
                            <th className="px-4 py-3 text-right">Net Margin Contribution</th>
                            <th className="px-4 py-3 text-center">Margin %</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {myProducts.map((prod, idx) => {
                            const cat = categories.find(c => c.id === prod.categoryId);
                            const unitsSold = (idx + 1) * 9 + 5;
                            const gross = unitsSold * prod.price;
                            const net = Math.round(gross * 0.95);

                            return (
                              <tr key={prod.productId} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <img src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} alt={prod.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="font-extrabold text-slate-900 truncate max-w-[180px]">{prod.name}</p>
                                      <span className="font-mono text-[9px] font-bold text-slate-400">#PRD-{String(prod.productId).padStart(4, '0')}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-600">{cat?.name || 'General'}</td>
                                <td className="px-4 py-3 text-right font-black text-slate-900">ETB {Number(prod.price).toLocaleString()}</td>
                                <td className="px-4 py-3 text-center font-black text-slate-800">{unitsSold}</td>
                                <td className="px-4 py-3 text-right font-black text-slate-900">ETB {gross.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-black text-emerald-600">ETB {net.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    95.0%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                )}

                {reportsActiveTab === 'logistics' && (
                  
                  /* ── TAB 3: FULFILLMENT & LOGISTICS SLA ── */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 lg:col-span-2">
                      <h3 className="text-base font-black text-slate-900">Fulfillment & Delivery Performance SLAs</h3>
                      <p className="text-xs text-slate-400 font-medium">Logistics reliability score and delivery duration metrics</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                          <span className="text-[10px] font-black uppercase text-slate-400">On-Time Delivery</span>
                          <p className="text-xl font-black text-emerald-600 mt-1">98.4%</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">SLA target &gt; 95%</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                          <span className="text-[10px] font-black uppercase text-slate-400">Avg Transit Time</span>
                          <p className="text-xl font-black text-indigo-600 mt-1">1.2 Days</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">Dispatch to doorstep</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                          <span className="text-[10px] font-black uppercase text-slate-400">Return (RTO) Rate</span>
                          <p className="text-xl font-black text-amber-600 mt-1">1.2%</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">Undelivered parcels</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                          <span className="text-[10px] font-black uppercase text-slate-400">Customer Rating</span>
                          <p className="text-xl font-black text-purple-600 mt-1">4.9 / 5.0</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">Packaging & speed</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                      <h3 className="text-sm font-black text-slate-900">Courier Partner Breakdown</h3>
                      <div className="space-y-3 pt-1">
                        {[
                          { partner: 'Smuni Express Fleet', share: '68%', status: 'Primary' },
                          { partner: 'Ethiopian Post (EMS)', share: '20%', status: 'Regional' },
                          { partner: 'Third-Party Dispatchers', share: '12%', status: 'Express' }
                        ].map((cp, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-bold">
                            <span className="text-slate-800">{cp.partner}</span>
                            <span className="text-indigo-600 font-black">{cp.share}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                )}

                {reportsActiveTab === 'tax' && (
                  
                  /* ── TAB 4: TAX & WITHHOLDING COMPLIANCE ── */
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-emerald-600" />
                          Ministry of Revenue (MoR) Tax Reconciliations
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          Withholding tax summaries and VAT/TOT declarations generated per Ethiopian commercial tax codes
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleGenerateAndExportReport('tax_withholding', 'q2', 'csv')}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download size={13} /> Export MoR Schedule
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b border-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left">Tax Period</th>
                            <th className="px-4 py-3 text-right">Gross Sales Turnover</th>
                            <th className="px-4 py-3 text-right">Marketplace Fee (5%)</th>
                            <th className="px-4 py-3 text-right">2% Withholding (MoR)</th>
                            <th className="px-4 py-3 text-right">Net Seller Settlement</th>
                            <th className="px-4 py-3 text-center">Filing Status</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {[
                            { period: '2025-Q2 (Apr - Jun)', gross: totalRevenue, fee: Math.round(totalRevenue * 0.05), wh: Math.round(totalRevenue * 0.02), net: Math.round(totalRevenue * 0.93), status: 'Compliant & Reconciled' },
                            { period: '2025-Q1 (Jan - Mar)', gross: 162600, fee: 8130, wh: 3252, net: 151218, status: 'Filed & Audited' },
                            { period: '2024 Annual Declaration', gross: 485000, fee: 24250, wh: 9700, net: 451050, status: 'Audited Complete' }
                          ].map((t, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3.5 font-extrabold text-slate-900">{t.period}</td>
                              <td className="px-4 py-3.5 text-right font-black text-slate-900">ETB {t.gross.toLocaleString()}</td>
                              <td className="px-4 py-3.5 text-right font-mono text-slate-600">ETB {t.fee.toLocaleString()}</td>
                              <td className="px-4 py-3.5 text-right font-mono text-purple-700 font-bold">ETB {t.wh.toLocaleString()}</td>
                              <td className="px-4 py-3.5 text-right font-black text-emerald-600">ETB {t.net.toLocaleString()}</td>
                              <td className="px-4 py-3.5 text-center">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <ShieldCheck size={11} /> {t.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                )}

                {/* ── Connected Payout Method & Next Schedule Card ── */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Connected Settlement Method</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Telebirr Merchant ID <strong className="text-slate-800 font-mono font-bold">#TB-9920148</strong> • Primary Automated Payout
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Next Scheduled Release</span>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                      May 15, 2025 • <strong className="text-emerald-600 font-black">ETB {netPayout.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ─── 10. MESSAGES INBOX ─────────────────────────────────────────── */}
          {activeSection === 'messages' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
              <div className="lg:col-span-5 border-r border-slate-100 pr-4 space-y-3 overflow-y-auto">
                <h2 className="text-base font-black text-slate-900">Customer Messages</h2>
                <div className="space-y-2">
                  {mockMessages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessageId(msg.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        selectedMessageId === msg.id ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-150 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{msg.customerName}</span>
                        <span className="text-[9px] text-slate-400">{msg.date.split('-')[0]}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate mt-1">{msg.subject}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.thread[msg.thread.length - 1].text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between h-full pl-2">
                <div>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">{activeMessageObj.subject}</h3>
                    <p className="text-[11px] text-slate-400">From: {activeMessageObj.customerName} ({activeMessageObj.date})</p>
                  </div>

                  <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto p-2">
                    {activeMessageObj.thread.map((t, idx) => (
                      <div key={idx} className={`flex ${t.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-xs font-semibold ${t.sender === 'seller' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                          {t.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendReply} className="flex gap-2 border-t border-slate-100 pt-3">
                  <input
                    type="text"
                    placeholder="Type reply to customer..."
                    value={replyInput}
                    onChange={e => setReplyInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Send size={14} /> Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ─── 11. PROFILE ────────────────────────────────────────────────── */}
          {activeSection === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6 max-w-3xl">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  {sellerName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{sellerName}</h2>
                  <p className="text-xs text-slate-500 font-semibold">{storeName}</p>
                  <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1">Verified Merchant</span>
                </div>
              </div>

              <form onSubmit={e => { e.preventDefault(); triggerMessage('Seller profile updated successfully!'); }} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Vendor Name</label>
                    <input type="text" value={sellerNameState} onChange={e => setSellerNameState(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Store Name</label>
                    <input type="text" value={storeNameState} onChange={e => setStoreNameState(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Phone Number</label>
                    <input type="text" value={sellerPhoneState} onChange={e => setSellerPhoneState(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Email Address</label>
                    <input type="email" value={sellerEmailState} onChange={e => setSellerEmailState(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Store Pickup Address</label>
                    <input type="text" value={sellerAddressState} onChange={e => setSellerAddressState(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Tax ID (TIN)</label>
                    <input type="text" value={sellerTinState} onChange={e => setSellerTinState(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" />
                  </div>
                </div>

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs">
                  <Save size={16} /> Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* ─── 12. SETTINGS ───────────────────────────────────────────────── */}
          {activeSection === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6 max-w-2xl text-xs">
              <h2 className="text-lg font-black text-slate-900">Seller Store Preferences & Alerts</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <p className="font-extrabold text-slate-800">Email Alerts on New Customer Orders</p>
                    <p className="text-[11px] text-slate-400">Receive instant notification email when an order is placed</p>
                  </div>
                  <button type="button" onClick={() => setEmailNewOrderToggle(!emailNewOrderToggle)} className="text-indigo-600 cursor-pointer">
                    {emailNewOrderToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <p className="font-extrabold text-slate-800">Low Stock Warning Notifications</p>
                    <p className="text-[11px] text-slate-400">Alert when product inventory drops below threshold</p>
                  </div>
                  <button type="button" onClick={() => setLowStockAlertToggle(!lowStockAlertToggle)} className="text-indigo-600 cursor-pointer">
                    {lowStockAlertToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <p className="font-extrabold text-slate-800">SMS Notifications</p>
                    <p className="text-[11px] text-slate-400">Send SMS text message for priority orders</p>
                  </div>
                  <button type="button" onClick={() => setSmsNotificationToggle(!smsNotificationToggle)} className="text-indigo-600 cursor-pointer">
                    {smsNotificationToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                  </button>
                </div>
              </div>

              <button onClick={() => triggerMessage('Store settings saved successfully!')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs">
                <Save size={16} /> Save Store Preferences
              </button>
            </div>
          )}

          {/* ─── 13. PRODUCT DETAIL (DIRECT URL) ────────────────────────────── */}
          {activeSection === 'product' && id && (() => {
            const viewingProduct = products.find(p => p.productId === Number(id) || String(p.productId) === id);
            if (!viewingProduct || viewingProduct.sellerId !== currentUser.userId) {
              return (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <h2 className="text-xl font-bold text-slate-700">Product Not Found</h2>
                  <button onClick={() => navigate('/seller/dashboard/all_products')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer">Go Back</button>
                </div>
              );
            }
            
            const displayImg = selectedVariant?.image || viewingProduct.image;
            const displayPrice = selectedVariant ? (selectedVariant.offPrice || selectedVariant.price) : (viewingProduct.offPrice || viewingProduct.price);
            const inventoryItem = inventory.find(i => Number(i.productId) === Number(viewingProduct.productId));
            const displayStock = selectedVariant ? Number(selectedVariant.stock) : (inventoryItem?.quantity ?? '—');
            
            return (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setSelectedVariant(null); navigate('/seller/dashboard/all_products'); }} className="text-slate-400 hover:text-slate-700 bg-white shadow-sm p-2 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                      <ChevronLeft size={18} />
                    </button>
                    <h2 className="text-lg font-black text-slate-900">Product Details</h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU-{viewingProduct.productId}</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-[42%] lg:min-h-[500px] bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 flex items-center justify-center p-8">
                      {displayImg ? (
                        <img
                          key={displayImg}
                          src={displayImg}
                          alt={viewingProduct.name}
                          className="w-full max-h-[380px] object-contain rounded-2xl transition-opacity duration-200"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-300">
                          <Package size={72} />
                          <span className="text-sm font-bold">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 lg:p-8 space-y-5 overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${viewingProduct.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : viewingProduct.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {viewingProduct.status || 'Pending'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{categories.find(c => c.id === viewingProduct.categoryId)?.name || 'No Category'}</span>
                      </div>

                      <div>
                        <h1 className="text-2xl font-black text-slate-900 break-words">{viewingProduct.name}</h1>
                        {selectedVariant && (
                          <p className="text-sm font-bold text-indigo-600 mt-1">
                            Variant: {[selectedVariant.color, selectedVariant.size].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {(() => {
                          const base    = viewingProduct.price;
                          const off     = selectedVariant ? (selectedVariant.offPrice || null) : (viewingProduct.offPrice || null);
                          const discPct = viewingProduct.discount || 0;
                          const salePrice = selectedVariant
                            ? (selectedVariant.offPrice || selectedVariant.price)
                            : (off || base);
                          const hasDiscount = off && off < base;
                          return (
                            <>
                              <div className="flex items-baseline gap-2 flex-wrap">
                                {hasDiscount && (
                                  <span className="text-lg font-bold text-slate-400 line-through">ETB {Number(base).toLocaleString()}</span>
                                )}
                                <span className="text-3xl font-black text-indigo-600">ETB {Number(salePrice).toLocaleString()}</span>
                              </div>
                              {hasDiscount && (
                                <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                                  -{discPct}% OFF
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-400 ml-auto">{displayStock} units in stock</span>
                            </>
                          );
                        })()}
                      </div>

                      <div className="border-t border-slate-100 pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                        <p className={`text-sm text-slate-600 leading-relaxed break-words overflow-hidden ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
                          {viewingProduct.description || 'No description provided.'}
                        </p>
                        {viewingProduct.description && viewingProduct.description.length > 120 && (
                          <button
                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                            className="mt-2 text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {isDescExpanded ? '▲ See Less' : '▼ See More'}
                          </button>
                        )}
                      </div>

                      {Array.isArray(viewingProduct.features) && viewingProduct.features.length > 0 && (
                        <div className="border-t border-slate-100 pt-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Product Features</p>
                          <div className="flex flex-wrap gap-2">
                            {viewingProduct.features.map((feat, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                                <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {viewingProduct.variants && viewingProduct.variants.length > 0 && (
                        <div className="border-t border-slate-100 pt-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Product Variations</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedVariant(null)}
                              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${!selectedVariant ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                            >
                              Default
                            </button>
                            {viewingProduct.variants.map(v => {
                              const varName = [v.color, v.size].filter(Boolean).join(' · ') || 'Variant';
                              const isActive = selectedVariant?.id === v.id;
                              return (
                                <button
                                  key={v.id}
                                  onClick={() => setSelectedVariant(v)}
                                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors flex items-center gap-2 cursor-pointer ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                                >
                                  {v.color && (
                                    <span
                                      className="w-3 h-3 rounded-full border border-white/60 shrink-0"
                                      style={{ backgroundColor: v.color.toLowerCase() }}
                                    />
                                  )}
                                  {varName}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                  <button onClick={() => { setSelectedVariant(null); navigate('/seller/dashboard/all_products'); }} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm cursor-pointer">
                    Close
                  </button>
                  <button onClick={() => { startEditProduct(viewingProduct); setSelectedVariant(null); navigate('/seller/dashboard/add_product'); }} className="px-5 py-2.5 rounded-xl font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors text-sm flex items-center gap-2 cursor-pointer">
                    <Edit2 size={15} /> Edit
                  </button>
                  <button onClick={() => { setDeleteConfirmProduct(viewingProduct); }} className="px-5 py-2.5 rounded-xl font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors text-sm flex items-center gap-2 cursor-pointer">
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      </div>

      {/* ─── MODALS ───────────────────────────────────────────────────────────── */}
      {selectedProductDetails && (
        <SellerProductDetailsModal
          product={selectedProductDetails}
          categories={categories}
          inventory={inventory}
          onClose={() => setSelectedProductDetails(null)}
        />
      )}

      {adjustingInventoryProduct && (
        <SellerInventoryAdjustModal
          product={adjustingInventoryProduct}
          inventoryItem={inventory.find(i => Number(i.productId) === Number(adjustingInventoryProduct.productId))}
          categories={categories}
          onClose={() => setAdjustingInventoryProduct(null)}
          onSave={handleSaveInventoryAdjustment}
        />
      )}

      {deleteConfirmProduct && (
        <SellerProductDeleteModal
          product={deleteConfirmProduct}
          onClose={() => setDeleteConfirmProduct(null)}
          onConfirm={() => {
            deleteProduct(deleteConfirmProduct.productId);
            setDeleteConfirmProduct(null);
            triggerMessage(`Deleted "${deleteConfirmProduct.name}" from catalog!`);
          }}
        />
      )}

      {selectedOrderDetail && (
        <SellerOrderDetailModal
          order={selectedOrderDetail}
          orderItems={orderItems}
          products={products}
          users={context.users || []}
          deliveryTracking={context.deliveryTracking || []}
          onClose={() => setSelectedOrderDetail(null)}
        />
      )}

      {selectedOrderReceipt && (
        <SellerOrderReceiptModal
          order={selectedOrderReceipt}
          orderItems={orderItems}
          products={products}
          sellerName={sellerName}
          storeName={storeName}
          onClose={() => setSelectedOrderReceipt(null)}
        />
      )}
    </div>
  );
}
