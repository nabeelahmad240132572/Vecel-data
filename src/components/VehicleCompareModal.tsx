import React, { useState, useMemo } from 'react';
import { ExpenseRecord } from '../types';
import { X, ArrowRightLeft, Truck, Wrench, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

interface VehicleCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ExpenseRecord[];
  initialVehicle1?: string;
}

export const VehicleCompareModal: React.FC<VehicleCompareModalProps> = ({
  isOpen,
  onClose,
  records,
  initialVehicle1,
}) => {
  // Unique vehicle list
  const vehicleList = useMemo(() => {
    const plates = Array.from(new Set(records.map(r => r.vehicle))).sort();
    return plates;
  }, [records]);

  const [vehicle1, setVehicle1] = useState<string>(initialVehicle1 || vehicleList[0] || '');
  const [vehicle2, setVehicle2] = useState<string>(() => {
    return vehicleList.find(v => v !== (initialVehicle1 || vehicleList[0])) || vehicleList[1] || '';
  });

  // Keep state synced if initial vehicle changes
  React.useEffect(() => {
    if (initialVehicle1) {
      setVehicle1(initialVehicle1);
      const other = vehicleList.find(v => v !== initialVehicle1) || '';
      if (vehicle2 === initialVehicle1) setVehicle2(other);
    }
  }, [initialVehicle1, vehicleList]);

  // Vehicle Stats computation
  const stats1 = useMemo(() => getVehicleStats(records, vehicle1), [records, vehicle1]);
  const stats2 = useMemo(() => getVehicleStats(records, vehicle2), [records, vehicle2]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                Vehicle Side-by-Side Comparison
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  Fleet Diagnostics
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Compare expense distribution, part replacements & maintenance history between two fleet units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Selection Bar */}
        <div className="p-4 bg-[#09090b] border-b border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <label className="text-xs font-mono text-zinc-400 whitespace-nowrap">Vehicle A:</label>
            <select
              value={vehicle1}
              onChange={e => setVehicle1(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-700 text-zinc-100 font-bold text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {vehicleList.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <label className="text-xs font-mono text-zinc-400 whitespace-nowrap">Vehicle B:</label>
            <select
              value={vehicle2}
              onChange={e => setVehicle2(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-700 text-zinc-100 font-bold text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {vehicleList.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Dashboard Grid */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Top Key Metrics Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vehicle 1 Card */}
            <ComparisonVehicleSummary stats={stats1} color="blue" />
            {/* Vehicle 2 Card */}
            <ComparisonVehicleSummary stats={stats2} color="amber" />
          </div>

          {/* Category Breakdown Side by Side */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-amber-400" /> Category Breakdown Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle 1 Category Bars */}
              <div>
                <div className="text-xs font-bold text-blue-400 mb-2">{stats1.vehiclePlate}</div>
                <CategoryBarList stats={stats1} color="blue" />
              </div>

              {/* Vehicle 2 Category Bars */}
              <div>
                <div className="text-xs font-bold text-amber-400 mb-2">{stats2.vehiclePlate}</div>
                <CategoryBarList stats={stats2} color="amber" />
              </div>
            </div>
          </div>

          {/* Top Parts/Services Replaced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TopPartsCard title={`Top Replaced Parts - ${stats1.vehiclePlate}`} topItems={stats1.topItems} color="blue" />
            <TopPartsCard title={`Top Replaced Parts - ${stats2.vehiclePlate}`} topItems={stats2.topItems} color="amber" />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#18181b] border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate vehicle stats
function getVehicleStats(records: ExpenseRecord[], vehiclePlate: string) {
  const vRecords = records.filter(r => r.vehicle === vehiclePlate);
  let totalSpend = 0;
  let cashAmount = 0;
  let inventoryValue = 0;

  const categories: Record<string, number> = {};
  const items: Record<string, number> = {};

  vRecords.forEach(r => {
    totalSpend += r.value;
    if (r.amount) cashAmount += r.amount;
    if (r.inventory) inventoryValue += r.inventory;

    const cat = r.category || 'Other';
    categories[cat] = (categories[cat] || 0) + r.value;

    const itemKey = r.additionalInfo || r.item || 'General';
    items[itemKey] = (items[itemKey] || 0) + r.value;
  });

  const sortedCategories = Object.entries(categories)
    .map(([name, val]) => ({ name, val, pct: totalSpend > 0 ? (val / totalSpend) * 100 : 0 }))
    .sort((a, b) => b.val - a.val);

  const sortedItems = Object.entries(items)
    .map(([name, val]) => ({ name, val }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 5);

  return {
    vehiclePlate,
    recordCount: vRecords.length,
    totalSpend,
    cashAmount,
    inventoryValue,
    avgPerEntry: vRecords.length > 0 ? totalSpend / vRecords.length : 0,
    categories: sortedCategories,
    topItems: sortedItems,
  };
}

// Subcomponent: Summary Card
const ComparisonVehicleSummary: React.FC<{ stats: ReturnType<typeof getVehicleStats>; color: 'blue' | 'amber' }> = ({
  stats,
  color,
}) => {
  const isBlue = color === 'blue';
  const borderColor = isBlue ? 'border-blue-500/30' : 'border-amber-500/30';
  const textColor = isBlue ? 'text-blue-400' : 'text-amber-400';
  const bgBadge = isBlue ? 'bg-blue-500/10' : 'bg-amber-500/10';

  return (
    <div className={`bg-[#18181b] border ${borderColor} p-4 sm:p-5 rounded-2xl space-y-4`}>
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Truck className={`w-5 h-5 ${textColor}`} />
          <span className="text-xl font-extrabold text-zinc-100">{stats.vehiclePlate}</span>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${bgBadge} ${textColor}`}>
          {stats.recordCount} Ledger Lines
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-sans uppercase">Total Maintenance Spend</div>
          <div className={`text-lg font-bold ${textColor} mt-0.5`}>
            PKR {stats.totalSpend.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-sans uppercase">Avg Spend / Job Line</div>
          <div className="text-lg font-bold text-zinc-200 mt-0.5">
            PKR {Math.round(stats.avgPerEntry).toLocaleString()}
          </div>
        </div>

        <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-sans uppercase">Cash Outflow</div>
          <div className="text-sm font-semibold text-emerald-400 mt-0.5">
            PKR {stats.cashAmount.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#09090b] p-3 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-sans uppercase">Warehouse Inventory</div>
          <div className="text-sm font-semibold text-purple-400 mt-0.5">
            PKR {stats.inventoryValue.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Category Bar List
const CategoryBarList: React.FC<{ stats: ReturnType<typeof getVehicleStats>; color: 'blue' | 'amber' }> = ({
  stats,
  color,
}) => {
  const barColor = color === 'blue' ? 'bg-blue-500' : 'bg-amber-500';

  if (stats.categories.length === 0) {
    return <div className="text-xs text-zinc-500 font-mono py-2">No records logged for this vehicle.</div>;
  }

  return (
    <div className="space-y-2.5">
      {stats.categories.map(cat => (
        <div key={cat.name} className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300 font-sans">{cat.name}</span>
            <span className="text-zinc-400">PKR {cat.val.toLocaleString()} ({Math.round(cat.pct)}%)</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.min(100, cat.pct)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Subcomponent: Top Parts Card
const TopPartsCard: React.FC<{ title: string; topItems: { name: string; val: number }[]; color: 'blue' | 'amber' }> = ({
  title,
  topItems,
  color,
}) => {
  const textColor = color === 'blue' ? 'text-blue-400' : 'text-amber-400';

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4">
      <h4 className={`text-xs font-bold font-mono ${textColor} uppercase mb-3`}>{title}</h4>
      <div className="space-y-2">
        {topItems.length === 0 ? (
          <p className="text-xs text-zinc-500">No items available</p>
        ) : (
          topItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-[#09090b] border border-zinc-800/80">
              <span className="text-zinc-200 truncate max-w-[200px]" title={item.name}>
                {item.name}
              </span>
              <span className="font-mono font-semibold text-zinc-400">
                PKR {item.val.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
