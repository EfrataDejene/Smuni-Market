import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CheckCircle, FileText, Printer, ClipboardList, Clock, Truck, ShieldCheck } from 'lucide-react';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, orderItems, payments, products, deliveryTracking } = useContext(AppContext);

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState(null);
  const [delivery, setDelivery] = useState(null);

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

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[800px] mx-auto px-4 py-8 space-y-6">
          {/* Success Banner */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle size={28} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Your order <strong className="text-gray-800">#{order.orderId}</strong> was placed successfully. You can track its processing and delivery updates below or inside your account dashboard.
            </p>
          </div>

          {/* SDS Status Tracker (3 Systems Kept Separate) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 flex items-center gap-2">
              <Clock size={18} className="text-[#0066D6]" /> Status Operations Tracker
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Order Status */}
              <div className="border border-gray-100 bg-slate-50 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">1. Order Status</span>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">Main business approval state</p>
                </div>
                <div className="mt-3.5">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    order.orderStatus === 'Confirmed'
                      ? 'bg-blue-100 text-blue-700'
                      : order.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="border border-gray-100 bg-slate-50 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">2. Payment Status</span>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">Transaction settlement state</p>
                </div>
                <div className="mt-3.5">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    payment?.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : payment?.paymentStatus === 'Refunded'
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {payment ? payment.paymentStatus : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Delivery Status */}
              <div className="border border-gray-100 bg-slate-50 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">3. Delivery Status</span>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">Physical product location state</p>
                </div>
                <div className="mt-3.5">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    delivery?.deliveryStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-700'
                      : delivery?.deliveryStatus === 'Returned'
                      ? 'bg-slate-100 text-slate-700'
                      : delivery?.deliveryStatus === 'Failed Delivery'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {delivery ? delivery.deliveryStatus : 'Awaiting Assignment'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Receipt */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <div>
                <p className="text-xs font-bold text-gray-800">SMUNI-MARKET INVOICE</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Date: {order.orderDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#0066D6]">Order Receipt #{order.orderId}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Payment: {payment?.paymentMethod}</p>
              </div>
            </div>

            {/* Address */}
            <div className="text-xs text-gray-600 bg-slate-50 p-4 rounded-xl space-y-1">
              <p className="font-bold text-gray-800 mb-1 flex items-center gap-1"><Truck size={14} /> Shipping Location Details</p>
              <p>{order.deliveryAddress}</p>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Itemized summary</p>
              <div className="divide-y divide-gray-100">
                {items.map((item) => {
                  const prod = products.find(p => p.productId === item.productId) || {};
                  return (
                    <div key={item.itemId} className="flex justify-between items-center py-2.5 text-xs">
                      <div>
                        <p className="font-bold text-gray-800">{prod.name || 'Purchased Product'}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Quantity: {item.quantity} units</p>
                      </div>
                      <span className="font-bold text-gray-700">ETB {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-150 pt-4 flex flex-col items-end text-xs space-y-1.5">
              <div className="flex justify-between w-full max-w-[200px] text-gray-400">
                <span>Total Items Cost:</span>
                <span>ETB {(order.totalAmount - 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[200px] text-gray-400">
                <span>Shipping Fee:</span>
                <span>ETB 100</span>
              </div>
              <hr className="border-gray-100 w-full max-w-[200px]" />
              <div className="flex justify-between w-full max-w-[200px] font-bold text-sm text-gray-900">
                <span>Grand Total:</span>
                <span className="text-[#0066D6]">ETB {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/products"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition text-center"
            >
              Continue Marketplace Shopping
            </Link>
            <Link
              to="/account"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-gray-700 border border-gray-250 font-bold py-2.5 px-6 rounded-lg text-xs transition text-center shadow-xs"
            >
              Go to Account Dashboard
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
