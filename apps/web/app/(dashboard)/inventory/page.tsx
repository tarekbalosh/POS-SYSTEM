import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, BarChart3, TrendingDown, MoreVertical, Plus, FileSpreadsheet } from 'lucide-react';

export default async function InventoryDashboard() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 min-h-screen">
      {/* Header - Adaptive Stack */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Inventory</h1>
          <p className="text-sm text-slate-500">Track ingredients and stock levels in real-time.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 active:scale-95 text-xs md:text-sm">
            <FileSpreadsheet size={18} className="text-slate-400" />
            <span className="hidden xs:inline">Export</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-xs md:text-sm">
            <Plus size={18} />
            <span>New Item</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <SummaryCard title="Total Items" value="124" icon={<Package size={20}/>} color="bg-blue-500" />
        <SummaryCard title="Low Stock" value="8" icon={<AlertTriangle size={20}/>} color="bg-amber-500" />
        <SummaryCard title="Stock Value" value="$12,450" icon={<BarChart3 size={20}/>} color="bg-emerald-500" />
        <SummaryCard title="Waste (MTD)" value="$420.50" icon={<TrendingDown size={20}/>} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Ingredients Table / Card View */}
        <div className="xl:col-span-2">
          <Suspense fallback={<TableSkeleton />}>
             <IngredientsTable />
          </Suspense>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="space-y-6">
           <LowStockPanel />
           <RecentMovements />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardContent className="p-4 md:p-6 flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${color} text-white shrink-0 shadow-lg shadow-black/5`}>{icon}</div>
        <div>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function IngredientsTable() {
  const ingredients = [
    { name: 'Ground Beef', unit: 'KG', stock: '15.400', status: 'HEALTHY' },
    { name: 'Fresh Tomatoes', unit: 'KG', stock: '2.400', status: 'LOW' },
    { name: 'Brioche Bun', unit: 'PCS', stock: '84', status: 'HEALTHY' },
    { name: 'Cheddar Cheese', unit: 'KG', stock: '1.200', status: 'LOW' },
  ];

  return (
    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-white p-6">
        <CardTitle className="text-lg font-bold">Stock Inventory</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {ingredients.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{item.unit}</td>
                  <td className="px-6 py-5 font-mono font-black text-indigo-600">{item.stock}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                      item.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right space-x-4">
                     <button className="text-indigo-600 font-bold hover:underline">Adjust</button>
                     <button className="text-slate-400 font-bold hover:text-slate-600"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {ingredients.map((item, i) => (
            <div key={i} className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500 uppercase font-medium">{item.unit}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                  item.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stock</p>
                  <p className="text-xl font-black text-indigo-600 font-mono">{item.stock}</p>
                </div>
                <div className="flex gap-2">
                   <button className="bg-slate-100 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold active:bg-slate-200">Adjust</button>
                   <button className="bg-slate-50 text-slate-400 p-2 rounded-xl active:bg-slate-100"><MoreVertical size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LowStockPanel() {
  return (
    <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem]">
      <CardHeader className="border-b border-slate-800 p-6">
        <CardTitle className="text-xs font-black tracking-widest flex items-center gap-2 uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Low Stock Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div>
              <p className="font-bold text-white">Tomato</p>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Threshold: 5.000 KG</p>
            </div>
            <div className="text-right">
               <p className="text-amber-500 font-mono font-black text-lg">2.400</p>
               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Remaining</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentMovements() { return null; }
function TableSkeleton() { return <div className="h-64 bg-slate-200 animate-pulse rounded-[2rem]" />; }
