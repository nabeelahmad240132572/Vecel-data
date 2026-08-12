import React, { useState, useRef } from 'react';
import { Plus, Download, RefreshCw, Truck, Calendar, ShieldCheck, ArrowRightLeft, UserCheck, Play, Pause, Video, Image as ImageIcon, Edit3, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
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
  onOpenLedgerModal?: () => void;
  onLogout?: () => void;
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
  onOpenLedgerModal,
  onLogout,
}) => {
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  return (
    <header className="relative mb-6 rounded-3xl border border-zinc-700/80 bg-[#09090b] overflow-hidden shadow-2xl transition-all group">
      {/* Hero Background - Video vs Animated Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isVideoMode ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={heroBgPath}
            className="w-full h-full object-cover object-center opacity-75 sm:opacity-85 scale-105 transition-opacity duration-700"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-trucks-driving-on-a-highway-at-sunset-41408-large.mp4"
              type="video/mp4"
            />
            <source
              src="https://cdn.coverr.co/videos/coverr-truck-on-the-highway-5231/1080p.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          <motion.img
            src={heroBgPath}
            alt="Descon Fleet Logistics Background"
            referrerPolicy="no-referrer"
            initial={{ scale: 1.15, opacity: 0.7 }}
            animate={{
              scale: [1.05, 1.14, 1.05],
              x: [0, -10, 0],
              y: [0, -5, 0],
              opacity: [0.8, 0.92, 0.8],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="w-full h-full object-cover object-center pointer-events-none"
          />
        )}

        {/* Multi-stage Gradient Overlays for High Legibility & Vibrant Ambiance */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/50" />

        {/* Animated Light Glow Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
        />
      </div>

      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 z-10 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />

      {/* Content Container with generous padding */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14 min-h-[300px] sm:min-h-[360px] flex flex-col justify-between gap-8">
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

          {/* Quick Stats Summary Pills & Video Toggle */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Video Motion Control Toggle */}
            <div className="bg-black/80 backdrop-blur-md border border-amber-500/40 p-1 rounded-xl flex items-center gap-1 shadow-lg">
              <button
                onClick={() => setIsVideoMode(true)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 text-[11px] font-bold cursor-pointer ${
                  isVideoMode
                    ? 'bg-amber-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Switch to Live Fleet Video Motion"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Motion Video</span>
              </button>

              <button
                onClick={() => setIsVideoMode(false)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 text-[11px] font-bold cursor-pointer ${
                  !isVideoMode
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Switch to Photo Backdrop"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>

              {isVideoMode && (
                <button
                  onClick={togglePlay}
                  className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                  title={isPlaying ? 'Pause Motion Video' : 'Play Motion Video'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              )}
            </div>

            <div className="bg-black/60 backdrop-blur-md border border-zinc-700/80 px-3 py-1.5 rounded-xl text-zinc-300 flex items-center gap-1.5 shadow-md">
              <Truck className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Fleet Motion: <strong className="text-emerald-400">ACTIVE</strong></span>
            </div>
            <div className="bg-blue-950/60 backdrop-blur-md border border-blue-500/40 px-3 py-1.5 rounded-xl text-blue-300 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
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
            <p className="text-sm sm:text-base text-zinc-200 font-sans mt-3 font-medium tracking-wide leading-relaxed drop-shadow-md">
              Industrial Heavy Transport & Equipment Maintenance Operations Ledger
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
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 cursor-pointer font-sans ring-2 ring-blue-500/50"
              >
                <Plus className="w-4 h-4" /> Add Expense
              </button>

              {onOpenLedgerModal && (
                <button
                  onClick={onOpenLedgerModal}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 cursor-pointer font-sans"
                  title="View, Search, Edit or Delete any Data Entry"
                >
                  <Edit3 className="w-4 h-4" /> Edit / Delete Entries
                </button>
              )}

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

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Lock & Logout Portal"
                  className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs py-2.5 px-3 rounded-xl shadow-xl transition active:scale-95 cursor-pointer font-sans backdrop-blur-md ml-auto"
                >
                  <LogOut className="w-4 h-4 text-rose-400" /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

