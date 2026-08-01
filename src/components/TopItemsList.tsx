import React from 'react';
import { ItemStat } from '../types';
import { fmtPKR, fmtCompact } from '../data/initialData';
import { Wrench } from 'lucide-react';

interface TopItemsListProps {
  items: ItemStat[];
  selectedItem: string | null;
  onSelectItem: (item: string) => void;
}

export const TopItemsList: React.FC<TopItemsListProps> = ({
  items,
  selectedItem,
  onSelectItem,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center h-[340px]">
        <span className="text-xs text-zinc-500 font-mono">No parts logged in current filter</span>
      </div>
    );
  }

  const maxVal = Math.max(...items.map(i => i.value));

  return (
    <div className={`bg-[#18181b] border rounded-2xl p-5 shadow-sm flex flex-col h-[340px] transition-all hover:border-zinc-700/80 ${selectedItem ? 'border-emerald-500/50' : 'border-zinc-800'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-400" /> Top Parts & Repair Jobs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Highest expenditure maintenance components & line items
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
        {items.slice(0, 10).map((item, index) => {
          const isSelected = selectedItem === item.name;
          const isDimmed = selectedItem && !isSelected;
          const widthPct = Math.max((item.value / maxVal) * 100, 4);

          return (
            <div
              key={index}
              onClick={() => onSelectItem(item.name)}
              className={`p-2.5 rounded-xl border transition cursor-pointer font-mono text-xs ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-zinc-100'
                  : isDimmed
                  ? 'bg-[#09090b]/50 border-transparent opacity-40 hover:opacity-80'
                  : 'bg-[#09090b] border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="truncate font-sans font-medium text-xs text-zinc-200 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono">#{index + 1}</span>
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="font-mono text-xs font-bold text-amber-400 shrink-0 ml-2">
                  {fmtCompact(item.value)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex items-center">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isSelected ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-500 font-sans">
                <span>{item.count} log line{item.count > 1 ? 's' : ''}</span>
                <span className="font-mono">{fmtPKR(item.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
