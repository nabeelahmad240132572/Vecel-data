import { ExpenseRecord, FilterState, VehicleStat, CategoryStat, DailyTrendStat, ItemStat } from '../types';
import { INITIAL_RECORDS } from '../data/initialData';

const STORAGE_KEY = 'fleet_descon_expense_records';

export function getStoredRecords(): ExpenseRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_RECORDS.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved records', e);
  }
  // Store updated INITIAL_RECORDS
  saveStoredRecords(INITIAL_RECORDS);
  return INITIAL_RECORDS;
}

export function saveStoredRecords(records: ExpenseRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records', e);
  }
}

export function normalizeDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const str = dateStr.trim();
  if (!str) return null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.substring(0, 10);
  }

  // YYYY/MM/DD
  if (/^\d{4}\/\d{1,2}\/\d{1,2}/.test(str)) {
    const parts = str.split('/');
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // D/M/YYYY or DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(str)) {
    const parts = str.split('/');
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    const y = parts[2];
    return `${y}-${m}-${d}`;
  }

  // Fallback try Date object
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  return null;
}

export function filterRecords(records: ExpenseRecord[], filters: FilterState): ExpenseRecord[] {
  const startDate = normalizeDate(filters.dateStart);
  const endDate = normalizeDate(filters.dateEnd);

  return records.filter(r => {
    // Category filter
    if (filters.category && r.category !== filters.category) return false;
    // Vehicle filter
    if (filters.vehicle && r.vehicle !== filters.vehicle) return false;
    // Item filter
    if (filters.item && r.item !== filters.item) return false;

    // Date Start & End filtering
    if (startDate || endDate) {
      const recordDate = normalizeDate(r.date);
      if (!recordDate) return false; // Hide undated entries if date filtering is applied
      if (startDate && recordDate < startDate) return false;
      if (endDate && recordDate > endDate) return false;
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchVeh = r.vehicle ? r.vehicle.toLowerCase().includes(q) : false;
      const matchCat = r.category ? r.category.toLowerCase().includes(q) : false;
      const matchItem = r.item ? r.item.toLowerCase().includes(q) : false;
      const matchVal = r.value !== undefined ? r.value.toString().includes(q) : false;
      const matchDate = r.date ? r.date.toLowerCase().includes(q) : false;
      if (!matchVeh && !matchCat && !matchItem && !matchVal && !matchDate) return false;
    }
    return true;
  });
}

export function computeAnalytics(filteredRecords: ExpenseRecord[], allRecords: ExpenseRecord[]) {
  const totalSpend = filteredRecords.reduce((sum, r) => sum + r.value, 0);
  const totalAllSpend = allRecords.reduce((sum, r) => sum + r.value, 0);
  const recordCount = filteredRecords.length;
  
  const vehicleSet = new Set(filteredRecords.map(r => r.vehicle));
  const vehicleCount = vehicleSet.size;

  const avgPerEntry = recordCount > 0 ? totalSpend / recordCount : 0;
  const avgPerVehicle = vehicleCount > 0 ? totalSpend / vehicleCount : 0;

  // Inventory vs Purchase (Cash) Breakdown
  let totalInventory = 0;
  let totalPurchase = 0;
  let totalSalaryAdvance = 0;

  filteredRecords.forEach(r => {
    if (r.inventory && r.inventory > 0) {
      totalInventory += r.inventory;
    } else if (r.subCategory === 'Inventory') {
      totalInventory += r.value;
    }

    if (r.amount && r.amount > 0) {
      totalPurchase += r.amount;
    } else if (!r.inventory) {
      totalPurchase += r.value;
    }

    if (r.salaryAdvance) {
      totalSalaryAdvance += r.salaryAdvance;
    }
  });

  // SubCategory Aggregation
  const subCatMap: Record<string, { value: number; count: number }> = {};
  filteredRecords.forEach(r => {
    const sub = r.subCategory || (r.inventory ? 'Inventory' : 'General / Direct Purchase');
    if (!subCatMap[sub]) {
      subCatMap[sub] = { value: 0, count: 0 };
    }
    subCatMap[sub].value += r.value;
    subCatMap[sub].count += 1;
  });

  const subCategories = Object.entries(subCatMap)
    .map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count,
      percentage: totalSpend > 0 ? (data.value / totalSpend) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // Category Aggregation
  const catMap: Record<string, { value: number; count: number }> = {};
  filteredRecords.forEach(r => {
    if (!catMap[r.category]) {
      catMap[r.category] = { value: 0, count: 0 };
    }
    catMap[r.category].value += r.value;
    catMap[r.category].count += 1;
  });

  const categories: CategoryStat[] = Object.entries(catMap)
    .map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count,
      percentage: totalSpend > 0 ? (data.value / totalSpend) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // Vehicle Aggregation
  const vehMap: Record<string, { value: number; count: number }> = {};
  filteredRecords.forEach(r => {
    if (!vehMap[r.vehicle]) {
      vehMap[r.vehicle] = { value: 0, count: 0 };
    }
    vehMap[r.vehicle].value += r.value;
    vehMap[r.vehicle].count += 1;
  });

  const vehicles: VehicleStat[] = Object.entries(vehMap)
    .map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count,
      avgPerEntry: data.count > 0 ? data.value / data.count : 0,
      share: totalSpend > 0 ? (data.value / totalSpend) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // Daily Trend Aggregation
  const dateMap: Record<string, { value: number; count: number }> = {};
  filteredRecords.forEach(r => {
    const d = r.date || 'Undated';
    if (!dateMap[d]) {
      dateMap[d] = { value: 0, count: 0 };
    }
    dateMap[d].value += r.value;
    dateMap[d].count += 1;
  });

  const dailyTrend: DailyTrendStat[] = Object.entries(dateMap)
    .map(([date, data]) => ({
      date,
      value: data.value,
      count: data.count,
      displayDate: date === 'Undated' ? 'Undated' : date.slice(5),
    }))
    .sort((a, b) => {
      if (a.date === 'Undated') return 1;
      if (b.date === 'Undated') return -1;
      return a.date.localeCompare(b.date);
    });

  // Top Items / Parts Aggregation
  const itemMap: Record<string, { value: number; count: number }> = {};
  filteredRecords.forEach(r => {
    if (r.item && r.item !== 'N/A') {
      if (!itemMap[r.item]) {
        itemMap[r.item] = { value: 0, count: 0 };
      }
      itemMap[r.item].value += r.value;
      itemMap[r.item].count += 1;
    }
  });

  const topItems: ItemStat[] = Object.entries(itemMap)
    .map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count,
    }))
    .sort((a, b) => b.value - a.value);

  // Min & Max Dates
  const validDates = filteredRecords.filter(r => r.date).map(r => r.date as string).sort();
  const dateRange = {
    start: validDates[0] || 'N/A',
    end: validDates[validDates.length - 1] || 'N/A',
  };

  return {
    totalSpend,
    totalAllSpend,
    totalInventory,
    totalPurchase,
    totalSalaryAdvance,
    recordCount,
    vehicleCount,
    avgPerEntry,
    avgPerVehicle,
    categories,
    subCategories,
    vehicles,
    dailyTrend,
    topItems,
    dateRange,
    shareOfTotalAll: totalAllSpend > 0 ? (totalSpend / totalAllSpend) * 100 : 0,
  };
}

export function exportToCSV(records: ExpenseRecord[]): void {
  const headers = ['ID', 'Date', 'Vehicle Plate', 'Category', 'Item / Repair', 'Cost (PKR)', 'Notes'];
  const rows = records.map(r => [
    r.id,
    r.date || '',
    `"${r.vehicle.replace(/"/g, '""')}"`,
    `"${r.category.replace(/"/g, '""')}"`,
    `"${r.item.replace(/"/g, '""')}"`,
    r.value,
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Descon_Fleet_Expenses_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
