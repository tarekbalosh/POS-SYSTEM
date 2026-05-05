'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { useMenuStore } from '@/lib/stores/menuStore';
import { useSettingsStore } from '@/lib/stores/settingsStore';
import {
  ShoppingCart, Trash2, Plus, Minus, CreditCard, RefreshCw,
  LogOut, Home, Settings, Menu, X, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function POSPage() {
  const { items, addItem, removeItem, updateQty, getTotal, getSubtotal, clearCart } = useCartStore();
  const { menuItems } = useMenuStore();
  const settings = useSettingsStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [showInvoice, setShowInvoice] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSyncing(false);
    toast.success('Data synchronized successfully');
  };

  const handleCompleteOrder = async () => {
    if (items.length === 0) return;

    const subtotal = getSubtotal();
    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + tax;
    const { tableId, orderType } = useCartStore.getState();

    const orderData = {
      items: [...items],
      subtotal,
      tax,
      total,
      tableId,
      orderType,
      date: new Date().toLocaleString(),
      orderNumber: Math.floor(1000 + Math.random() * 9000)
    };

    const promise = new Promise((resolve) => setTimeout(() => {
      setLastOrder(orderData);
      clearCart();
      setShowInvoice(true);
      resolve({ name: 'Order' });
    }, 1500));

    toast.promise(promise, {
      loading: 'Processing payment...',
      success: 'Payment successful!',
      error: 'Payment failed',
    });
    setIsMobileCartOpen(false);
  };

  if (!mounted) return null;

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-[100dvh] bg-[#fafafa] text-slate-900 overflow-hidden font-sans flex-col md:flex-row">

      {/* Invoice Modal Overlay */}
      {showInvoice && lastOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            {/* Receipt Header */}
            <div className="p-10 bg-slate-50 border-b border-slate-100 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-xl">P</div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">{settings.restaurantName}</h3>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-widest">
                    {lastOrder.orderType === 'DINE_IN' ? 'Eat In' : 'Takeaway'}
                  </span>
                  {lastOrder.tableId && (
                    <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-widest">
                      Table {lastOrder.tableId}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">Official Receipt • #{lastOrder.orderNumber}</p>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="space-y-4">
                {lastOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex gap-4 items-center">
                      <span className="font-mono text-slate-400 text-xs">x{item.quantity}</span>
                      <span className="font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-dashed border-slate-200 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>SUBTOTAL</span>
                  <span className="font-mono">${lastOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>VAT ({settings.taxRate}%)</span>
                  <span className="font-mono">${lastOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-slate-900 pt-4">
                  <span className="tracking-tighter">TOTAL PAID</span>
                  <span className="font-mono tracking-tighter">${lastOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{lastOrder.date}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Thank you for dining with us!</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button onClick={() => window.print()} className="bg-white hover:bg-slate-100 text-slate-900 font-black py-4 rounded-2xl border border-slate-200 transition-all active:scale-95 text-xs uppercase tracking-widest">
                Print Receipt
              </button>
              <button onClick={() => setShowInvoice(false)} className="bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-xl shadow-slate-200">
                New Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Ultra Minimal */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-24 bg-white border-r border-slate-100 flex flex-col items-center py-10 gap-10 transition-all duration-500
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl shadow-slate-200">P</div>
        <nav className="flex flex-col gap-6 mt-10">
          {[
            { icon: Home, href: '/' },
            { icon: ShoppingCart, href: '/pos', active: true },
            { icon: Settings, href: '/settings' }
          ].map((item, i) => (
            <a key={i} href={item.href} className={`
              p-4 rounded-2xl transition-all duration-300 group
              ${item.active ? 'bg-slate-900 text-white shadow-xl shadow-slate-300' : 'text-slate-300 hover:text-slate-900 hover:bg-slate-50'}
            `}>
              <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} />
            </a>
          ))}
        </nav>
        <div className="mt-auto p-4 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer">
          <LogOut size={22} />
        </div>
      </aside>

      {/* Main Terminal Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#fafafa]">
        {/* Modern Header - Responsive & Premium */}
        <header className="border-b border-slate-100 bg-white shrink-0 py-4 px-4 md:px-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 xl:gap-0">

          {/* Left: Terminal Info & Mobile Actions */}
          <div className="w-full xl:w-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">POS Project</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-slate-100">Alex</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
              </div>
            </div>
            <div className="xl:hidden flex gap-3">
              <button onClick={handleSync} disabled={isSyncing} className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm active:scale-95 transition-all">
                <RefreshCw size={18} className={isSyncing ? 'animate-spin text-emerald-500' : ''} />
              </button>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 bg-slate-900 text-white rounded-xl border border-slate-900 flex items-center justify-center shadow-md active:scale-95 transition-all">
                <Menu size={18} />
              </button>
            </div>
          </div>

          {/* Center/Right: Unified Controls Container (Scrollable on Mobile) */}
          <div className="w-full xl:w-auto overflow-x-auto custom-scrollbar-hide -mx-4 px-4 xl:mx-0 xl:px-0 py-4">
            <div className="flex items-center gap-4 xl:gap-6 min-w-max">

              {/* Order Type Toggle */}
              <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner shrink-0">
                <button
                  onClick={() => useCartStore.getState().setOrderType('DINE_IN')}
                  className={`px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${useCartStore.getState().orderType === 'DINE_IN' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Eat In
                </button>
                <button
                  onClick={() => useCartStore.getState().setOrderType('TAKEAWAY')}
                  className={`px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${useCartStore.getState().orderType === 'TAKEAWAY' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Takeaway
                </button>
              </div>

              <div className="h-8 w-px bg-slate-200 shrink-0 hidden md:block" />

              {/* Table Selector */}
              <div className="flex items-center gap-2.5 shrink-0">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => useCartStore.getState().setTable(num.toString())}
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-black transition-all duration-300 border-2 ${useCartStore.getState().tableId === num.toString()
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] scale-110 z-10'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                      }`}
                  >
                    T{num}
                  </button>
                ))}
              </div>

              <div className="h-8 w-px bg-slate-200 shrink-0 hidden xl:block ml-2" />

              {/* Desktop Actions */}
              <div className="hidden xl:flex items-center gap-3 shrink-0 ml-2">
                <button onClick={handleSync} disabled={isSyncing} className="w-12 h-12 bg-white hover:bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 shadow-sm group">
                  <RefreshCw size={18} className={`transition-transform duration-500 ${isSyncing ? 'animate-spin text-emerald-500' : 'group-hover:rotate-180'}`} />
                </button>
              </div>

            </div>
          </div>
        </header>

        {/* Category Filter & Search */}
        <div className="px-4 md:px-10 py-3 md:py-6 bg-[#fafafa] shrink-0">
          {/* Search - mobile only top */}
          <div className="relative mb-3 md:hidden">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300">
              <Menu size={14} className="rotate-90" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:border-slate-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex gap-2 md:gap-4 overflow-x-auto custom-scrollbar-hide pb-1 flex-1">
              {['ALL', ...Array.from(new Set(menuItems.map((item) => item.category)))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black tracking-[0.15em] md:tracking-[0.2em] transition-all border whitespace-nowrap active:scale-95 uppercase ${activeCategory === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-900'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Search - desktop only */}
            <div className="hidden md:block relative w-64 group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                <Menu size={16} className="rotate-90" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:shadow-lg transition-all"
              />
            </div>
          </div>
        </div>

        {/* Refined Product Grid - scrollable container wraps the grid */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8 px-4 md:px-10 pt-2 pb-36 md:pb-10">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  addItem(item);
                  toast.success(`Added ${item.name}`, { duration: 1500 });
                }}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-4 hover:border-slate-300 hover:shadow-2xl transition-all duration-500 cursor-pointer active:scale-[0.98] flex flex-col gap-4 md:gap-6 shadow-sm"
              >
                <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-inner">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-slate-900 border border-slate-100 shadow-xl">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between items-center px-1 pb-1">
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-sm md:text-lg tracking-tight group-hover:text-slate-600 transition-colors truncate">{item.name}</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center text-slate-300 transition-all flex-shrink-0 ml-2">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cart - High-End Aesthetic */}
      <section className={`
        fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white border-l border-slate-100 flex flex-col shadow-2xl transition-transform duration-500 ease-in-out
        md:relative md:w-[420px] lg:w-[480px] md:translate-x-0
        ${isMobileCartOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileCartOpen(false)} className="md:hidden p-2 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Current Order</h2>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-rose-700 transition-colors">Clear All</button>
          )}
        </div>

        <div className="flex-1 px-8 py-6 overflow-y-auto space-y-4 custom-scrollbar bg-white">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-200 gap-10">
              <div className="w-32 h-32 rounded-[3rem] bg-slate-50 flex items-center justify-center">
                <ShoppingCart size={48} strokeWidth={1} />
              </div>
              <div className="text-center space-y-3">
                <p className="text-[11px] font-black tracking-[0.4em] uppercase text-slate-400">Your cart is empty</p>
                <p className="text-[10px] font-bold text-slate-300">Choose some delicious items</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center group animate-in fade-in duration-300 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 relative shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-0 right-0 w-5 h-5 bg-slate-900 text-white text-[9px] font-black rounded-bl-lg flex items-center justify-center">{item.quantity}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate text-sm tracking-tight">{item.name}</h4>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><Minus size={10} /></button>
                        <span className="text-[10px] font-black w-3 text-center text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><Plus size={10} /></button>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 font-mono">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 font-mono tracking-tighter text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-slate-200 hover:text-rose-500 mt-2 p-1 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-10 bg-white border-t border-slate-100 space-y-8 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>VAT ({settings.taxRate}%)</span>
              <span className="font-mono text-slate-900">${(getSubtotal() * (settings.taxRate / 100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-3xl font-black text-slate-900 pt-8 border-t border-slate-50">
              <span className="tracking-tighter">Total</span>
              <span className="font-mono tracking-tighter">${(getSubtotal() + (getSubtotal() * (settings.taxRate / 100))).toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCompleteOrder}
            disabled={items.length === 0}
            className="w-full bg-slate-900 hover:bg-black disabled:opacity-10 text-white font-black py-6 rounded-3xl transition-all duration-300 shadow-2xl shadow-slate-300 flex items-center justify-center gap-4 text-lg active:scale-95 uppercase tracking-[0.2em]"
          >
            <CreditCard size={24} />
            Complete Payment
          </button>
        </div>
      </section>

      {/* Backdrop for Mobile */}
      {isMobileCartOpen && <div onClick={() => setIsMobileCartOpen(false)} className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm" />}

      {/* Floating Cart Button (Mobile Only) */}
      {!isMobileCartOpen && (
        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="md:hidden fixed bottom-10 right-10 w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl z-30 border-4 border-white active:scale-90 transition-transform"
        >
          <ShoppingCart size={28} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-8 h-8 bg-white text-slate-900 text-xs font-black rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
              {cartItemCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
