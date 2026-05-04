import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, AlertCircle, Settings, ExternalLink } from 'lucide-react';

export default async function AccountingDashboard() {
  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Accounting Integration</h1>
          <p className="text-slate-500">Double-entry ledger sync and external ERP webhooks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ledger Entries */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-white border-b border-slate-100 rounded-t-2xl">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-500" />
                Recent Journal Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Debit</th>
                      <th className="px-6 py-4 text-right">Credit</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500">2024-05-04</td>
                        <td className="px-6 py-4 font-medium">Order #1284 - Payment Recv.</td>
                        <td className="px-6 py-4 text-right font-mono font-bold">$125.00</td>
                        <td className="px-6 py-4 text-right font-mono font-bold">$125.00</td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-[10px] font-bold">SENT</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Settings size={16} className="text-indigo-400" />
                Account Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <MappingRow label="Cash Debit" code="1001" />
                <MappingRow label="Card Receivable" code="1002" />
                <MappingRow label="Food Revenue" code="4001" />
                <MappingRow label="Tax Payable" code="2001" />
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold text-xs transition-all mt-4">
                Update Mapping
              </button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ExternalLink size={16} className="text-slate-500" />
                Webhook Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Provider</p>
                <div className="text-sm font-semibold p-2 bg-slate-50 rounded border border-slate-100">QUICKBOOKS ONLINE</div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Endpoint URL</p>
                <div className="text-[10px] font-mono break-all text-slate-600">https://api.qbo.intuit.com/v3/journal-entry</div>
              </div>
              <button className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
                Test Connection
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MappingRow({ label, code }: any) {
  return (
    <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <span className="font-mono font-bold text-indigo-400">{code}</span>
    </div>
  );
}
