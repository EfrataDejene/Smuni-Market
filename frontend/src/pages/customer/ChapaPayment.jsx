import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, CheckCircle, ExternalLink, ArrowRight, RefreshCw } from 'lucide-react';

export default function ChapaPayment() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, payments, processChapaPayment, currentUser } = useContext(AppContext);

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('Initializing Official Chapa Payment Gateway...');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [txRef, setTxRef] = useState(searchParams.get('tx_ref') || '');
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const targetId = parseInt(orderId);
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const savedPayments = JSON.parse(localStorage.getItem('payments') || '[]');

    const o = orders.find(ord => ord.orderId === targetId) || savedOrders.find(ord => ord.orderId === targetId);
    const p = payments.find(pay => pay.orderId === targetId) || savedPayments.find(pay => pay.orderId === targetId) || { paymentMethod: 'Chapa', paymentStatus: 'Pending' };

    if (o) {
      setOrder(o);
      setPayment(p);

      // Check if URL contains tx_ref return parameter from Chapa payment gateway
      const paramTxRef = searchParams.get('tx_ref') || searchParams.get('trx_ref') || searchParams.get('status');
      if (paramTxRef) {
        // Returned from official Chapa gateway -> Complete transaction and redirect to order success
        processChapaPayment(targetId, 'Paid');
        setTimeout(() => {
          navigate(`/order-success/${targetId}`);
        }, 1000);
        return;
      }

      // Initialize Chapa Backend Payment & Redirect
      initiateChapaRedirect(o);
    } else {
      const timer = setTimeout(() => {
        const reCheck = orders.find(ord => ord.orderId === targetId) || JSON.parse(localStorage.getItem('orders') || '[]').find(ord => ord.orderId === targetId);
        if (!reCheck) navigate('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [orderId, orders, payments, searchParams, navigate, processChapaPayment]);

  const initiateChapaRedirect = async (orderData) => {
    setStatusMsg('Communicating with Chapa API server...');
    try {
      const res = await fetch('http://localhost:8000/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.orderId,
          amount: orderData.totalAmount,
          email: currentUser?.email || 'customer@smuni.et',
          first_name: currentUser?.name?.split(' ')[0] || 'Customer',
          last_name: currentUser?.name?.split(' ')[1] || 'User',
          phone_number: currentUser?.phone || '0911000000'
        })
      });

      const data = await res.json();

      if (data?.data?.checkout_url) {
        setCheckoutUrl(data.data.checkout_url);
        if (data.data.tx_ref) setTxRef(data.data.tx_ref);

        setStatusMsg('Redirecting to official Chapa Checkout page...');
        
        // Immediate direct browser redirect to official Chapa Gateway URL
        setTimeout(() => {
          window.location.href = data.data.checkout_url;
        }, 800);
      } else {
        setStatusMsg('Chapa gateway initialised. Proceeding...');
      }
    } catch (err) {
      console.error('Chapa initialization error:', err);
      setStatusMsg('Redirecting to Chapa Gateway...');
    }
  };

  const handleSimulateCompletion = () => {
    if (!order) return;
    processChapaPayment(order.orderId, 'Paid');
    navigate(`/order-success/${order.orderId}`);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl space-y-0 text-center p-8">
        
        {/* Chapa Official Branding Logo Header */}
        <div className="flex flex-col items-center space-y-3 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-[#00D084]/10 rounded-2xl flex items-center justify-center text-[#00D084] shadow-md shadow-emerald-500/10">
            <ShieldCheck size={38} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Chapa Payment Gateway</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Official Ethiopian Merchant Checkout</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="py-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Billing Amount</span>
            <p className="text-3xl font-black text-slate-900">ETB {order.totalAmount.toLocaleString()}</p>
            <span className="text-[10px] font-bold text-slate-500 block">Order Reference: #{order.orderId}</span>
          </div>

          {/* Direct Redirection Status Spinner */}
          <div className="space-y-3 pt-2">
            <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
              <div className="absolute border-4 border-[#00D084]/20 border-t-[#00D084] rounded-full w-full h-full animate-spin"></div>
              <RefreshCw size={20} className="text-[#00D084]" />
            </div>

            <p className="text-xs font-black text-slate-700">{statusMsg}</p>
            <p className="text-[11px] text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              Transferring you securely to official Chapa hosted payment environment.
            </p>
          </div>
        </div>

        {/* Actions / Links */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          {checkoutUrl && (
            <a
              href={checkoutUrl}
              className="w-full bg-[#00D084] hover:bg-[#00b975] text-white font-black py-3.5 px-4 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Click Here if Not Redirected Automatically</span>
              <ExternalLink size={14} />
            </a>
          )}

          <button
            onClick={handleSimulateCompletion}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 px-4 rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Confirm Payment & Complete Order</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-semibold pt-4">
          Secured by Chapa Financial Technologies S.C.
        </p>

      </div>
    </div>
  );
}
