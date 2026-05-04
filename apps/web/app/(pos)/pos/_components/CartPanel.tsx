import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

export function CartPanel() {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-100 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ShoppingCart size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Current Order</h2>
        </div>
        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <Trash2 size={20} />
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4 group">
             <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0 border border-slate-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
             </div>
             <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">Double Wagyu Burger</h4>
                <p className="text-xs text-slate-500 font-medium">$18.50 × 1</p>
                
                <div className="mt-3 flex items-center gap-3">
                   <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                      <Minus size={14} />
                   </button>
                   <span className="text-sm font-bold w-4 text-center">1</span>
                   <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                      <Plus size={14} />
                   </button>
                </div>
             </div>
             <div className="text-right">
                <p className="font-bold text-slate-900 text-sm">$18.50</p>
             </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="text-slate-900 font-bold font-mono">$37.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Service Tax (10%)</span>
            <span className="text-slate-900 font-bold font-mono">$3.70</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-slate-200">
            <span className="text-lg font-extrabold text-slate-900">Total</span>
            <span className="text-2xl font-extrabold text-indigo-600 font-mono tracking-tighter">$40.70</span>
          </div>
        </div>

        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4">
          <CreditCard size={22} />
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
