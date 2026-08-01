import React from 'react';
import { DollarSign, FileText, Truck, Calculator, PieChart } from 'lucide-react';
import { fmtPKR } from '../data/initialData';

interface KPICardsProps {
  totalSpend: number;
  totalAllSpend: number;
  recordCount: number;
  vehicleCount: number;
  avgPerEntry: number;
  avgPerVehicle: number;
  isFiltered: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalSpend,
  totalAllSpend,
  recordCount,
  vehicleCount,
  avgPerEntry,
  avgPerVehicle,
  isFiltered,
}) => {
  const percentageOfFleet = totalAllSpend > 0 ? ((totalSpend / totalAllSpend) * 100).toFixed(1) : '100';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      {/* 1. Total Spend Card */}
      <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">Total Spend</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="font-mono text-2xl font-bold text-zinc-100 group-hover:text-amber-400 transition-colors tracking-tight">
          {fmtPKR(totalSpend)}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 flex items-center justify-between font-sans">
          <span>{isFiltered ? `${percentageOfFleet}% of total fleet spend` : 'All categories combined'}</span>
        </div>
      </div>

      {/* 2. Logged Entries Card */}
      <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-400 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">Logged Entries</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="font-mono text-2xl font-bold text-zinc-100 group-hover:text-blue-400 transition-colors tracking-tight">
          {recordCount}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-sans">
          Individual job & part lines
        </div>
      </div>

      {/* 3. Vehicles Card */}
      <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">Vehicles</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="font-mono text-2xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors tracking-tight">
          {vehicleCount}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-sans">
          Distinct plates in current view
        </div>
      </div>

      {/* 4. Avg per Entry Card */}
      <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-pink-400 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">Avg / Entry</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <Calculator className="w-4 h-4" />
          </div>
        </div>
        <div className="font-mono text-2xl font-bold text-zinc-100 group-hover:text-purple-400 transition-colors tracking-tight">
          {fmtPKR(avgPerEntry)}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-sans">
          Mean line-item repair cost
        </div>
      </div>

      {/* 5. Avg per Vehicle Card */}
      <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4.5 relative overflow-hidden transition-all duration-200 shadow-sm group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-orange-400 opacity-80 group-hover:opacity-100 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">Avg / Vehicle</span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="font-mono text-2xl font-bold text-zinc-100 group-hover:text-rose-400 transition-colors tracking-tight">
          {fmtPKR(avgPerVehicle)}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-sans">
          Mean total spend per plate
        </div>
      </div>
    </div>
  );
};
