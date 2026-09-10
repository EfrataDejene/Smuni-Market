import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  Mail, 
  Lock, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Store, 
  Truck, 
  Shield, 
  User,
  Sparkles,
  RefreshCw,
  Layers
} from 'lucide-react';

export default function Login() {
  const { loginUser } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Read URL query parameters for verified state
  useEffect(() => {
    const verifiedParam = searchParams.get('verified');
    const emailParam = searchParams.get('email');
    const roleParam = searchParams.get('role');
    if (emailParam) {
      setEmail(emailParam);
    }
    if (verifiedParam === 'true') {
      if (roleParam === 'Seller') {
        setSuccess('Your Gmail address has been verified! Your seller merchant application is pending administrator review.');
      } else {
        setSuccess('Your Gmail address has been verified successfully! You can now sign in.');
      }
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setLoading(true);
    const res = loginUser(email, password);
    setLoading(false);

    if (res.success) {
      // Central unified automatic routing based on user's registered role
      if (res.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'Seller') {
        navigate('/seller/dashboard');
      } else if (res.user.role === 'Delivery') {
        navigate('/delivery/dashboard');
      } else {
        navigate('/');
      }
    } else if (res.unverified) {
      setError(res.message);
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(email)}&reason=unverified`);
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/60 to-blue-50/30 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans relative overflow-x-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/40 via-blue-50/20 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* ── Top Navigation Bar ── */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition group">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#0066D6] to-blue-500 rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
            SMUNI<span className="text-[#0066D6]">-Market</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-slate-500 font-medium">
            Don't have an account?
          </span>
          <Link
            to="/register"
            className="font-black text-xs text-[#0066D6] hover:text-white hover:bg-[#0066D6] border border-blue-200 bg-blue-50/70 px-4 py-2 rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* ── Centered Universal Login Card ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-md w-full">
          
          {/* Card Wrapper */}
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/60 space-y-6 relative transition-all animate-fadeIn">
            
            {/* Header / Central Portal Pill */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0066D6] border border-blue-200/80 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mx-auto shadow-2xs">
                <ShieldCheck size={13} className="text-[#0066D6]" /> Secure Account Sign In
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sign In to SMUNI-Market
              </h1>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                Enter your verified Gmail address and password to access your account
              </p>
            </div>

            {/* Success Banner */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-slideDown">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-bold">{success}</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-shake">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Gmail / Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066D6] transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066D6] transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0066D6] focus:ring-blue-500 border-slate-300 transition cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
                <Link
                  to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className="text-xs text-[#0066D6] font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0066D6] to-blue-600 hover:from-[#0052B4] hover:to-blue-700 text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Portal <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Redirect */}
            <div className="text-center pt-1 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-[#0066D6] font-black hover:underline">
                  Create new account &rarr;
                </Link>
              </p>
            </div>

          </div>

          {/* Security & Ethiopian Trust Guarantee */}
          <div className="text-center mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>🇪🇹 Addis Ababa, Ethiopia</span>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-slate-200/80 py-6 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} SMUNI-Market Ethiopia. All rights reserved.</p>
      </footer>

    </div>
  );
}
