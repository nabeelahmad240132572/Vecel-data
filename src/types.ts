export interface ExpenseRecord {
  id: string;
  date: string | null; // e.g. "2026-07-02"
  vehicle: string;    // e.g. "LET-3263"
  category: string;   // e.g. "Irregular Expense", "Oil Change", "Regular Expense"
  item: string;       // e.g. "Engine Oil", "Bairing", "Break Oil"
  value: number;      // amount in PKR
  notes?: string;
}

export type CategoryName = 
  | 'Irregular Expense'
  | 'Oil Change'
  | 'Regular Expense'
  | 'Service Expense'
  | 'Fuel Expense'
  | 'Common Expense'
  | 'Puncture Expense'
  | string;

export interface FilterState {
  category: string | null;
  vehicle: string | null;
  item: string | null;
  dateStart: string | null;
  dateEnd: string | null;
  search: string;
}

export interface VehicleStat {
  name: string;
  value: number;
  count: number;
  avgPerEntry: number;
  share: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  count: number;
  percentage: number;
}

export interface DailyTrendStat {
  date: string;
  value: number;
  count: number;
  displayDate: string;
}

export interface ItemStat {
  name: string;
  value: number;
  count: number;
}
