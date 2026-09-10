import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Store, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Layers, 
  FileText, 
  RefreshCw, 
  Check, 
  AlertCircle
} from 'lucide-react';

const ADDIS_SUBCITIES = [
  'Bole',
  'Kirkos',
  'Yeka',
  'Arada',
  'Lideta',
  'Nifas Silk-Lafto',
  'Gullele',
  'Akaki Kality',
  'Kolfe Keranio',
  'Lemi Kura',
  'Addis Ketema'
];

const SELLER_CATEGORIES = [
  'Electronics & Gadgets',
  'Fashion & Apparel',
  'Traditional & Artisanal Crafts',
  'Health & Beauty',
  'Home & Kitchen',
  'Groceries & Spices',
  'Books & Stationery',
  'Sports & Fitness'
];

const PAYOUT_METHODS = [
  'Telebirr (Ethio Telecom)',
  'Commercial Bank of Ethiopia (CBE)',
  'Dashen Bank / Amole',
  'Awash Bank',
  'Bank of Abyssinia'
];

export default function Register() {
  const { registerUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Steps: 1 = Role Select, 2 = Registration Form
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Customer'); // 'Customer' or 'Seller'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    subcity: 'Bole',
    woreda: '',
    houseNum: '',
    // Seller specific fields
    storeName: '',
    businessType: 'Electronics & Gadgets',
    tinNumber: '',
    payoutMethod: 'Telebirr (Ethio Telecom)',
    payoutAccount: ''
  });

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Password Strength Calculation
  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  // Step 2 Submit: Validate & Trigger Registration + Redirect to Verify Email
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const formattedAddress = `${formData.subcity}, ${formData.woreda ? formData.woreda + ', ' : ''}${formData.houseNum}`;
      
      const payload = {
        name: role === 'Seller' ? (formData.storeName || formData.name) : formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
        address: formattedAddress,
        storeName: formData.storeName,
        businessType: formData.businessType,
        tinNumber: formData.tinNumber,
        payoutMethod: formData.payoutMethod,
        payoutAccount: formData.payoutAccount
      };

      const res = await registerUser(payload);
      if (res.success) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&role=${role}`);
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── Top Header Navigation ── */}
      <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition">
          <div className="w-10 h-10 bg-[#0066D6] rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
            SMUNI<span className="text-[#0066D6]">-Market</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-slate-500 font-medium">Already have an account?</span>
          <Link
            to="/login"
            className="font-black text-[#0066D6] hover:text-[#0052B4] border border-blue-200 hover:border-blue-300 bg-blue-50/70 px-4 py-2 rounded-xl transition shadow-2xs"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        
        {/* Step Indicator */}
        <div className="max-w-md mx-auto mb-10">
          <div className="grid grid-cols-3 items-center relative">
            
            {/* Step 1: Role */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                step >= 1 ? 'bg-[#0066D6] text-white shadow-md shadow-blue-500/20 scale-105' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {step > 1 ? <Check size={18} strokeWidth={3} /> : '1'}
              </div>
              <span className={`text-[11px] font-black mt-2 ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                Account Role
              </span>
            </div>

            {/* Connecting Bar 1-2 */}
            <div className={`h-1 -mt-5 transition-all ${step >= 2 ? 'bg-[#0066D6]' : 'bg-slate-200'}`} />

            {/* Step 2: Information */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                step >= 2 ? 'bg-[#0066D6] text-white shadow-md shadow-blue-500/20 scale-105' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                2
              </div>
              <span className={`text-[11px] font-black mt-2 ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                {role === 'Seller' ? 'Store Details' : 'Details'}
              </span>
            </div>

            {/* Connecting Bar 2-3 */}
            <div className="h-1 -mt-5 bg-slate-200" />

            {/* Step 3: Gmail Verification */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black bg-slate-100 text-slate-400 border border-slate-200">
                3
              </div>
              <span className="text-[11px] font-black mt-2 text-slate-400">
                Gmail OTP
              </span>
            </div>

          </div>
        </div>

        {/* ── Form Card Container ── */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs relative">
          
          {/* ── STEP 1: ROLE SELECTION ── */}
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0066D6] bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full">
                  Step 1 of 3: Choose Account Type
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Join Ethiopia's Premier Multi-Vendor Marketplace
                </h1>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Select whether you're joining to shop verified goods or opening a seller store to reach millions of Ethiopian buyers.
                </p>
              </div>

              {/* Role Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* 1. Customer Option Card */}
                <div
                  onClick={() => handleRoleSelect('Customer')}
                  className="group relative bg-white border-2 border-slate-200 hover:border-[#0066D6] rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between space-y-6 active:scale-[0.99]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 bg-blue-50 text-[#0066D6] group-hover:bg-[#0066D6] group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-inner">
                        <User size={28} />
                      </div>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
                        Personal Account
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0066D6] transition-colors">
                        Customer / Buyer
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Shop thousands of authentic electronics, apparel, and traditional Ethiopian crafts with reliable 24h delivery.
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 font-semibold border-t border-slate-100 pt-4">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>24h Express Doorstep Delivery in Addis Ababa</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>Chapa, Telebirr & CBE Escrow Protected</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>Real-Time SMS & Email Order Tracking</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-slate-100 group-hover:bg-[#0066D6] text-slate-700 group-hover:text-white font-black text-xs py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    Continue as Customer <ArrowRight size={15} />
                  </button>
                </div>

                {/* 2. Seller Option Card */}
                <div
                  onClick={() => handleRoleSelect('Seller')}
                  className="group relative bg-white border-2 border-slate-200 hover:border-indigo-600 rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between space-y-6 active:scale-[0.99]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-inner">
                        <Store size={28} />
                      </div>
                      <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider">
                        Business & Merchant
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Seller / Merchant Partner
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        Open your official marketplace store, list unlimited products, and accept direct bank / Telebirr payouts.
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 font-semibold border-t border-slate-100 pt-4">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-indigo-600 shrink-0" />
                        <span>Zero upfront setup or listing fees</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-indigo-600 shrink-0" />
                        <span>Live Inventory, Variant & Analytics Portal</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-indigo-600 shrink-0" />
                        <span>Instant Telebirr & CBE merchant payouts</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-slate-100 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white font-black text-xs py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    Open Merchant Store <ArrowRight size={15} />
                  </button>
                </div>

              </div>

              {/* Trust Badge Footer */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span>Verified Ethiopian E-Commerce Standard</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
                  <span>🔒 256-Bit SSL Encrypted</span>
                  <span>⚡ Instant Gmail OTP Verification</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: REGISTRATION DETAILS FORM ── */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Back & Role Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                    aria-label="Back to role selection"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      {role === 'Seller' ? (
                        <>
                          <Store size={22} className="text-indigo-600" /> Register Merchant Store
                        </>
                      ) : (
                        <>
                          <User size={22} className="text-[#0066D6]" /> Create Customer Account
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {role === 'Seller'
                        ? 'Fill in your business details to configure your vendor profile'
                        : 'Enter your personal details for doorstep delivery'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-shake">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span className="font-bold">{error}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmitRegistration} className="space-y-6">
                
                {/* ── SELLER SPECIFIC SECTION ── */}
                {role === 'Seller' && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2 font-black text-indigo-950 text-xs uppercase tracking-wider">
                      <Building2 size={16} className="text-indigo-600" /> Store & Business Profile
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Store / Shop Name */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Official Store Name *
                        </label>
                        <div className="relative">
                          <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            name="storeName"
                            required
                            placeholder="e.g. Habesha Tech & Electronics"
                            value={formData.storeName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Business Primary Category */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Primary Selling Department *
                        </label>
                        <div className="relative">
                          <Layers size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs appearance-none"
                          >
                            {SELLER_CATEGORIES.map((cat, idx) => (
                              <option key={idx} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Business TIN Number */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Tax Identification (TIN) <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            name="tinNumber"
                            placeholder="e.g. TIN-009847231"
                            value={formData.tinNumber}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Payout Method Preference */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Payout Account Method *
                        </label>
                        <div className="relative">
                          <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <select
                            name="payoutMethod"
                            value={formData.payoutMethod}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs appearance-none"
                          >
                            {PAYOUT_METHODS.map((method, idx) => (
                              <option key={idx} value={method}>{method}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ── PERSONAL & CONTACT SECTION ── */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Full Name / Legal Contact */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        {role === 'Seller' ? 'Merchant Contact Person Full Name *' : 'Full Name *'}
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. Abebe Bikila"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066D6] transition shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Gmail / Email Address */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Gmail / Email Address *
                        </label>
                        <span className="text-[10px] text-[#0066D6] font-bold">Will receive OTP</span>
                      </div>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="e.g. yourname@gmail.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066D6] transition shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Phone Number (Telebirr / Mobile) *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+251 911 234 567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066D6] transition shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* City & Subcity */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Location / Addis Ababa Subcity *
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          name="subcity"
                          value={formData.subcity}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066D6] transition shadow-2xs appearance-none"
                        >
                          {ADDIS_SUBCITIES.map((sc, idx) => (
                            <option key={idx} value={sc}>{sc} Subcity</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Street / Building Address */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      {role === 'Seller' ? 'Physical Shop / Office Address Details *' : 'Specific Delivery Address / Landmarks *'}
                    </label>
                    <input
                      type="text"
                      name="houseNum"
                      required
                      placeholder={role === 'Seller' ? 'e.g. Bole Medhanialem Mall, 3rd floor, Room #305' : 'e.g. Near Edna Mall, House #420, Woreda 03'}
                      value={formData.houseNum}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066D6] transition shadow-2xs"
                    />
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    
                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Create Password *
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          required
                          placeholder="At least 6 characters"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066D6] transition shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="space-y-1 pt-1">
                          <div className="flex gap-1 h-1.5">
                            {[1, 2, 3, 4].map(idx => (
                              <div
                                key={idx}
                                className={`flex-1 rounded-full transition-all ${
                                  idx <= strength.score ? strength.color : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 flex justify-between">
                            <span>Password Strength:</span>
                            <span className="font-black text-slate-800">{strength.label}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          required
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066D6] transition shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="termsConsent"
                    required
                    defaultChecked
                    className="mt-1 w-4 h-4 rounded text-[#0066D6] focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="termsConsent" className="text-xs text-slate-600 font-medium leading-relaxed">
                    I agree to the <span className="text-[#0066D6] font-bold hover:underline cursor-pointer">SMUNI-Market Terms of Service</span> and acknowledge that my Gmail address will be verified via a 6-digit OTP security code.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md cursor-pointer ${
                    role === 'Seller'
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                      : 'bg-[#0066D6] hover:bg-[#0052B4] shadow-blue-500/20'
                  } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Registering Account & Sending OTP...
                    </>
                  ) : (
                    <>
                      Proceed to Gmail OTP Verification <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

        </div>

      </main>

      {/* ── Minimal Trust Footer ── */}
      <footer className="w-full border-t border-slate-200/80 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SMUNI-Market Ethiopia. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <Link to="/" className="hover:text-[#0066D6]">Home</Link>
            <span>•</span>
            <Link to="/products" className="hover:text-[#0066D6]">Catalog</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-[#0066D6]">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
