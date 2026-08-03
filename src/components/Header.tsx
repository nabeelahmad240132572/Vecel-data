import React from 'react';
import { Plus, Download, RefreshCw, Truck, Calendar, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface HeaderProps {
  dateStart: string;
  dateEnd: string;
  totalRecordsCount: number;
  activeDataset: 'sheet' | 'full';
  onSwitchDataset: (dataset: 'sheet' | 'full') => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onOpenCompare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dateStart,
  dateEnd,
  totalRecordsCount,
  activeDataset,
  onSwitchDataset,
  onOpenAddModal,
  onExportCSV,
  onResetData,
  onOpenCompare,
}) => {
  return (
    <header className="relative mb-6 pb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      {/* Decorative gradient bar */}
      <div className="absolute -bottom-[1px] left-0 w-44 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />

      <div>
        {/* Subtitle / Eyebrow */}
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-blue-400 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
          </span>
          <span className="font-bold">DESCON FLEET INTELLIGENCE</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 flex items-center gap-1 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Live Bento Ledger
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 uppercase tracking-tight leading-none">
          DESCON ENGINEERING <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">LIMITED</span>
        </h1>

        <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs">
          <span className="text-zinc-400 font-sans">Active Ledger View:</span>
          <div className="inline-flex bg-[#09090b] border border-zinc-800 p-0.5 rounded-xl">
            <button
              onClick={() => onSwitchDataset('sheet')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer text-xs ${
                activeDataset === 'sheet'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sheet Data (9 Records)
            </button>
            <button
              onClick={() => onSwitchDataset('full')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer text-xs ${
                activeDataset === 'full'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Full Fleet Ledger (193 Records)
            </button>
          </div>
        </div>
      </div>

      {/* Right controls and Period Stamp */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Date stamp card */}
        <div className="bg-[#18181b] border border-zinc-800 px-4 py-2.5 rounded-2xl shadow-sm font-mono transition hover:border-zinc-700">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-blue-400" /> LOGGED PERIOD
          </div>
          <div className="text-xs text-amber-400 font-bold mt-1 tracking-tight">
            {dateStart} <span className="text-zinc-600">→</span> {dateEnd}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs py-2.5 px-3.5 rounded-xl shadow transition active:scale-95 cursor-pointer font-sans font-semibold"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" /> Compare
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 cursor-pointer font-sans"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>

          <button
            onClick={onExportCSV}
            title="Export CSV Ledger"
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs py-2.5 px-3.5 rounded-xl shadow transition active:scale-95 cursor-pointer font-sans"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" /> Export
          </button>

          <button
            onClick={onResetData}
            title="Reset to Original Data"
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs py-2.5 px-3 rounded-xl shadow transition active:scale-95 cursor-pointer font-sans"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> Reset
          </button>
        </div>
      </div>
    </header>
  );
};
