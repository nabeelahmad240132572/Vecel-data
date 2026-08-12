import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Truck, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const REQUIRED_USERNAME = 'DESCONENGINEERINGLIMITED#123';
const REQUIRED_PASSWORD = 'DESCON@0908';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both User Name and Password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (username.trim() === REQUIRED_USERNAME && password === REQUIRED_PASSWORD) {
        localStorage.setItem('descon_fleet_auth', 'true');
        localStorage.setItem('descon_fleet_user', username.trim());
        onLoginSuccess();
      } else {
        setError('Invalid User Name or Password. Please try again.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background visual accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid line pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#18181b]/90 border border-zinc-700/80 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
        {/* Descon Fleet Header Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 ring-4 ring-amber-500/20">
            <Truck className="w-9 h-9 text-zinc-950 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] uppercase tracking-widest mb-2 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Portal Access
          </div>

          <h1 className="text-xl font-black uppercase tracking-wider text-zinc-100">
            Descon Engineering
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Fleet Maintenance & Cost Management Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3.5 rounded-xl flex items-center gap-2 font-mono animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* User Name Field */}
          <div>
            <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
              User Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter User Name"
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl pl-10 pr-3 py-3 outline-none transition placeholder-zinc-600"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter Password"
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl pl-10 pr-10 py-3 outline-none transition placeholder-zinc-600"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-3.5 px-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer font-sans flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In To Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-zinc-800/80 text-center text-[10px] font-mono text-zinc-500">
          Protected System • Descon Engineering Limited © 2026
        </div>
      </div>
    </div>
  );
};
