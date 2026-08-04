import React, { useMemo } from 'react';
import { Filter, X, Search, Calendar, RotateCcw, Truck, Tag, SlidersHorizontal, Check } from 'lucide-react';
import { FilterState, ExpenseRecord } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
  records?: ExpenseRecord[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilters,
  onClearAll,
  filteredCount,
  totalCount,
  records = [],
}) => {
  // Extract unique vehicles and their counts
  const vehicleOptions = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      if (r.vehicle) {
        map[r.vehicle] = (map[r.vehicle] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([plate, count]) => ({ plate, count }))
      .sort((a, b) => a.plate.localeCompare(b.plate));
  }, [records]);

  // Extract unique categories and their counts
  const categoryOptions = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      if (r.category) {
        map[r.category] = (map[r.category] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([cat, count]) => ({ category: cat, count }))
      .sort((a, b) => b.count - a.count);
  }, [records]);

  const hasActiveFilters =
    Boolean(filters.category) ||
    Boolean(filters.vehicle) ||
    Boolean(filters.item) ||
    Boolean(filters.dateStart) ||
    Boolean(filters.dateEnd) ||
    Boolean(filters.search.trim());

  // Quick Date Range Presets
  const handleApplyPreset = (preset: 'all' | 'jan2025' | 'feb2025' | 'year2025' | 'year2024') => {
    if (preset === 'all') {
      onUpdateFilters({ dateStart: null, dateEnd: null });
    } else if (preset === 'jan2025') {
      onUpdateFilters({ dateStart: '2025-01-01', dateEnd: '2025-01-31' });
    } else if (preset === 'feb2025') {
      onUpdateFilters({ dateStart: '2025-02-01', dateEnd: '2025-02-28' });
    } else if (preset === 'year2025') {
      onUpdateFilters({ dateStart: '2025-01-01', dateEnd: '2025-12-31' });
    } else if (preset === 'year2024') {
      onUpdateFilters({ dateStart: '2024-01-01', dateEnd: '2024-12-31' });
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl relative overflow-hidden transition-all">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Bar of Filter Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              Fleet Data Filter & Search Bar
              {hasActiveFilters && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold animate-pulse">
                  Filters Active
                </span>
              )}
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans">
              Filter ledger entries by Date Range, Vehicle Plate number, Expense Category & Keyword search
            </p>
          </div>
        </div>

        {/* Counter & Reset All button */}
        <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
          <span className="text-zinc-400 bg-[#09090b] px-3 py-1.5 rounded-xl border border-zinc-800">
            Showing <strong className="text-amber-400 font-extrabold">{filteredCount}</strong> of{' '}
            <span className="text-zinc-300">{totalCount}</span> entries
          </span>

          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl py-1.5 px-3 transition active:scale-95 cursor-pointer font-sans text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Controls Section: Date, Vehicle, Category, Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5">
        
        {/* 1. Date Range Filter Block (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#09090b] border border-zinc-800/90 p-3 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Date Range Filter (تاریخ)
            </label>
            {(filters.dateStart || filters.dateEnd) && (
              <button
                onClick={() => onUpdateFilters({ dateStart: null, dateEnd: null })}
                className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
              >
                Clear Dates
              </button>
            )}
          </div>

          {/* Start & End Date Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block mb-0.5">From Date:</span>
              <input
                type="date"
                value={filters.dateStart || ''}
                onChange={e => onUpdateFilters({ dateStart: e.target.value || null })}
                className="w-full bg-[#18181b] border border-zinc-700/80 focus:border-blue-500 rounded-lg text-xs px-2.5 py-1.5 text-zinc-100 outline-none font-mono"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block mb-0.5">To Date:</span>
              <input
                type="date"
                value={filters.dateEnd || ''}
                onChange={e => onUpdateFilters({ dateEnd: e.target.value || null })}
                className="w-full bg-[#18181b] border border-zinc-700/80 focus:border-blue-500 rounded-lg text-xs px-2.5 py-1.5 text-zinc-100 outline-none font-mono"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-zinc-800/60">
            <span className="text-[10px] text-zinc-500 font-mono mr-1">Presets:</span>
            <button
              onClick={() => handleApplyPreset('all')}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition cursor-pointer ${
                !filters.dateStart && !filters.dateEnd
                  ? 'bg-blue-600 text-white border-blue-500 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => handleApplyPreset('jan2025')}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition cursor-pointer ${
                filters.dateStart === '2025-01-01' && filters.dateEnd === '2025-01-31'
                  ? 'bg-blue-600 text-white border-blue-500 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Jan 2025
            </button>
            <button
              onClick={() => handleApplyPreset('feb2025')}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition cursor-pointer ${
                filters.dateStart === '2025-02-01' && filters.dateEnd === '2025-02-28'
                  ? 'bg-blue-600 text-white border-blue-500 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Feb 2025
            </button>
          </div>
        </div>

        {/* 2. Vehicle Selector Filter Block (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-[#09090b] border border-zinc-800/90 p-3 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-400" /> Vehicle Plate (گاڑیاں)
            </label>
            {filters.vehicle && (
              <button
                onClick={() => onUpdateFilters({ vehicle: null })}
                className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={filters.vehicle || ''}
              onChange={e => onUpdateFilters({ vehicle: e.target.value || null })}
              className="w-full bg-[#18181b] border border-zinc-700/80 focus:border-blue-500 rounded-lg text-xs px-3 py-2 text-zinc-100 outline-none font-mono transition cursor-pointer"
            >
              <option value="">All Vehicles ({vehicleOptions.length} Vehicles)</option>
              {vehicleOptions.map(v => (
                <option key={v.plate} value={v.plate}>
                  {v.plate} ({v.count} logs)
                </option>
              ))}
            </select>
          </div>

          <p className="text-[10px] text-zinc-500 font-mono italic">
            Select a specific vehicle number plate to isolate expense history
          </p>
        </div>

        {/* 3. Category Selector Filter Block (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#09090b] border border-zinc-800/90 p-3 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" /> Category (کیٹیگری)
            </label>
            {filters.category && (
              <button
                onClick={() => onUpdateFilters({ category: null })}
                className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={filters.category || ''}
              onChange={e => onUpdateFilters({ category: e.target.value || null })}
              className="w-full bg-[#18181b] border border-zinc-700/80 focus:border-blue-500 rounded-lg text-xs px-3 py-2 text-zinc-100 outline-none font-mono transition cursor-pointer"
            >
              <option value="">All Categories ({categoryOptions.length} Types)</option>
              {categoryOptions.map(c => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.count} records)
                </option>
              ))}
            </select>
          </div>

          {/* Universal Keyword Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search keyword, part, description..."
              value={filters.search}
              onChange={e => onUpdateFilters({ search: e.target.value })}
              className="w-full bg-[#18181b] border border-zinc-700/80 focus:border-blue-500 rounded-lg text-xs pl-8 pr-7 py-1.5 text-zinc-100 placeholder-zinc-500 outline-none font-sans transition"
            />
            {filters.search && (
              <button
                onClick={() => onUpdateFilters({ search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Bar: Active Filter Badges */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-blue-400" /> Active Filters:
          </span>

          {/* Vehicle Badge */}
          {filters.vehicle && (
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
              <Truck className="w-3 h-3" />
              <span>Vehicle: {filters.vehicle}</span>
              <button
                onClick={() => onUpdateFilters({ vehicle: null })}
                className="w-4 h-4 rounded-full bg-blue-500/20 hover:bg-blue-400 hover:text-zinc-950 flex items-center justify-center transition cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Category Badge */}
          {filters.category && (
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
              <Tag className="w-3 h-3" />
              <span>Category: {filters.category}</span>
              <button
                onClick={() => onUpdateFilters({ category: null })}
                className="w-4 h-4 rounded-full bg-amber-500/20 hover:bg-amber-400 hover:text-zinc-950 flex items-center justify-center transition cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Date Badge */}
          {(filters.dateStart || filters.dateEnd) && (
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
              <Calendar className="w-3 h-3" />
              <span>
                Date: {filters.dateStart || 'Start'} to {filters.dateEnd || 'End'}
              </span>
              <button
                onClick={() => onUpdateFilters({ dateStart: null, dateEnd: null })}
                className="w-4 h-4 rounded-full bg-purple-500/20 hover:bg-purple-400 hover:text-zinc-950 flex items-center justify-center transition cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Item Badge */}
          {filters.item && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
              <span>Part: {filters.item}</span>
              <button
                onClick={() => onUpdateFilters({ item: null })}
                className="w-4 h-4 rounded-full bg-emerald-500/20 hover:bg-emerald-400 hover:text-zinc-950 flex items-center justify-center transition cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Search Badge */}
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
              <Search className="w-3 h-3 text-zinc-400" />
              <span>Keyword: "{filters.search}"</span>
              <button
                onClick={() => onUpdateFilters({ search: '' })}
                className="w-4 h-4 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
