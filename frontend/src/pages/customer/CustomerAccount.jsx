import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { User, Package, MapPin, Phone, Mail, LogOut, Star, Edit2, Check, X } from 'lucide-react';

function StatusBadge({ label, color }) {
  const colorMap = {
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${colorMap[color] || colorMap.gray}`}>
      {label}
    </span>
  );
}

function getOrderStatusColor(s) {
  if (s === 'Confirmed') return 'blue';
  if (s === 'Cancelled') return 'red';
  return 'yellow';
}
function getPaymentStatusColor(s) {
  if (s === 'Paid') return 'green';
  if (s === 'Refunded') return 'gray';
  if (s === 'Failed') return 'red';
  return 'yellow';
}
function getDeliveryStatusColor(s) {
  if (s === 'Delivered') return 'green';
  if (s === 'Returned') return 'gray';
  if (s === 'Failed Delivery') return 'red';
  if (s === 'On The Way' || s === 'Picked Up') return 'blue';
  return 'yellow';
}

export default function CustomerAccount() {
  const { currentUser, orders, orderItems, payments, deliveryTracking, products, reviews, addReview, logoutUser, updateProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

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

  const handleSaveProfile = () => {
    const res = updateProfile({ name: editName, phone: editPhone, address: editAddress });
    if (res.success) {
      setProfileMsg('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setProfileMsg(''), 2000);
    }
  };

  const handleSubmitReview = (e, productId) => {
    e.preventDefault();
    const res = addReview(productId, reviewRating, reviewComment);
    if (res.success) {
      setReviewMsg('Review submitted!');
      setReviewProductId(null);
      setReviewComment('');
      setReviewRating(5);
    } else {
      setReviewMsg(res.message);
    }
    setTimeout(() => setReviewMsg(''), 2000);
  };

  const tabs = [
    { id: 'orders', label: 'Order History' },
    { id: 'profile', label: 'My Profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center space-y-2">
                <div className="w-16 h-16 bg-blue-100 text-[#0066D6] font-extrabold text-2xl rounded-full flex items-center justify-center mx-auto">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-bold text-gray-800 text-sm">{currentUser.name}</p>
                <p className="text-[10px] text-gray-400">{currentUser.email}</p>
                <span className="inline-block bg-blue-50 text-[#0066D6] text-[10px] px-2 py-0.5 rounded-full font-bold">Customer</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full text-left px-4 py-3 text-xs font-semibold border-b border-gray-100 last:border-0 transition-colors ${
                      activeTab === t.id ? 'bg-blue-50 text-[#0066D6]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  onClick={() => { logoutUser(); navigate('/'); }}
                  className="w-full text-left px-4 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* ORDER HISTORY TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">My Order History</h2>
                  {reviewMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2 rounded-lg font-semibold">{reviewMsg}</div>
                  )}

                  {myOrders.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                      <Package size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="font-bold text-gray-700">No orders yet.</p>
                      <Link to="/products" className="mt-3 inline-block text-xs text-[#0066D6] font-bold hover:underline">Start Shopping</Link>
                    </div>
                  ) : (
                    myOrders.map(order => {
                      const payment = payments.find(p => p.orderId === order.orderId);
                      const delivery = deliveryTracking.find(d => d.orderId === order.orderId);
                      const items = orderItems.filter(oi => oi.orderId === order.orderId);
                      const isDelivered = delivery?.deliveryStatus === 'Delivered';

                      return (
                        <div key={order.orderId} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                          {/* Order Header */}
                          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-gray-100">
                            <div>
                              <p className="text-xs font-bold text-gray-800">Order #{order.orderId}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{order.orderDate}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <StatusBadge label={`Order: ${order.orderStatus}`} color={getOrderStatusColor(order.orderStatus)} />
                              <StatusBadge label={`Payment: ${payment?.paymentStatus || 'Pending'}`} color={getPaymentStatusColor(payment?.paymentStatus)} />
                              <StatusBadge label={`Delivery: ${delivery?.deliveryStatus || 'Awaiting'}`} color={getDeliveryStatusColor(delivery?.deliveryStatus)} />
                            </div>
                          </div>

                          {/* Items */}
                          <div className="space-y-2">
                            {items.map(item => {
                              const prod = products.find(p => p.productId === item.productId);
                              const hasReview = reviews.some(r => r.productId === item.productId && r.userId === currentUser.userId);
                              return (
                                <div key={item.itemId} className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    {prod && (
                                      <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain bg-slate-50 rounded border border-gray-100 p-0.5" />
                                    )}
                                    <div>
                                      <p className="text-xs font-bold text-gray-700">{prod?.name || 'Product'}</p>
                                      <p className="text-[10px] text-gray-400">Qty: {item.quantity} &mdash; ETB {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  {isDelivered && !hasReview && (
                                    <button
                                      onClick={() => setReviewProductId(item.productId)}
                                      className="text-[10px] font-bold text-[#0066D6] hover:underline whitespace-nowrap flex items-center gap-1"
                                    >
                                      <Star size={11} /> Write Review
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Review form inline */}
                          {reviewProductId && items.some(i => i.productId === reviewProductId) && (
                            <form onSubmit={(e) => handleSubmitReview(e, reviewProductId)} className="bg-slate-50 border border-gray-200 rounded-lg p-4 space-y-3">
                              <p className="text-xs font-bold text-gray-700">Submit Review for: {products.find(p => p.productId === reviewProductId)?.name}</p>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(s => (
                                  <button key={s} type="button" onClick={() => setReviewRating(s)}>
                                    <Star size={20} fill={s <= reviewRating ? '#FFB800' : 'none'} className="stroke-yellow-400" />
                                  </button>
                                ))}
                              </div>
                              <textarea
                                required
                                rows={3}
                                placeholder="Share your experience..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none focus:border-[#0066D6]"
                              />
                              <div className="flex gap-2">
                                <button type="submit" className="bg-[#0066D6] text-white text-xs font-bold px-4 py-1.5 rounded-lg">Submit</button>
                                <button type="button" onClick={() => setReviewProductId(null)} className="text-xs font-bold text-gray-500 px-4 py-1.5 rounded-lg border border-gray-200">Cancel</button>
                              </div>
                            </form>
                          )}

                          {/* Footer */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
                            <span className="text-gray-400">Payment via: <strong className="text-gray-600">{payment?.paymentMethod}</strong></span>
                            <span className="font-bold text-gray-900">Total: ETB {order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h2 className="text-sm font-bold text-gray-900">Account Profile</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs font-bold text-[#0066D6] hover:underline">
                        <Edit2 size={13} /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSaveProfile} className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline">
                          <Check size={13} /> Save
                        </button>
                        <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline">
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {profileMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2 rounded-lg font-semibold">{profileMsg}</div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><User size={11} /> Full Name</label>
                        {editing ? (
                          <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]" />
                        ) : (
                          <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Mail size={11} /> Email</label>
                        <p className="text-sm font-semibold text-gray-800">{currentUser.email}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Phone size={11} /> Phone</label>
                        {editing ? (
                          <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]" />
                        ) : (
                          <p className="text-sm font-semibold text-gray-800">{currentUser.phone || '—'}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><MapPin size={11} /> Address</label>
                        {editing ? (
                          <input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]" />
                        ) : (
                          <p className="text-sm font-semibold text-gray-800">{currentUser.address || '—'}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400">Member since: <strong className="text-gray-600">{currentUser.createdAt}</strong></p>
                      <p className="text-[10px] text-gray-400 mt-1">Account status: <strong className="text-emerald-600">{currentUser.status}</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
