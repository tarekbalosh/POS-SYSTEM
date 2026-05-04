'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Store, Utensils, CreditCard, Bell, 
  ShieldCheck, Globe, Save, Plus, Edit2, 
  Trash2, ChevronRight, Camera, DollarSign, Percent, X,
  Loader2, User, Lock, Mail, Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useSettingsStore } from '@/lib/stores/settingsStore';
import { useMenuStore, MenuItem } from '@/lib/stores/menuStore';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('restaurant');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'restaurant', label: 'Restaurant Info', icon: Store },
    { id: 'menu', label: 'Menu Management', icon: Utensils },
    { id: 'payments', label: 'Payments & Tax', icon: CreditCard },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Control</h1>
          <p className="text-slate-500">Manage your restaurant configuration, menu, and system preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4 ${
                    activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-600' 
                    : 'text-slate-500 border-transparent hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {activeTab === 'restaurant' && <RestaurantSettings />}
            {activeTab === 'menu' && <MenuSettings />}
            {activeTab === 'payments' && <PaymentSettings />}
            {activeTab === 'security' && <SecuritySettings />}
          </main>
        </div>
      </div>
    </div>
  );
}

function RestaurantSettings() {
  const { restaurantName, email, address, updateSettings } = useSettingsStore();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    updateSettings({ restaurantName, email, address });
    setLoading(false);
    toast.success('Restaurant profile updated!');
  };

  return (
    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
      <CardHeader className="p-8 border-b border-slate-100">
        <CardTitle className="text-xl font-bold">Restaurant Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center pb-8 border-b border-slate-100">
          <div className="relative group">
             <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden border-4 border-white shadow-lg">
                <Store size={48} />
             </div>
             <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all">
                <Camera size={16} />
             </button>
          </div>
          <div className="flex-1 text-center md:text-left">
             <h3 className="text-lg font-bold text-slate-900">Restaurant Logo</h3>
             <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size of 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Restaurant Name</label>
            <input 
              type="text" 
              value={restaurantName} 
              onChange={(e) => updateSettings({ restaurantName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => updateSettings({ email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => updateSettings({ address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
           <button 
             onClick={handleSave} 
             disabled={loading}
             className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
           >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Changes'}
           </button>
        </div>
      </CardContent>
    </Card>
  );
}

function MenuSettings() {
  const { menuItems, addItem, updateItem, deleteItem } = useMenuStore();
  const [isEditing, setIsEditing] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    price: 0,
    category: 'BURGER',
    image: '/images/classic_burger_pos_1777879237778.png'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateItem(isEditing.id, formData);
      toast.success('Item updated');
      setIsEditing(null);
    } else {
      addItem(formData);
      toast.success('Item added');
      setIsAdding(false);
    }
    setFormData({ name: '', price: 0, category: 'BURGER', image: '/images/classic_burger_pos_1777879237778.png' });
  };

  const startEdit = (item: MenuItem) => {
    setIsEditing(item);
    setFormData({ name: item.name, price: item.price, category: item.category, image: item.image });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-slate-900">Manage Menu</h2>
         <button 
           onClick={() => setIsAdding(true)}
           className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
         >
            <Plus size={16} /> Add New Item
         </button>
      </div>

      {/* Form Section (Add/Edit) */}
      {(isAdding || isEditing) && (
        <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2rem] overflow-hidden animate-in slide-in-from-top-4 duration-300">
           <CardHeader className="p-6 border-b border-slate-800 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-black tracking-widest uppercase">
                {isEditing ? `Edit ${isEditing.name}` : 'Create New Item'}
              </CardTitle>
              <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-slate-500 hover:text-white"><X size={20} /></button>
           </CardHeader>
           <CardContent className="p-6">
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price ($)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    >
                       <option value="BURGER">BURGER</option>
                       <option value="SHAWARMA">SHAWARMA</option>
                       <option value="RICE">RICE</option>
                       <option value="DRINK">DRINK</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Image URL</label>
                    <input 
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
                 <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-6 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="bg-indigo-600 px-6 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30">
                       {isEditing ? 'Update Item' : 'Create Item'}
                    </button>
                 </div>
              </form>
           </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <p className="font-mono font-black text-slate-900">${item.price.toFixed(2)}</p>
               <div className="flex gap-2">
                  <button 
                    onClick={() => startEdit(item)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                     <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => { deleteItem(item.id); toast.error(`${item.name} deleted`); }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentSettings() {
  const { currency, taxRate, updateSettings } = useSettingsStore();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    updateSettings({ currency, taxRate });
    setLoading(false);
    toast.success('Payment settings saved!');
  };

  return (
    <Card className="border-none shadow-sm rounded-[2rem]">
      <CardHeader className="p-8 border-b border-slate-100">
        <CardTitle className="text-xl font-bold">Currency & Taxation</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Currency</label>
              <div className="relative">
                 <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <select 
                   value={currency}
                   onChange={(e) => updateSettings({ currency: e.target.value })}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                 >
                    <option>USD - US Dollar</option>
                    <option>AED - UAE Dirham</option>
                    <option>EUR - Euro</option>
                    <option>SAR - Saudi Riyal</option>
                 </select>
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Default Tax (VAT)</label>
              <div className="relative">
                 <Percent size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="number" 
                   value={taxRate} 
                   onChange={(e) => updateSettings({ taxRate: Number(e.target.value) })}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" 
                 />
              </div>
           </div>
        </div>
        <div className="flex justify-end pt-4">
           <button 
             onClick={handleSave} 
             disabled={loading}
             className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
           >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Changes'}
           </button>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  const { adminUsername, adminEmail, updateSettings } = useSettingsStore();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    updateSettings({ adminUsername, adminEmail });
    setLoading(false);
    toast.success('Security credentials updated!');
  };

  return (
    <Card className="border-none shadow-sm rounded-[2rem]">
      <CardHeader className="p-8 border-b border-slate-100">
        <CardTitle className="text-xl font-bold">Admin Security</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="space-y-6">
           <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <Lock className="text-amber-600 shrink-0" size={20} />
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                Updating these credentials will change the primary sign-in information for the System Administrator. Ensure you have access to the new email address.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Admin Username</label>
                <div className="relative">
                   <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     value={adminUsername} 
                     onChange={(e) => updateSettings({ adminUsername: e.target.value })}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" 
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Email</label>
                <div className="relative">
                   <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="email" 
                     value={adminEmail} 
                     onChange={(e) => updateSettings({ adminEmail: e.target.value })}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" 
                   />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">New Password</label>
                <div className="relative">
                   <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Leave blank to keep the current password.</p>
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-4">
           <button 
             onClick={handleSave} 
             disabled={loading}
             className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
           >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {loading ? 'Updating...' : 'Save Security Info'}
           </button>
        </div>
      </CardContent>
    </Card>
  );
}
