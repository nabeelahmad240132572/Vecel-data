export interface ExpenseRecord {
  id: string;
  date: string | null; // e.g. "2026-06-07"
  vehicle: string;    // e.g. "CAX-2223"
  category: string;   // e.g. "Oil Change", "Irregular Expense", "Common Expense"
  subCategory?: string; // e.g. "Inventory", "Fuel Expense"
  additionalInfo?: string; // e.g. "Engine Oil", "Filter", "petrol"
  amount?: number | null;
  inventory?: number | null;
  salaryAdvance?: number | null;
  item: string;       // e.g. "Engine Oil", "Filter", "petrol"
  value: number;      // total value in PKR
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

export interface SubCategoryStat {
  name: string;
  value: number;
  count: number;
  percentage: number;
}
