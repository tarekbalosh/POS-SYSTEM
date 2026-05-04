'use client';

import React from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { Trash2, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function CartPanel() {
  const { items, removeItem, updateQty, getSubtotal, getTaxAmount, getTotal, discount, setDiscount, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 bg-slate-900/20">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl">🛒</div>
        <p className="text-sm font-medium">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <h2 className="font-bold text-lg">Current Order</h2>
        <button onClick={clearCart} className="text-xs text-rose-500 hover:text-rose-400 font-medium">Clear All</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 group">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-slate-200">{item.name}</span>
              <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-rose-500">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 bg-slate-950 rounded-lg p-1">
                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 hover:text-indigo-400"><Minus size={14}/></button>
                <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 hover:text-indigo-400"><Plus size={14}/></button>
              </div>
              <span className="font-mono text-indigo-400">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Subtotal</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-400">
            <span>Tax (10%)</span>
            <span>${getTaxAmount().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-800">
            <span>Total</span>
            <span className="text-indigo-400">${getTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="bg-slate-800 hover:bg-slate-700 py-4 rounded-xl font-bold text-slate-300 transition-all border border-slate-700 active:scale-95">
            Hold
          </button>
          <Link href="/pos/checkout" className="flex-1">
            <button className="w-full h-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95">
              Checkout <ChevronRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
