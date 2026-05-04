'use client';

import React, { useState } from 'react';
import { ShoppingBag, Lock, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Sign in successful');
      router.push('/pos');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-200">
            <ShoppingBag size={32} strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-black text-slate-900 tracking-tight">
          Restaurant Portal
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-400 uppercase tracking-widest">
          Secure Terminal Access
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow-[0_30px_100px_rgba(0,0,0,0.04)] sm:rounded-[3rem] sm:px-12 border border-slate-100">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-slate-900 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@restaurant.com"
                  className="block w-full pl-12 pr-4 py-5 border border-slate-50 rounded-2xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-slate-900 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-5 border border-slate-50 rounded-2xl bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-200 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-slate-400 cursor-pointer">
                  Stay Signed In
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-black text-slate-900 hover:opacity-70 transition-opacity">
                  Help?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-3 py-5 px-4 border border-transparent rounded-2xl shadow-2xl shadow-slate-200 text-sm font-black text-white bg-slate-900 hover:bg-black disabled:opacity-50 transition-all hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Initialize POS
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
