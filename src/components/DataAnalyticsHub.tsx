import React, { useState, useMemo } from 'react';
import { ExpenseRecord, FilterState } from '../types';
import { fmtPKR } from '../data/initialData';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertCircle, 
  Calendar, 
  Layers, 
  Zap, 
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Sliders,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Edit3,
  Trash2
} from 'lucide-react';

interface DataAnalyticsHubProps {
  records: ExpenseRecord[];
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onOpenVehicleModal: (vehicle: string) => void;
  onEditRecord?: (record: ExpenseRecord) => void;
  onDeleteRecord?: (id: string) => void;
}

export const DataAnalyticsHub: React.FC<DataAnalyticsHubProps> = ({
  records,
  onUpdateFilters,
  onOpenVehicleModal,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'outflow' | 'anomalies' | 'dayOfWeek' | 'partsMatrix'>('outflow');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Compute comprehensive analytical metrics
  const analyticsData = useMemo(() => {
    let cashTotal = 0;
    let inventoryTotal = 0;
    let serviceTotal = 0;
    let salaryAdvanceTotal = 0;

    const values = records.map(r => r.value);
    const totalSpend = values.reduce((a, b) => a + b, 0);
    const avgSpend = records.length > 0 ? totalSpend / records.length : 0;

    // Financial outflow breakdown
    records.forEach(r => {
      if (r.amount) cashTotal += r.amount;
      if (r.inventory) inventoryTotal += r.inventory;
      if (r.category === 'Service Expense') serviceTotal += r.value;
      if (r.salaryAdvance) salaryAdvanceTotal += r.salaryAdvance;
    });

    // Day of week analysis
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats: Record<string, { total: number; count: number }> = {};
    dayNames.forEach(d => (dayStats[d] = { total: 0, count: 0 }));

    records.forEach(r => {
      if (r.date) {
        const d = new Date(r.date);
        if (!isNaN(d.getTime())) {
          const dayName = dayNames[d.getDay()];
          dayStats[dayName].total += r.value;
          dayStats[dayName].count += 1;
        }
      }
    });

    const dayOfWeekList = dayNames.map(name => ({
      day: name,
      total: dayStats[name].total,
      count: dayStats[name].count,
      pct: totalSpend > 0 ? (dayStats[name].total / totalSpend) * 100 : 0,
    }));

    // Anomaly / Outlier Detection (Entries > 2 font-mono standard factor or > PKR 3,000)
    const anomalyThreshold = Math.max(3000, avgSpend * 2);
    const anomalies = records
      .filter(r => r.value >= anomalyThreshold)
      .sort((a, b) => b.value - a.value);

    // Spare parts & item breakdown matrix
    const itemMap: Record<string, { total: number; count: number; vehicles: Set<string>; type: 'inventory' | 'cash' | 'both' }> = {};
    records.forEach(r => {
      const itemKey = r.additionalInfo || r.item || 'General Expense';
      if (!itemMap[itemKey]) {
        itemMap[itemKey] = { total: 0, count: 0, vehicles: new Set(), type: r.inventory ? 'inventory' : 'cash' };
      }
      itemMap[itemKey].total += r.value;
      itemMap[itemKey].count += 1;
      itemMap[itemKey].vehicles.add(r.vehicle);
      if (r.inventory && !r.amount) itemMap[itemKey].type = 'inventory';
      else if (r.inventory && r.amount) itemMap[itemKey].type = 'both';
    });

    const sortedItems = Object.entries(itemMap)
      .map(([name, d]) => ({
        name,
        total: d.total,
        count: d.count,
        vehicleCount: d.vehicles.size,
        type: d.type,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      totalSpend,
      avgSpend,
      cashTotal,
      inventoryTotal,
      serviceTotal,
      salaryAdvanceTotal,
      cashPct: totalSpend > 0 ? (cashTotal / totalSpend) * 100 : 0,
      inventoryPct: totalSpend > 0 ? (inventoryTotal / totalSpend) * 100 : 0,
      dayOfWeekList,
      anomalies,
      sortedItems,
    };
  }, [records]);

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              Advanced Fleet Data Analytics & Cost Intelligence
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                Analytics Hub
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Deep data insights, cash vs warehouse stock analysis, outlier detection & item breakdown
            </p>
          </div>
        </div>

        {/* Tab Buttons & User Guide Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-blue-400 border border-blue-500/30 transition cursor-pointer flex items-center gap-1.5"
            title="Dashboard Usage Guide & Explainer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Usage Guide</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#09090b] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('outflow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'outflow'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Outflow Split
            </button>

            <button
              onClick={() => setActiveTab('anomalies')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'anomalies'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" /> Major Overhauls ({analyticsData.anomalies.length})
            </button>

            <button
              onClick={() => setActiveTab('dayOfWeek')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dayOfWeek'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Day Trends
            </button>

            <button
              onClick={() => setActiveTab('partsMatrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'partsMatrix'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Parts Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Interactive Help Guide */}
      {showGuide && (
        <div className="bg-[#09090b] border border-blue-500/30 p-4 rounded-xl mb-5 space-y-3 text-xs text-zinc-300 transition animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-blue-400 flex items-center gap-2 font-mono uppercase tracking-wider text-[11px]">
              <Info className="w-4 h-4 text-blue-400" /> Fleet Ledger Quick Guide & Understanding Help
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Descon Operations Ledger</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#121215] p-3 rounded-lg border border-zinc-800">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Cash vs Store Inventory
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <strong>Cash Paid:</strong> Out-of-pocket cash given for external workshop repair & fuel.<br/>
                <strong>Warehouse Store:</strong> Issued spare parts directly from Descon store inventory.
              </p>
            </div>

            <div className="bg-[#121215] p-3 rounded-lg border border-zinc-800">
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Major Overhauls
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Single repairs costing ≥ <strong>PKR 3,000</strong> are flagged as Major Overhauls for auditing & maintenance tracking.
              </p>
            </div>

            <div className="bg-[#121215] p-3 rounded-lg border border-zinc-800">
              <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Day Trends & Peak Days
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Shows which day of the week experiences highest vehicle maintenance spending to optimize workshop scheduling.
              </p>
            </div>

            <div className="bg-[#121215] p-3 rounded-lg border border-zinc-800">
              <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Interactive Filtering
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Click any vehicle number or category pill anywhere to filter the charts, tables, and total ledger instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Financial Outflow Split (Cash vs Inventory Stock) */}
      {activeTab === 'outflow' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cash Outflow Card */}
            <div className="bg-[#09090b] border border-emerald-500/30 p-4 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Direct Cash Paid
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {Math.round(analyticsData.cashPct)}% of Total
                </span>
              </div>
              <div className="text-xl font-black text-zinc-100 font-mono">
                PKR {analyticsData.cashTotal.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Direct out-of-pocket cash spent on external mechanics, fuel & services.
              </p>
              <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analyticsData.cashPct}%` }} />
              </div>
            </div>

            {/* Warehouse Inventory Stock Consumption Card */}
            <div className="bg-[#09090b] border border-purple-500/30 p-4 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-purple-400 font-semibold uppercase flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" /> Warehouse Inventory Used
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {Math.round(analyticsData.inventoryPct)}% of Total
                </span>
              </div>
              <div className="text-xl font-black text-zinc-100 font-mono">
                PKR {analyticsData.inventoryTotal.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Value of spare parts, oil barrels & shoes issued directly from Descon store.
              </p>
              <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${analyticsData.inventoryPct}%` }} />
              </div>
            </div>

            {/* Service & Workshop Fees */}
            <div className="bg-[#09090b] border border-blue-500/30 p-4 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-blue-400 font-semibold uppercase flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" /> Service & Labor Expenses
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Labor & Alignment
                </span>
              </div>
              <div className="text-xl font-black text-zinc-100 font-mono">
                PKR {analyticsData.serviceTotal.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Routine service charges, workshop labor fees, alignment & balancing.
              </p>
              <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(analyticsData.serviceTotal / (analyticsData.totalSpend || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#09090b] p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <strong>Analytical Insight:</strong> {analyticsData.inventoryPct > 30 ? 'High warehouse store utilization' : 'Balanced inventory stock distribution'}. Consuming store inventory saves direct cash outflow.
            </span>
            <button
              onClick={() => onUpdateFilters({ search: 'Inventory' })}
              className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-blue-400 border border-zinc-700 rounded-lg text-xs font-mono transition cursor-pointer"
            >
              Filter Store Inventory Records
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Major Overhauls & Outlier Transactions */}
      {activeTab === 'anomalies' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
            <span>High Value Overhauls (Single line expenses ≥ PKR 3,000)</span>
            <span>Total Identified: {analyticsData.anomalies.length} entries</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
            {analyticsData.anomalies.map(r => (
              <div
                key={r.id}
                className="bg-[#09090b] border border-amber-500/20 hover:border-amber-500/40 p-3 rounded-xl transition flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => onOpenVehicleModal(r.vehicle)}
                      className="text-xs font-bold font-mono text-zinc-100 hover:text-amber-400 cursor-pointer bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800"
                    >
                      {r.vehicle}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{r.date || 'Undated'}</span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 mt-1 truncate max-w-[260px]" title={r.additionalInfo || r.item}>
                    {r.additionalInfo || r.item}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Category: {r.category} {r.subCategory ? `(${r.subCategory})` : ''}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <div className="text-sm font-bold font-mono text-amber-400">
                    PKR {r.value.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {onEditRecord && (
                      <button
                        onClick={() => onEditRecord(r)}
                        title="Edit this entry"
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 cursor-pointer transition"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    )}
                    {onDeleteRecord && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete record "${r.item}" for ${r.vehicle}?`)) {
                            onDeleteRecord(r.id);
                          }
                        }}
                        title="Delete this entry"
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 cursor-pointer transition"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateFilters({ vehicle: r.vehicle })}
                      className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer ml-1"
                    >
                      Filter <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Day of Week Analytics */}
      {activeTab === 'dayOfWeek' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400 font-mono mb-2">
            Maintenance expenditure grouped by day of the week to analyze peak workshop days:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
            {analyticsData.dayOfWeekList.map(item => (
              <div
                key={item.day}
                className="bg-[#09090b] border border-zinc-800 p-3 rounded-xl text-center flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-300 font-mono">{item.day.slice(0, 3)}</div>
                  <div className="text-xs font-extrabold text-purple-400 font-mono mt-1">
                    PKR {Math.round(item.total).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.count} logs</div>
                </div>

                <div className="mt-3 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, item.pct * 2.5)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Parts & Spare Items Matrix */}
      {activeTab === 'partsMatrix' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Aggregated Spare Parts & Maintenance Jobs List</span>
            <span>Total Unique Jobs: {analyticsData.sortedItems.length}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#09090b] text-zinc-400 font-mono text-[11px] uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-2.5">Part / Description</th>
                  <th className="p-2.5">Source Type</th>
                  <th className="p-2.5 text-center">Log Count</th>
                  <th className="p-2.5 text-center">Vehicles Used</th>
                  <th className="p-2.5 text-right">Total PKR Spend</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-[#121215]">
                {analyticsData.sortedItems.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/40 transition">
                    <td className="p-2.5 font-bold text-zinc-100">{item.name}</td>
                    <td className="p-2.5 font-mono text-[10px]">
                      {item.type === 'inventory' ? (
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Store Inventory
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Cash Purchase
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-center font-mono">{item.count} times</td>
                    <td className="p-2.5 text-center font-mono">{item.vehicleCount} vehicles</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-400">
                      PKR {item.total.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => onUpdateFilters({ search: item.name })}
                        className="text-[10px] font-mono text-blue-400 hover:underline cursor-pointer"
                      >
                        Filter Logs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
function Wrench(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
