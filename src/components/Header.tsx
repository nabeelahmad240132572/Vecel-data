import React from 'react';
import { Plus, Download, RefreshCw, Truck, Calendar, ShieldCheck, ArrowRightLeft, UserCheck } from 'lucide-react';
import heroBgPath from '../assets/images/fleet_hero_bg_1785833631179.jpg';

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
    <header className="relative mb-6 rounded-3xl border border-zinc-800 bg-[#09090b] overflow-hidden shadow-2xl transition-all">
      {/* Hero Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgPath}
          alt="Descon Fleet Logistics Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        {/* Dark Multi-layer Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/90 to-[#09090b]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/40" />
      </div>

      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 z-10" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          {/* Subtitle / Eyebrow */}
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-blue-400 mb-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
            </span>
            <span className="font-bold">DESCON FLEET INTELLIGENCE</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 flex items-center gap-1 font-sans font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Live Bento Ledger
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-100 uppercase tracking-tight leading-none drop-shadow-md">
            DESCON ENGINEERING <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">LIMITED</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 mt-4 font-mono text-xs">
            <span className="text-zinc-300 font-sans font-medium">Active Ledger View:</span>
            <div className="inline-flex bg-[#09090b]/90 border border-zinc-700/80 backdrop-blur-md p-1 rounded-xl shadow-lg">
              <button
                onClick={() => onSwitchDataset('sheet')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                  activeDataset === 'sheet'
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Sheet Data (9 Records)
              </button>
              <button
                onClick={() => onSwitchDataset('full')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                  activeDataset === 'full'
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Full Fleet Ledger (193 Records)
              </button>
            </div>
          </div>
        </div>

        {/* Right controls and Period Stamp */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Operator Card */}
          <div className="bg-[#121215]/90 backdrop-blur-md border border-blue-500/40 px-4 py-2.5 rounded-2xl shadow-lg font-mono transition hover:border-blue-500/60">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> FLEET OPERATOR
            </div>
            <div className="text-xs text-zinc-100 font-bold mt-1 tracking-tight flex items-center gap-1.5 font-sans">
              <span className="text-zinc-100">Nabeel Ahmad</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Verified
              </span>
            </div>
          </div>

          {/* Date stamp card */}
          <div className="bg-[#121215]/90 backdrop-blur-md border border-zinc-700/80 px-4 py-2.5 rounded-2xl shadow-lg font-mono transition hover:border-zinc-600">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> LOGGED PERIOD
            </div>
            <div className="text-xs text-amber-400 font-bold mt-1 tracking-tight">
              {dateStart} <span className="text-zinc-500">→</span> {dateEnd}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 bg-[#121215]/90 hover:bg-zinc-800/90 text-zinc-100 border border-zinc-700 text-xs py-2.5 px-3.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer font-sans font-semibold backdrop-blur-md"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" /> Compare
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 cursor-pointer font-sans"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>

            <button
              onClick={onExportCSV}
              title="Export CSV Ledger"
              className="flex items-center gap-1.5 bg-[#121215]/90 hover:bg-zinc-800/90 text-zinc-100 border border-zinc-700 text-xs py-2.5 px-3.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer font-sans backdrop-blur-md"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" /> Export
            </button>

            <button
              onClick={onResetData}
              title="Reset to Original Data"
              className="flex items-center gap-1.5 bg-[#121215]/90 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-700 text-xs py-2.5 px-3 rounded-xl shadow-lg transition active:scale-95 cursor-pointer font-sans backdrop-blur-md"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" /> Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
