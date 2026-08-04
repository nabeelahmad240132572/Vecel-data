import React, { useState, useMemo } from 'react';
import { ExpenseRecord, FilterState } from './types';
import {
  getStoredRecords,
  saveStoredRecords,
  filterRecords,
  computeAnalytics,
  exportToCSV,
} from './utils/dataStore';
import { INITIAL_RECORDS, SHEET_RECORDS, FULL_DOC_RECORDS } from './data/initialData';

import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KPICards } from './components/KPICards';
import { TrendChart } from './components/TrendChart';
import { CategoryPieChart } from './components/CategoryPieChart';
import { VehicleBarChart } from './components/VehicleBarChart';
import { TopItemsList } from './components/TopItemsList';
import { VehicleTable } from './components/VehicleTable';
import { AddExpenseModal } from './components/AddExpenseModal';
import { VehicleDetailsModal } from './components/VehicleDetailsModal';
import { VehicleCompareModal } from './components/VehicleCompareModal';
import { DataAnalyticsHub } from './components/DataAnalyticsHub';
import { AnomalyAndVehicleActionGraphic } from './components/AnomalyAndVehicleActionGraphic';
import { LayoutDashboard, AlertTriangle, Truck, Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<ExpenseRecord[]>(() => getStoredRecords());
  const [activeDataset, setActiveDataset] = useState<'sheet' | 'full'>('sheet');
  const [activePage, setActivePage] = useState<'overview' | 'anomalyMatrix' | 'vehicleRegister' | 'fullView'>('overview');

  const handleSwitchDataset = (mode: 'sheet' | 'full') => {
    setActiveDataset(mode);
    const target = mode === 'sheet' ? SHEET_RECORDS : FULL_DOC_RECORDS;
    setRecords(target);
    saveStoredRecords(target);
    handleClearFilters();
  };

  const [filters, setFilters] = useState<FilterState>({
    category: null,
    vehicle: null,
    item: null,
    dateStart: null,
    dateEnd: null,
    search: '',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialVehicle, setAddModalInitialVehicle] = useState('');
  const [inspectedVehicle, setInspectedVehicle] = useState<string | null>(null);

  // Compare Modal State
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareVehicle1, setCompareVehicle1] = useState<string | undefined>(undefined);

  const handleOpenCompare = (vPlate?: string) => {
    setCompareVehicle1(vPlate);
    setIsCompareModalOpen(true);
  };

  // Compute filtered records & analytics memoized
  const filteredRecords = useMemo(
    () => filterRecords(records, filters),
    [records, filters]
  );

  const analytics = useMemo(
    () => computeAnalytics(filteredRecords, records),
    [filteredRecords, records]
  );

  // Unique list of vehicle plates for dropdown
  const existingPlates = useMemo(() => {
    const set = new Set(records.map(r => r.vehicle));
    return Array.from(set).sort();
  }, [records]);

  // Filter handlers
  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: null,
      vehicle: null,
      item: null,
      dateStart: null,
      dateEnd: null,
      search: '',
    });
  };

  const handleToggleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category,
    }));
  };

  const handleToggleVehicleFilter = (vehicle: string) => {
    setFilters(prev => ({
      ...prev,
      vehicle: prev.vehicle === vehicle ? null : vehicle,
    }));
  };

  const handleToggleItemFilter = (item: string) => {
    setFilters(prev => ({
      ...prev,
      item: prev.item === item ? null : item,
    }));
  };

  // Add Record
  const handleAddRecord = (newRecord: ExpenseRecord) => {
    const updated = [newRecord, ...records];
    setRecords(updated);
    saveStoredRecords(updated);
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    saveStoredRecords(updated);
  };

  // Reset to original data
  const handleResetData = () => {
    if (window.confirm('Reset all maintenance records to original Descon dataset?')) {
      setRecords(INITIAL_RECORDS);
      saveStoredRecords(INITIAL_RECORDS);
      handleClearFilters();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    exportToCSV(filteredRecords);
  };

  const isFiltered =
    Boolean(filters.category) ||
    Boolean(filters.vehicle) ||
    Boolean(filters.item) ||
    Boolean(filters.dateStart) ||
    Boolean(filters.dateEnd) ||
    Boolean(filters.search.trim());

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-amber-400 selection:text-zinc-900">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.06),transparent_50%)] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header */}
        <Header
          dateStart={analytics.dateRange.start}
          dateEnd={analytics.dateRange.end}
          totalRecordsCount={records.length}
          activeDataset={activeDataset}
          onSwitchDataset={handleSwitchDataset}
          onOpenAddModal={() => {
            setAddModalInitialVehicle('');
            setIsAddModalOpen(true);
          }}
          onExportCSV={handleExportCSV}
          onResetData={handleResetData}
          onOpenCompare={() => handleOpenCompare()}
        />

        {/* Global Cross-Filter Bar */}
        <FilterBar
          filters={filters}
          onUpdateFilters={handleUpdateFilters}
          onClearAll={handleClearFilters}
          filteredCount={filteredRecords.length}
          totalCount={records.length}
          records={records}
        />

        {/* Top Page Navigation Bar / Module Switcher */}
        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-2 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActivePage('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activePage === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Overview & Charts</span>
            </button>

            <button
              onClick={() => setActivePage('anomalyMatrix')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
                activePage === 'anomalyMatrix'
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/25'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Fleet Expense Anomaly & Vehicle Action Matrix</span>
              <span className="ml-1 text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold animate-pulse">
                New Page
              </span>
            </button>

            <button
              onClick={() => setActivePage('vehicleRegister')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activePage === 'vehicleRegister'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Vehicle Register</span>
            </button>

            <button
              onClick={() => setActivePage('fullView')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activePage === 'fullView'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>All Modules (Single Page)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-400 px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode: <strong className="text-zinc-200 uppercase">{activePage}</strong></span>
          </div>
        </div>

        {/* PAGE 1: OVERVIEW DASHBOARD */}
        {(activePage === 'overview' || activePage === 'fullView') && (
          <div className="space-y-6">
            {/* KPI Strip */}
            <KPICards
              totalSpend={analytics.totalSpend}
              totalAllSpend={analytics.totalAllSpend}
              totalInventory={analytics.totalInventory}
              totalPurchase={analytics.totalPurchase}
              recordCount={analytics.recordCount}
              vehicleCount={analytics.vehicleCount}
              avgPerEntry={analytics.avgPerEntry}
              avgPerVehicle={analytics.avgPerVehicle}
              isFiltered={isFiltered}
              subCategories={analytics.subCategories}
              onSelectSubCategory={subCat => handleUpdateFilters({ search: subCat })}
            />

            {/* Quick Banner Callout for Dedicated Anomaly Matrix */}
            {activePage === 'overview' && (
              <div
                onClick={() => setActivePage('anomalyMatrix')}
                className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-blue-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-amber-500/60 transition group shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 font-mono flex items-center gap-2">
                      <span>Dedicated Anomaly Detection & Vehicle Action Page</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400 text-zinc-950 font-bold">
                        NEW MATRIX PAGE
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Explore detailed cost spike radar, warehouse store vs cash breakdown, health index & action directives.
                    </p>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 transition shrink-0 shadow-lg">
                  Open Anomaly Matrix Page <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Data Analytics & Cost Intelligence Hub */}
            <DataAnalyticsHub
              records={filteredRecords}
              onUpdateFilters={handleUpdateFilters}
              onOpenVehicleModal={plate => setInspectedVehicle(plate)}
            />

            {/* First Grid Row: Daily Spend Trend & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7">
                <TrendChart data={analytics.dailyTrend} />
              </div>
              <div className="lg:col-span-5">
                <CategoryPieChart
                  categories={analytics.categories}
                  selectedCategory={filters.category}
                  onSelectCategory={handleToggleCategoryFilter}
                />
              </div>
            </div>

            {/* Second Grid Row: Top Vehicles Spend & Top Parts/Jobs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7">
                <VehicleBarChart
                  vehicles={analytics.vehicles}
                  selectedVehicle={filters.vehicle}
                  onSelectVehicle={handleToggleVehicleFilter}
                />
              </div>
              <div className="lg:col-span-5">
                <TopItemsList
                  items={analytics.topItems}
                  selectedItem={filters.item}
                  onSelectItem={handleToggleItemFilter}
                />
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: DEDICATED FLEET EXPENSE ANOMALY & VEHICLE ACTION MATRIX PAGE */}
        {(activePage === 'anomalyMatrix' || activePage === 'fullView') && (
          <div className={activePage === 'fullView' ? 'mt-8' : ''}>
            {activePage === 'anomalyMatrix' && (
              <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h2 className="text-xl font-black text-zinc-100 font-mono flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Fleet Expense Anomaly & Vehicle Action Matrix
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Specialized telemetry dashboard for irregular spend flags, vehicle risk indices, stock issuance vs cash purchases, and workshop directives.
                  </p>
                </div>
                <button
                  onClick={() => setActivePage('overview')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition cursor-pointer"
                >
                  ← Back to Overview
                </button>
              </div>
            )}

            <AnomalyAndVehicleActionGraphic
              records={filteredRecords}
              allRecords={records}
              onFilterByVehicle={plate => handleUpdateFilters({ vehicle: plate })}
              onFilterByCategory={cat => handleUpdateFilters({ category: cat })}
              onOpenVehicleDetails={plate => setInspectedVehicle(plate)}
            />
          </div>
        )}

        {/* PAGE 3: DEDICATED VEHICLE REGISTER TABLE */}
        {(activePage === 'vehicleRegister' || activePage === 'fullView') && (
          <div className={activePage === 'fullView' ? 'mt-8' : ''}>
            <VehicleTable
              vehicles={analytics.vehicles}
              records={records}
              selectedVehicle={filters.vehicle}
              onSelectVehicle={handleToggleVehicleFilter}
              onOpenVehicleModal={plate => setInspectedVehicle(plate)}
              onOpenAddModalForVehicle={plate => {
                setAddModalInitialVehicle(plate);
                setIsAddModalOpen(true);
              }}
              onOpenCompare={handleOpenCompare}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-xs text-zinc-500">
          <div>
            Source: Descon Engineering Limited • Maintenance Ledger •{' '}
            <span className="text-amber-400 font-semibold">1 malformed date row</span> &{' '}
            <span className="text-amber-400 font-semibold">1 non-standard plate</span> preserved
          </div>
          <div>
            {isFiltered
              ? `Filtered to active selection • ${filteredRecords.length} ledger lines`
              : `Dashboard reflects all ${records.length} ledger lines`}
          </div>
        </footer>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRecord={handleAddRecord}
        existingPlates={existingPlates}
        initialVehicle={addModalInitialVehicle}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        vehiclePlate={inspectedVehicle}
        records={records}
        onClose={() => setInspectedVehicle(null)}
        onDeleteRecord={handleDeleteRecord}
        onOpenAddModal={plate => {
          setInspectedVehicle(null);
          setAddModalInitialVehicle(plate);
          setIsAddModalOpen(true);
        }}
      />

      {/* Vehicle Side-by-Side Comparison Modal */}
      <VehicleCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        records={records}
        initialVehicle1={compareVehicle1}
      />
    </div>
  );
}

