import React, { useState } from 'react';
import { ExpenseRecord } from '../types';
import { fmtPKR } from '../data/initialData';
import { X, Search, Edit3, Trash2, Plus, Download, FileText, ArrowUpDown } from 'lucide-react';

interface LedgerEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ExpenseRecord[];
  onEditRecord: (record: ExpenseRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenAddModal: () => void;
}

export const LedgerEntriesModal: React.FC<LedgerEntriesModalProps> = ({
  isOpen,
  onClose,
  records,
  onEditRecord,
  onDeleteRecord,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'value' | 'vehicle'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  if (!isOpen) return null;

  // Filter
  const filtered = records.filter(r => {
    const matchesSearch =
      r.vehicle.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      r.item.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (r.additionalInfo && r.additionalInfo.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase().trim());

    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortField === 'value') {
      comp = b.value - a.value;
    } else if (sortField === 'vehicle') {
      comp = a.vehicle.localeCompare(b.vehicle);
    } else {
      const dateA = a.date || '';
      const dateB = b.date || '';
      comp = dateB.localeCompare(dateA);
    }
    return sortAsc ? -comp : comp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const categoriesList = Array.from(new Set(records.map(r => r.category))).sort();

  const handleSort = (field: 'date' | 'value' | 'vehicle') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#18181b] border border-zinc-700/80 w-full max-w-5xl rounded-2xl shadow-2xl p-5 relative font-sans text-xs text-zinc-100 max-h-[92vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pb-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" /> Manage All Fleet Ledger Entries
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Edit, delete, or search any maintenance record in the entire Descon ledger ({records.length} total entries).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAddModal();
              }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer font-sans"
            >
              <Plus className="w-4 h-4" /> Add New Entry
            </button>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search plate, part, item or category..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-xs pl-8 pr-3 py-2 rounded-xl text-zinc-100 placeholder-zinc-500 outline-none font-mono transition"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-xs px-3 py-2 rounded-xl text-zinc-300 outline-none font-mono"
            >
              <option value="all">All Categories ({records.length})</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="font-mono text-zinc-400 text-[11px]">
            Showing <strong>{filtered.length}</strong> of {records.length} records
          </div>
        </div>

        {/* Records Table */}
        <div className="flex-1 overflow-y-auto border border-zinc-800 rounded-xl scrollbar-thin">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead className="bg-[#09090b] border-b border-zinc-800 font-mono text-[10px] text-zinc-500 uppercase sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => handleSort('date')}
                  className="py-2.5 px-3 cursor-pointer hover:text-zinc-200 transition"
                >
                  <div className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('vehicle')}
                  className="py-2.5 px-3 cursor-pointer hover:text-zinc-200 transition"
                >
                  <div className="flex items-center gap-1">
                    Vehicle Plate <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Item / Maintenance Work</th>
                <th className="py-2.5 px-3 text-right">Cash Paid</th>
                <th className="py-2.5 px-3 text-right">Store Inventory</th>
                <th
                  onClick={() => handleSort('value')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-zinc-200 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    Total (PKR) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-zinc-500">
                    No ledger entries found matching active filters.
                  </td>
                </tr>
              ) : (
                paginated.map(r => (
                  <tr key={r.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-2.5 px-3 text-zinc-400 whitespace-nowrap">
                      {r.date || 'Undated'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">
                      <span className="bg-[#09090b] border border-zinc-800 px-2 py-0.5 rounded">
                        {r.vehicle}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">
                      <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] px-2 py-0.5 rounded">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-100 font-sans font-medium">
                      {r.additionalInfo || r.item}
                      {r.notes && (
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {r.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {r.amount != null ? fmtPKR(r.amount) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      {r.inventory != null ? fmtPKR(r.inventory) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-400 whitespace-nowrap">
                      {fmtPKR(r.value)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditRecord(r)}
                          title="Edit entry"
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete entry "${r.item}" for ${r.vehicle}?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          title="Delete entry"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Footer with Pagination */}
        <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
          <div className="text-zinc-500">
            Page {page} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 transition cursor-pointer"
            >
              Next
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer font-sans ml-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
