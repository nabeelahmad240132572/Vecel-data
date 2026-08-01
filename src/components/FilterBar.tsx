import React from 'react';
import { Filter, X, Search, Calendar, RotateCcw } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilters,
  onClearAll,
  filteredCount,
  totalCount,
}) => {
  const hasActiveFilters =
    Boolean(filters.category) ||
    Boolean(filters.vehicle) ||
    Boolean(filters.item) ||
    Boolean(filters.dateStart) ||
    Boolean(filters.dateEnd) ||
    Boolean(filters.search.trim());

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-3.5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left side: Search input and active filter badges */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 uppercase tracking-wider shrink-0 font-semibold">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filters:</span>
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[220px] max-w-xs flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plate, part, category..."
            value={filters.search}
            onChange={e => onUpdateFilters({ search: e.target.value })}
            className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 rounded-full text-xs pl-9 pr-7 py-2 text-zinc-100 placeholder-zinc-500 outline-none font-sans transition"
          />
          {filters.search && (
            <button
              onClick={() => onUpdateFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pill */}
        {filters.category && (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
            <span>Category: {filters.category}</span>
            <button
              onClick={() => onUpdateFilters({ category: null })}
              className="w-4 h-4 rounded-full bg-amber-500/20 hover:bg-amber-400 hover:text-zinc-950 flex items-center justify-center transition"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Vehicle Pill */}
        {filters.vehicle && (
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
            <span>Plate: {filters.vehicle}</span>
            <button
              onClick={() => onUpdateFilters({ vehicle: null })}
              className="w-4 h-4 rounded-full bg-blue-500/20 hover:bg-blue-400 hover:text-zinc-950 flex items-center justify-center transition"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Item / Part Pill */}
        {filters.item && (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium py-1 px-3 rounded-full animate-fadeIn">
            <span>Part: {filters.item}</span>
            <button
              onClick={() => onUpdateFilters({ item: null })}
              className="w-4 h-4 rounded-full bg-emerald-500/20 hover:bg-emerald-400 hover:text-zinc-950 flex items-center justify-center transition"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Date Filter Badges */}
        {(filters.dateStart || filters.dateEnd) && (
          <span className="inline-flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700 text-zinc-300 text-xs font-mono py-1 px-3 rounded-full">
            <Calendar className="w-3 h-3 text-blue-400" />
            <span>
              {filters.dateStart || 'Start'} to {filters.dateEnd || 'End'}
            </span>
            <button
              onClick={() => onUpdateFilters({ dateStart: null, dateEnd: null })}
              className="w-4 h-4 rounded-full hover:bg-zinc-700 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {!hasActiveFilters && (
          <span className="text-xs text-zinc-500 italic font-mono">
            None — click any bento card or chart bar to filter
          </span>
        )}
      </div>

      {/* Right side: Results count & Reset button */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center font-mono text-xs">
        <span className="text-zinc-400">
          Showing <strong className="text-amber-400">{filteredCount}</strong> of {totalCount} lines
        </span>

        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 rounded-full py-1 px-3 transition active:scale-95 cursor-pointer font-sans"
          >
            <RotateCcw className="w-3 h-3 text-zinc-500" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
