import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, Truck, CreditCard, ShieldAlert, ArrowLeft, Smartphone, Check, Lock, Sparkles, Building2, ChevronRight } from 'lucide-react';

export default function Checkout() {
  const { cart, currentUser, checkoutOrder } = useContext(AppContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || 'customer.smuni@gmail.com');
  const [city] = useState('Addis Ababa');
  const [subcity, setSubcity] = useState('');
  const [woreda, setWoreda] = useState('');
  const [houseNum, setHouseNum] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Chapa'); // Default to Chapa as primary
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate('/login');
    else if (cart.length === 0 && !loading) navigate('/cart');
  }, [currentUser, cart, loading, navigate]);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.price * (1 - (item.discount || 0) / 100);
    return acc + price * item.quantity;
  }, 0);
  const shippingFee = 100;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName || !phone || !subcity || !woreda || !houseNum) {
      setErrorMsg('Please complete all required delivery address fields.');
      return;
    }

    setLoading(true);

    try {
      // 1. Save local order state
      const res = checkoutOrder({ fullName, phone, city, subcity, woreda, houseNum }, paymentMethod);
      
      if (res.success) {
        if (paymentMethod === 'Chapa') {
          // 2. Initialize Chapa Transaction via Backend API
          try {
            const apiRes = await fetch('http://localhost:8000/api/chapa/initialize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: res.orderId,
                amount: total,
                email: (email && email.includes('@')) ? email : 'customer.smuni@gmail.com',
                first_name: fullName.split(' ')[0] || 'Customer',
                last_name: fullName.split(' ')[1] || 'Market',
                phone_number: phone
              })
            });
            const chapaData = await apiRes.json();
            
            if (chapaData?.data?.checkout_url) {
              // Direct browser redirect straight to the official Chapa checkout URL!
              window.location.href = chapaData.data.checkout_url;
              return;
            } else {
              setLoading(false);
              const msg = typeof chapaData?.message === 'string'
                ? chapaData.message
                : (chapaData?.message?.email ? 'Invalid email format. Please enter a valid email address.' : 'Chapa payment initialization failed.');
              setErrorMsg(msg);
            }
          } catch (err) {
            setLoading(false);
            setErrorMsg('Unable to connect to Chapa gateway. Please try again.');
          }
        } else {
          setLoading(false);
          navigate(`/order-success/${res.orderId}`);
        }
      } else {
        setLoading(false);
        setErrorMsg(res.message);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Transaction initialization failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1280px] mx-auto px-4 py-8">
          
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-[#0066D6] transition-colors mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Cart
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0066D6] px-3 py-1 rounded-full border border-blue-100">
                Express Checkout Step 2 of 2
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Order Delivery & Payment
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3.5 py-2 rounded-2xl border border-emerald-200">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Chapa 256-bit Encrypted Checkout</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-xs">
              <ShieldAlert size={18} className="shrink-0" /> {typeof errorMsg === 'string' ? errorMsg : 'Payment initialization error. Please check inputs.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Delivery & Payment Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Section 1: Address Details */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Truck size={18} className="text-[#0066D6]" /> 1. Doorstep Delivery Address (Addis Ababa)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 focus:bg-white"
                      placeholder="Receiver full name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 focus:bg-white"
                      placeholder="+251 9..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Email Address (for Chapa Receipt) *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 focus:bg-white"
                      placeholder="e.g. customer@gmail.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      disabled
                      value={city}
                      className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Subcity *</label>
                    <select
                      required
                      value={subcity}
                      onChange={e => setSubcity(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] bg-slate-50/50 focus:bg-white cursor-pointer"
                    >
                      <option value="">Select Subcity</option>
                      {['Bole','Yeka','Kirkos','Lideta','Arada','Gullele','Nifas Silk Lafto','Kolfe Keranio','Akaki Kality'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Woreda *</label>
                    <input
                      type="text"
                      required
                      value={woreda}
                      onChange={e => setWoreda(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] bg-slate-50/50 focus:bg-white"
                      placeholder="e.g. 03 or Bole Bulbula"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">House / Landmark *</label>
                    <input
                      type="text"
                      required
                      value={houseNum}
                      onChange={e => setHouseNum(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0066D6] bg-slate-50/50 focus:bg-white"
                      placeholder="e.g. House #452 or Near Bole Medhanialem"
                    />
                  </div>

                </div>
              </div>

              {/* Section 2: Payment Method Selection */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <CreditCard size={18} className="text-[#0066D6]" /> 2. Select Payment Method
                  </h3>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock size={10} /> Instant Verification
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Chapa Primary Option */}
                  <label 
                    className={`border-2 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden ${
                      paymentMethod === 'Chapa' 
                        ? 'border-[#00D084] bg-emerald-50/30 ring-2 ring-[#00D084]/20 shadow-md' 
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'Chapa'}
                          onChange={() => setPaymentMethod('Chapa')}
                          className="w-4 h-4 text-[#00D084] focus:ring-[#00D084] cursor-pointer"
                        />
                        <div>
                          <span className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                            Chapa Online Payment
                          </span>
                          <p className="text-[10px] font-bold text-emerald-700 mt-0.5">
                            Telebirr • CBE Birr • M-PESA • Card
                          </p>
                        </div>
                      </div>

                      <span className="bg-[#00D084] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                        RECOMMENDED
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-3 border-t border-slate-100 pt-2">
                      Instant mobile banking payment verification with zero extra hidden fees. Direct receipts.
                    </p>
                  </label>

                  {/* Cash on Delivery (COD) */}
                  <label 
                    className={`border-2 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all ${
                      paymentMethod === 'COD' 
                        ? 'border-[#0066D6] bg-blue-50/30 ring-2 ring-blue-500/20 shadow-md' 
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="w-4 h-4 text-[#0066D6] focus:ring-[#0066D6] cursor-pointer"
                      />
                      <div>
                        <span className="font-black text-slate-900 text-sm">Cash on Delivery (COD)</span>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pay upon package doorstep delivery</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-3 border-t border-slate-100 pt-2">
                      Hand cash to our authorized delivery agent after inspecting item condition.
                    </p>
                  </label>

                </div>
              </div>

            </div>

            {/* Right 4 Cols: Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5 sticky top-24">
                
                <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs text-slate-400 font-extrabold">{cart.length} Items</span>
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => {
                    const price = item.price * (1 - (item.discount || 0) / 100);
                    return (
                      <div key={item.productId} className="flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100 shrink-0" />
                          <div className="truncate">
                            <p className="font-black text-slate-800 truncate">{item.name}</p>
                            <span className="text-[10px] text-slate-400 font-semibold">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 shrink-0">
                          ETB {Math.round(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <hr className="border-slate-100" />

                {/* Costs Breakdown */}
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>ETB {Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Doorstep Express Shipping</span>
                    <span>ETB {shippingFee}</span>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="flex justify-between font-black text-base text-slate-900 pt-1">
                    <span>Total Amount</span>
                    <span className="text-[#E53E3E]">ETB {Math.round(total).toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl cursor-pointer ${
                    paymentMethod === 'Chapa'
                      ? 'bg-[#00D084] hover:bg-[#00b975] text-white shadow-emerald-500/20'
                      : 'bg-[#0066D6] hover:bg-[#0052B4] text-white shadow-blue-500/20'
                  } disabled:opacity-50`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connecting Chapa Gateway...
                    </span>
                  ) : paymentMethod === 'Chapa' ? (
                    <>
                      <ShieldCheck size={18} /> Pay ETB {Math.round(total).toLocaleString()} via Chapa
                    </>
                  ) : (
                    <>
                      <Truck size={18} /> Place Cash on Delivery Order
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 font-semibold">
                  🔒 Safe 256-Bit TLS Encrypted Transaction
                </p>

              </div>
            </div>

          </form>

        </div>
      </div>
      <Footer />
    </div>
  );
}
