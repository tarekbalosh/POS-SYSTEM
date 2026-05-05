'use client';

import React from 'react';
import { useKitchenSocket } from '@/lib/hooks/useKitchenSocket';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function KitchenPage() {
  const { orders, socket } = useKitchenSocket('demo-tenant'); // Hardcoded for demo

  const getTimerColor = (minutes: number) => {
    if (minutes < 5) return 'text-emerald-500';
    if (minutes < 15) return 'text-amber-500';
    return 'text-rose-500';
  };

  const markReady = (orderId: string, itemId: string) => {
    socket?.emit('order:item:ready', { orderId, itemId });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8 overflow-hidden flex flex-col font-sans">
      <header className="flex justify-between items-center mb-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-indigo-500 uppercase italic">Kitchen Display System</h1>
          <p className="text-slate-500 font-medium">Live Order Stream • Station 01</p>
        </div>
        <div className="flex gap-8 items-center bg-slate-950/80 px-8 py-4 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Queue Status</span>
            <span className="text-2xl font-mono font-bold text-emerald-400">{orders.length} ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8">
        {orders.map((order) => {
          const minutesElapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
          
          return (
            <div key={order.id} className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
              <div className="p-5 bg-indigo-600/10 border-b border-slate-800 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Table {order.tableNumber || 'N/A'}</span>
                  <span className="text-2xl font-black italic">#{order.id.slice(-4)}</span>
                </div>
                <div className={`flex items-center gap-2 font-mono font-bold text-xl ${getTimerColor(minutesElapsed)}`}>
                  <Clock size={20} /> {minutesElapsed}m
                </div>
              </div>

              <div className="p-6 flex-1 space-y-4">
                <ul className="space-y-4">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="group flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-bold text-sm">{item.quantity}x</span>
                          <span className={`text-lg font-bold ${item.status === 'READY' ? 'line-through text-slate-600' : 'text-slate-100'}`}>
                            {item.name}
                          </span>
                        </div>
                        {item.notes && <p className="text-xs text-rose-400 mt-1 italic ml-10">&quot;{item.notes}&quot;</p>}
                      </div>
                      {item.status !== 'READY' && (
                        <button 
                          onClick={() => markReady(order.id, item.id)}
                          className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white p-2 rounded-xl transition-all border border-emerald-500/20"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-950/80 flex gap-2">
                <div className="flex-1 text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2 pl-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {order.type}
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3 rounded-2xl text-sm transition-all border border-slate-700 active:scale-95">
                  Recall
                </button>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20 py-40">
             <div className="w-24 h-24 border-4 border-dashed border-slate-500 rounded-full animate-spin-slow mb-8" />
             <p className="text-2xl font-black uppercase tracking-widest italic">All orders cleared</p>
          </div>
        )}
      </div>
    </div>
  );
}
