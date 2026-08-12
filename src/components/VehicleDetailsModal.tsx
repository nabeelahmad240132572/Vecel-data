import React from 'react';
import { ExpenseRecord } from '../types';
import { fmtPKR } from '../data/initialData';
import { X, Truck, Calendar, Trash2, Edit3, Plus, Download, Tag } from 'lucide-react';

interface VehicleDetailsModalProps {
  vehiclePlate: string | null;
  records: ExpenseRecord[];
  onClose: () => void;
  onDeleteRecord: (id: string) => void;
  onEditRecord?: (record: ExpenseRecord) => void;
  onOpenAddModal: (vehicle: string) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehiclePlate,
  records,
  onClose,
  onDeleteRecord,
  onEditRecord,
  onOpenAddModal,
}) => {
  if (!vehiclePlate) return null;

  const vehicleRecords = records
    .filter(r => r.vehicle === vehiclePlate)
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

  const totalSpend = vehicleRecords.reduce((sum, r) => sum + r.value, 0);
  const avgEntry = vehicleRecords.length > 0 ? totalSpend / vehicleRecords.length : 0;

  // Breakdown by category
  const catBreakdown: Record<string, number> = {};
  vehicleRecords.forEach(r => {
    catBreakdown[r.category] = (catBreakdown[r.category] || 0) + r.value;
  });

  const topCategory = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#18181b] border border-zinc-800 w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative font-sans text-sm text-zinc-100 max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pb-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#09090b] border border-zinc-800 px-4 py-1.5 rounded-full text-lg font-mono font-bold text-amber-400 tracking-wider shadow-sm">
              {vehiclePlate}
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-zinc-100">
                Vehicle Maintenance Log
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                Itemized maintenance ledger & parts history for vehicle {vehiclePlate}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAddModal(vehiclePlate)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer font-sans"
          >
            <Plus className="w-4 h-4" /> Log Entry
          </button>
        </div>

        {/* Quick vehicle stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 font-mono text-xs">
          <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px] uppercase font-semibold">Total Spend</div>
            <div className="text-amber-400 font-bold text-base mt-0.5">{fmtPKR(totalSpend)}</div>
          </div>
          <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px] uppercase font-semibold">Logged Entries</div>
            <div className="text-blue-400 font-bold text-base mt-0.5">{vehicleRecords.length}</div>
          </div>
          <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px] uppercase font-semibold">Avg / Line Item</div>
            <div className="text-zinc-100 font-bold text-base mt-0.5">{fmtPKR(avgEntry)}</div>
          </div>
          <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800/80">
            <div className="text-zinc-500 text-[10px] uppercase font-semibold">Top Category</div>
            <div className="text-emerald-400 font-bold text-xs mt-0.5 truncate">{topCategory[0]}</div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="flex-1 overflow-y-auto border border-zinc-800 rounded-xl scrollbar-thin">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead className="bg-[#09090b] border-b border-zinc-800 font-mono text-[10px] text-zinc-500 uppercase sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Sub-Category</th>
                <th className="py-2.5 px-3">Additional Info / Part</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Inventory</th>
                <th className="py-2.5 px-3 text-right">Total (PKR)</th>
                <th className="py-2.5 px-3 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {vehicleRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-zinc-500 font-mono">
                    No expense entries recorded for vehicle {vehiclePlate}
                  </td>
                </tr>
              ) : (
                vehicleRecords.map(r => (
                  <tr key={r.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-2.5 px-3 font-mono text-zinc-400 whitespace-nowrap">
                      {r.date || 'Undated'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        <Tag className="w-2.5 h-2.5" /> {r.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400">
                      {r.subCategory || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-100 font-medium">
                      {r.additionalInfo || r.item}
                      {r.notes && (
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {r.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-300">
                      {r.amount != null ? fmtPKR(r.amount) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-400">
                      {r.inventory != null ? fmtPKR(r.inventory) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400 whitespace-nowrap">
                      {fmtPKR(r.value)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {onEditRecord && (
                          <button
                            onClick={() => onEditRecord(r)}
                            title="Edit this entry"
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition cursor-pointer border border-amber-500/30"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete entry "${r.item}" for ${r.vehicle}?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          title="Delete this entry"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer border border-rose-500/30"
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

        {/* Modal Footer */}
        <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">
            {vehicleRecords.length} entries for plate {vehiclePlate}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition cursor-pointer font-sans"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
