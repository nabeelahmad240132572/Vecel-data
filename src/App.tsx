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

export default function App() {
  const [records, setRecords] = useState<ExpenseRecord[]>(() => getStoredRecords());
  const [activeDataset, setActiveDataset] = useState<'sheet' | 'full'>('sheet');

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
        />

        {/* Global Cross-Filter Bar */}
        <FilterBar
          filters={filters}
          onUpdateFilters={handleUpdateFilters}
          onClearAll={handleClearFilters}
          filteredCount={filteredRecords.length}
          totalCount={records.length}
        />

        {/* KPI Strip */}
        <KPICards
          totalSpend={analytics.totalSpend}
          totalAllSpend={analytics.totalAllSpend}
          recordCount={analytics.recordCount}
          vehicleCount={analytics.vehicleCount}
          avgPerEntry={analytics.avgPerEntry}
          avgPerVehicle={analytics.avgPerVehicle}
          isFiltered={isFiltered}
        />

        {/* First Grid Row: Daily Spend Trend & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
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

        {/* Full Vehicle Register Table */}
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
        />

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
    </div>
  );
}
