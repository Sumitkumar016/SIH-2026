import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Award,
  FileCheck,
  Fingerprint,
  Landmark,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../auth/mockAuth';

/**
 * LoginPage Component (Route: /login)
 * 
 * Provides:
 * 1. Standard credential form (Email + Plaintext Password)
 * 2. 5 One-Click "Quick Demo Login" buttons connecting to real backend auth
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsRole, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Target route after login (fallback to role default path)
  const fromPath = location.state?.from?.pathname;

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      const destination = fromPath || res.user.defaultPath || '/ministry/overview';
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  const handleQuickLogin = async (demoUser) => {
    setErrorMessage('');
    setEmail(demoUser.email);
    setPassword(demoUser.password);

    const res = await loginAsRole(demoUser);
    if (res.success) {
      const destination = fromPath || res.user.defaultPath || '/ministry/overview';
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Emblem & Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1D9BF0] flex items-center justify-center text-white shadow-card mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#0F1419] tracking-tight">
            MPLADS <span className="text-[#1D9BF0]">SENTINEL</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            AI-Powered Anomaly Detection & Transparency Intelligence Platform
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full bg-sky-50 text-[#1D9BF0] text-[11px] font-semibold border border-sky-100">
            <Sparkles className="w-3 h-3 text-[#1D9BF0]" />
            <span>Smart India Hackathon 2026 Prototype</span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 sm:px-8 border border-[#EFF3F4] rounded-3xl shadow-subtle space-y-6">
          
          {/* Form Header */}
          <div className="pb-3 border-b border-[#EFF3F4]">
            <h2 className="text-base font-bold text-[#0F1419]">Portal Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter authorized credentials or select a Quick Demo role below.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Official Username
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ministry@mplads.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-white text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (e.g. ministry@mplads123)"
                  className="w-full pl-9 pr-10 py-2.5 bg-white text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-4 border-t border-[#EFF3F4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ⚡ Quick Demo One-Click Login
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Backend Auth</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {mockUsers.map((u) => {
                const roleIcons = {
                  ministry: Building,
                  mp: Award,
                  district: FileCheck,
                  state: Landmark,
                  auditor: Fingerprint,
                };
                const RoleIcon = roleIcons[u.role] || User;

                return (
                  <button
                    key={u.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickLogin(u)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-sky-50/60 hover:border-sky-200 transition-all text-left group disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] group-hover:scale-105 transition-transform shadow-2xs">
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors">
                          Login as {u.roleLabel}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                          {u.name} · {u.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1D9BF0] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Launch →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[11px] text-slate-400">
            <span>Role-Based Access Control • Smart India Hackathon 2026</span>
          </div>

        </div>
      </div>
    </div>
  );
}
