import React, { useState, useEffect } from 'react';
import { ExpenseRecord } from '../types';
import { X, Edit3, AlertCircle, Save, Trash2 } from 'lucide-react';

interface EditExpenseModalProps {
  record: ExpenseRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRecord: (updatedRecord: ExpenseRecord) => void;
  onDeleteRecord?: (id: string) => void;
  existingPlates: string[];
}

const CATEGORIES = [
  'Irregular Expense',
  'Oil Change',
  'Regular Expense',
  'Service Expense',
  'Fuel Expense',
  'Common Expense',
  'Puncture Expense',
];

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  record,
  isOpen,
  onClose,
  onUpdateRecord,
  onDeleteRecord,
  existingPlates,
}) => {
  const [date, setDate] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [customVehicle, setCustomVehicle] = useState('');
  const [category, setCategory] = useState('Irregular Expense');
  const [subCategory, setSubCategory] = useState('');
  const [item, setItem] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [amount, setAmount] = useState('');
  const [inventory, setInventory] = useState('');
  const [salaryAdvance, setSalaryAdvance] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (record) {
      setDate(record.date || '');
      setVehicle(record.vehicle || '');
      setCustomVehicle('');
      setCategory(record.category || 'Irregular Expense');
      setSubCategory(record.subCategory || '');
      setItem(record.item || '');
      setAdditionalInfo(record.additionalInfo || '');
      setAmount(record.amount != null ? String(record.amount) : '');
      setInventory(record.inventory != null ? String(record.inventory) : '');
      setSalaryAdvance(record.salaryAdvance != null ? String(record.salaryAdvance) : '');
      setValue(String(record.value || 0));
      setNotes(record.notes || '');
      setError('');
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetVehicle = customVehicle.trim() ? customVehicle.trim().toUpperCase() : vehicle;
    if (!targetVehicle) {
      setError('Vehicle plate number is required');
      return;
    }

    if (!item.trim()) {
      setError('Item/Repair description is required');
      return;
    }

    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal < 0) {
      setError('Please enter a valid expense total amount in PKR');
      return;
    }

    const numAmount = amount.trim() !== '' ? parseFloat(amount) : null;
    const numInventory = inventory.trim() !== '' ? parseFloat(inventory) : null;
    const numSalaryAdvance = salaryAdvance.trim() !== '' ? parseFloat(salaryAdvance) : null;

    const updatedRecord: ExpenseRecord = {
      ...record,
      date: date.trim() || null,
      vehicle: targetVehicle,
      category,
      subCategory: subCategory.trim() || undefined,
      additionalInfo: additionalInfo.trim() || undefined,
      item: item.trim(),
      amount: numAmount != null && !isNaN(numAmount) ? numAmount : null,
      inventory: numInventory != null && !isNaN(numInventory) ? numInventory : null,
      salaryAdvance: numSalaryAdvance != null && !isNaN(numSalaryAdvance) ? numSalaryAdvance : null,
      value: numVal,
      notes: notes.trim() || undefined,
    };

    onUpdateRecord(updatedRecord);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteRecord && record) {
      if (window.confirm(`Delete record "${record.item}" (${record.vehicle})?`)) {
        onDeleteRecord(record.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#18181b] border border-zinc-700/80 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative font-sans text-sm text-zinc-100">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pb-3 border-b border-zinc-800 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wide text-zinc-100 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" /> Edit Expense Entry
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Modify maintenance ledger record details & amounts.
            </p>
          </div>
          <div className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 shrink-0">
            <span>ID: <strong>{record.id.slice(0, 8)}</strong></span>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
          {/* Date Picker */}
          <div>
            <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
              Log Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono"
            />
          </div>

          {/* Vehicle Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Vehicle Plate
              </label>
              <select
                value={vehicle}
                onChange={e => {
                  setVehicle(e.target.value);
                  setCustomVehicle('');
                }}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono"
              >
                {!existingPlates.includes(vehicle) && vehicle && (
                  <option value={vehicle}>{vehicle}</option>
                )}
                {existingPlates.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Or Custom Plate
              </label>
              <input
                type="text"
                placeholder="e.g. LET-9999"
                value={customVehicle}
                onChange={e => setCustomVehicle(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Category & Sub-Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Sub-Category
              </label>
              <input
                type="text"
                placeholder="e.g. Inventory, Fuel Expense"
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Item & Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Item Name
              </label>
              <input
                type="text"
                placeholder="e.g. Engine Oil 4L"
                value={item}
                onChange={e => setItem(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Additional Info / Part
              </label>
              <input
                type="text"
                placeholder="e.g. Filter #402"
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Cash Amount, Inventory & Total Spend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Cash Paid (PKR)
              </label>
              <input
                type="number"
                placeholder="e.g. 2000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3 py-2 outline-none font-mono placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Store Inventory (PKR)
              </label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={inventory}
                onChange={e => setInventory(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3 py-2 outline-none font-mono placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-amber-400 font-semibold uppercase tracking-wider mb-1">
                Total Value (PKR) *
              </label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full bg-[#09090b] border border-amber-500/60 focus:border-amber-400 text-amber-300 font-bold rounded-xl px-3 py-2 outline-none font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
              Notes / Workshop Details
            </label>
            <input
              type="text"
              placeholder="e.g. Workshop receipt detail"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 focus:border-amber-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between font-sans">
            {onDeleteRecord ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Record
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition cursor-pointer text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
