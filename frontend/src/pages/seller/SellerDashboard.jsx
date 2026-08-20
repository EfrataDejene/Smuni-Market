import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  LayoutDashboard, Package, Plus, Archive, ShoppingBag, BarChart2,
  LogOut, Menu, X, TrendingUp, AlertTriangle, CheckCircle, Edit2,
  Trash2, Eye, Save, Upload, Star, DollarSign, Users, Search, Bell,
  MessageSquare, User, Settings, ChevronDown, ChevronRight, Layers,
  Tag, ShieldCheck, ArrowUpRight, Clock, FileText, Check, Send, Download,
  ToggleLeft, ToggleRight, Store, MapPin, Phone, Mail, ShieldAlert
} from 'lucide-react';

// ─── Status Badge Component ───────────────────────────────────────────────────
function Badge({ label, color }) {
  const m = {
    green: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    yellow: 'bg-amber-100 text-amber-700 border border-amber-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border border-purple-200',
    gray: 'bg-slate-100 text-slate-600 border border-slate-200'
  };
  return <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${m[color] || m.gray}`}>{label}</span>;
}

// ─── MAIN SELLER DASHBOARD COMPONENT ──────────────────────────────────────────
export default function SellerDashboard() {
  const context = useContext(AppContext);
  const {
    currentUser, logoutUser, products, inventory, orders, orderItems, payments,
    categories, brands, addProduct, updateProduct, deleteProduct, updateInventoryQuantity
  } = context;

  const navigate = useNavigate();

  // Navigation states
  const [activeSection, setActiveSection] = useState('dashboard');
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(true);

  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states for Add/Edit product
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscount, setProdDiscount] = useState(0);
  const [prodCatId, setProdCatId] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState('');

  // Seller Profile editable state
  const [sellerNameState, setSellerNameState] = useState(currentUser?.name || 'Selam Tesfaye');
  const [storeNameState, setStoreNameState] = useState(currentUser?.storeName || 'SMUNI Fashion Store');
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

  // Notification message
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

  // Low Stock Items for this seller
  const lowStockItems = inventory.filter(inv => myProductIds.includes(inv.productId) && (inv.stockStatus === 'Low' || inv.stockStatus === 'Out of Stock'));

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
    setTimeout(() => setActionMsg(''), 3000);
  };

  // Product submit handler
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodCatId || !prodBrandId) return;

    if (editingProduct) {
      updateProduct(editingProduct.productId, {
        name: prodName,
        description: prodDesc,
        price: parseFloat(prodPrice),
        discount: parseFloat(prodDiscount || 0),
        categoryId: parseInt(prodCatId),
        brandId: parseInt(prodBrandId),
        image: prodImage || editingProduct.image
      });
      if (prodStock) updateInventoryQuantity(editingProduct.productId, parseInt(prodStock), 3);
      triggerMessage(`Product "${prodName}" updated successfully!`);
    } else {
      addProduct({
        name: prodName,
        description: prodDesc,
        price: parseFloat(prodPrice),
        discount: parseFloat(prodDiscount || 0),
        categoryId: parseInt(prodCatId),
        brandId: parseInt(prodBrandId),
        image: prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
        stock: parseInt(prodStock || 10),
        lowStockThreshold: 3
      });
      triggerMessage(`Product "${prodName}" created successfully!`);
    }

    setEditingProduct(null);
    setProdName(''); setProdDesc(''); setProdPrice(''); setProdDiscount(0); setProdCatId(''); setProdBrandId(''); setProdImage(''); setProdStock('');
    setActiveSection('all_products');
  };

  const startEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdDiscount(prod.discount || 0);
    setProdCatId(prod.categoryId);
    setProdBrandId(prod.brandId);
    setProdImage(prod.image);
    const inv = inventory.find(i => i.productId === prod.productId);
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
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShoppingBag size={20} color="white" />
              </div>
              <div>
                <p className="font-extrabold text-base tracking-tight text-white">SMUNI-Market</p>
                <p className="text-[11px] text-slate-400 font-medium">Seller Dashboard</p>
              </div>
            </div>
            <button onClick={() => setSidebarMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <button
              onClick={() => { setActiveSection('dashboard'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </button>

            {/* Products Dropdown */}
            <div>
              <button
                onClick={() => setProductsSubmenuOpen(!productsSubmenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  ['all_products', 'add_product', 'categories', 'brands'].includes(activeSection)
                    ? 'text-white bg-slate-800/80'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={17} />
                  <span>Products</span>
                </div>
                <ChevronDown size={14} className={`transition-transform ${productsSubmenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {productsSubmenuOpen && (
                <div className="ml-7 my-1 space-y-1 border-l border-slate-800 pl-3">
                  {[
                    { id: 'all_products', label: 'All Products' },
                    { id: 'add_product', label: 'Add New Product' },
                    { id: 'categories', label: 'Categories' },
                    { id: 'brands', label: 'Brands' },
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { setActiveSection(sub.id); setSidebarMobileOpen(false); }}
                      className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                        activeSection === sub.id ? 'text-blue-400 font-extrabold' : 'text-slate-400 hover:text-white'
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'inventory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Archive size={17} />
                <span>Inventory</span>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </button>

            {/* Orders */}
            <button
              onClick={() => { setActiveSection('orders'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={17} />
                <span>Orders</span>
              </div>
              <ChevronRight size={14} className="text-slate-500" />
            </button>

            {/* Sales & Analytics */}
            <button
              onClick={() => { setActiveSection('sales_analytics'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'sales_analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <BarChart2 size={17} />
              <span>Sales & Analytics</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => { setActiveSection('reports'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'reports' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <FileText size={17} />
              <span>Reports</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => { setActiveSection('messages'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'messages' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={17} />
                <span>Messages</span>
              </div>
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">3</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => { setActiveSection('profile'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <User size={17} />
              <span>Profile</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => { setActiveSection('settings'); setSidebarMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Settings size={17} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LogOut size={17} />
            <span>Logout</span>
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
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button onClick={() => setSidebarMobileOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900 p-1">
              <Menu size={22} />
            </button>

            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                5
              </span>
            </button>

            <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors">
              <MessageSquare size={18} />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {sellerName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-extrabold text-slate-800 leading-tight">Hi, {sellerName.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Seller</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
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

        {/* MAIN BODY DEPENDING ON ACTIVE SECTION */}
        <div className="p-6 space-y-6 flex-1">
          {/* ─── 1. DASHBOARD OVERVIEW ───────────────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <>
              {/* PROFILE CARD & STAT CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">Seller Profile</p>
                    <div className="flex items-center gap-3.5 mt-3">
                      <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                        {sellerName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{sellerName}</h3>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{storeName}</p>
                        <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                          Verified Seller
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection('profile')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20"
                  >
                    View Profile
                  </button>
                </div>

                <div className="lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Total Orders</p>
                      <p className="text-2xl font-black text-slate-900 mt-0.5">{totalOrdersCount}</p>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp size={12} /> 12.5% from last month
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Total Products</p>
                      <p className="text-2xl font-black text-slate-900 mt-0.5">{totalProductsCount}</p>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp size={12} /> 8.3% from last month
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                      $
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Total Revenue</p>
                      <p className="text-lg font-black text-slate-900 mt-0.5">ETB {totalRevenue.toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp size={12} /> 15.7% from last month
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Total Customers</p>
                      <p className="text-2xl font-black text-slate-900 mt-0.5">{totalCustomersCount}</p>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp size={12} /> 10.1% from last month
                    </p>
                  </div>
                </div>
              </div>

              {/* QUICK ACTION TILES */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button onClick={() => { setEditingProduct(null); setActiveSection('add_product'); }} className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-4 flex items-center gap-3 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Plus size={20} /></div>
                  <div><p className="text-xs font-extrabold text-slate-800">Add New Product</p><p className="text-[10px] text-slate-400">Add a new product</p></div>
                </button>
                <button onClick={() => setActiveSection('all_products')} className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-4 flex items-center gap-3 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Package size={20} /></div>
                  <div><p className="text-xs font-extrabold text-slate-800">Manage Products</p><p className="text-[10px] text-slate-400">Edit or delete products</p></div>
                </button>
                <button onClick={() => setActiveSection('inventory')} className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-4 flex items-center gap-3 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><Layers size={20} /></div>
                  <div><p className="text-xs font-extrabold text-slate-800">Manage Inventory</p><p className="text-[10px] text-slate-400">Check stock levels</p></div>
                </button>
                <button onClick={() => setActiveSection('orders')} className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-4 flex items-center gap-3 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><ShoppingBag size={20} /></div>
                  <div><p className="text-xs font-extrabold text-slate-800">View Orders</p><p className="text-[10px] text-slate-400">Process customer orders</p></div>
                </button>
                <button onClick={() => setActiveSection('sales_analytics')} className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-4 flex items-center gap-3 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><BarChart2 size={20} /></div>
                  <div><p className="text-xs font-extrabold text-slate-800">Sales Reports</p><p className="text-[10px] text-slate-400">View detailed reports</p></div>
                </button>
              </div>

              {/* 3 COLUMNS MIDDLE WORKSPACE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Sales Summary</h3>
                      <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">This Month</span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">Total Revenue</p>
                        <p className="text-2xl font-black text-slate-900 mt-0.5">ETB {totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-slate-400">Total Orders</p>
                        <p className="text-2xl font-black text-slate-900 mt-0.5">{totalOrdersCount}</p>
                      </div>
                    </div>

                    <div className="mt-6 h-36 w-full">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="sellerSalesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M 0 60 Q 30 75 60 45 T 120 50 T 180 35 T 240 60 T 300 40 L 300 100 L 0 100 Z" fill="url(#sellerSalesGrad)" />
                        <path d="M 0 60 Q 30 75 60 45 T 120 50 T 180 30 T 240 60 T 300 40" fill="none" stroke="#2563EB" strokeWidth="3" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Low Stock Alerts</h3>
                      <button onClick={() => setActiveSection('inventory')} className="text-xs font-extrabold text-blue-600 hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="space-y-3 mt-3">
                      {(lowStockItems.length > 0 ? lowStockItems : myProducts.slice(0, 5)).map((item, idx) => {
                        const prod = myProducts.find(p => p.productId === item.productId) || item;
                        return (
                          <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <img src={prod.image} alt={prod.name} className="w-9 h-9 object-cover rounded-lg border border-slate-200 bg-white shrink-0" />
                              <div className="min-w-0">
                                <p className="font-extrabold text-xs text-slate-800 truncate">{prod.name}</p>
                                <p className="text-[10px] text-slate-400">SKU: PROD-00{prod.productId || idx + 1}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
                              Stock: {item.quantity !== undefined ? item.quantity : (idx + 2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Recent Orders</h3>
                      <button onClick={() => setActiveSection('orders')} className="text-xs font-extrabold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3 mt-3">
                      {recentOrders.map(o => (
                        <div key={o.orderId} className="flex items-center justify-between p-2 rounded-xl border border-slate-100">
                          <div>
                            <span className="font-extrabold text-xs text-blue-600">#ORD-{o.orderId}</span>
                            <p className="text-xs font-bold text-slate-700">{o.customerName || 'Abebe Kebede'}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-xs text-slate-900 block">ETB {(o.displayAmount || 2450).toLocaleString()}</span>
                            <Badge label={o.orderStatus || 'Delivered'} color="green" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BEST SELLING PRODUCTS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900">Best Selling Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {bestSellingProducts.map((prod, index) => (
                    <div key={prod.productId} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                      <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      <img src={prod.image} alt={prod.name} className="w-full h-28 object-cover rounded-xl border border-slate-200 bg-white" />
                      <div>
                        <p className="font-extrabold text-xs text-slate-800 line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-slate-400">Sold: {prod.unitsSold}</p>
                        <p className="text-xs font-black text-blue-600">ETB {prod.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ─── 2. ALL PRODUCTS ───────────────────────────────────────────── */}
          {activeSection === 'all_products' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">My Product Listings ({myProducts.length})</h2>
                <button onClick={() => { setEditingProduct(null); setActiveSection('add_product'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Price (ETB)</th>
                      <th className="px-4 py-3 text-left">Stock Qty</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myProducts.map(prod => {
                      const inv = inventory.find(i => i.productId === prod.productId);
                      return (
                        <tr key={prod.productId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-800 flex items-center gap-3">
                            <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                            <span>{prod.name}</span>
                          </td>
                          <td className="px-4 py-3 font-black text-blue-600">ETB {prod.price.toLocaleString()}</td>
                          <td className="px-4 py-3"><Badge label={`${inv?.quantity || 0} units`} color="green" /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => startEditProduct(prod)} className="text-blue-600 font-bold hover:underline flex items-center gap-1"><Edit2 size={14} /> Edit</button>
                              <button onClick={() => { deleteProduct(prod.productId); triggerMessage(`Deleted ${prod.name}`); }} className="text-red-500 font-bold hover:underline flex items-center gap-1"><Trash2 size={14} /> Delete</button>
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

          {/* ─── 3. ADD / EDIT PRODUCT ─────────────────────────────────────── */}
          {activeSection === 'add_product' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6 max-w-2xl">
              <h2 className="text-lg font-black text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">Product Name *</label>
                  <input type="text" required value={prodName} onChange={e => setProdName(e.target.value)} placeholder="e.g. Classic Wrist Watch" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Category *</label>
                    <select required value={prodCatId} onChange={e => setProdCatId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold bg-white">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Brand *</label>
                    <select required value={prodBrandId} onChange={e => setProdBrandId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold bg-white">
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Price (ETB) *</label>
                    <input type="number" required value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="2450" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Stock Qty *</label>
                    <input type="number" required value={prodStock} onChange={e => setProdStock(e.target.value)} placeholder="15" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2"><Save size={16} /> Save Product</button>
                  <button type="button" onClick={() => setActiveSection('all_products')} className="border border-slate-200 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-xl">Cancel</button>
                </div>
              </form>
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

          {/* ─── 6. INVENTORY ───────────────────────────────────────────────── */}
          {activeSection === 'inventory' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Inventory Stock Control</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Stock Quantity</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Quick Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myProducts.map(prod => {
                      const inv = inventory.find(i => i.productId === prod.productId);
                      return (
                        <tr key={prod.productId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-800">{prod.name}</td>
                          <td className="px-4 py-3 font-black text-slate-900">{inv?.quantity || 0} units</td>
                          <td className="px-4 py-3"><Badge label={inv?.stockStatus || 'Available'} color={inv?.stockStatus === 'Out of Stock' ? 'red' : 'green'} /></td>
                          <td className="px-4 py-3">
                            <button onClick={() => { updateInventoryQuantity(prod.productId, (inv?.quantity || 0) + 5, 3); triggerMessage(`Restocked +5 units for ${prod.name}`); }} className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg border border-emerald-200">
                              +5 Add Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 7. ORDERS ──────────────────────────────────────────────────── */}
          {activeSection === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Orders Received ({myOrders.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myOrders.map(o => (
                      <tr key={o.orderId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-extrabold text-blue-600">#ORD-{o.orderId}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{o.customerName || 'Customer'}</td>
                        <td className="px-4 py-3 text-slate-400">{o.orderDate}</td>
                        <td className="px-4 py-3 font-black text-slate-900">ETB {(o.totalAmount || 2450).toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge label={o.orderStatus || 'Confirmed'} color="green" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 8. SALES & ANALYTICS ────────────────────────────────────────── */}
          {activeSection === 'sales_analytics' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
              <h2 className="text-lg font-black text-slate-900">Sales & Store Performance Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                  <p className="text-[11px] font-bold text-blue-800">Gross Revenue</p>
                  <p className="text-xl font-black text-blue-900 mt-1">ETB {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <p className="text-[11px] font-bold text-emerald-800">Average Order Value</p>
                  <p className="text-xl font-black text-emerald-900 mt-1">ETB {Math.round(totalRevenue / (totalOrdersCount || 1)).toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                  <p className="text-[11px] font-bold text-purple-800">Conversion Rate</p>
                  <p className="text-xl font-black text-purple-900 mt-1">3.4%</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <p className="text-[11px] font-bold text-amber-800">Repeat Customers</p>
                  <p className="text-xl font-black text-amber-900 mt-1">24.8%</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── 9. REPORTS ─────────────────────────────────────────────────── */}
          {activeSection === 'reports' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Seller Monthly Performance Statement</h2>
                <button onClick={() => triggerMessage('Sales statement CSV downloaded')} className="bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
                  <Download size={16} /> Download Report (CSV)
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Period</th>
                      <th className="px-4 py-3 text-left">Orders Count</th>
                      <th className="px-4 py-3 text-left">Items Sold</th>
                      <th className="px-4 py-3 text-left">Digital Sales</th>
                      <th className="px-4 py-3 text-left">COD Collected</th>
                      <th className="px-4 py-3 text-left">Total Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 font-bold">
                      <td className="px-4 py-3 text-slate-800">May 2025</td>
                      <td className="px-4 py-3 text-slate-600">{totalOrdersCount}</td>
                      <td className="px-4 py-3 text-slate-600">340 units</td>
                      <td className="px-4 py-3 text-purple-600">ETB 54,200</td>
                      <td className="px-4 py-3 text-amber-600">ETB 44,250</td>
                      <td className="px-4 py-3 font-black text-emerald-600">ETB {totalRevenue.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 10. MESSAGES INBOX ─────────────────────────────────────────── */}
          {activeSection === 'messages' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
              {/* Message List */}
              <div className="lg:col-span-5 border-r border-slate-100 pr-4 space-y-3 overflow-y-auto">
                <h2 className="text-base font-black text-slate-900">Customer Messages</h2>
                <div className="space-y-2">
                  {mockMessages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessageId(msg.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        selectedMessageId === msg.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-150 hover:bg-slate-100'
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

              {/* Message Thread Details */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full pl-2">
                <div>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">{activeMessageObj.subject}</h3>
                    <p className="text-[11px] text-slate-400">From: {activeMessageObj.customerName} ({activeMessageObj.date})</p>
                  </div>

                  <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto p-2">
                    {activeMessageObj.thread.map((t, idx) => (
                      <div key={idx} className={`flex ${t.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-xs font-semibold ${t.sender === 'seller' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
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
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
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
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  {sellerName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{sellerName}</h2>
                  <p className="text-xs text-slate-500 font-semibold">{storeName}</p>
                  <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1">Verified Seller</span>
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

                <button type="submit" className="bg-blue-600 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2">
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
                  <button type="button" onClick={() => setEmailNewOrderToggle(!emailNewOrderToggle)} className="text-blue-600">
                    {emailNewOrderToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <p className="font-extrabold text-slate-800">Low Stock Warning Notifications</p>
                    <p className="text-[11px] text-slate-400">Alert when product inventory drops below threshold</p>
                  </div>
                  <button type="button" onClick={() => setLowStockAlertToggle(!lowStockAlertToggle)} className="text-blue-600">
                    {lowStockAlertToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <p className="font-extrabold text-slate-800">SMS Notifications</p>
                    <p className="text-[11px] text-slate-400">Send SMS text message for priority orders</p>
                  </div>
                  <button type="button" onClick={() => setSmsNotificationToggle(!smsNotificationToggle)} className="text-blue-600">
                    {smsNotificationToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                  </button>
                </div>
              </div>

              <button onClick={() => triggerMessage('Store settings saved successfully!')} className="bg-blue-600 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2">
                <Save size={16} /> Save Store Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
