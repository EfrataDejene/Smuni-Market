import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Shield, Mail, Lock } from 'lucide-react';

export default function AdminLogin() {
  const { loginUser } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const res = loginUser(email, password);
    if (res.success) {
      if (res.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        setError('This login portal is restricted to system Administrators.');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield size={22} color="white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              <span className="text-red-500">SMUNI</span>-Admin
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Enterprise Operations Portal
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Authorized personnel only. Sessions are logged and audited.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg font-semibold">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 pl-10 block w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="System Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 pl-10 block w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-red-500/25 active:scale-95 mt-4"
          >
            Authenticate Admin
          </button>
        </form>

        <div className="border-t border-slate-700 pt-6 mt-6 flex justify-between text-xs text-slate-500">
          <Link to="/login" className="hover:text-red-400 transition-colors">
            Customer Portal
          </Link>
          <Link to="/seller/login" className="hover:text-red-400 transition-colors">
            Seller Portal
          </Link>
          <Link to="/delivery/login" className="hover:text-red-400 transition-colors">
            Delivery Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
