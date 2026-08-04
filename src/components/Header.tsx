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
    <header className="relative mb-6 rounded-3xl border border-zinc-700/80 bg-[#09090b] overflow-hidden shadow-2xl transition-all group">
      {/* Hero Background Image with Crisp Cinematic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroBgPath}
          alt="Descon Fleet Logistics Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-80 sm:opacity-90 scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
        />
        {/* Multi-stage Gradient Overlays for High Legibility & Vibrant Ambiance */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 z-10 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />

      {/* Content Container with increased height & generous padding */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14 min-h-[280px] sm:min-h-[340px] flex flex-col justify-between gap-8">
        {/* Top Eyebrow & Brand Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-blue-400 font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
            </span>
            <span>DESCON FLEET INTELLIGENCE DIVISION</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-sans font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Audited Live Bento Ledger
            </span>
          </div>

          {/* Quick Stats Summary Pills inside Hero */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="bg-black/60 backdrop-blur-md border border-zinc-700/80 px-3 py-1 rounded-full text-zinc-300 flex items-center gap-1.5 shadow-md">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Heavy Transport Fleet</span>
            </div>
            <div className="bg-blue-950/60 backdrop-blur-md border border-blue-500/40 px-3 py-1 rounded-full text-blue-300 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Records Loaded: <strong>{totalRecordsCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Main Title, Subtitle, & Dataset Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-zinc-100 uppercase tracking-tight leading-[1.05] drop-shadow-xl">
              DESCON ENGINEERING <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">LIMITED</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 font-sans mt-3 font-medium leading-relaxed drop-shadow">
              صنعت کارانہ ہیوی ٹرانسپورٹ اور آلات دیکھ بھال ڈیش بورڈ — Industrial Heavy Transport & Fleet Maintenance Operations Dashboard
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5 font-mono text-xs">
              <span className="text-zinc-300 font-sans font-semibold text-xs sm:text-sm">Active Ledger Mode:</span>
              <div className="inline-flex bg-black/80 border border-zinc-700/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl">
                <button
                  onClick={() => onSwitchDataset('sheet')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer text-xs font-semibold ${
                    activeDataset === 'sheet'
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  Sheet Data (9 Records)
                </button>
                <button
                  onClick={() => onSwitchDataset('full')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer text-xs font-semibold ${
                    activeDataset === 'full'
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  Full Fleet Ledger (193 Records)
                </button>
              </div>
            </div>
          </div>

          {/* Right Controls & Info Badges */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              {/* Operator Card */}
              <div className="bg-black/70 backdrop-blur-md border border-blue-500/50 px-4 py-2.5 rounded-2xl shadow-xl font-mono hover:border-blue-400 transition">
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" /> FLEET OPERATOR
                </div>
                <div className="text-xs sm:text-sm text-zinc-100 font-bold mt-1 tracking-tight flex items-center gap-2 font-sans">
                  <span>Nabeel Ahmad</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    Verified
                  </span>
                </div>
              </div>

              {/* Date Stamp Card */}
              <div className="bg-black/70 backdrop-blur-md border border-zinc-700/90 px-4 py-2.5 rounded-2xl shadow-xl font-mono hover:border-zinc-600 transition">
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> LOGGED PERIOD
                </div>
                <div className="text-xs sm:text-sm text-amber-400 font-extrabold mt-1 tracking-tight">
                  {dateStart} <span className="text-zinc-500">→</span> {dateEnd}
                </div>
              </div>
            </div>

            {/* Quick Control Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {onOpenCompare && (
                <button
                  onClick={onOpenCompare}
                  className="flex items-center gap-2 bg-black/70 hover:bg-zinc-800/90 text-zinc-100 border border-zinc-700 text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xl transition active:scale-95 cursor-pointer font-sans font-bold backdrop-blur-md hover:border-amber-500/50"
                >
                  <ArrowRightLeft className="w-4 h-4 text-amber-400" /> Compare Vehicles
                </button>
              )}

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 cursor-pointer font-sans ring-2 ring-blue-500/50"
              >
                <Plus className="w-4 h-4" /> Add Expense
              </button>

              <button
                onClick={onExportCSV}
                title="Export CSV Ledger"
                className="flex items-center gap-1.5 bg-black/70 hover:bg-zinc-800/90 text-zinc-100 border border-zinc-700 text-xs py-2.5 px-3.5 rounded-xl shadow-xl transition active:scale-95 cursor-pointer font-sans font-semibold backdrop-blur-md"
              >
                <Download className="w-4 h-4 text-blue-400" /> Export
              </button>

              <button
                onClick={onResetData}
                title="Reset to Original Data"
                className="flex items-center gap-1.5 bg-black/70 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-700 text-xs py-2.5 px-3 rounded-xl shadow-xl transition active:scale-95 cursor-pointer font-sans backdrop-blur-md"
              >
                <RefreshCw className="w-4 h-4 text-zinc-400" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
