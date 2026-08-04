import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  FileCheck2,
  Wrench,
  Search,
  Filter,
  DollarSign,
  Package,
  Truck,
  ArrowUpRight,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  BarChart3,
  Check,
  RotateCcw
} from 'lucide-react';
import { ExpenseRecord, FilterState } from '../types';
import { fmtPKR } from '../data/initialData';

interface AnomalyAndVehicleActionGraphicProps {
  records: ExpenseRecord[];
  allRecords: ExpenseRecord[];
  onFilterByVehicle: (plate: string) => void;
  onFilterByCategory: (cat: string) => void;
  onOpenVehicleDetails?: (plate: string) => void;
}

interface ActionItem {
  id: string;
  vehicle: string;
  type: 'High Cost' | 'Repeat Replacement' | 'Store Discrepancy' | 'Irregular Frequency';
  title: string;
  recommendedAction: string;
  cost: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export const AnomalyAndVehicleActionGraphic: React.FC<AnomalyAndVehicleActionGraphicProps> = ({
  records,
  allRecords,
  onFilterByVehicle,
  onFilterByCategory,
  onOpenVehicleDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'anomalies' | 'totalBreakdown' | 'vehicleHealth' | 'actions'>('anomalies');
  const [showGraphicDiagram, setShowGraphicDiagram] = useState<boolean>(true);
  const [actionStatuses, setActionStatuses] = useState<Record<string, 'Pending' | 'In Progress' | 'Resolved'>>({});

  // 1. Detect Irregular Expenses & Anomalies
  const anomalyAnalysis = useMemo(() => {
    const list: Array<{
      record: ExpenseRecord;
      score: number;
      reasons: string[];
      riskLevel: 'High' | 'Medium' | 'Low';
    }> = [];

    // Map for frequency detection (same item on same vehicle)
    const itemVehicleMap: Record<string, ExpenseRecord[]> = {};

    records.forEach(r => {
      const key = `${r.vehicle}_${r.category}_${r.item.toLowerCase().trim()}`;
      if (!itemVehicleMap[key]) itemVehicleMap[key] = [];
      itemVehicleMap[key].push(r);
    });

    records.forEach(r => {
      let score = 0;
      const reasons: string[] = [];

      // Reason 1: High Cost Overhaul (>= 3000 PKR)
      if (r.value >= 5000) {
        score += 50;
        reasons.push(`Extreme Cost Spike (${fmtPKR(r.value)})`);
      } else if (r.value >= 3000) {
        score += 30;
        reasons.push(`Major Overhaul Expense (${fmtPKR(r.value)})`);
      }

      // Reason 2: Repeat Part Replacement
      const key = `${r.vehicle}_${r.category}_${r.item.toLowerCase().trim()}`;
      const duplicates = itemVehicleMap[key] || [];
      if (duplicates.length > 1) {
        score += 25;
        reasons.push(`Repeated part replacement (${duplicates.length} times for '${r.item}')`);
      }

      // Reason 3: High Inventory vs Direct Purchase disparity
      if (r.inventory && r.inventory > 4000) {
        score += 20;
        reasons.push(`Unusually high warehouse store stock issuance (${fmtPKR(r.inventory)})`);
      }

      if (score > 0) {
        list.push({
          record: r,
          score,
          reasons,
          riskLevel: score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low',
        });
      }
    });

    return list.sort((a, b) => b.score - a.score);
  }, [records]);

  // 2. Aggregate Vehicle Health & Cost Risk Matrix
  const vehicleMatrix = useMemo(() => {
    const map: Record<
      string,
      {
        vehicle: string;
        totalSpend: number;
        cashPurchase: number;
        inventoryStock: number;
        recordCount: number;
        anomaliesCount: number;
        topCategory: string;
      }
    > = {};

    records.forEach(r => {
      if (!r.vehicle) return;
      if (!map[r.vehicle]) {
        map[r.vehicle] = {
          vehicle: r.vehicle,
          totalSpend: 0,
          cashPurchase: 0,
          inventoryStock: 0,
          recordCount: 0,
          anomaliesCount: 0,
          topCategory: r.category,
        };
      }

      map[r.vehicle].totalSpend += r.value;
      map[r.vehicle].recordCount += 1;
      if (r.inventory && r.inventory > 0) {
        map[r.vehicle].inventoryStock += r.inventory;
      } else {
        map[r.vehicle].cashPurchase += r.value;
      }

      if (r.value >= 3000) {
        map[r.vehicle].anomaliesCount += 1;
      }
    });

    return Object.values(map).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [records]);

  // 3. Recommended Necessary Actions Matrix
  const recommendedActions = useMemo<ActionItem[]>(() => {
    const actions: ActionItem[] = [];

    vehicleMatrix.forEach(vm => {
      if (vm.anomaliesCount > 0 || vm.totalSpend > 8000) {
        actions.push({
          id: `act_${vm.vehicle}_audit`,
          vehicle: vm.vehicle,
          type: 'High Cost',
          title: `Technical & Audit Inspection for Vehicle ${vm.vehicle}`,
          recommendedAction: `Schedule workshop audit. Total spend reached ${fmtPKR(vm.totalSpend)} across ${vm.recordCount} repairs.`,
          cost: vm.totalSpend,
          priority: vm.totalSpend > 12000 ? 'High' : 'Medium',
          status: actionStatuses[`act_${vm.vehicle}_audit`] || 'Pending',
        });
      }

      if (vm.inventoryStock > 5000) {
        actions.push({
          id: `act_${vm.vehicle}_store`,
          vehicle: vm.vehicle,
          type: 'Store Discrepancy',
          title: `Store Inventory Dispatch Re-verification for ${vm.vehicle}`,
          recommendedAction: `Verify store gate passes. Warehouse store parts value issued is ${fmtPKR(vm.inventoryStock)}.`,
          cost: vm.inventoryStock,
          priority: 'High',
          status: actionStatuses[`act_${vm.vehicle}_store`] || 'Pending',
        });
      }
    });

    // Add specific anomaly items
    anomalyAnalysis.slice(0, 5).forEach((item, idx) => {
      actions.push({
        id: `act_anomaly_${item.record.id}`,
        vehicle: item.record.vehicle,
        type: 'Irregular Frequency',
        title: `Investigate Expense Anomaly: ${item.record.item} on ${item.record.vehicle}`,
        recommendedAction: `Check maintenance log on ${item.record.date}. Reason: ${item.reasons.join('; ')}.`,
        cost: item.record.value,
        priority: item.riskLevel === 'High' ? 'High' : 'Medium',
        status: actionStatuses[`act_anomaly_${item.record.id}`] || 'Pending',
      });
    });

    return actions;
  }, [vehicleMatrix, anomalyAnalysis, actionStatuses]);

  // Toggle action status
  const handleToggleStatus = (id: string) => {
    setActionStatuses(prev => {
      const curr = prev[id] || 'Pending';
      const next = curr === 'Pending' ? 'In Progress' : curr === 'In Progress' ? 'Resolved' : 'Pending';
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="bg-[#18181b] border border-amber-500/30 rounded-2xl p-5 mb-6 shadow-2xl relative overflow-hidden transition-all">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-red-500 to-blue-500" />

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-base font-black uppercase tracking-wide text-zinc-100 flex items-center gap-2">
              Fleet Expense Anomaly & Vehicle Action Matrix
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold animate-pulse">
              {anomalyAnalysis.length} Anomalies Flagged
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            AI & Rule-based diagnostic center for irregular maintenance costs, vehicle health risk scores, and executive action workflows.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#09090b] p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'anomalies'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Irregular Expenses ({anomalyAnalysis.length})
          </button>

          <button
            onClick={() => setActiveTab('vehicleHealth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vehicleHealth'
                ? 'bg-blue-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Vehicle Health Matrix
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'actions'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Necessary Actions ({recommendedActions.length})
          </button>
        </div>
      </div>

      {/* Interactive Vector Diagnostic Blueprint Diagram (No raster photo used) */}
      {showGraphicDiagram && (
        <div className="mt-4 relative rounded-xl overflow-hidden border border-zinc-800 bg-[#09090b] transition-all p-4">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 text-zinc-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Fleet Expense Telemetry & Diagnostic Flowchart Diagram
              </span>
            </div>
            <button
              onClick={() => setShowGraphicDiagram(false)}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 cursor-pointer font-mono"
            >
              Hide Diagram
            </button>
          </div>

          {/* Flowchart Diagram Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
            {/* Connecting Line background on desktop */}
            <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-500/30 via-amber-500/30 to-emerald-500/30 -translate-y-1/2 pointer-events-none z-0" />

            {/* Step 1: Ingestion */}
            <div className="relative z-10 bg-[#121215] border border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                  STEP 01
                </span>
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 font-mono">1. Ledger Ingestion</h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Cash purchases & Descon store warehouse stock issuances logged per vehicle.
                </p>
              </div>
              <div className="text-[10px] font-mono text-blue-400 bg-blue-950/40 p-1.5 rounded border border-blue-900/60 mt-2">
                Total Logs: {records.length}
              </div>
            </div>

            {/* Step 2: Anomaly Engine */}
            <div className="relative z-10 bg-[#121215] border border-amber-500/30 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                  STEP 02
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 font-mono">2. Anomaly Engine</h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Scans cost spikes (≥3,000 PKR), repeat part replacements & stock discrepancies.
                </p>
              </div>
              <div className="text-[10px] font-mono text-amber-400 bg-amber-950/40 p-1.5 rounded border border-amber-900/60 mt-2 font-bold">
                Flagged Spikes: {anomalyAnalysis.length}
              </div>
            </div>

            {/* Step 3: Vehicle Risk Index */}
            <div className="relative z-10 bg-[#121215] border border-purple-500/30 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">
                  STEP 03
                </span>
                <Truck className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 font-mono">3. Vehicle Health Score</h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Computes risk score per license plate based on total repair expenditure.
                </p>
              </div>
              <div className="text-[10px] font-mono text-purple-400 bg-purple-950/40 p-1.5 rounded border border-purple-900/60 mt-2">
                Active Vehicles: {vehicleMatrix.length}
              </div>
            </div>

            {/* Step 4: Action Directives */}
            <div className="relative z-10 bg-[#121215] border border-emerald-500/30 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  STEP 04
                </span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 font-mono">4. Action Directives</h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Generates workshop audits, gate-pass verifications & clearance directives.
                </p>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-900/60 mt-2 font-bold">
                Directives Generated: {recommendedActions.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showGraphicDiagram && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setShowGraphicDiagram(true)}
            className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" /> Show Diagnostic Flowchart Diagram
          </button>
        </div>
      )}

      {/* Tab 1: Irregular Expenses & Anomaly Detection */}
      {activeTab === 'anomalies' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Showing detected irregular transactions across filtered ledger</span>
            <span>Sorted by Anomaly Severity Score</span>
          </div>

          {anomalyAnalysis.length === 0 ? (
            <div className="bg-[#09090b] border border-zinc-800 p-8 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-200">No Expense Anomalies Detected</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                All maintenance records within current filters fall within standard cost thresholds and repair frequencies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {anomalyAnalysis.map(({ record, score, reasons, riskLevel }) => (
                <div
                  key={record.id}
                  className={`bg-[#09090b] border p-4 rounded-xl flex flex-col justify-between space-y-3 transition hover:scale-[1.01] ${
                    riskLevel === 'High'
                      ? 'border-red-500/40 bg-red-950/10'
                      : riskLevel === 'Medium'
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-zinc-800'
                  }`}
                >
                  <div>
                    {/* Header Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        onClick={() => onFilterByVehicle(record.vehicle)}
                        className="font-mono text-xs font-black text-zinc-100 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700 hover:bg-blue-600 hover:text-white cursor-pointer transition flex items-center gap-1"
                        title="Click to filter by vehicle"
                      >
                        <Truck className="w-3 h-3 text-blue-400" /> {record.vehicle}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          riskLevel === 'High'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {riskLevel} Anomaly ({score} pts)
                      </span>
                    </div>

                    {/* Part & Cost */}
                    <div className="text-sm font-bold text-zinc-100 flex items-baseline justify-between mt-2">
                      <span className="truncate pr-2" title={record.item}>
                        {record.item}
                      </span>
                      <span className="font-mono font-black text-amber-400 text-base shrink-0">
                        {fmtPKR(record.value)}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 mt-1 font-mono flex items-center justify-between">
                      <span>Date: {record.date}</span>
                      <span
                        onClick={() => onFilterByCategory(record.category)}
                        className="text-blue-400 hover:underline cursor-pointer"
                      >
                        Category: {record.category}
                      </span>
                    </div>

                    {/* Reasons List */}
                    <div className="mt-3 pt-2 border-t border-zinc-800/80 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">
                        Diagnostic Flags:
                      </span>
                      {reasons.map((r, i) => (
                        <div key={i} className="text-[11px] text-amber-300 font-sans flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onOpenVehicleDetails && onOpenVehicleDetails(record.vehicle)}
                      className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Vehicle Ledger</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onFilterByVehicle(record.vehicle)}
                      className="text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 cursor-pointer"
                    >
                      Filter Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Vehicle Health & Risk Score Matrix */}
      {activeTab === 'vehicleHealth' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>All vehicles ranked by maintenance expenditure & risk flags</span>
            <span>Click any vehicle card to drill down</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {vehicleMatrix.map(vm => {
              const riskCategory =
                vm.anomaliesCount > 0 ? 'High Cost Anomaly' : vm.totalSpend > 8000 ? 'Moderate Spend' : 'Optimal';

              return (
                <div
                  key={vm.vehicle}
                  className="bg-[#09090b] border border-zinc-800 hover:border-blue-500/50 p-4 rounded-xl transition flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Truck className="w-4 h-4" />
                        </span>
                        <span className="font-mono text-sm font-black text-zinc-100 group-hover:text-blue-400 transition">
                          {vm.vehicle}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          riskCategory === 'High Cost Anomaly'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : riskCategory === 'Moderate Spend'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {riskCategory}
                      </span>
                    </div>

                    {/* Spend Metrics */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-[#121215] p-2 rounded-lg border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 block">Total Spend</span>
                        <span className="font-bold text-amber-400">{fmtPKR(vm.totalSpend)}</span>
                      </div>
                      <div className="bg-[#121215] p-2 rounded-lg border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 block">Repairs Count</span>
                        <span className="font-bold text-zinc-200">{vm.recordCount} logs</span>
                      </div>
                    </div>

                    {/* Breakdown Cash vs Store */}
                    <div className="mt-2 text-[11px] font-mono text-zinc-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Cash Purchases:</span>
                        <span className="text-emerald-400 font-bold">{fmtPKR(vm.cashPurchase)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store Inventory:</span>
                        <span className="text-purple-400 font-bold">{fmtPKR(vm.inventoryStock)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      onClick={() => onFilterByVehicle(vm.vehicle)}
                      className="text-[11px] font-mono text-blue-400 hover:underline cursor-pointer"
                    >
                      Filter Vehicle Logs
                    </button>

                    {onOpenVehicleDetails && (
                      <button
                        onClick={() => onOpenVehicleDetails(vm.vehicle)}
                        className="text-[10px] font-mono bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white px-2.5 py-1 rounded border border-blue-500/30 cursor-pointer transition"
                      >
                        Open Full Profile
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Necessary Actions Decision Matrix */}
      {activeTab === 'actions' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Executive & Workshop Directives generated from ledger analysis</span>
            <span>Click buttons to update directive status</span>
          </div>

          <div className="space-y-2.5">
            {recommendedActions.map(act => (
              <div
                key={act.id}
                className={`bg-[#09090b] border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  act.status === 'Resolved'
                    ? 'border-emerald-500/30 opacity-70 bg-emerald-950/10'
                    : act.priority === 'High'
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : 'border-zinc-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        act.priority === 'High'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {act.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-zinc-200 flex items-center gap-1 font-mono">
                      <Truck className="w-3.5 h-3.5 text-blue-400" /> {act.vehicle}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">({act.type})</span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-100">{act.title}</h4>
                  <p className="text-xs text-zinc-400 font-sans">{act.recommendedAction}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {fmtPKR(act.cost)}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(act.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      act.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : act.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {act.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {act.status === 'In Progress' && <Activity className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                    <span>Status: {act.status}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
