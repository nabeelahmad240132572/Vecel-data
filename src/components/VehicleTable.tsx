import React, { useState } from 'react';
import { VehicleStat, ExpenseRecord } from '../types';
import { fmtPKR, fmtCompact } from '../data/initialData';
import { Search, Eye, Plus, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleTableProps {
  vehicles: VehicleStat[];
  records: ExpenseRecord[];
  selectedVehicle: string | null;
  onSelectVehicle: (vehicle: string) => void;
  onOpenVehicleModal: (vehicle: string) => void;
  onOpenAddModalForVehicle?: (vehicle: string) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  onOpenVehicleModal,
  onOpenAddModalForVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'value' | 'count' | 'name'>('value');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter & Sort
  const filtered = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortField === 'value') comp = b.value - a.value;
    else if (sortField === 'count') comp = b.count - a.count;
    else comp = a.name.localeCompare(b.name);
    return sortAsc ? -comp : comp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalFleetSpendInTable = vehicles.reduce((acc, v) => acc + v.value, 0) || 1;

  const handleSort = (field: 'value' | 'count' | 'name') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-zinc-700/80 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
            Fleet Vehicle Register
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Every vehicle plate in active view, ranked by total repair & upkeep spend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Internal table search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter plate..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-xs pl-8 pr-3 py-1.5 rounded-full text-zinc-100 placeholder-zinc-500 outline-none font-mono transition"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-zinc-800 rounded-xl scrollbar-thin">
        <table className="w-full text-left font-sans text-xs border-collapse">
          <thead className="bg-[#09090b] border-b border-zinc-800 font-mono text-[11px] text-zinc-500 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="py-3 px-3.5 w-12 text-center">Rank</th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition"
              >
                <div className="flex items-center gap-1">
                  Plate <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th
                onClick={() => handleSort('count')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-zinc-200 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  Entries <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-right">Avg / Entry</th>
              <th
                onClick={() => handleSort('value')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-zinc-200 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  Total Spend <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3 px-3.5 w-36">Fleet Share</th>
              <th className="py-3 px-3.5 text-center w-24">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-zinc-500 font-mono">
                  No vehicles found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              paginated.map((v, index) => {
                const rank = (page - 1) * pageSize + index + 1;
                const isSelected = selectedVehicle === v.name;
                const isDimmed = selectedVehicle && !isSelected;
                const sharePct = (v.value / totalFleetSpendInTable) * 100;

                return (
                  <tr
                    key={v.name}
                    className={`transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 text-zinc-100'
                        : isDimmed
                        ? 'opacity-40 hover:opacity-80 hover:bg-zinc-800/40'
                        : 'hover:bg-zinc-800/40 text-zinc-400'
                    }`}
                    onClick={() => onSelectVehicle(v.name)}
                  >
                    <td className="py-2.5 px-3.5 text-center font-mono text-zinc-500">
                      #{rank}
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="inline-flex items-center gap-2 font-mono font-bold text-xs bg-[#09090b] text-amber-400 border border-zinc-800 px-3 py-1 rounded-full shadow-sm">
                        {v.name}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-mono text-zinc-100">
                      {v.count}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-mono text-zinc-400">
                      {fmtPKR(v.avgPerEntry)}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-zinc-100">
                      {fmtPKR(v.value)}
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                          <span>{sharePct.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-amber-400 rounded-full"
                            style={{ width: `${Math.min(sharePct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenVehicleModal(v.name)}
                          title="View Vehicle Ledger & Repair History"
                          className="p-1.5 rounded-lg hover:bg-zinc-800 text-blue-400 hover:text-blue-300 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {onOpenAddModalForVehicle && (
                          <button
                            onClick={() => onOpenAddModalForVehicle(v.name)}
                            title="Add Maintenance Log for this Vehicle"
                            className="p-1.5 rounded-lg hover:bg-zinc-800 text-amber-400 hover:text-amber-300 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-3 font-mono text-xs text-zinc-400">
        <span>
          Page <strong className="text-zinc-100">{page}</strong> of {totalPages} ({sorted.length} vehicles)
        </span>

        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-200 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 text-zinc-200 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
