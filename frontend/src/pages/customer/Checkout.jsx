import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, Truck, CreditCard, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const { cart, currentUser, checkoutOrder } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/login');
    else if (cart.length === 0) navigate('/cart');
  }, [currentUser, cart, navigate]);

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city] = useState('Addis Ababa');
  const [subcity, setSubcity] = useState('');
  const [woreda, setWoreda] = useState('');
  const [houseNum, setHouseNum] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.price * (1 - (item.discount || 0) / 100);
    return acc + price * item.quantity;
  }, 0);
  const shippingFee = 100;
  const total = subtotal + shippingFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName || !phone || !subcity || !woreda || !houseNum) {
      setErrorMsg('Please complete all delivery address details.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = checkoutOrder({ fullName, phone, city, subcity, woreda, houseNum }, paymentMethod);
      setLoading(false);
      if (res.success) {
        if (paymentMethod === 'Chapa') navigate(`/chapa-payment/${res.orderId}`);
        else navigate(`/order-success/${res.orderId}`);
      } else {
        setErrorMsg(res.message);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft size={16} /> Edit Cart
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Checkout</h1>

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3.5 rounded-lg flex items-center gap-2 font-semibold">
              <ShieldAlert size={18} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping info */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Truck size={18} className="text-[#0066D6]" /> 1. Shipping & Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Customer Full Name</label>
                    <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]" placeholder="Receiver name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Phone</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]" placeholder="+251 9..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                    <input type="text" disabled value={city}
                      className="w-full px-3 py-2 border border-gray-100 bg-gray-50 text-gray-400 rounded-lg text-xs outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Subcity</label>
                    <select required value={subcity} onChange={e => setSubcity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]">
                      <option value="">Select Subcity</option>
                      {['Bole','Yeka','Kirkos','Lideta','Arada','Gullele','Nifas Silk Lafto','Kolfe Keranio','Akaki Kality'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Woreda</label>
                    <input type="text" required value={woreda} onChange={e => setWoreda(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]" placeholder="e.g. 03" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">House Number</label>
                    <input type="text" required value={houseNum} onChange={e => setHouseNum(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]" placeholder="e.g. 452 or New" />
                  </div>
                </div>
              </div>

              {/* Payment selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#0066D6]" /> 2. Select Payment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`border rounded-xl p-4 flex flex-col gap-1.5 cursor-pointer transition ${paymentMethod === 'COD' ? 'border-[#0066D6] bg-blue-50/20 ring-1 ring-[#0066D6]' : 'border-gray-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-4 h-4" />
                      <span className="font-bold text-gray-800 text-xs">Cash on Delivery (COD)</span>
                    </div>
                    <span className="text-[10px] text-gray-400 leading-normal pl-6">Pay cash when our rider delivers your order. Collection is confirmed by the delivery agent.</span>
                  </label>
                  <label className={`border rounded-xl p-4 flex flex-col gap-1.5 cursor-pointer transition ${paymentMethod === 'Chapa' ? 'border-[#0066D6] bg-blue-50/20 ring-1 ring-[#0066D6]' : 'border-gray-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="payment" checked={paymentMethod === 'Chapa'} onChange={() => setPaymentMethod('Chapa')} className="w-4 h-4" />
                      <span className="font-bold text-gray-800 text-xs">Chapa Online Payment</span>
                    </div>
                    <span className="text-[10px] text-gray-400 leading-normal pl-6">Telebirr, CBE Birr, mobile banking, or card. Full Chapa webhook callback verification before marking paid.</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 sticky top-24">
                <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">Order Breakdown</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {cart.map(item => {
                    const price = item.price * (1 - (item.discount || 0) / 100);
                    return (
                      <div key={item.productId} className="flex justify-between items-start text-xs">
                        <span className="text-gray-500 font-semibold max-w-[150px] truncate">{item.name} <strong className="text-gray-400">x{item.quantity}</strong></span>
                        <span className="font-bold text-gray-800">ETB {(price * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400"><span>Subtotal:</span><span>ETB {subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Delivery Fee:</span><span>ETB {shippingFee}</span></div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-sm text-gray-900 pt-1">
                    <span>Total:</span><span className="text-[#0066D6]">ETB {total.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#0066D6] hover:bg-[#0052B4] text-white font-bold py-3 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-300 shadow-md shadow-blue-500/10">
                  {loading ? 'Securing inventory...' : (
                    <><ShieldCheck size={16} /> {paymentMethod === 'Chapa' ? 'Go to Chapa Payment' : 'Place COD Order'}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
