'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Save, X, Info } from 'lucide-react';

export function IngredientForm({ onClose }: { onClose?: () => void }) {
  return (
    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white max-w-2xl mx-auto">
      <CardHeader className="bg-slate-900 text-white p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl">
               <Package size={20} />
             </div>
             <CardTitle className="text-xl font-black tracking-tight">New Ingredient</CardTitle>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <form className="space-y-8">
          {/* Main Grid: Stacks on mobile, 2 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name - Full width on all screens */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ingredient Name</label>
              <input 
                type="text" 
                placeholder="e.g. Wagyu Beef Patty"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
              />
            </div>

            {/* Category - 1 col */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900 appearance-none">
                <option>Meat & Poultry</option>
                <option>Vegetables</option>
                <option>Dairy</option>
                <option>Bakery</option>
              </select>
            </div>

            {/* Unit - 1 col */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Measurement Unit</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900 appearance-none">
                <option>Kilograms (KG)</option>
                <option>Grams (G)</option>
                <option>Liters (L)</option>
                <option>Pieces (PCS)</option>
              </select>
            </div>

            {/* Stock Levels - 2 cols on desktop */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Opening Stock</label>
              <input 
                type="number" 
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-rose-400 uppercase tracking-widest">Minimum Threshold</label>
              <input 
                type="number" 
                placeholder="0.00"
                className="w-full bg-rose-50/30 border border-rose-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
             <Info className="text-indigo-600 shrink-0" size={20} />
             <p className="text-xs text-indigo-700 font-medium leading-relaxed">
               Setting a minimum threshold will trigger automatic alerts in the KDS and Dashboard when stock drops below this level.
             </p>
          </div>

          {/* Action Buttons - Stacked on Mobile, Row on Desktop */}
          <div className="flex flex-col-reverse md:flex-row gap-4 pt-4">
            <button 
              type="button"
              className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Ingredient
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
