import React, { useState } from 'react';
import { ExpenseRecord } from '../types';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: ExpenseRecord) => void;
  existingPlates: string[];
  initialVehicle?: string;
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

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
  existingPlates,
  initialVehicle = '',
}) => {
  const [date, setDate] = useState('2026-07-31');
  const [vehicle, setVehicle] = useState(initialVehicle || (existingPlates[0] || 'LET-3263'));
  const [customVehicle, setCustomVehicle] = useState('');
  const [category, setCategory] = useState('Irregular Expense');
  const [item, setItem] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
      setError('Please enter a valid expense amount in PKR');
      return;
    }

    const newRecord: ExpenseRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: date || null,
      vehicle: targetVehicle,
      category,
      item: item.trim(),
      value: numVal,
      notes: notes.trim() || undefined,
    };

    onAddRecord(newRecord);
    // Reset form
    setItem('');
    setValue('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#18181b] border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative font-sans text-sm text-zinc-100">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pb-3 border-b border-zinc-800">
          <h2 className="text-lg font-black uppercase tracking-wide text-zinc-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" /> Log Fleet Expense Entry
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Add a new vehicle maintenance record to Descon Engineering's ledger.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* Date Picker */}
          <div>
            <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
              Log Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono"
            />
          </div>

          {/* Vehicle Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Select Plate
              </label>
              <select
                value={vehicle}
                onChange={e => {
                  setVehicle(e.target.value);
                  setCustomVehicle('');
                }}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono"
              >
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
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Item Description & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Item / Repair Work
              </label>
              <input
                type="text"
                placeholder="e.g. Engine Oil 4L, Brake Pad"
                value={item}
                onChange={e => setItem(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Cost (PKR)
              </label>
              <input
                type="number"
                placeholder="e.g. 4400"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-zinc-400 font-semibold uppercase tracking-wider mb-1">
              Notes / Workshop Details (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Manga plot workshop receipt #402"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 focus:border-blue-500 text-zinc-100 rounded-xl px-3.5 py-2.5 outline-none font-mono placeholder-zinc-600"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2 font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer shadow-lg shadow-blue-600/20 text-xs"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
