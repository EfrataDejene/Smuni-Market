import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Briefcase, Mail, Lock, User, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function SellerLogin() {
  const { loginUser, registerUser } = useContext(AppContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const fillDemo = () => {
    setEmail('habesha@seller.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegistering) {
      if (!businessName || !email || !password || !phone || !address) {
        setError('Please fill in all fields.');
        return;
      }
      const res = registerUser({
        name: businessName,
        email,
        password,
        phone,
        address,
        role: 'Seller'
      });
      if (res.success) {
        setSuccess('Application submitted! Your seller profile is pending Administrator approval.');
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
        if (res.user.role === 'Seller') {
          navigate('/seller/dashboard');
        } else {
          setError('This login is for sellers only. Please use the appropriate login portal.');
        }
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Briefcase size={22} color="white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-800">
              <span className="text-indigo-600">SMUNI</span>-Seller
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRegistering ? 'Apply as Seller' : 'Seller Business Portal'}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Or{' '}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }}
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none underline"
            >
              {isRegistering ? 'already registered? Sign in' : 'register your store'}
            </button>
          </p>
        </div>

        {/* Demo Quick Fill Box */}
        {!isRegistering && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                💼 Demo Seller Account
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded transition"
              >
                Auto Fill
              </button>
            </div>
            <p className="text-[11px] text-indigo-700 font-mono">
              Email: <strong>habesha@seller.com</strong> | Password: <strong>password123</strong>
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm px-4 py-4 rounded-lg flex items-start gap-2.5">
            <CheckCircle size={20} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Application Received</p>
              <p className="text-xs text-indigo-700 mt-1">{success}</p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              {/* Business Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Business / Store Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  placeholder="Business Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <textarea
                  placeholder="Store / Warehouse Location (Addis Ababa, Bole, etc.)"
                  value={address}
                  rows={2}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Business Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors shadow-md shadow-indigo-500/10 active:scale-95 mt-4"
          >
            {isRegistering ? 'Submit Application' : 'Seller Login'}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between text-xs text-gray-500">
          <Link to="/login" className="hover:text-indigo-600 transition-colors">
            Customer Shop &rarr;
          </Link>
          <Link to="/delivery/login" className="hover:text-indigo-600 transition-colors">
            Delivery Dashboard &rarr;
          </Link>
          <Link to="/admin/login" className="hover:text-indigo-600 transition-colors">
            Admin Panel &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
