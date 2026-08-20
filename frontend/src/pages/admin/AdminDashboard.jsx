import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  LayoutDashboard, Users, Store, Package, Archive, ShoppingBag,
  CreditCard, Truck, BarChart2, Tag, Layers, LogOut, Menu, X,
  CheckCircle, XCircle, AlertTriangle, Edit2, Trash2, Plus, Save,
  RefreshCw, ShieldAlert, Search, Bell, Mail, Settings, ChevronRight,
  TrendingUp, Calendar, ChevronDown, Check, ArrowRight, ShieldCheck, Eye,
  Sliders, Download, UserCheck, FileText, ToggleLeft, ToggleRight, DollarSign
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

// ─── Main Admin Dashboard Component ──────────────────────────────────────────
export default function AdminDashboard() {
  const context = useContext(AppContext);
  const {
    users, products, orders, payments, inventory, deliveryTracking,
    categories, brands, orderItems, updateSellerStatus, addCategory,
    updateCategory, deleteCategory, addBrand, updateBrand, deleteBrand,
    adminConfirmOrder, adminCancelOrder, assignDeliveryPerson, updateDeliveryStatus,
    updateInventoryQuantity, logoutUser, currentUser
  } = context;

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('May 1, 2025 - May 31, 2025');

  // Modals & form state
  const [actionMsg, setActionMsg] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [brandNameInput, setBrandNameInput] = useState('');
  const [brandDescInput, setBrandDescInput] = useState('');

  // Settings local state
  const [siteName, setSiteName] = useState('SMUNI-Market Ethiopia');
  const [shippingFee, setShippingFee] = useState(100);
  const [lowStockDefault, setLowStockDefault] = useState(3);
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

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const deliveredOrdersCount = deliveryTracking.filter(d => d.deliveryStatus === 'Delivered').length || orders.filter(o => o.orderStatus === 'Confirmed').length;
  const processingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const shippedOrdersCount = deliveryTracking.filter(d => d.deliveryStatus === 'On The Way' || d.deliveryStatus === 'Picked Up').length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const cancelledOrdersCount = orders.filter(o => o.orderStatus === 'Cancelled').length;

  // Recent Orders (Top 5)
  const recentOrdersList = orders.slice(0, 5).map(o => {
    const customer = users.find(u => u.userId === o.userId) || { name: o.customerName || 'Customer' };
    const orderItem = orderItems.find(oi => oi.orderId === o.orderId);
    const prod = products.find(p => p.productId === orderItem?.productId);
    const seller = users.find(u => u.userId === prod?.sellerId) || { name: 'Tech Store' };
    const tracking = deliveryTracking.find(dt => dt.orderId === o.orderId);
    const status = tracking?.deliveryStatus || o.orderStatus;
    return { ...o, customerName: customer.name, sellerName: seller.name, status };
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
      productsCount: catProducts.length || 12,
      ordersCount: catOrdersCount || 45,
      revenue: catRevenue || (cat.id * 15400)
    };
  }).slice(0, 5);

  // System Alerts
  const lowStockCount = inventory.filter(i => i.stockStatus === 'Low' || i.stockStatus === 'Out of Stock').length;
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

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!catNameInput) return;
    addCategory(catNameInput, 'Layers');
    setCatNameInput('');
    setShowAddCategoryModal(false);
    triggerMessage('Category created successfully!');
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

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* ─── LEFT SIDEBAR (DARK NAVY #0F172A) ────────────────────────────────── */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#0F172A] text-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShoppingBag size={20} color="white" />
              </div>
              <div>
                <p className="font-extrabold text-base tracking-tight text-white">SMUNI-Market</p>
                <p className="text-[11px] text-slate-400 font-medium">Admin Dashboard</p>
              </div>
            </div>
            <button onClick={() => setSidebarMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'sellers', label: 'Seller Management', icon: Store },
              { id: 'products', label: 'Product Management', icon: Package },
              { id: 'categories', label: 'Category Management', icon: Layers },
              { id: 'brands', label: 'Brand Management', icon: Tag },
              { id: 'inventory', label: 'Inventory Monitoring', icon: Archive },
              { id: 'orders', label: 'Order Management', icon: ShoppingBag },
              { id: 'payments', label: 'Payment Management', icon: CreditCard },
              { id: 'deliveries', label: 'Delivery Management', icon: Truck },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart2 },
              { id: 'settings', label: 'System Settings', icon: Settings },
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
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout at bottom */}
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
                placeholder="Search for users, orders, products, sellers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                8
              </span>
            </button>

            <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors">
              <Mail size={18} />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
                A
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-extrabold text-slate-800 leading-tight">Admin User</p>
                <p className="text-[10px] text-slate-400 font-semibold">Super Administrator</p>
              </div>
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
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Welcome back, Admin!</p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs cursor-pointer">
                  <Calendar size={16} className="text-slate-400" />
                  <span>{dateRange}</span>
                  <ChevronDown size={14} className="text-slate-400 ml-1" />
                </div>
              </div>

              {/* 6 STAT CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Total Users</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{totalUsersCount.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp size={12} /> 12.5% from last month
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Store size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Total Sellers</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{totalSellersCount.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp size={12} /> 10.3% from last month
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Total Products</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{totalProductsCount.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp size={12} /> 8.7% from last month
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Total Orders</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{totalOrdersCount.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp size={12} /> 15.6% from last month
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Total Revenue</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">ETB {totalRevenue.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp size={12} /> 18.4% from last month
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Layers size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Total Categories</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{totalCategoriesCount}</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">No change</p>
                </div>
              </div>

              {/* 3 CHARTS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Sales Overview</h3>
                      <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">This Month</span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">Revenue (ETB)</p>
                        <p className="text-2xl font-black text-slate-900 mt-0.5">ETB {totalRevenue.toLocaleString()}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        ↑ 18.4% vs last month
                      </span>
                    </div>

                    <div className="mt-6 h-36 w-full">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M 0 70 Q 30 40 60 60 T 120 45 T 180 30 T 240 50 T 300 20 L 300 100 L 0 100 Z" fill="url(#salesGrad)" />
                        <path d="M 0 70 Q 30 40 60 60 T 120 45 T 180 30 T 240 50 T 300 20" fill="none" stroke="#4F46E5" strokeWidth="3" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Orders Overview</h3>
                      <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">This Month</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path strokeDasharray="51, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="4.5" />
                          <path strokeDasharray="22, 100" strokeDashoffset="-51" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F59E0B" strokeWidth="4.5" />
                          <path strokeDasharray="14, 100" strokeDashoffset="-73" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" strokeWidth="4.5" />
                          <path strokeDasharray="8, 100" strokeDashoffset="-87" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8B5CF6" strokeWidth="4.5" />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-base font-black text-slate-900 block">{totalOrdersCount}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Orders</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px] font-bold text-slate-600 flex-1 ml-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Delivered</span>
                          <span className="text-slate-800 font-extrabold">{deliveredOrdersCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Processing</span>
                          <span className="text-slate-800 font-extrabold">{processingOrdersCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Shipped</span>
                          <span className="text-slate-800 font-extrabold">{shippedOrdersCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Pending</span>
                          <span className="text-slate-800 font-extrabold">{pendingOrdersCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Revenue Overview</h3>
                      <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">This Month</span>
                    </div>

                    <div className="mt-6 h-36 w-full flex items-end justify-between gap-1.5 px-1">
                      {[40, 65, 30, 80, 55, 90, 70, 85, 45, 75, 95, 60, 80, 50].map((h, idx) => (
                        <div key={idx} className="flex-1 bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACCESS */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900">Quick Access</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                  {[
                    { id: 'users', label: 'Users', icon: Users, color: 'bg-purple-50 text-purple-600' },
                    { id: 'sellers', label: 'Sellers', icon: Store, color: 'bg-blue-50 text-blue-600' },
                    { id: 'products', label: 'Products', icon: Package, color: 'bg-teal-50 text-teal-600' },
                    { id: 'categories', label: 'Categories', icon: Layers, color: 'bg-orange-50 text-orange-600' },
                    { id: 'brands', label: 'Brands', icon: Tag, color: 'bg-emerald-50 text-emerald-600' },
                    { id: 'inventory', label: 'Inventory', icon: Archive, color: 'bg-indigo-50 text-indigo-600' },
                    { id: 'orders', label: 'Orders', icon: ShoppingBag, color: 'bg-[#0066D6]/10 text-[#0066D6]' },
                    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
                    { id: 'deliveries', label: 'Deliveries', icon: Truck, color: 'bg-amber-50 text-amber-600' },
                    { id: 'reports', label: 'Reports', icon: BarChart2, color: 'bg-rose-50 text-rose-600' },
                  ].map(tile => {
                    const Icon = tile.icon;
                    return (
                      <button
                        key={tile.id}
                        onClick={() => setActiveSection(tile.id)}
                        className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 text-center group"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tile.color} group-hover:scale-110 transition-transform`}>
                          <Icon size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{tile.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RECENT ORDERS / TOP CATEGORIES / ALERTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">Recent Orders</h3>
                    <button onClick={() => setActiveSection('orders')} className="text-xs font-extrabold text-blue-600 hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                        <tr>
                          <th className="px-3 py-2 text-left">Order ID</th>
                          <th className="px-3 py-2 text-left">Customer</th>
                          <th className="px-3 py-2 text-left">Seller</th>
                          <th className="px-3 py-2 text-left">Amount</th>
                          <th className="px-3 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentOrdersList.map(o => (
                          <tr key={o.orderId} className="hover:bg-slate-50">
                            <td className="px-3 py-2.5 font-extrabold text-blue-600">#ORD-{o.orderId}</td>
                            <td className="px-3 py-2.5 font-bold text-slate-700 truncate max-w-[100px]">{o.customerName}</td>
                            <td className="px-3 py-2.5 text-slate-500 truncate max-w-[90px]">{o.sellerName}</td>
                            <td className="px-3 py-2.5 font-bold text-slate-900">ETB {o.totalAmount.toLocaleString()}</td>
                            <td className="px-3 py-2.5"><Badge label={o.status} color={o.status === 'Delivered' ? 'green' : 'yellow'} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">Top Selling Categories</h3>
                    <button onClick={() => setActiveSection('categories')} className="text-xs font-extrabold text-blue-600 hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                        <tr>
                          <th className="px-3 py-2 text-left">Category</th>
                          <th className="px-3 py-2 text-left">Products</th>
                          <th className="px-3 py-2 text-left">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {topSellingCategories.map(cat => (
                          <tr key={cat.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2.5 font-bold text-slate-800">{cat.name}</td>
                            <td className="px-3 py-2.5 text-slate-500 font-medium">{cat.productsCount}</td>
                            <td className="px-3 py-2.5 font-bold text-slate-900">ETB {cat.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">System Alerts</h3>
                  </div>
                  <div className="space-y-3">
                    {systemAlerts.map(alert => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-150">
                        <AlertTriangle size={16} className={alert.type === 'danger' ? 'text-red-500' : 'text-amber-500'} />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 text-xs">{alert.title}</p>
                          <p className="text-[11px] text-slate-400">{alert.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── 2. USER MANAGEMENT ─────────────────────────────────────────── */}
          {activeSection === 'users' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">User Accounts Management ({users.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">User ID</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.userId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-extrabold text-slate-900">#{u.userId}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{u.name}</td>
                        <td className="px-4 py-3 text-slate-500">{u.email}</td>
                        <td className="px-4 py-3 text-slate-500">{u.phone || '—'}</td>
                        <td className="px-4 py-3"><Badge label={u.role} color={u.role === 'Admin' ? 'red' : u.role === 'Seller' ? 'indigo' : u.role === 'Delivery' ? 'amber' : 'blue'} /></td>
                        <td className="px-4 py-3"><Badge label={u.status} color={u.status === 'Active' ? 'green' : 'yellow'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 3. SELLER MANAGEMENT ───────────────────────────────────────── */}
          {activeSection === 'sellers' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Seller Approvals & Account Control ({sellers.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Store / Business Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sellers.map(s => (
                      <tr key={s.userId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-800">{s.name}</td>
                        <td className="px-4 py-3 text-slate-500">{s.email}</td>
                        <td className="px-4 py-3 text-slate-500">{s.phone}</td>
                        <td className="px-4 py-3"><Badge label={s.status} color={s.status === 'Active' ? 'green' : s.status === 'Pending' ? 'yellow' : 'red'} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {s.status === 'Pending' && (
                              <button onClick={() => { updateSellerStatus(s.userId, 'Active'); triggerMessage(`Approved ${s.name}`); }} className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Approve</button>
                            )}
                            {s.status === 'Active' && (
                              <button onClick={() => { updateSellerStatus(s.userId, 'Inactive'); triggerMessage(`Suspended ${s.name}`); }} className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Suspend</button>
                            )}
                            {s.status === 'Inactive' && (
                              <button onClick={() => { updateSellerStatus(s.userId, 'Active'); triggerMessage(`Reactivated ${s.name}`); }} className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Reactivate</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 4. PRODUCT MANAGEMENT ──────────────────────────────────────── */}
          {activeSection === 'products' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Product Catalog Control ({products.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Seller</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Price (ETB)</th>
                      <th className="px-4 py-3 text-left">Discount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => {
                      const seller = users.find(u => u.userId === p.sellerId);
                      const cat = categories.find(c => c.id === p.categoryId);
                      return (
                        <tr key={p.productId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-800 flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                            <span>{p.name}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{seller?.name || 'Seller'}</td>
                          <td className="px-4 py-3 text-slate-500">{cat?.name || 'Category'}</td>
                          <td className="px-4 py-3 font-black text-indigo-600">ETB {p.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-slate-400">{p.discount > 0 ? `${p.discount}% OFF` : 'None'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 5. CATEGORY MANAGEMENT ─────────────────────────────────────── */}
          {activeSection === 'categories' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Category Management ({categories.length})</h2>
                <button onClick={() => setShowAddCategoryModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
                  <Plus size={16} /> Add Category
                </button>
              </div>

              {showAddCategoryModal && (
                <form onSubmit={handleAddCategorySubmit} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                  <p className="font-extrabold text-xs text-slate-800">Add New Category</p>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={catNameInput}
                    onChange={e => setCatNameInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg">Save Category</button>
                    <button type="button" onClick={() => setShowAddCategoryModal(false)} className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map(c => (
                  <div key={c.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                    <div>
                      <p className="font-extrabold text-xs text-slate-800">{c.name}</p>
                      <p className="text-[10px] text-slate-400">ID #{c.id}</p>
                    </div>
                    <button onClick={() => { deleteCategory(c.id); triggerMessage(`Deleted category ${c.name}`); }} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 6. BRAND MANAGEMENT ────────────────────────────────────────── */}
          {activeSection === 'brands' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
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
                      <tr key={b.id} className="hover:bg-slate-50">
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

          {/* ─── 7. INVENTORY MONITORING ────────────────────────────────────── */}
          {activeSection === 'inventory' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Inventory Stock Monitoring ({inventory.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Stock Qty</th>
                      <th className="px-4 py-3 text-left">Alert Threshold</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Stock Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map(inv => {
                      const prod = products.find(p => p.productId === inv.productId) || { name: `Product #${inv.productId}` };
                      return (
                        <tr key={inv.inventoryId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-800">{prod.name}</td>
                          <td className="px-4 py-3 font-black text-slate-900">{inv.quantity} units</td>
                          <td className="px-4 py-3 text-slate-500">{inv.lowStockThreshold} units</td>
                          <td className="px-4 py-3">
                            <Badge
                              label={inv.stockStatus}
                              color={inv.stockStatus === 'Available' ? 'green' : inv.stockStatus === 'Low' ? 'yellow' : 'red'}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  updateInventoryQuantity(inv.productId, inv.quantity + 5, inv.lowStockThreshold);
                                  triggerMessage(`Added +5 stock to ${prod.name}`);
                                }}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200"
                              >
                                +5 Stock
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

          {/* ─── 8. ORDER MANAGEMENT ────────────────────────────────────────── */}
          {activeSection === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Order Management & Workflow ({orders.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Total</th>
                      <th className="px-4 py-3 text-left">Order Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(o => (
                      <tr key={o.orderId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-extrabold text-blue-600">#ORD-{o.orderId}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{o.customerName || 'Customer'}</td>
                        <td className="px-4 py-3 text-slate-400">{o.orderDate}</td>
                        <td className="px-4 py-3 font-black text-slate-900">ETB {o.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge label={o.orderStatus} color={o.orderStatus === 'Confirmed' ? 'green' : o.orderStatus === 'Cancelled' ? 'red' : 'yellow'} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {o.orderStatus === 'Pending' && (
                              <button onClick={() => { adminConfirmOrder(o.orderId); triggerMessage(`Confirmed Order #${o.orderId}`); }} className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg">Confirm</button>
                            )}
                            {o.orderStatus !== 'Cancelled' && (
                              <button onClick={() => { adminCancelOrder(o.orderId); triggerMessage(`Cancelled Order #${o.orderId}`); }} className="bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-lg border border-red-200">Cancel</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 9. PAYMENT MANAGEMENT ──────────────────────────────────────── */}
          {activeSection === 'payments' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Payment Transactions Ledger ({payments.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Payment ID</th>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">Method</th>
                      <th className="px-4 py-3 text-left">Reference</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map(p => (
                      <tr key={p.paymentId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-extrabold text-slate-900">#{p.paymentId}</td>
                        <td className="px-4 py-3 font-bold text-blue-600">#ORD-{p.orderId}</td>
                        <td className="px-4 py-3"><Badge label={p.paymentMethod} color={p.paymentMethod === 'Chapa' ? 'purple' : 'amber'} /></td>
                        <td className="px-4 py-3 font-mono text-slate-500">{p.transactionReference}</td>
                        <td className="px-4 py-3 font-black text-slate-900">ETB {p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge label={p.paymentStatus} color={p.paymentStatus === 'Paid' ? 'green' : p.paymentStatus === 'Refunded' ? 'gray' : 'yellow'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 10. DELIVERY MANAGEMENT ─────────────────────────────────────── */}
          {activeSection === 'deliveries' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Delivery Dispatch & Assignment ({deliveryTracking.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">Assigned Driver</th>
                      <th className="px-4 py-3 text-left">Delivery Status</th>
                      <th className="px-4 py-3 text-left">Assign Driver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deliveryTracking.map(dt => {
                      const driver = users.find(u => u.userId === dt.deliveryPersonId);
                      return (
                        <tr key={dt.trackingId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-extrabold text-blue-600">#ORD-{dt.orderId}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{driver?.name || 'Abebe Tesfaye'}</td>
                          <td className="px-4 py-3"><Badge label={dt.deliveryStatus} color={dt.deliveryStatus === 'Delivered' ? 'green' : 'blue'} /></td>
                          <td className="px-4 py-3">
                            <select
                              value={dt.deliveryPersonId || ''}
                              onChange={e => {
                                assignDeliveryPerson(dt.orderId, parseInt(e.target.value));
                                triggerMessage(`Assigned Order #${dt.orderId} to driver`);
                              }}
                              className="border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500 bg-slate-50"
                            >
                              <option value="">Select Agent</option>
                              {deliveryAgents.map(d => <option key={d.userId} value={d.userId}>{d.name}</option>)}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 11. REPORTS & ANALYTICS ────────────────────────────────────── */}
          {activeSection === 'reports' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Reports & Marketplace Analytics</h2>
                <button onClick={() => triggerMessage('Report exported as CSV file')} className="bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
                  <Download size={16} /> Export Report
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl text-center">
                  <p className="text-2xl font-black text-indigo-600">ETB {totalRevenue.toLocaleString()}</p>
                  <p className="text-xs font-bold text-indigo-800 mt-1">Total Market Gross Revenue</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center">
                  <p className="text-2xl font-black text-emerald-600">{deliveredOrdersCount}</p>
                  <p className="text-xs font-bold text-emerald-800 mt-1">Delivered Orders Rate (94.2%)</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl text-center">
                  <p className="text-2xl font-black text-purple-600">{sellers.length}</p>
                  <p className="text-xs font-bold text-purple-800 mt-1">Verified Sellers Active</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── 12. SYSTEM SETTINGS ────────────────────────────────────────── */}
          {activeSection === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6 max-w-3xl">
              <h2 className="text-lg font-black text-slate-900">System Settings & Marketplace Controls</h2>

              <form onSubmit={e => { e.preventDefault(); triggerMessage('System configuration saved successfully!'); }} className="space-y-6">
                {/* General config */}
                <div className="space-y-4 border-b border-slate-100 pb-6">
                  <h3 className="font-extrabold text-sm text-slate-800">General Marketplace Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Site Name</label>
                      <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Default Delivery Fee (ETB)</label>
                      <input type="number" value={shippingFee} onChange={e => setShippingFee(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold" />
                    </div>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4 border-b border-slate-100 pb-6 text-xs">
                  <h3 className="font-extrabold text-sm text-slate-800">Feature Switches</h3>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <p className="font-extrabold text-slate-800">Allow New Seller Registration</p>
                      <p className="text-[11px] text-slate-400">Open portal for incoming vendor store registration</p>
                    </div>
                    <button type="button" onClick={() => setAllowSellersToggle(!allowSellersToggle)} className="text-indigo-600">
                      {allowSellersToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <p className="font-extrabold text-slate-800">Enable Chapa Payment Gateway</p>
                      <p className="text-[11px] text-slate-400">Allow digital Telebirr, CBE Birr & card online payments</p>
                    </div>
                    <button type="button" onClick={() => setEnableChapaToggle(!enableChapaToggle)} className="text-indigo-600">
                      {enableChapaToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <p className="font-extrabold text-slate-800">Enable Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-400">Allow cash collection upon delivery driver arrival</p>
                    </div>
                    <button type="button" onClick={() => setEnableCodToggle(!enableCodToggle)} className="text-indigo-600">
                      {enableCodToggle ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-400" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center gap-2">
                  <Save size={16} /> Save Platform Configuration
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
