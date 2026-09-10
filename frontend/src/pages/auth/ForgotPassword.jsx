import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff,
  Clock,
  Check,
  Shield,
  Sparkles
} from 'lucide-react';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const navigate = useNavigate();
  const { sendPasswordResetOtp, verifyPasswordResetOtp, resetPasswordWithOtp } = useContext(AppContext);

  // Step 1: Input Gmail & Send OTP
  // Step 2: Input OTP & Click Verify
  // Step 3: (If verified) Input New Password & Confirm Password
  // Step 4: Password Changed Successfully!
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(emailParam);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [verifiedOtp, setVerifiedOtp] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef([]);

  // Auto-focus first OTP digit when entering Step 2
  useEffect(() => {
    if (step === 2 && otpInputRefs.current[0]) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Resend Countdown for Step 2
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // ── Step 1: Send OTP to Gmail ──
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendPasswordResetOtp(cleanEmail);
      if (res.success) {
        setSuccessMsg(`A 6-digit verification code has been dispatched to ${cleanEmail}`);
        setStep(2);
        setResendTimer(45);
        setCanResend(false);
        setOtpValues(['', '', '', '', '', '']);
      } else {
        setError(res.message || 'Could not send verification code. Please try again.');
      }
    } catch (err) {
      setError('Network error. Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Digit Input Handlers ──
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
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

    // Auto-advance to next box
    if (cleanChar && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    if (!canResend || !email) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await sendPasswordResetOtp(email);
      if (res.success) {
        setSuccessMsg('A fresh 6-digit code has been delivered to your Gmail inbox.');
        setResendTimer(45);
        setCanResend(false);
        setOtpValues(['', '', '', '', '', '']);
      } else {
        setError(res.message || 'Failed to resend code.');
      }
    } catch (err) {
      setError('Network error while resending verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP Code ──
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    const fullCode = otpValues.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyPasswordResetOtp(email, fullCode);
      if (res.success) {
        setVerifiedOtp(fullCode);
        setSuccessMsg('Verification code confirmed! Now enter your new password.');
        setStep(3); // Proceed to Step 3 (New Password setup)
      } else {
        setError(res.message || 'Invalid or expired 6-digit verification code. Please check your Gmail or resend.');
      }
    } catch (err) {
      setError('Verification failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Set New Password & Confirm ──
  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please verify both password fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithOtp(email, verifiedOtp || otpValues.join(''), newPassword);
      if (res.success) {
        setStep(4); // Success step
      } else {
        setError(res.message || 'Failed to update password. Please verify your OTP code or request a fresh one.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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

        <Link
          to="/login"
          className="font-bold text-xs text-slate-600 hover:text-[#0066D6] flex items-center gap-1.5 transition px-3 py-1.5 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </header>

      {/* ── Centered Card ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-14">
        <div className="max-w-md w-full">
          
          {/* Multi-Step Visual Progress Stepper */}
          {step < 4 && (
            <div className="mb-5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-black text-slate-500">
                
                {/* Step 1 Pill */}
                <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#0066D6]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step > 1 ? 'bg-emerald-500 text-white' : step === 1 ? 'bg-[#0066D6] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {step > 1 ? <Check size={11} /> : '1'}
                  </span>
                  <span>1. Enter Gmail</span>
                </div>

                <div className={`h-0.5 flex-1 mx-2 rounded ${step > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />

                {/* Step 2 Pill */}
                <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#0066D6]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step > 2 ? 'bg-emerald-500 text-white' : step === 2 ? 'bg-[#0066D6] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {step > 2 ? <Check size={11} /> : '2'}
                  </span>
                  <span>2. Verify OTP</span>
                </div>

                <div className={`h-0.5 flex-1 mx-2 rounded ${step > 2 ? 'bg-emerald-400' : 'bg-slate-200'}`} />

                {/* Step 3 Pill */}
                <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-[#0066D6]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step === 3 ? 'bg-[#0066D6] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    3
                  </span>
                  <span>3. New Password</span>
                </div>

              </div>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/60 space-y-6 relative transition-all">
            
            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── STEP 1: CLIENT GIVES GMAIL & SENDS OTP ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0066D6] border border-blue-200/80 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mx-auto shadow-2xs">
                    <KeyRound size={13} className="text-[#0066D6]" /> Step 1 • Reset Password
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Enter Your Gmail Address
                  </h1>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                    We will dispatch a secure 6-digit OTP code to your Gmail inbox (valid for <strong className="text-slate-700 font-bold">10 minutes</strong>).
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-shake">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span className="font-bold">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#0066D6] to-blue-600 hover:from-[#0052B4] hover:to-blue-700 text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Sending 6-Digit OTP...
                      </>
                    ) : (
                      <>
                        Send Verification Code <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">
                    Remember your password?{' '}
                    <Link to="/login" className="text-[#0066D6] font-black hover:underline">
                      Sign In &rarr;
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── STEP 2: RECEIVE & VERIFY OTP CODE ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0066D6] border border-blue-200/80 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mx-auto shadow-2xs">
                    <Clock size={13} className="text-[#0066D6]" /> Step 2 • Verify 6-Digit Code
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Verify Reset Code
                  </h1>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                    Enter the 6-digit code delivered to <strong className="text-slate-800">{email}</strong>. (Expires in 10 minutes)
                  </p>
                </div>

                {successMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="font-bold">{successMsg}</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-shake">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span className="font-bold">{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  
                  {/* 6 Individual Digit Boxes */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block text-center">
                      6-Digit Security Code
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {otpValues.map((val, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          inputMode="numeric"
                          value={val}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black text-[#0066D6] bg-slate-50 border-2 border-slate-200 focus:border-[#0066D6] focus:bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-2xs"
                        />
                      ))}
                    </div>

                    {/* Resend Timer / Action */}
                    <div className="text-center pt-1">
                      {resendTimer > 0 ? (
                        <span className="text-xs text-slate-400 font-medium">
                          Resend code in <strong className="text-slate-600">{resendTimer}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="text-xs text-[#0066D6] font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <RefreshCw size={12} /> Resend 6-Digit Code
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verify Code Button */}
                  <button
                    type="submit"
                    disabled={loading || otpValues.join('').length < 6}
                    className="w-full bg-gradient-to-r from-[#0066D6] to-blue-600 hover:from-[#0052B4] hover:to-blue-700 text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Verifying Code...
                      </>
                    ) : (
                      <>
                        Verify Code & Proceed <CheckCircle2 size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); setSuccessMsg(''); }}
                    className="text-slate-500 font-semibold hover:text-[#0066D6] transition"
                  >
                    &larr; Change Email
                  </button>
                  <Link to="/login" className="text-[#0066D6] font-bold hover:underline">
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── STEP 3: IF VERIFIED -> ENTER NEW PASSWORD & CONFIRM ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mx-auto shadow-2xs">
                    <ShieldCheck size={13} className="text-emerald-600" /> OTP Verified • Step 3
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Set New Password
                  </h1>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                    Create a strong new password for your account associated with <strong className="text-slate-800">{email}</strong>.
                  </p>
                </div>

                {successMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="font-bold">{successMsg}</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xs animate-shake">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span className="font-bold">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSaveNewPassword} className="space-y-4">
                  
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        New Password
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold">Min 6 characters</span>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066D6] transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0066D6] transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {newPassword === confirmPassword ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Passwords match perfectly
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertCircle size={13} /> Passwords do not match yet
                        </span>
                      )}
                    </div>
                  )}

                  {/* Change Password Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !newPassword || newPassword !== confirmPassword}
                    className="w-full bg-gradient-to-r from-[#0066D6] to-blue-600 hover:from-[#0052B4] hover:to-blue-700 text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Updating Password...
                      </>
                    ) : (
                      <>
                        Change Password <ShieldCheck size={16} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── STEP 4: PASSWORD RESET SUCCESS CONFIRMATION ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="text-center space-y-6 py-4 animate-fadeIn">
                <div className="w-18 h-18 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Password Changed Successfully!
                  </h2>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                    Your account password for <strong className="text-slate-800">{email}</strong> has been securely updated. You can now sign in immediately.
                  </p>
                </div>

                <Link
                  to={`/login?email=${encodeURIComponent(email)}`}
                  className="w-full inline-flex bg-[#0066D6] hover:bg-[#0052B4] text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition-all items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98"
                >
                  Sign In with New Password <ArrowRight size={16} />
                </Link>
              </div>
            )}

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
