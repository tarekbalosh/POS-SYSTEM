import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
// Note: Recharts needs a client component wrapper. I'll create a simple one.

async function getStats() {
  // In a real app, fetch from NestJS API
  return {
    todayRevenue: 4250.00,
    ordersCount: 84,
    avgOrder: 50.60,
    topItem: 'Classic Burger'
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Business overview for today, {new Date().toLocaleDateString()}</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          Generate Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Revenue" value={`$${stats.todayRevenue}`} icon={<DollarSign className="text-emerald-500" />} trend="+12.5%" />
        <StatCard title="Orders Count" value={stats.ordersCount.toString()} icon={<ShoppingBag className="text-blue-500" />} trend="+4.2%" />
        <StatCard title="Avg. Order" value={`$${stats.avgOrder}`} icon={<TrendingUp className="text-indigo-500" />} trend="-1.5%" />
        <StatCard title="Top Item" value={stats.topItem} icon={<Users className="text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Placeholder - Would use Recharts Client Component here */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-slate-800 text-lg">Revenue History (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center bg-slate-50/50">
             <div className="text-slate-400 font-medium italic">Chart Visualization Integrated with Recharts</div>
          </CardContent>
        </Card>

        {/* Low Stock Panel */}
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
               {[
                 { name: 'Tomato', stock: '2.4 kg', min: '5 kg' },
                 { name: 'Beef Patties', stock: '12 pcs', min: '50 pcs' },
                 { name: 'Brioche Buns', stock: '8 pcs', min: '20 pcs' }
               ].map((item, i) => (
                 <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                   <div>
                     <p className="font-semibold text-slate-900">{item.name}</p>
                     <p className="text-xs text-slate-500">Min. Threshold: {item.min}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-mono font-bold text-rose-500">{item.stock}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">REORDER NOW</p>
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-slate-50">{icon}</div>
          {trend && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
