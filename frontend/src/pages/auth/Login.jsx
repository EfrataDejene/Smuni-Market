import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Mail, Lock, User, Phone, MapPin, ShoppingBag, Sparkles } from 'lucide-react';

export default function Login() {
  const { loginUser, registerUser } = useContext(AppContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const fillDemo = () => {
    setEmail('abebe@gmail.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegistering) {
      if (!name || !email || !password || !phone || !address) {
        setError('Please fill in all fields.');
        return;
      }
      const res = registerUser({ name, email, password, phone, address, role: 'Customer' });
      if (res.success) {
        setSuccess('Registration successful! Please login.');
        setIsRegistering(false);
        setEmail(email);
        setPassword('');
      } else {
        setError(res.message);
      }
    } else {
      if (!email || !password) {
        setError('Please enter email and password.');
        return;
      }
      const res = loginUser(email, password);
      if (res.success) {
        if (res.user.role === 'Admin') navigate('/admin/dashboard');
        else if (res.user.role === 'Seller') navigate('/seller/dashboard');
        else if (res.user.role === 'Delivery') navigate('/delivery/dashboard');
        else navigate('/');
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#0066D6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShoppingBag size={22} color="white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-800">
              SMUNI<span className="text-[#0066D6]">-Market</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {isRegistering ? 'Create Customer Account' : 'Sign In to Your Account'}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {isRegistering
              ? 'Join Ethiopia’s premier online marketplace'
              : 'Access your shopping cart, order history and profile'}
          </p>
        </div>

        {/* Demo Quick Fill Box */}
        {!isRegistering && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0066D6]" /> Demo Customer Account
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] bg-[#0066D6] hover:bg-[#0052B4] text-white font-bold px-2.5 py-1 rounded transition"
              >
                Auto Fill
              </button>
            </div>
            <p className="text-[11px] text-blue-700 font-mono">
              Email: <strong>abebe@gmail.com</strong> | Password: <strong>password123</strong>
            </p>
          </div>
        )}

        <div className="flex border-b border-gray-200 text-sm font-semibold">
          <button
            type="button"
            className={`flex-1 pb-3 text-center transition-colors ${
              !isRegistering
                ? 'border-b-2 border-[#0066D6] text-[#0066D6]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => {
              setIsRegistering(false);
              setError('');
              setSuccess('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 pb-3 text-center transition-colors ${
              isRegistering
                ? 'border-b-2 border-[#0066D6] text-[#0066D6]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => {
              setIsRegistering(true);
              setError('');
              setSuccess('');
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-lg font-semibold">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0066D6] focus:border-[#0066D6]"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number (+251...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0066D6] focus:border-[#0066D6]"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <textarea
                  placeholder="Delivery Address (Subcity, Woreda, House No.)"
                  value={address}
                  rows={2}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0066D6] focus:border-[#0066D6]"
                />
              </div>
            </>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0066D6] focus:border-[#0066D6]"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0066D6] focus:border-[#0066D6]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0066D6] hover:bg-[#0052B4] text-white font-semibold py-3 px-4 rounded-lg text-xs transition-colors shadow-md shadow-blue-500/10 active:scale-95 mt-4"
          >
            {isRegistering ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-6 flex justify-between text-[11px] text-gray-500 font-semibold">
          <Link to="/seller/login" className="hover:text-[#0066D6] transition-colors">
            Seller Portal &rarr;
          </Link>
          <Link to="/delivery/login" className="hover:text-[#0066D6] transition-colors">
            Delivery Portal &rarr;
          </Link>
          <Link to="/admin/login" className="hover:text-[#0066D6] transition-colors">
            Admin Portal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
