import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategoryStat } from '../types';
import { fmtPKR, fmtCompact } from '../data/initialData';
import { PieChart as PieIcon } from 'lucide-react';

interface CategoryPieChartProps {
  categories: CategoryStat[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Irregular Expense': '#f59e0b', // amber-500
  'Oil Change': '#ef4444',        // red-500
  'Regular Expense': '#3b82f6',    // blue-500
  'Service Expense': '#10b981',    // emerald-500
  'Fuel Expense': '#a855f7',       // purple-500
  'Common Expense': '#6366f1',     // indigo-500
  'Puncture Expense': '#71717a',   // zinc-500
};

const DEFAULT_COLOR = '#3b82f6';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: CategoryStat = payload[0].payload;
    return (
      <div className="bg-[#09090b] border border-zinc-800 p-3 rounded-xl shadow-xl font-mono text-xs z-50">
        <div className="text-zinc-100 font-bold mb-1">{data.name}</div>
        <div className="text-amber-400 font-bold text-sm">{fmtPKR(data.value)}</div>
        <div className="text-zinc-400 text-[11px] mt-0.5">
          {data.percentage.toFixed(1)}% of total • {data.count} entries
        </div>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center h-[340px]">
        <span className="text-xs text-zinc-500 font-mono">No categories in current filter</span>
      </div>
    );
  }

  const isCategoryActive = (catName: string) => selectedCategory === catName;

  return (
    <div className={`bg-[#18181b] border rounded-2xl p-5 shadow-sm flex flex-col h-[340px] transition-all hover:border-zinc-700/80 ${selectedCategory ? 'border-amber-500/50' : 'border-zinc-800'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" /> Spend by Category
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Click any slice or item below to filter dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 items-center min-h-0">
        {/* Donut Chart */}
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                onClick={entry => onSelectCategory(entry.name)}
                cursor="pointer"
              >
                {categories.map((entry, index) => {
                  const color = CATEGORY_COLORS[entry.name] || DEFAULT_COLOR;
                  const isDimmed = selectedCategory && !isCategoryActive(entry.name);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      opacity={isDimmed ? 0.35 : 1}
                      stroke={isCategoryActive(entry.name) ? '#ffffff' : '#09090b'}
                      strokeWidth={isCategoryActive(entry.name) ? 2 : 1}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Category List */}
        <div className="space-y-1.5 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
          {categories.map((cat, idx) => {
            const color = CATEGORY_COLORS[cat.name] || DEFAULT_COLOR;
            const isSelected = isCategoryActive(cat.name);
            const isDimmed = selectedCategory && !isSelected;

            return (
              <button
                key={idx}
                onClick={() => onSelectCategory(cat.name)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-mono transition text-xs cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border border-amber-500/40 text-zinc-100'
                    : isDimmed
                    ? 'opacity-40 hover:opacity-80'
                    : 'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-semibold">
                  <span className="text-[11px] text-zinc-500">{cat.percentage.toFixed(0)}%</span>
                  <span className={isSelected ? 'text-amber-400' : 'text-zinc-200'}>
                    {fmtCompact(cat.value)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
