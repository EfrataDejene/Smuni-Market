import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Package, Truck, CheckCircle2, Clock, MapPin, Phone, Mail, User,
  ArrowLeft, RefreshCw, Printer, ExternalLink, ShieldCheck, DollarSign,
  AlertTriangle, Navigation, Star, Store, Sparkles, ChevronRight, Copy, Check
} from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    orders,
    orderItems,
    payments,
    deliveryTracking,
    products,
    users,
    updateDeliveryStatus,
    assignDeliveryPerson
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [liveOrder, setLiveOrder] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const orderIdNum = parseInt(id, 10);

  // Live real-world fetch function from backend API with AppContext fallback
  const fetchLiveOrder = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/orders/${orderIdNum}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          const o = data.order;
          // Format backend data
          const mapped = {
            orderId: o.id,
            userId: o.user_id,
            customerName: o.customer ? o.customer.name : (o.delivery_address?.split(',')[0] || 'Customer'),
            customerPhone: o.customer ? o.customer.phone : '',
            customerEmail: o.customer ? o.customer.email : '',
            deliveryAddress: o.delivery_address || 'Addis Ababa, Ethiopia',
            orderDate: o.created_at ? new Date(o.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
            orderTime: o.created_at ? new Date(o.created_at).toLocaleTimeString() : '10:00 AM',
            orderStatus: o.order_status || 'Confirmed',
            totalAmount: parseFloat(o.total_amount || 0),
            subtotal: parseFloat(o.total_amount || 0),
            shippingFee: 100,
            items: (o.items || []).map(i => ({
              itemId: i.id,
              productId: i.product_id,
              quantity: i.quantity,
              price: parseFloat(i.unit_price),
              product: i.product || products.find(p => p.productId === i.product_id)
            })),
            payment: o.payments && o.payments.length > 0 ? {
              paymentMethod: o.payments[0].payment_method,
              paymentStatus: o.payments[0].payment_status,
              transactionReference: o.payments[0].transaction_reference,
              amount: parseFloat(o.payments[0].amount || 0),
            } : payments.find(p => p.orderId === orderIdNum) || { paymentMethod: 'COD', paymentStatus: 'Pending', amount: o.total_amount },
            delivery: o.delivery ? {
              trackingId: o.delivery.id,
              orderId: o.id,
              deliveryPersonId: o.delivery.delivery_person_id,
              deliveryStatus: o.delivery.delivery_status || 'Assigned',
              deliveryDate: o.delivery.delivery_date,
              notes: o.delivery.notes,
              deliveryPerson: o.delivery.delivery_person
            } : deliveryTracking.find(dt => dt.orderId === orderIdNum) || {
              deliveryStatus: 'Assigned',
              deliveryPersonId: null,
              notes: 'Awaiting courier assignment'
            }
          };
          setLiveOrder(mapped);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend single order fetch failed, resolving from context:', e);
    }

    // Fallback: Resolve dynamically from AppContext & mock tables
    const foundOrder = orders.find(o => o.orderId === orderIdNum);
    if (foundOrder) {
      const items = orderItems.filter(oi => oi.orderId === orderIdNum).map(i => ({
        ...i,
        product: products.find(p => p.productId === i.productId)
      }));
      const payment = payments.find(p => p.orderId === orderIdNum) || { paymentMethod: 'COD', paymentStatus: 'Pending', amount: foundOrder.totalAmount };
      const tracking = deliveryTracking.find(dt => dt.orderId === orderIdNum) || { deliveryStatus: 'Assigned', deliveryPersonId: null, notes: 'Awaiting dispatch' };
      const customer = users.find(u => u.userId === foundOrder.userId);
      const deliveryPerson = users.find(u => u.userId === tracking.deliveryPersonId || u.id === tracking.deliveryPersonId);

      setLiveOrder({
        ...foundOrder,
        customerName: foundOrder.customerName || customer?.name || 'Customer',
        customerPhone: foundOrder.customerPhone || customer?.phone || '+251 911 000 000',
        customerEmail: foundOrder.customerEmail || customer?.email || '',
        items,
        payment,
        delivery: {
          ...tracking,
          deliveryPerson
        }
      });
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLiveOrder();
  }, [orderIdNum, orders, orderItems, payments, deliveryTracking, products, users]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        <Header />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#0066D6] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-bold text-sm">Fetching real-time live order & delivery data...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!liveOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        <Header />
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Package size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500">We could not locate Order #{id}. Please verify the order number.</p>
          <Link to="/" className="inline-block bg-[#0066D6] text-white font-bold text-xs px-5 py-2.5 rounded-xl">
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const deliveryStatus = liveOrder.delivery?.deliveryStatus || 'Assigned';
  const driver = liveOrder.delivery?.deliveryPerson || users.find(u => u.userId === liveOrder.delivery?.deliveryPersonId || u.id === liveOrder.delivery?.deliveryPersonId);
  const deliveryAgents = users.filter(u => u.role === 'Delivery');

  // Parse Driver vehicle details
  let driverZone = 'Addis Ababa';
  let driverVehicle = 'Motorbike';
  let driverPlate = 'AA-2-84920';
  if (driver?.address) {
    const parts = driver.address.split('|').map(s => s.trim());
    parts.forEach(p => {
      if (p.startsWith('Zone:')) driverZone = p.replace('Zone:', '').trim();
      else if (p.startsWith('Vehicle:')) driverVehicle = p.replace('Vehicle:', '').trim();
      else if (p.startsWith('Plate:')) driverPlate = p.replace('Plate:', '').trim();
    });
  }

  // Delivery Stages Definition
  const deliverySteps = [
    {
      id: 1,
      title: 'Order Confirmed',
      desc: 'Order placed & inventory reserved',
      done: true,
      time: liveOrder.orderDate || 'Today'
    },
    {
      id: 2,
      title: 'Courier Assigned',
      desc: driver ? `Assigned to ${driver.name}` : 'Awaiting dispatch assignment',
      done: Boolean(liveOrder.delivery?.deliveryPersonId),
      time: driver ? 'Dispatched' : 'Pending'
    },
    {
      id: 3,
      title: 'Picked Up',
      desc: 'Courier collected package from seller hub',
      done: ['Picked Up', 'On The Way', 'Delivered'].includes(deliveryStatus),
      time: ['Picked Up', 'On The Way', 'Delivered'].includes(deliveryStatus) ? 'En Route to Hub' : '--'
    },
    {
      id: 4,
      title: 'Out for Delivery',
      desc: 'Driver is on the way to your doorstep',
      done: ['On The Way', 'Delivered'].includes(deliveryStatus),
      time: deliveryStatus === 'Delivered' ? 'Completed' : deliveryStatus === 'On The Way' ? 'Live on Road' : '--'
    },
    {
      id: 5,
      title: 'Delivered & Completed',
      desc: liveOrder.payment?.paymentMethod === 'COD' ? 'Delivered & Cash on Delivery Verified' : 'Package successfully delivered',
      done: deliveryStatus === 'Delivered',
      failed: deliveryStatus === 'Failed Delivery',
      time: deliveryStatus === 'Delivered' ? (liveOrder.delivery?.deliveryDate ? new Date(liveOrder.delivery.deliveryDate).toLocaleDateString() : 'Today') : '--'
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStatusChange = async (newStatus) => {
    await updateDeliveryStatus(liveOrder.orderId, newStatus, `Updated via Order Detail Page by ${currentUser?.name || 'Admin'}`);
    setStatusMsg(`Status updated to "${newStatus}"!`);
    fetchLiveOrder();
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleDriverChange = async (newDriverId) => {
    const dId = parseInt(newDriverId, 10);
    if (dId) {
      await assignDeliveryPerson(liveOrder.orderId, dId);
      setStatusMsg(`Order assigned to courier #${dId}!`);
      fetchLiveOrder();
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const isPrivileged = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Delivery');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-800">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1240px] mx-auto px-4 py-8 space-y-6">
          
          {/* Breadcrumbs & Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <button
                onClick={() => navigate(-1)}
                className="hover:text-slate-900 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <ChevronRight size={14} className="text-slate-300" />
              <span>Orders</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-900 font-mono font-black">#ORD-{liveOrder.orderId}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchLiveOrder}
                disabled={refreshing}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
                title="Fetch latest tracking and payment sync"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin text-[#0066D6]' : ''} />
                <span>{refreshing ? 'Syncing...' : 'Live Sync'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
              >
                {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedLink ? 'Copied!' : 'Share Link'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Printer size={13} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>

          {statusMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {statusMsg}
            </div>
          )}

          {/* ─── Hero Order Summary Banner ─────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-xl shadow-2xs">
                    #ORD-{liveOrder.orderId}
                  </span>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    deliveryStatus === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : deliveryStatus === 'Failed Delivery'
                        ? 'bg-red-500/20 text-red-300 border-red-400/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span>Live Status: {deliveryStatus}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Placed on {liveOrder.orderDate} at {liveOrder.orderTime || '10:30 AM'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {deliveryStatus === 'Delivered' ? 'Delivered & Completed' : deliveryStatus === 'On The Way' ? 'Package is On The Way!' : 'Order is Being Processed'}
                </h1>

                <p className="text-xs text-slate-300 max-w-xl">
                  {deliveryStatus === 'Delivered'
                    ? 'Package was safely delivered to the destination address. Thank you for shopping with SMUNI-Market.'
                    : deliveryStatus === 'On The Way'
                      ? `Courier ${driver?.name || 'Driver'} is currently in transit with your order.`
                      : 'We have registered your order. Real-time updates will reflect here as your package moves across dispatch stages.'}
                </p>
              </div>

              {/* Amount & Fast Info Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:min-w-[240px] text-right lg:text-right flex lg:flex-col justify-between items-center lg:items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Total Order Amount</p>
                  <p className="text-2xl font-black text-white mt-0.5">ETB {liveOrder.totalAmount.toLocaleString()}</p>
                </div>
                <div className="mt-2">
                  <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    liveOrder.payment?.paymentStatus === 'Paid'
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  }`}>
                    {liveOrder.payment?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid (Chapa)'} • {liveOrder.payment?.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Role Control Bar (Admin & Driver Quick Actions) ────────────────── */}
          {isPrivileged && (
            <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-orange-950 font-bold">
                <Sparkles className="text-orange-600 shrink-0" size={16} />
                <span>
                  Admin & Logistics Dispatch Controller (Role: <span className="font-black text-orange-600">{currentUser.role}</span>)
                </span>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                {/* Driver Selector */}
                {currentUser.role === 'Admin' && (
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-slate-500">Driver:</span>
                    <select
                      value={liveOrder.delivery?.deliveryPersonId || ''}
                      onChange={e => handleDriverChange(e.target.value)}
                      className="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-white outline-none focus:border-orange-500"
                    >
                      <option value="">Select Delivery Courier</option>
                      {deliveryAgents.map(d => (
                        <option key={d.userId || d.id} value={d.userId || d.id}>
                          {d.name} ({d.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status Changer */}
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-slate-500">Update Status:</span>
                  <select
                    value={deliveryStatus}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-white outline-none focus:border-orange-500"
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Failed Delivery">Failed Delivery</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ─── Real-Time Delivery Tracking Stepper ──────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Live Delivery Progress</h3>
                <p className="text-xs text-slate-400 font-medium">Real-time status synced with courier telemetry</p>
              </div>
              <span className="text-xs font-bold text-[#0066D6] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                ⚡ Live Tracking
              </span>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {deliverySteps.map((step, idx) => {
                const isCurrent = step.done && (!deliverySteps[idx + 1] || !deliverySteps[idx + 1].done);
                return (
                  <div
                    key={step.id}
                    className={`relative rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                      step.failed
                        ? 'bg-red-50/60 border-red-200'
                        : step.done
                          ? 'bg-emerald-50/50 border-emerald-200/80 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-100 opacity-60'
                    } ${isCurrent ? 'ring-2 ring-emerald-500/30' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 ${
                        step.failed
                          ? 'bg-red-500 text-white border-red-600'
                          : step.done
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        {step.failed ? '✕' : step.done ? '✓' : step.id}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{step.time}</span>
                    </div>

                    <div>
                      <p className={`text-xs font-black ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                        {step.desc}
                      </p>
                    </div>

                    {isCurrent && (
                      <div className="pt-2 border-t border-emerald-200/60">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" /> Current Stage
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Main Content Grid: Items & Courier/Destination Details ────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Purchased Items Breakdown */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Purchased Items ({liveOrder.items?.length || 0})
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">Verified Merchant Fulfilled</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {liveOrder.items && liveOrder.items.map((item, idx) => {
                    const prod = item.product || products.find(p => p.productId === item.productId);
                    const seller = users.find(u => u.userId === prod?.sellerId);
                    return (
                      <div key={item.itemId || idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                            {prod?.image ? (
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                            ) : (
                              <Package className="text-slate-400" size={24} />
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/product/${prod?.productId || item.productId}`}
                              className="font-black text-sm text-slate-900 hover:text-[#0066D6] transition-colors line-clamp-1"
                            >
                              {prod?.name || `Product #${item.productId}`}
                            </Link>
                            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                              <Store size={12} className="text-slate-400" /> Merchant: {seller?.name || 'Habesha Verified Seller'}
                            </p>
                            <p className="text-xs text-slate-400 font-bold mt-1">
                              Unit Price: ETB {(item.price || prod?.price || 0).toLocaleString()} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right sm:text-right shrink-0">
                          <p className="text-sm font-black text-slate-900">
                            ETB {((item.price || prod?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            In Stock
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Breakdown Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3 text-xs font-semibold">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Financial Breakdown</h4>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Items Total</span>
                  <span className="font-bold text-slate-900">ETB {(liveOrder.subtotal || liveOrder.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Doorstep Delivery Dispatch Fee</span>
                  <span className="font-bold text-emerald-600">Free / Standard ETB 0</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Protection & Escrow Fee</span>
                  <span className="font-bold text-slate-900">ETB 0.00</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-black text-sm text-slate-900">Grand Total</span>
                  <span className="font-black text-xl text-[#0066D6]">ETB {liveOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Courier, Address, & Payment Details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 1. Assigned Delivery Driver Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Assigned Courier</span>
                  <span className="bg-orange-50 text-orange-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-orange-200">
                    Fleet Driver
                  </span>
                </div>

                {driver ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm leading-snug">{driver.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">SMUNI Logistics Partner</p>
                        <div className="flex items-center gap-1 text-amber-500 font-black text-[11px] mt-0.5">
                          <Star size={12} className="fill-amber-400" /> 4.9 Rating
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 font-medium text-slate-600">
                      <p className="flex items-center justify-between">
                        <span className="text-slate-400 font-normal">Vehicle:</span>
                        <span className="font-bold text-slate-800">{driverVehicle} ({driverPlate})</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-400 font-normal">Operating Zone:</span>
                        <span className="font-bold text-slate-800">{driverZone}</span>
                      </p>
                    </div>

                    <a
                      href={`tel:${driver.phone || '+251 911 000 000'}`}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Phone size={14} /> Call Driver ({driver.phone || '+251 911 000 000'})
                    </a>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-2 text-xs">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Clock size={16} />
                    </div>
                    <p className="font-black text-amber-900">Awaiting Courier Assignment</p>
                    <p className="text-amber-700 text-[11px]">The logistics admin is dispatching the nearest driver in your area.</p>
                  </div>
                )}
              </div>

              {/* 2. Destination Address Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Shipping Destination</span>
                  <MapPin size={15} className="text-red-500" />
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-black text-slate-900 text-sm">{liveOrder.customerName}</p>
                  <p className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" /> {liveOrder.customerPhone || '+251 911 000 000'}
                  </p>
                  <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {liveOrder.deliveryAddress}
                  </p>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(liveOrder.deliveryAddress || 'Addis Ababa')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066D6] hover:underline pt-1"
                  >
                    <Navigation size={13} /> View on Google Maps GPS
                  </a>
                </div>
              </div>

              {/* 3. Payment Method Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Payment & Security</span>
                  <ShieldCheck size={16} className="text-emerald-600" />
                </div>

                <div className="space-y-2 text-xs font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Method:</span>
                    <span className="font-bold text-slate-900">
                      {liveOrder.payment?.paymentMethod === 'COD' ? '💵 Cash on Delivery (COD)' : '💳 Chapa Online Payment'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={`font-black ${liveOrder.payment?.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {liveOrder.payment?.paymentStatus === 'Paid' ? '● Verified Paid' : '○ Pending Collection'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono text-[11px] text-slate-600">
                      {liveOrder.payment?.transactionReference || `TXN-SMUNI-${liveOrder.orderId}`}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
