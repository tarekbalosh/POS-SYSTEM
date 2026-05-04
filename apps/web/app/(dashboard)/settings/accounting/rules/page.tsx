import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, FileJson, ShieldCheck, Database } from 'lucide-react';

export default async function AccountingRulesPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Accounting Engine</h1>
          <p className="text-slate-500">Configure financial rules, formulas, and tax engines.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 active:scale-95">
            Import Rules
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            + Create New Rule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Rules List */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-white border-b border-slate-100 rounded-t-2xl">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson size={20} className="text-indigo-500" />
                Active Accounting Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { name: 'Cash Sale with Tax', trigger: 'ORDER_PAID', priority: 10 },
                  { name: 'Card Sale with Tax', trigger: 'ORDER_PAID', priority: 10 },
                  { name: 'COGS Recognition', trigger: 'ORDER_PAID', priority: 5 },
                  { name: 'Stock Purchase', trigger: 'STOCK_PURCHASED', priority: 10 }
                ].map((rule, i) => (
                  <div key={i} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900">{rule.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Trigger: {rule.trigger}</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Priority</p>
                         <p className="font-mono font-bold text-indigo-600">{rule.priority}</p>
                       </div>
                       <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-xs transition-all">
                        Edit JSON
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Panel */}
        <div className="space-y-6">
           <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Play size={16} className="text-emerald-400" />
                TEST ENGINE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <p className="text-xs text-slate-400">Paste a sample event JSON below to simulate the accounting entry generation.</p>
               <textarea 
                className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] focus:outline-none focus:border-indigo-500"
                placeholder='{ "type": "ORDER_PAID", "data": { ... } }'
               />
               <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                Simulate Journal Entry
              </button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
             <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Database size={16} className="text-slate-500" />
                Data Integrity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div className="flex items-center gap-3 text-emerald-600">
                  <ShieldCheck size={20} />
                  <span className="text-sm font-bold">Decimal.js Enabled</span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">
                 All financial calculations use 20-digit precision to prevent rounding discrepancies across multi-currency transactions.
               </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
