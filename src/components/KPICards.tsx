import React from 'react';
import { DollarSign, FileText, Truck, Calculator, PieChart, Package, ShoppingBag, Layers, Tag } from 'lucide-react';
import { fmtPKR } from '../data/initialData';
import { SubCategoryStat } from '../types';

interface KPICardsProps {
  totalSpend: number;
  totalAllSpend: number;
  totalInventory?: number;
  totalPurchase?: number;
  recordCount: number;
  vehicleCount: number;
  avgPerEntry: number;
  avgPerVehicle: number;
  isFiltered: boolean;
  subCategories?: SubCategoryStat[];
  onSelectSubCategory?: (subCat: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalSpend,
  totalAllSpend,
  totalInventory = 0,
  totalPurchase = 0,
  recordCount,
  vehicleCount,
  avgPerEntry,
  avgPerVehicle,
  isFiltered,
  subCategories = [],
  onSelectSubCategory,
}) => {
  const percentageOfFleet = totalAllSpend > 0 ? ((totalSpend / totalAllSpend) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-4 mb-6">
      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Spend Card */}
        <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 opacity-80 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">Total Fleet Spend</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-zinc-100 group-hover:text-amber-400 transition-colors tracking-tight">
            {fmtPKR(totalSpend)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center justify-between font-sans">
            <span>{isFiltered ? `${percentageOfFleet}% of total fleet ledger` : 'All combined maintenance'}</span>
          </div>
        </div>

        {/* 2. Direct Purchase (Cash Paid) Sum Card */}
        <div className="bg-[#18181b] border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" /> Cash / Direct Purchase
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-emerald-400 transition-colors tracking-tight">
            {fmtPKR(totalPurchase)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between font-sans">
            <span>Out-of-pocket cash paid</span>
            <span className="font-mono font-bold text-emerald-400">
              {totalSpend > 0 ? Math.round((totalPurchase / totalSpend) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 3. Store Inventory Stock Value Sum Card */}
        <div className="bg-[#18181b] border border-purple-500/30 hover:border-purple-500/50 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-400 opacity-80 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-semibold flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> Store Inventory Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-purple-400 transition-colors tracking-tight">
            {fmtPKR(totalInventory)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between font-sans">
            <span>Issued Descon store parts</span>
            <span className="font-mono font-bold text-purple-400">
              {totalSpend > 0 ? Math.round((totalInventory / totalSpend) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 4. Fleet & Entries Stat Card */}
        <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">Active Fleet Stats</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div>
              <span className="text-2xl font-black text-zinc-100">{vehicleCount}</span>
              <span className="text-xs text-zinc-500 ml-1">vehicles</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-blue-400">{recordCount}</span>
              <span className="text-xs text-zinc-500 ml-1">logs</span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex justify-between font-sans border-t border-zinc-800/80 pt-1.5">
            <span>Avg/Vehicle: <strong className="text-zinc-300 font-mono">{fmtPKR(avgPerVehicle)}</strong></span>
            <span>Avg/Log: <strong className="text-zinc-300 font-mono">{fmtPKR(avgPerEntry)}</strong></span>
          </div>
        </div>
      </div>

      {/* Subcategory Totals & Breakdown Cards */}
      {subCategories.length > 0 && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider">
                Subcategory Financial Breakdown ({subCategories.length} Subcategories)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              Hover/Click to explore detailed subcategory expenditures
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {subCategories.map((sub, idx) => (
              <div
                key={sub.name || idx}
                onClick={() => onSelectSubCategory && onSelectSubCategory(sub.name)}
                className="bg-[#09090b] border border-zinc-800 hover:border-blue-500/40 p-3 rounded-xl transition cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[100px]" title={sub.name}>
                      {sub.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">
                      {Math.round(sub.percentage)}%
                    </span>
                  </div>
                  <div className="text-xs font-black font-mono text-amber-400 group-hover:text-blue-400 transition-colors">
                    {fmtPKR(sub.value)}
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-2 flex justify-between items-center border-t border-zinc-800/60 pt-1">
                  <span>{sub.count} logs</span>
                  <Tag className="w-3 h-3 text-zinc-600 group-hover:text-blue-400 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
