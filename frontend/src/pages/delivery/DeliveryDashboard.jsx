import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  Truck, Package, CheckCircle, XCircle, MapPin, Phone, Mail, User,
  LogOut, Menu, X, Clock, AlertTriangle, DollarSign, Calendar, ChevronRight,
  ExternalLink, Bell, RefreshCw, Layers, ShieldCheck, Wallet, ArrowRight, Eye
} from 'lucide-react';

// ─── Status Pill Component ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'On The Way') {
    return <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">On The Way</span>;
  }
  if (status === 'Assigned') {
    return <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Assigned</span>;
  }
  if (status === 'Picked Up') {
    return <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0066D6]/10 text-[#0066D6]">Picked Up</span>;
  }
  if (status === 'Delivered') {
    return <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Delivered</span>;
  }
  if (status === 'Failed Delivery') {
    return <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">Failed Delivery</span>;
  }
  if (status === 'Cancelled') {
    return <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">Cancelled</span>;
  }
  return <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{status}</span>;
}

// ─── Main Delivery Dashboard ─────────────────────────────────────────────────
export default function DeliveryDashboard() {
  const { currentUser, logoutUser, deliveryTracking, orders, orderItems, payments, products, users, updateDeliveryStatus } = useContext(AppContext);
  const navigate = useNavigate();

  const { section } = useParams();
  const activeSection = section || 'dashboard';
  const setActiveSection = (newSection) => navigate(newSection === 'dashboard' ? '/delivery/dashboard' : `/delivery/dashboard/${newSection}`);
  const [selectedOrderId, setSelectedOrderId] = useState(10058);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Form input for COD confirmation
  const [collectedAmountInput, setCollectedAmountInput] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [failedReasonInput, setFailedReasonInput] = useState('');
  const [showFailModal, setShowFailModal] = useState(false);

  if (!currentUser || currentUser.role !== 'Delivery') {
    navigate('/delivery/login');
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/delivery/login');
  };

  // Get current user details
  const deliveryDriverName = currentUser.name;

  // Filter deliveries assigned to current logged-in driver (or preseeded driver ID 7)
  const myDeliveries = deliveryTracking.filter(dt =>
    dt.deliveryPersonId === currentUser.userId ||
    (currentUser.email === 'dawit@delivery.com' && (dt.deliveryPersonId === 7 || dt.deliveryPersonId === 5))
  );

  // Joined order data list resolved dynamically from AppContext mock DB tables
  const deliveryOrdersList = myDeliveries.map(dt => {
    const order = orders.find(o => o.orderId === dt.orderId) || {};
    const customer = users.find(u => u.userId === order.userId) || {};
    const payment = payments.find(p => p.orderId === dt.orderId) || {};
    const items = orderItems.filter(oi => oi.orderId === dt.orderId);

    return {
      ...dt,
      order: {
        ...order,
        customerName: order.customerName || customer.name || 'Customer',
        customerPhone: order.customerPhone || customer.phone || '+251 911 000 000',
        customerEmail: order.customerEmail || customer.email || 'customer@gmail.com',
        deliveryAddress: order.deliveryAddress || customer.address || 'Addis Ababa, Ethiopia',
        totalAmount: order.totalAmount || 0,
        subtotal: order.subtotal || Math.max(0, (order.totalAmount || 100) - 100),
        shippingFee: order.shippingFee || 100,
        orderTime: order.orderTime || '10:30 AM'
      },
      payment,
      items
    };
  });

  // Selected Order
  const activeOrderObj = deliveryOrdersList.find(d => d.orderId === selectedOrderId) || deliveryOrdersList[0];

  // Dynamically Calculated Stats from AppContext State
  const assignedCount = deliveryOrdersList.filter(d => ['Assigned', 'Picked Up', 'On The Way'].includes(d.deliveryStatus)).length;
  const onTheWayCount = deliveryOrdersList.filter(d => d.deliveryStatus === 'On The Way').length;
  const deliveredTodayCount = deliveryOrdersList.filter(d => d.deliveryStatus === 'Delivered').length;
  const codCollectedTotal = deliveryOrdersList
    .filter(d => d.deliveryStatus === 'Delivered')
    .reduce((sum, d) => sum + (d.order.totalAmount || 0), 0);

  // Filtered orders list
  const filteredAssignedOrders = deliveryOrdersList.filter(d => {
    if (statusFilter === 'On The Way') return d.deliveryStatus === 'On The Way';
    if (statusFilter === 'Assigned') return d.deliveryStatus === 'Assigned';
    if (statusFilter === 'Delivered') return d.deliveryStatus === 'Delivered';
    return true;
  });

  // Handle Confirm Delivery & COD Payment
  const handleConfirmDelivery = (e) => {
    e.preventDefault();
    if (!activeOrderObj) return;

    const amountToRecord = collectedAmountInput || activeOrderObj.order.totalAmount || 2550;
    updateDeliveryStatus(activeOrderObj.orderId, 'Delivered', `COD Collected: ETB ${amountToRecord}`);
    setActionSuccessMsg(`Order #${activeOrderObj.orderId} marked Delivered & COD payment recorded!`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Handle Mark Failed
  const handleMarkFailed = () => {
    if (!activeOrderObj) return;
    updateDeliveryStatus(activeOrderObj.orderId, 'Failed Delivery', failedReasonInput || 'Customer unavailable at address');
    setShowFailModal(false);
    setFailedReasonInput('');
    setActionSuccessMsg(`Order #${activeOrderObj.orderId} marked as Failed Delivery.`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Maps URL redirect helper
  const openGoogleMaps = (address) => {
    const encoded = encodeURIComponent(address || 'Bole Sub City, Addis Ababa, Ethiopia');
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* ─── LEFT SIDEBAR (DARK NAVY #0F172A) ────────────────────────────────── */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#0F172A] text-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Truck size={20} color="white" />
              </div>
              <div>
                <p className="font-extrabold text-base tracking-tight text-white">SMUNI-Market</p>
                <p className="text-[11px] text-slate-400 font-medium">Delivery Dashboard</p>
              </div>
            </div>
            <button onClick={() => setSidebarMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'assigned', label: 'Assigned Orders', icon: Package },
              { id: 'history', label: 'Delivery History', icon: Clock },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'profile', label: 'Profile', icon: User },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LogOut size={18} />
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
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarMobileOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900 p-1">
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-black text-slate-900 hidden sm:block">
              Welcome back, {deliveryDriverName.split(' ')[0]}!
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition-colors"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-xs space-y-2">
                  <p className="font-bold text-slate-800 border-b border-slate-100 pb-1.5">Notifications</p>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-800">New delivery assigned: #ORD-10058</div>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-800">Address updated for #ORD-10057</div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">COD Payment confirmed #ORD-10055</div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">
              <div className="w-8 h-8 rounded-full bg-[#F97316] text-white font-black text-xs flex items-center justify-center shadow-xs">
                {deliveryDriverName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{deliveryDriverName}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Delivery Personnel</p>
              </div>
            </div>
          </div>
        </header>

        {/* Action Alert Banner */}
        {actionSuccessMsg && (
          <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl font-bold flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              {actionSuccessMsg}
            </span>
            <button onClick={() => setActionSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* MAIN BODY CONTENT DEPENDING ON SIDEBAR ITEM */}
        <div className="p-6 space-y-6 flex-1">
          {activeSection === 'dashboard' && (
            <>
              {/* ─── 5 TOP METRIC CARDS ROW ────────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Card 1: Assigned Orders */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
                      <Package size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Assigned Orders</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{assignedCount}</p>
                  </div>
                  <button onClick={() => setStatusFilter('Assigned')} className="text-[11px] font-bold text-[#F97316] hover:underline text-left">
                    View all
                  </button>
                </div>

                {/* Card 2: On The Way */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Truck size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">On The Way</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{onTheWayCount}</p>
                  </div>
                  <button onClick={() => setStatusFilter('On The Way')} className="text-[11px] font-bold text-emerald-600 hover:underline text-left">
                    View all
                  </button>
                </div>

                {/* Card 3: Delivered Today */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Delivered Today</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{deliveredTodayCount}</p>
                  </div>
                  <button onClick={() => setStatusFilter('Delivered')} className="text-[11px] font-bold text-blue-600 hover:underline text-left">
                    View all
                  </button>
                </div>

                {/* Card 4: COD Collected Today */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs">
                      ETB
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">COD Collected Today</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">ETB {codCollectedTotal.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setActiveSection('earnings')} className="text-[11px] font-bold text-purple-600 hover:underline text-left">
                    View earnings
                  </button>
                </div>

                {/* Card 5: Today Date */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Today</p>
                    <p className="text-sm font-black text-slate-800 mt-0.5 flex items-center gap-1">
                      May 31, 2025
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">Active Run Day</span>
                </div>
              </div>

              {/* ─── 3 COLUMNS MAIN WORKSPACE ──────────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ─── COLUMN 1: ASSIGNED ORDERS LIST ────────────────────────── */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Assigned Orders ({filteredAssignedOrders.length})
                      </h3>
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 outline-none focus:border-[#F97316] bg-slate-50"
                      >
                        <option value="All Status">All Status</option>
                        <option value="On The Way">On The Way</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="space-y-3 mt-4 max-h-[520px] overflow-y-auto pr-1">
                      {filteredAssignedOrders.map(item => {
                        const isSelected = item.orderId === activeOrderObj?.orderId;
                        const prod = products.find(p => p.productId === item.items[0]?.productId) || products[0];

                        return (
                          <div
                            key={item.orderId}
                            onClick={() => setSelectedOrderId(item.orderId)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-[#F97316] bg-orange-50/20 shadow-sm ring-1 ring-[#F97316]'
                                : 'border-slate-150 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img
                                src={prod.image}
                                alt="thumb"
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-xs text-slate-900">
                                    #ORD-{item.orderId}
                                  </span>
                                  <StatusBadge status={item.deliveryStatus} />
                                </div>
                                <p className="text-xs font-bold text-slate-700 truncate mt-0.5">
                                  {item.order.customerName || 'Customer'}
                                </p>
                                <p className="text-[11px] font-black text-[#F97316] mt-0.5">
                                  ETB {(item.order.totalAmount || 2550).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-semibold text-slate-400 block">
                                {item.order.orderTime || '10:30 AM'}
                              </span>
                              <ChevronRight size={16} className={`ml-auto mt-1 ${isSelected ? 'text-[#F97316]' : 'text-slate-300'}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSection('assigned')}
                    className="w-full text-center border border-[#F97316] text-[#F97316] hover:bg-orange-50 font-extrabold text-xs py-2.5 rounded-xl transition-colors mt-2"
                  >
                    View All Orders
                  </button>
                </div>

                {/* ─── COLUMN 2: ORDER DETAILS ─────────────────────────────────── */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Order Details Header Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Order Details</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">#ORD-{activeOrderObj?.orderId}</span>
                        <StatusBadge status={activeOrderObj?.deliveryStatus} />
                      </div>
                    </div>

                    {/* Customer Info Box */}
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2 text-xs">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Customer Information</p>
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <User size={15} className="text-slate-400" />
                        <span>{activeOrderObj?.order.customerName || 'Selamawit Assefa'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={15} className="text-slate-400" />
                        <span>{activeOrderObj?.order.customerPhone || '+251 912 345 678'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 truncate">
                        <Mail size={15} className="text-slate-400 shrink-0" />
                        <span className="truncate">{activeOrderObj?.order.customerEmail || 'selamawitassefa12@gmail.com'}</span>
                      </div>
                    </div>

                    {/* Delivery Address Box */}
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3 text-xs">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Delivery Address</p>
                      <div className="flex items-start gap-2 text-slate-700 font-semibold leading-relaxed">
                        <MapPin size={18} className="text-[#F97316] shrink-0 mt-0.5" />
                        <span>{activeOrderObj?.order.deliveryAddress || 'Bole Sub City, Woreda 03 House No. 1234, Road 5 Addis Ababa, Ethiopia'}</span>
                      </div>
                      <button
                        onClick={() => openGoogleMaps(activeOrderObj?.order.deliveryAddress)}
                        className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <ExternalLink size={14} /> Open in Maps
                      </button>
                    </div>

                    {/* Order Item Details */}
                    <div className="space-y-3 text-xs">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Purchased Item</p>
                      {activeOrderObj?.items.map((item, idx) => {
                        const prod = products.find(p => p.productId === item.productId) || products[0];
                        return (
                          <div key={idx} className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-white" />
                              <div>
                                <p className="font-extrabold text-slate-800">{prod.name}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-black text-slate-900">ETB {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                      <div className="flex justify-between">
                        <span>Item Total</span>
                        <span className="text-slate-800">ETB {(activeOrderObj?.order.subtotal || 2450).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="text-slate-800">ETB {(activeOrderObj?.order.shippingFee || 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                        <span>Total Amount (COD)</span>
                        <span className="text-[#F97316]">ETB {(activeOrderObj?.order.totalAmount || 2550).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Payment Method Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-800 font-bold">
                      <DollarSign size={18} className="text-amber-600 shrink-0" />
                      <span>Payment Method: Cash on Delivery (COD)</span>
                    </div>
                  </div>
                </div>

                {/* ─── COLUMN 3: UPDATE DELIVERY STATUS & COD CONFIRMATION ─────── */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-6">
                    <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
                      Update Delivery Status
                    </h3>

                    {/* Vertical Timeline Stepper */}
                    <div className="relative pl-6 space-y-5 text-xs">
                      <div className="absolute top-2 left-2.5 bottom-2 w-0.5 bg-slate-200" />

                      {/* Stepper item 1: Assigned */}
                      <div className="relative flex items-start gap-3">
                        <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] ring-4 ring-white">
                          ✓
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800">Assigned</p>
                          <p className="text-[10px] text-slate-400">{activeOrderObj?.assignedTime || 'May 31, 2025 - 09:15 AM'}</p>
                        </div>
                      </div>

                      {/* Stepper item 2: Picked Up */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white ${
                          ['Picked Up', 'On The Way', 'Delivered'].includes(activeOrderObj?.deliveryStatus)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {['Picked Up', 'On The Way', 'Delivered'].includes(activeOrderObj?.deliveryStatus) ? '✓' : '•'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800">Picked Up</p>
                          <p className="text-[10px] text-slate-400">
                            {['Picked Up', 'On The Way', 'Delivered'].includes(activeOrderObj?.deliveryStatus)
                              ? (activeOrderObj?.pickedUpTime || 'May 31, 2025 - 09:45 AM')
                              : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Stepper item 3: On The Way */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white ${
                          activeOrderObj?.deliveryStatus === 'On The Way'
                            ? 'bg-[#F97316] text-white ring-orange-100'
                            : ['Delivered'].includes(activeOrderObj?.deliveryStatus)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {activeOrderObj?.deliveryStatus === 'Delivered' ? '✓' : '•'}
                        </div>
                        <div>
                          <p className={`font-extrabold ${activeOrderObj?.deliveryStatus === 'On The Way' ? 'text-[#F97316]' : 'text-slate-800'}`}>
                            On The Way
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {['On The Way', 'Delivered'].includes(activeOrderObj?.deliveryStatus)
                              ? (activeOrderObj?.onTheWayTime || 'May 31, 2025 - 10:30 AM')
                              : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Stepper item 4: Delivered */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white ${
                          activeOrderObj?.deliveryStatus === 'Delivered'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {activeOrderObj?.deliveryStatus === 'Delivered' ? '✓' : '•'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800">Delivered</p>
                          <p className="text-[10px] text-slate-400">
                            {activeOrderObj?.deliveryStatus === 'Delivered'
                              ? (activeOrderObj?.deliveredTime || 'Just Now')
                              : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Stepper item 5: Failed Delivery */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white ${
                          activeOrderObj?.deliveryStatus === 'Failed Delivery'
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {activeOrderObj?.deliveryStatus === 'Failed Delivery' ? '✕' : '•'}
                        </div>
                        <div>
                          <p className={`font-extrabold ${activeOrderObj?.deliveryStatus === 'Failed Delivery' ? 'text-red-600' : 'text-slate-800'}`}>
                            Failed Delivery
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {activeOrderObj?.deliveryStatus === 'Failed Delivery' ? 'Marked Failed' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* COD Payment Confirmation Form */}
                    <form onSubmit={handleConfirmDelivery} className="space-y-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-extrabold text-slate-900">COD Payment Confirmation</p>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase">Collected Amount (ETB)</label>
                        <input
                          type="number"
                          value={collectedAmountInput !== '' ? collectedAmountInput : activeOrderObj?.order.totalAmount || 2550}
                          onChange={e => setCollectedAmountInput(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#F97316]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} /> Confirm Delivery & Payment
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowFailModal(true)}
                        className="w-full border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-700 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all"
                      >
                        Mark as Failed Delivery
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* ─── BOTTOM TABLE ROW: DELIVERY HISTORY ─────────────────────────── */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900">Delivery History</h3>
                  <button onClick={() => setActiveSection('history')} className="text-xs font-extrabold text-[#F97316] hover:underline">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                      <tr>
                        <th className="px-4 py-3 text-left">Order ID</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Address</th>
                        <th className="px-4 py-3 text-left">Amount (ETB)</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Delivered On</th>
                        <th className="px-4 py-3 text-left">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deliveryOrdersList.map(row => (
                        <tr key={row.trackingId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-extrabold text-slate-900">#ORD-{row.orderId}</td>
                          <td className="px-4 py-3 font-bold text-slate-700">{row.order.customerName || 'Customer'}</td>
                          <td className="px-4 py-3 text-slate-500 max-w-[220px] truncate">{row.order.deliveryAddress || 'Addis Ababa'}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">ETB {(row.order.totalAmount || 2550).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={row.deliveryStatus} />
                          </td>
                          <td className="px-4 py-3 text-slate-400 font-medium">{row.deliveredTime || row.deliveryDate || 'May 30, 2025 - 02:45 PM'}</td>
                          <td className="px-4 py-3">
                            {row.deliveryStatus === 'Delivered' ? (
                              <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                                COD Collected
                              </span>
                            ) : row.deliveryStatus === 'Failed Delivery' ? (
                              <span className="text-slate-400 font-bold">-</span>
                            ) : (
                              <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ─── SIDEBAR SECTION: ASSIGNED ORDERS ───────────────────────────────── */}
          {activeSection === 'assigned' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Assigned Orders Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveryOrdersList.map(item => (
                  <div key={item.orderId} className="border border-slate-200 rounded-xl p-4 space-y-3 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-sm text-slate-900">#ORD-{item.orderId}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{item.order.customerName}</p>
                      </div>
                      <StatusBadge status={item.deliveryStatus} />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.order.deliveryAddress}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="font-black text-sm text-[#F97316]">ETB {(item.order.totalAmount || 2550).toLocaleString()}</span>
                      <button
                        onClick={() => { setSelectedOrderId(item.orderId); setActiveSection('dashboard'); }}
                        className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                      >
                        Select & Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── SIDEBAR SECTION: DELIVERY HISTORY ──────────────────────────────── */}
          {activeSection === 'history' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">Full Delivery History Audit Log</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Address</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Delivery Status</th>
                      <th className="px-4 py-3 text-left">Completed Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deliveryOrdersList.map(row => (
                      <tr key={row.trackingId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-extrabold text-slate-900">#ORD-{row.orderId}</td>
                        <td className="px-4 py-3 font-bold text-slate-700">{row.order.customerName}</td>
                        <td className="px-4 py-3 text-slate-500">{row.order.customerPhone}</td>
                        <td className="px-4 py-3 text-slate-500">{row.order.deliveryAddress}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">ETB {(row.order.totalAmount || 2550).toLocaleString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={row.deliveryStatus} /></td>
                        <td className="px-4 py-3 text-slate-400 font-medium">{row.deliveredTime || row.deliveryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── SIDEBAR SECTION: EARNINGS ───────────────────────────────────────── */}
          {activeSection === 'earnings' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
              <h2 className="text-lg font-black text-slate-900">COD Earnings & Cash Collection Ledger</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
                  <p className="text-2xl font-black text-[#F97316]">ETB {codCollectedTotal.toLocaleString()}</p>
                  <p className="text-xs font-bold text-orange-800 mt-1">Cash Collected Today</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                  <p className="text-2xl font-black text-emerald-600">ETB {(codCollectedTotal + 12500).toLocaleString()}</p>
                  <p className="text-xs font-bold text-emerald-800 mt-1">Total This Week</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                  <p className="text-2xl font-black text-blue-600">{deliveredTodayCount}</p>
                  <p className="text-xs font-bold text-blue-800 mt-1">Successful Deliveries Today</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── SIDEBAR SECTION: PROFILE ────────────────────────────────────────── */}
          {activeSection === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6 max-w-xl">
              <h2 className="text-lg font-black text-slate-900">Delivery Personnel Profile</h2>
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F97316] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  {deliveryDriverName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{deliveryDriverName}</h3>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">Active Driver</span>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Phone:</span>
                  <span className="font-bold text-slate-800">{currentUser.phone || '+251 922 334 455'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Assigned Station:</span>
                  <span className="font-bold text-slate-800">Addis Ababa Central Hub</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Vehicle Type:</span>
                  <span className="font-bold text-slate-800">Motorcycle / Express Runner</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">License Status:</span>
                  <span className="font-bold text-emerald-600">Verified & Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL FOR FAILED DELIVERY ────────────────────────────────────────── */}
      {showFailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 text-sm">Mark Delivery as Failed</h3>
            <p className="text-xs text-slate-500">Please record the exact reason for the failed delivery attempt.</p>
            <textarea
              value={failedReasonInput}
              onChange={e => setFailedReasonInput(e.target.value)}
              placeholder="e.g. Customer unreachable at home, incorrect phone number..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-red-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleMarkFailed}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all"
              >
                Confirm Failed
              </button>
              <button
                onClick={() => setShowFailModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 font-extrabold text-xs py-2.5 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
