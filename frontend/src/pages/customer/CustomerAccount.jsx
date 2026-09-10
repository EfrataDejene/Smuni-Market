import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  User, Package, MapPin, Phone, Mail, LogOut, Star, Edit2, Check, X, 
  ExternalLink, ShieldCheck, Clock, Truck, ChevronRight, Eye, ShoppingBag, 
  CreditCard, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';

function StatusBadge({ label, type }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-[#0066D6] border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-slate-100 text-slate-600 border-slate-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-2xs ${styles[type] || styles.gray}`}>
      {type === 'green' && <CheckCircle2 size={11} />}
      {type === 'blue' && <ShieldCheck size={11} />}
      {type === 'yellow' && <Clock size={11} />}
      {label}
    </span>
  );
}

export default function CustomerAccount() {
  const { currentUser, orders, orderItems, payments, deliveryTracking, products, reviews, addReview, logoutUser, updateProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Review form state
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Get customer orders
  const myOrders = orders.filter(o => o.userId === currentUser.userId);
  const totalSpent = myOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const deliveredCount = myOrders.filter(o => {
    const d = deliveryTracking.find(dt => dt.orderId === o.orderId);
    return d?.deliveryStatus === 'Delivered';
  }).length;

  const handleSaveProfile = () => {
    const res = updateProfile({ name: editName, phone: editPhone, address: editAddress });
    if (res.success) {
      setProfileMsg('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setProfileMsg(''), 2500);
    }
  };

  const handleSubmitReview = (e, productId) => {
    e.preventDefault();
    const res = addReview(productId, reviewRating, reviewComment);
    if (res.success) {
      setReviewMsg('Thank you! Your product review has been published.');
      setReviewProductId(null);
      setReviewComment('');
      setReviewRating(5);
    } else {
      setReviewMsg(res.message);
    }
    setTimeout(() => setReviewMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between font-sans">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1280px] mx-auto px-4 py-8 space-y-8">
          
          {/* Top Banner & Profile Overview Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0066D6] to-blue-400 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-white/20">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h1>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified Customer
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/80 font-medium mt-1">{currentUser.email} • {currentUser.phone || 'Phone not set'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Member since: {currentUser.createdAt || 'August 2026'}</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full md:w-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Total Orders</p>
                  <p className="text-lg sm:text-2xl font-black text-white mt-1">{myOrders.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Delivered</p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-400 mt-1">{deliveredCount}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center min-w-[110px]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Total Spent</p>
                  <p className="text-sm sm:text-lg font-black text-amber-300 mt-1">ETB {totalSpent.toLocaleString()}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-xl space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black transition-all ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-[#0066D6] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} className={activeTab === 'orders' ? 'text-[#0066D6]' : 'text-slate-400'} />
                    <span>My Order History</span>
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{myOrders.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black transition-all ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-[#0066D6] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User size={18} className={activeTab === 'profile' ? 'text-[#0066D6]' : 'text-slate-400'} />
                    <span>My Profile & Address</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => { logoutUser(); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Pane */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* TAB 1: ORDER HISTORY */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Order History & Receipts</h2>
                      <p className="text-xs text-slate-500 font-medium">Track your orders, view Chapa payment receipts, and submit product reviews.</p>
                    </div>
                    <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-black text-[#0066D6] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors">
                      <ShoppingBag size={14} /> Shop Now
                    </Link>
                  </div>

                  {reviewMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {reviewMsg}
                    </div>
                  )}

                  {myOrders.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xl space-y-4">
                      <div className="w-16 h-16 bg-blue-50 text-[#0066D6] rounded-full flex items-center justify-center mx-auto">
                        <Package size={32} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-base">No Orders Placed Yet</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">You haven't placed any orders yet. Browse our store to discover products and pay securely with Chapa.</p>
                      </div>
                      <Link to="/products" className="inline-flex items-center gap-2 bg-[#0066D6] text-white text-xs font-black px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">
                        Start Shopping <ArrowRight size={14} />
                      </Link>
                    </div>
                  ) : (
                    myOrders.map(order => {
                      const payment = payments.find(p => p.orderId === order.orderId);
                      const delivery = deliveryTracking.find(d => d.orderId === order.orderId);
                      const items = orderItems.filter(oi => oi.orderId === order.orderId);
                      const isDelivered = delivery?.deliveryStatus === 'Delivered';

                      return (
                        <div key={order.orderId} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all space-y-5">
                          
                          {/* Card Top Row */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-black text-slate-900 text-base">Order #{order.orderId}</span>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                                  {order.orderDate}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                <CreditCard size={12} className="text-[#0066D6]" /> Payment via {payment?.paymentMethod || 'Chapa Gateway'}
                              </p>
                            </div>

                            {/* Status Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge 
                                label={`Order: ${order.orderStatus}`} 
                                type={order.orderStatus === 'Confirmed' ? 'blue' : 'yellow'} 
                              />
                              <StatusBadge 
                                label={`Payment: ${payment?.paymentStatus || 'Paid'}`} 
                                type={payment?.paymentStatus === 'Paid' ? 'green' : 'yellow'} 
                              />
                              <StatusBadge 
                                label={`Delivery: ${delivery?.deliveryStatus || 'Processing'}`} 
                                type={delivery?.deliveryStatus === 'Delivered' ? 'green' : 'purple'} 
                              />
                            </div>
                          </div>

                          {/* Purchased Item Previews */}
                          <div className="space-y-3">
                            {items.map(item => {
                              const prod = products.find(p => p.productId === item.productId);
                              const hasReview = reviews.some(r => r.productId === item.productId && r.userId === currentUser.userId);
                              
                              return (
                                <div key={item.itemId} className="flex items-center justify-between gap-4 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                                  <div className="flex items-center gap-3.5">
                                    {prod ? (
                                      <img src={prod.image} alt={prod.name} className="w-12 h-12 object-contain bg-white rounded-xl border border-slate-200 p-1 shrink-0" />
                                    ) : (
                                      <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center shrink-0">
                                        <Package size={20} className="text-slate-400" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-xs font-black text-slate-800 line-clamp-1">{prod?.name || 'Item Name'}</p>
                                      <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                                        Qty: {item.quantity} • <span className="text-[#0066D6]">ETB {(item.price * item.quantity).toLocaleString()}</span>
                                      </p>
                                    </div>
                                  </div>

                                  {isDelivered && !hasReview && (
                                    <button
                                      onClick={() => setReviewProductId(item.productId)}
                                      className="text-xs font-black text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                                    >
                                      <Star size={13} className="fill-amber-400 text-amber-400" /> Review
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Review Form Drawer */}
                          {reviewProductId && items.some(i => i.productId === reviewProductId) && (
                            <form onSubmit={(e) => handleSubmitReview(e, reviewProductId)} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-3">
                              <p className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                                <Sparkles size={14} className="text-amber-500" /> Rate & Review: {products.find(p => p.productId === reviewProductId)?.name}
                              </p>
                              
                              <div className="flex gap-1.5">
                                {[1,2,3,4,5].map(s => (
                                  <button key={s} type="button" onClick={() => setReviewRating(s)} className="p-1 hover:scale-110 transition-transform">
                                    <Star size={22} fill={s <= reviewRating ? '#FFB800' : 'none'} className={s <= reviewRating ? 'text-amber-400' : 'text-slate-300'} />
                                  </button>
                                ))}
                              </div>

                              <textarea
                                required
                                rows={2}
                                placeholder="Write your experience with this item..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full border border-amber-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-amber-400 bg-white"
                              />

                              <div className="flex gap-2">
                                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-xs">
                                  Submit Review
                                </button>
                                <button type="button" onClick={() => setReviewProductId(null)} className="text-xs font-black text-slate-600 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}

                          {/* Bottom Action Footer */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
                            <div>
                              <span className="text-xs text-slate-500 font-medium">Total Amount: </span>
                              <span className="text-base font-black text-slate-900">ETB {order.totalAmount.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                              <Link
                                to={`/order/${order.orderId}`}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-[#0066D6] to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20"
                              >
                                <Truck size={14} /> Live Track Delivery & Details
                              </Link>
                              <button
                                onClick={() => setSelectedOrderModal({ order, items, payment, delivery })}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl transition-colors"
                              >
                                <Eye size={14} /> Quick View
                              </button>
                            </div>
                          </div>


                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: MY PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Account Profile & Address</h2>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your personal info and delivery preferences.</p>
                    </div>

                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-xs font-black text-[#0066D6] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors">
                        <Edit2 size={14} /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSaveProfile} className="inline-flex items-center gap-1 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-colors">
                          <Check size={14} /> Save Changes
                        </button>
                        <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1 text-xs font-black text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors">
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {profileMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {profileMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <User size={12} className="text-[#0066D6]" /> Full Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
                        />
                      ) : (
                        <p className="text-sm font-black text-slate-800 bg-slate-50/60 p-3 rounded-xl border border-slate-100">{currentUser.name}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail size={12} className="text-[#0066D6]" /> Email Address
                      </label>
                      <p className="text-sm font-black text-slate-800 bg-slate-50/60 p-3 rounded-xl border border-slate-100">{currentUser.email}</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone size={12} className="text-[#0066D6]" /> Contact Phone
                      </label>
                      {editing ? (
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
                        />
                      ) : (
                        <p className="text-sm font-black text-slate-800 bg-slate-50/60 p-3 rounded-xl border border-slate-100">{currentUser.phone || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#0066D6]" /> Primary Delivery Address
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={editAddress}
                          onChange={e => setEditAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
                        />
                      ) : (
                        <p className="text-sm font-black text-slate-800 bg-slate-50/60 p-3 rounded-xl border border-slate-100">{currentUser.address || 'Bole, Addis Ababa'}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>Account Security: <strong className="text-emerald-600">Active & Protected</strong></span>
                    <span>Role: <strong className="text-[#0066D6] uppercase">Customer</strong></span>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* QUICK VIEW ORDER DETAILS MODAL */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedOrderModal(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm transition-colors"
            >
              ✕
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0066D6] px-2.5 py-0.5 rounded-full border border-blue-100">
                  Detailed Receipt
                </span>
                <span className="text-xs text-slate-400 font-bold">{selectedOrderModal.order.orderDate}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                Order #{selectedOrderModal.order.orderId}
              </h3>
            </div>

            {/* Statuses */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Payment Status</p>
                <p className="font-black text-emerald-600 mt-0.5">{selectedOrderModal.payment?.paymentStatus || 'Paid (Chapa)'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Delivery Tracking</p>
                <p className="font-black text-[#0066D6] mt-0.5">{selectedOrderModal.delivery?.deliveryStatus || 'On The Way'}</p>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Itemized Purchased Items</p>
              {selectedOrderModal.items.map(item => {
                const prod = products.find(p => p.productId === item.productId);
                return (
                  <div key={item.itemId} className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-2">
                    <span className="text-slate-800">{prod?.name || 'Product'} × {item.quantity}</span>
                    <span className="text-slate-900 font-black">ETB {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            {/* Address */}
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Truck size={12} className="text-[#0066D6]" /> Shipping Destination
              </p>
              <p className="text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedOrderModal.order.deliveryAddress?.fullName || currentUser.name} • {selectedOrderModal.order.deliveryAddress?.phone || currentUser.phone}
                <br />
                {selectedOrderModal.order.deliveryAddress?.subcity || 'Addis Ababa'}, Woreda {selectedOrderModal.order.deliveryAddress?.woreda || '03'}, House {selectedOrderModal.order.deliveryAddress?.houseNum || '102'}
              </p>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="font-black text-slate-900 text-sm">Grand Total Amount</span>
              <span className="font-black text-[#0066D6] text-lg">ETB {selectedOrderModal.order.totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedOrderModal(null);
                  navigate(`/order/${selectedOrderModal.order.orderId}`);
                }}
                className="w-full bg-[#0066D6] hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                Track Live Delivery & Full Details <ArrowRight size={14} />
              </button>
            </div>


          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
