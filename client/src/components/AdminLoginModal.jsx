import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock, User, Eye, EyeOff, X, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginModal = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    adminLogin
  } = useStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await adminLogin(username.trim(), password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.message || 'Invalid admin username or password');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#0B0705]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-espresso-900 border border-amberGold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-cream-100 space-y-6 overflow-hidden">
        
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amberGold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-forest-700/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-espresso-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amberGold-500/15 border border-amberGold-500/30 flex items-center justify-center text-amberGold-400 shadow-inner">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 font-bold block">RESTRICTED AREA</span>
              <h2 className="text-xl font-serif font-bold text-cream-100">Admin Portal Login</h2>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAdminLoginModalOpen(false);
              setErrorMsg('');
            }}
            className="p-2 text-cream-100/60 hover:text-cream-100 hover:bg-espresso-800 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Security Subtitle */}
        <p className="text-xs text-cream-200/70 leading-relaxed">
          Please enter your authorized roastery master credentials to access inventory control, sales analytics, and customer fulfillment.
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-red-300 animate-shake">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username / Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-cream-200/80 flex items-center gap-1.5">
              <User size={13} className="text-amberGold-400" />
              <span>Admin Username or Email</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter admin username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#140D0A] border border-espresso-700 focus:border-amberGold-500 rounded-2xl px-4 py-3 text-xs text-cream-100 placeholder:text-cream-100/40 focus:outline-none transition-all shadow-inner focus:ring-1 focus:ring-amberGold-500/50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-cream-200/80 flex items-center gap-1.5">
              <Lock size={13} className="text-amberGold-400" />
              <span>Security Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#140D0A] border border-espresso-700 focus:border-amberGold-500 rounded-2xl pl-4 pr-11 py-3 text-xs text-cream-100 placeholder:text-cream-100/40 focus:outline-none transition-all shadow-inner focus:ring-1 focus:ring-amberGold-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-amberGold-400 hover:text-amberGold-300 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amberGold-500 hover:bg-amberGold-400 text-espresso-900 font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating Admin Session...</span>
            ) : (
              <>
                <KeyRound size={16} />
                <span>Verify & Enter Admin Portal</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-3 border-t border-espresso-800 text-center text-[10px] text-cream-200/50 font-mono">
          🔒 256-Bit Encrypted Admin Control Gate
        </div>

      </div>
    </div>
  );
};
