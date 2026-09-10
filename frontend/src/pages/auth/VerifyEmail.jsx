import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  BadgeCheck
} from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const roleParam = searchParams.get('role') || 'Customer';
  const reasonParam = searchParams.get('reason') || '';

  const { sendVerificationOtp, verifyEmailOtp } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState(emailParam);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // If redirected from login because unverified, show notice
  useEffect(() => {
    if (reasonParam === 'unverified') {
      setError('Please verify your Gmail address to sign in.');
    }
  }, [reasonParam]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Paste full 6-digit code handling
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpValues];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpValues(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      if (otpInputRefs.current[nextFocus]) {
        otpInputRefs.current[nextFocus].focus();
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, '');
    const newOtp = [...otpValues];
    newOtp[index] = cleanChar;
    setOtpValues(newOtp);

    // Auto move to next input box
    if (cleanChar && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await sendVerificationOtp(email);
      if (res.success) {
        setSuccessMsg('A new 6-digit verification code has been dispatched to your Gmail inbox.');
        setResendTimer(45);
        setCanResend(false);
        setOtpValues(['', '', '', '', '', '']);
      } else {
        setError(res.message || 'Could not send verification code.');
      }
    } catch (err) {
      setError('Could not resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullCode = otpValues.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit verification code sent to your Gmail.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await verifyEmailOtp(email, fullCode);
      if (res.success) {
        if (res.isSeller || roleParam === 'Seller') {
          navigate(`/seller/login?verified=true&email=${encodeURIComponent(email)}`);
        } else {
          // Redirect directly to customer login with verified flag
          navigate(`/login?verified=true&email=${encodeURIComponent(email)}`);
        }
      } else {
        setError(res.message || 'Invalid 6-digit code. Please check your Gmail or request a new code.');
      }
    } catch (err) {
      setError('Verification failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header Navigation */}
      <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition">
          <div className="w-10 h-10 bg-[#0066D6] rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
            SMUNI<span className="text-[#0066D6]">-Market</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="font-black text-xs text-[#0066D6] hover:text-[#0052B4] border border-blue-200 bg-blue-50/70 px-4 py-2 rounded-xl transition shadow-2xs"
        >
          Sign In
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="max-w-lg w-full mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          
          {/* Header Icon & Details */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-[#0066D6] rounded-3xl flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
              <Mail size={32} />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                Email Security Verification
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Check Your Gmail Inbox
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                We sent a 6-digit verification code to <strong className="text-slate-800 font-bold">{email || 'your email'}</strong> (valid for 10 minutes). Please check your inbox or spam folder and enter the code below.
              </p>
            </div>
          </div>

          {/* Direct Gmail Inbox Action Link */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold text-xs">
                G
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">Google Gmail</p>
                <p className="text-[11px] text-slate-500 font-medium">Check incoming verification email</p>
              </div>
            </div>

            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-black text-xs px-3.5 py-2 rounded-xl transition shadow-2xs shrink-0"
            >
              Open Gmail <ExternalLink size={13} />
            </a>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-shake">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {/* 6-Digit OTP Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpInputRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-black rounded-2xl border transition-all duration-200 shadow-2xs focus:outline-none ${
                    digit
                      ? 'border-[#0066D6] bg-blue-50/50 text-[#0066D6] ring-4 ring-blue-500/10'
                      : 'border-slate-300 bg-white text-slate-800 focus:border-[#0066D6] focus:ring-4 focus:ring-blue-500/15'
                  }`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otpValues.join('').length < 6}
              className="w-full bg-[#0066D6] hover:bg-[#0052B4] text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Verifying Code...
                </>
              ) : (
                <>
                  <BadgeCheck size={18} /> Verify Code & Proceed to Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Resend & Back Action */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
            <Link
              to="/register"
              className="hover:text-[#0066D6] transition flex items-center gap-1 font-bold"
            >
              <ArrowLeft size={14} /> Back to Register
            </Link>

            <div>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-[#0066D6] hover:underline font-black flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={13} /> Resend OTP Code
                </button>
              ) : (
                <span className="text-slate-400 font-semibold">
                  Resend code in <strong className="text-slate-700">{resendTimer}s</strong>
                </span>
              )}
            </div>
          </div>

          {/* Trust Guarantee Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Only verified emails are granted access to SMUNI-Market buyer & seller portals.</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 py-6 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} SMUNI-Market Ethiopia. All rights reserved.</p>
      </footer>

    </div>
  );
}
