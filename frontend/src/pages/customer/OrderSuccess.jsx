import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CheckCircle, FileText, Printer, ClipboardList, Clock, Truck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, orderItems, payments, products, deliveryTracking, clearCart } = useContext(AppContext);

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const clearedRef = useRef(false);

  // Clear cart exactly once when landing on OrderSuccess
  useEffect(() => {
    if (!clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [clearCart]);

  useEffect(() => {
    const o = orders.find(ord => ord.orderId === parseInt(orderId));
    const oi = orderItems.filter(item => item.orderId === parseInt(orderId));
    const p = payments.find(pay => pay.orderId === parseInt(orderId));
    const d = deliveryTracking.find(del => del.orderId === parseInt(orderId));

    if (o) {
      setOrder(o);
      setItems(oi);
      setPayment(p);
      setDelivery(d);
    } else {
      navigate('/');
    }
  }, [orderId, orders, orderItems, payments, deliveryTracking, navigate]);

  // Trigger navigation when countdown hits 0
  useEffect(() => {
    if (countdown === 0) {
      navigate('/account');
    }
  }, [countdown, navigate]);

  // 5-second auto redirect countdown ticker
  useEffect(() => {
    if (!order) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[840px] mx-auto px-4 py-8 space-y-6">
          
          {/* 5-second Auto-Redirect Alert Banner */}
          <div className="bg-gradient-to-r from-[#0066D6] to-blue-700 text-white rounded-3xl p-5 shadow-xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg">
                ⏱️
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight flex items-center gap-2">
                  <span>Order Placement Confirmed!</span>
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Auto Redirecting in {countdown}s
                  </span>
                </h4>
                <p className="text-xs text-blue-100 font-medium">
                  We are automatically transferring you to your My Account & Orders dashboard.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/account')}
              className="bg-white hover:bg-blue-50 text-[#0066D6] font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Go to My Orders Now</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Success Banner Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-500/20">
              <CheckCircle size={36} strokeWidth={2.5} />
            </div>
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                Payment & Order Completed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Thank You for Your Order!
              </h1>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mt-1 font-medium">
                Order Reference <strong className="text-slate-900">#{order.orderId}</strong> has been registered. Items are now being prepared for express delivery.
              </p>
            </div>
          </div>

          {/* Status Tracker Systems */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock size={18} className="text-[#0066D6]" /> Order Status Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Order Status */}
              <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">1. Order Status</span>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Merchant approval state</p>
                </div>
                <div className="mt-3">
                  <span className={`inline-block text-xs font-black px-3 py-1 rounded-xl ${
                    order.orderStatus === 'Confirmed'
                      ? 'bg-blue-100 text-[#0066D6]'
                      : order.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">2. Payment Status</span>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Chapa / Settlement state</p>
                </div>
                <div className="mt-3">
                  <span className={`inline-block text-xs font-black px-3 py-1 rounded-xl ${
                    payment?.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : payment?.paymentStatus === 'Refunded'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {payment ? payment.paymentStatus : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Delivery Status */}
              <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">3. Delivery Status</span>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Courier tracking state</p>
                </div>
                <div className="mt-3">
                  <span className={`inline-block text-xs font-black px-3 py-1 rounded-xl ${
                    delivery?.deliveryStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-700'
                      : delivery?.deliveryStatus === 'Assigned'
                      ? 'bg-blue-100 text-[#0066D6]'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {delivery ? delivery.deliveryStatus : 'Awaiting Rider'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Invoice Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-black text-slate-900 tracking-tight">SMUNI-MARKET OFFICIAL RECEIPT</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Date: {order.orderDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-[#0066D6]">Order #{order.orderId}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Method: {payment?.paymentMethod}</p>
              </div>
            </div>

            {/* Address */}
            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl space-y-1 border border-slate-150">
              <p className="font-black text-slate-800 mb-1 flex items-center gap-1.5"><Truck size={15} className="text-[#0066D6]" /> Delivery Destination</p>
              <p className="font-medium text-slate-700">{order.deliveryAddress}</p>
            </div>

            {/* Itemized list */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Itemized Summary</p>
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {items.map((item) => {
                  const prod = products.find(p => p.productId === item.productId) || {};
                  return (
                    <div key={item.itemId} className="flex justify-between items-center py-3 text-xs">
                      <div>
                        <p className="font-black text-slate-800">{prod.name || 'Marketplace Item'}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quantity: {item.quantity} units</p>
                      </div>
                      <span className="font-black text-slate-900">ETB {Math.round(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Costs Total */}
            <div className="border-t border-slate-100 pt-4 flex flex-col items-end text-xs space-y-1.5 font-bold">
              <div className="flex justify-between w-full max-w-[220px] text-slate-500">
                <span>Items Subtotal:</span>
                <span>ETB {Math.round(order.totalAmount - 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[220px] text-slate-500">
                <span>Shipping Fee:</span>
                <span>ETB 100</span>
              </div>
              <hr className="border-slate-100 w-full max-w-[220px]" />
              <div className="flex justify-between w-full max-w-[220px] font-black text-sm text-slate-900 pt-1">
                <span>Grand Total:</span>
                <span className="text-[#0066D6]">ETB {Math.round(order.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/order/${order.orderId}`}
              className="w-full sm:w-auto bg-gradient-to-r from-[#0066D6] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-3 px-6 rounded-2xl text-xs transition text-center shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck size={15} /> Track Live Delivery Progress
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-6 rounded-2xl text-xs transition text-center shadow-md cursor-pointer"
            >
              Continue Shopping
            </Link>
            <Link
              to="/account"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black py-3 px-6 rounded-2xl text-xs transition text-center shadow-xs cursor-pointer"
            >
              My Account
            </Link>
          </div>


        </div>
      </div>
      <Footer />
    </div>
  );
}
