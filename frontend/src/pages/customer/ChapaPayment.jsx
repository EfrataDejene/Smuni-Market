import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { CreditCard, CheckCircle, Smartphone, ShieldCheck, X } from 'lucide-react';

export default function ChapaPayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, payments, processChapaPayment } = useContext(AppContext);

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [method, setMethod] = useState('telebirr'); // telebirr, cbe_birr, card
  
  // input states
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // input, processing, success

  useEffect(() => {
    const o = orders.find(ord => ord.orderId === parseInt(orderId));
    const p = payments.find(pay => pay.orderId === parseInt(orderId) && pay.paymentMethod === 'Chapa');
    if (o && p) {
      setOrder(o);
      setPayment(p);
    } else {
      navigate('/cart');
    }
  }, [orderId, orders, payments, navigate]);

  if (!order || !payment) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    setStep('processing');

    // Simulate Chapa server-to-server callback verification (SDS rule integration)
    setTimeout(() => {
      processChapaPayment(order.orderId, 'Paid');
      setStep('success');
      setLoading(false);
    }, 2500);
  };

  const handleCancel = () => {
    processChapaPayment(order.orderId, 'Failed');
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#00D084] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={24} />
            <span className="font-extrabold text-lg tracking-tight">Chapa Checkout</span>
          </div>
          <button onClick={handleCancel} className="hover:bg-black/10 p-1.5 rounded transition">
            <X size={18} />
          </button>
        </div>

        {/* Processing State */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute border-4 border-[#00D084]/20 border-t-[#00D084] rounded-full w-full h-full animate-spin"></div>
              <CreditCard size={32} className="text-[#00D084]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-800 text-sm">Verifying Chapa Transaction</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Running server-to-server webhook callbacks and signature audits before marking order paid.
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">Chapa Payment Verified</h3>
              <p className="text-xs text-gray-500">
                Payment reference updated successfully. Your invoice and receipts have been registered.
              </p>
            </div>
            <button
              onClick={() => navigate(`/order-success/${order.orderId}`)}
              className="w-full bg-[#00D084] hover:bg-[#00b975] text-white font-bold py-2.5 px-4 rounded-lg text-xs transition"
            >
              View Invoice Receipt
            </button>
          </div>
        )}

        {/* Input Details state */}
        {step === 'input' && (
          <form onSubmit={handlePay} className="p-6 space-y-6">
            {/* Amount Banner */}
            <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 text-center">
              <span className="text-xs text-gray-400 font-semibold uppercase">Total Billing Amount</span>
              <p className="text-2xl font-black text-slate-800 mt-1">ETB {order.totalAmount.toLocaleString()}</p>
              <span className="text-[10px] text-gray-400 block mt-1">Reference: TXN-CHAPA-{order.orderId}</span>
            </div>

            {/* Channels tab */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('telebirr')}
                  className={`border rounded-lg p-2.5 flex flex-col items-center gap-1.5 transition ${
                    method === 'telebirr' ? 'border-[#00D084] bg-emerald-50/20 text-[#00D084]' : 'border-gray-200 text-gray-500'
                  }`}
                >
                  <Smartphone size={16} />
                  <span className="text-[10px] font-bold">Telebirr</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('cbe_birr')}
                  className={`border rounded-lg p-2.5 flex flex-col items-center gap-1.5 transition ${
                    method === 'cbe_birr' ? 'border-[#00D084] bg-emerald-50/20 text-[#00D084]' : 'border-gray-200 text-gray-500'
                  }`}
                >
                  <Smartphone size={16} />
                  <span className="text-[10px] font-bold">CBE Birr</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`border rounded-lg p-2.5 flex flex-col items-center gap-1.5 transition ${
                    method === 'card' ? 'border-[#00D084] bg-emerald-50/20 text-[#00D084]' : 'border-gray-200 text-gray-500'
                  }`}
                >
                  <CreditCard size={16} />
                  <span className="text-[10px] font-bold">Card</span>
                </button>
              </div>
            </div>

            {/* Input Form based on channel */}
            {method === 'card' ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#00D084]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#00D084]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#00D084]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Mobile Number (Telebirr/CBE)</label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white focus-within:border-[#00D084] transition">
                  <span className="bg-slate-50 px-3 py-2 text-xs text-gray-500 font-bold border-r border-gray-200 flex items-center">
                    +251
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs outline-none bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3.5 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00D084] hover:bg-[#00b975] text-white font-bold py-3 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-emerald-500/10"
              >
                <ShieldCheck size={16} /> Pay Securely
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-white hover:bg-slate-50 text-gray-500 border border-gray-200 font-bold py-2.5 px-4 rounded-lg text-xs transition-colors active:scale-95 text-center block"
              >
                Cancel Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
