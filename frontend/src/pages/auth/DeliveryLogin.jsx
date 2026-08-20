import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Truck, Mail, Lock } from 'lucide-react';

export default function DeliveryLogin() {
  const { loginUser } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fillDemo = () => {
    setEmail('dawit@delivery.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const res = loginUser(email, password);
    if (res.success) {
      if (res.user.role === 'Delivery') {
        navigate('/delivery/dashboard');
      } else {
        setError('This portal is restricted to authorized Delivery Personnel.');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Truck size={22} color="white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-800">
              <span className="text-emerald-600">SMUNI</span>-Delivery
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Delivery Operations Portal
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Sign in to access your assigned delivery runs and collect payments.
          </p>
        </div>

        {/* Demo Quick Fill Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              🚚 Demo Delivery Account
            </span>
            <button
              type="button"
              onClick={fillDemo}
              className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded transition"
            >
              Auto Fill
            </button>
          </div>
          <p className="text-[11px] text-emerald-700 font-mono">
            Email: <strong>dawit@delivery.com</strong> | Password: <strong>password123</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg font-semibold">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Delivery Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Security PIN / Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/10 active:scale-95 mt-4"
          >
            Enter Dashboard
          </button>
        </form>

        <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between text-xs text-gray-500">
          <Link to="/login" className="hover:text-emerald-600 transition-colors">
            Customer Shop
          </Link>
          <Link to="/seller/login" className="hover:text-emerald-600 transition-colors">
            Seller Portal
          </Link>
          <Link to="/admin/login" className="hover:text-emerald-600 transition-colors">
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
