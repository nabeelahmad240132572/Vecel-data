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
import { EditExpenseModal } from './components/EditExpenseModal';
import { LedgerEntriesModal } from './components/LedgerEntriesModal';
import { VehicleDetailsModal } from './components/VehicleDetailsModal';
import { VehicleCompareModal } from './components/VehicleCompareModal';
import { DataAnalyticsHub } from './components/DataAnalyticsHub';
import { AnomalyAndVehicleActionGraphic } from './components/AnomalyAndVehicleActionGraphic';
import { LoginScreen } from './components/LoginScreen';
import { LayoutDashboard, AlertTriangle, Truck, Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('descon_fleet_auth') === 'true'
  );

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

  // Edit Record & Ledger Modal State
  const [editingRecord, setEditingRecord] = useState<ExpenseRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  const handleOpenEditModal = (record: ExpenseRecord) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

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

  // Edit Record
  const handleEditRecord = (updatedRecord: ExpenseRecord) => {
    const updated = records.map(r => r.id === updatedRecord.id ? updatedRecord : r);
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

  const handleLogout = () => {
    localStorage.removeItem('descon_fleet_auth');
    localStorage.removeItem('descon_fleet_user');
    setIsAuthenticated(false);
  };

  const isFiltered =
    Boolean(filters.category) ||
    Boolean(filters.vehicle) ||
    Boolean(filters.item) ||
    Boolean(filters.dateStart) ||
    Boolean(filters.dateEnd) ||
    Boolean(filters.search.trim());

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

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
          onOpenLedgerModal={() => setIsLedgerModalOpen(true)}
          onLogout={handleLogout}
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
        <div className="relative bg-[#121215]/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-2.5 sm:p-3 mb-6 shadow-2xl overflow-hidden transition-all">
          {/* Subtle accent glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 opacity-90" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActivePage('overview')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2.5 cursor-pointer border ${
                  activePage === 'overview'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activePage === 'overview' ? 'text-amber-300' : 'text-amber-400'}`} />
                <span>1. Overview & Analytics</span>
              </button>

              <button
                onClick={() => setActivePage('anomalyMatrix')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2.5 cursor-pointer relative border ${
                  activePage === 'anomalyMatrix'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 border-amber-300 shadow-lg shadow-amber-500/30 ring-1 ring-amber-300 font-black'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-300'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 ${activePage === 'anomalyMatrix' ? 'text-zinc-950' : 'text-amber-400 animate-pulse'}`} />
                <span>2. Expense Anomaly & Action Matrix</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  activePage === 'anomalyMatrix' ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500 text-zinc-950'
                }`}>
                  Dedicated Page
                </span>
              </button>

              <button
                onClick={() => setActivePage('vehicleRegister')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2.5 cursor-pointer border ${
                  activePage === 'vehicleRegister'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80'
                }`}
              >
                <Truck className={`w-4 h-4 ${activePage === 'vehicleRegister' ? 'text-amber-300' : 'text-blue-400'}`} />
                <span>3. Vehicle Register Table</span>
              </button>

              <button
                onClick={() => setActivePage('fullView')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2.5 cursor-pointer border ${
                  activePage === 'fullView'
                    ? 'bg-zinc-800 text-white border-zinc-600 shadow-lg ring-1 ring-zinc-500'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Layers className={`w-4 h-4 ${activePage === 'fullView' ? 'text-emerald-400' : 'text-emerald-500'}`} />
                <span>All Modules View</span>
              </button>
            </div>

            {/* Right Status Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-300 bg-black/60 border border-zinc-800 px-3 py-1.5 rounded-xl shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Page: <strong className="text-amber-400 font-bold uppercase">{activePage}</strong></span>
            </div>
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
              onEditRecord={handleOpenEditModal}
              onDeleteRecord={handleDeleteRecord}
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
        onEditRecord={handleOpenEditModal}
        onOpenAddModal={plate => {
          setInspectedVehicle(null);
          setAddModalInitialVehicle(plate);
          setIsAddModalOpen(true);
        }}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        record={editingRecord}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRecord(null);
        }}
        onUpdateRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
        existingPlates={existingPlates}
      />

      {/* Full Ledger Entries Management Modal */}
      <LedgerEntriesModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
        records={records}
        onEditRecord={record => {
          handleOpenEditModal(record);
        }}
        onDeleteRecord={handleDeleteRecord}
        onOpenAddModal={() => {
          setAddModalInitialVehicle('');
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

