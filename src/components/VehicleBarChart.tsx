import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { VehicleStat } from '../types';
import { fmtPKR, fmtCompact } from '../data/initialData';
import { Truck } from 'lucide-react';

interface VehicleBarChartProps {
  vehicles: VehicleStat[];
  selectedVehicle: string | null;
  onSelectVehicle: (vehicle: string) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: VehicleStat = payload[0].payload;
    return (
      <div className="bg-[#09090b] border border-zinc-800 p-3 rounded-xl shadow-xl font-mono text-xs z-50">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#18181b] border border-zinc-700 px-1.5 py-0.5 rounded-md text-amber-400 font-bold">
            {data.name}
          </span>
          <span className="text-zinc-400">Vehicle Details</span>
        </div>
        <div className="text-zinc-100 font-bold text-sm">{fmtPKR(data.value)}</div>
        <div className="text-zinc-500 text-[11px] mt-0.5">
          {data.count} maintenance lines • Avg {fmtPKR(data.avgPerEntry)}/line
        </div>
      </div>
    );
  }
  return null;
};

export const VehicleBarChart: React.FC<VehicleBarChartProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center h-[340px]">
        <span className="text-xs text-zinc-500 font-mono">No vehicles in current filter</span>
      </div>
    );
  }

  // Display top 10 vehicles in chart
  const topVehicles = vehicles.slice(0, 10);

  return (
    <div className={`bg-[#18181b] border rounded-2xl p-5 shadow-sm flex flex-col h-[340px] transition-all hover:border-zinc-700/80 ${selectedVehicle ? 'border-blue-500/50' : 'border-zinc-800'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" /> Top Vehicles by Spend
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Ranked by total expenditure in PKR. Click a plate to filter.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={topVehicles}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barCategoryGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />

            <XAxis
              type="number"
              stroke="#52525b"
              tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={val => fmtCompact(val)}
              axisLine={{ stroke: '#27272a' }}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              stroke="#52525b"
              tick={{ fill: '#f4f4f5', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}
              axisLine={{ stroke: '#27272a' }}
              tickLine={false}
              width={75}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              radius={[0, 6, 6, 0]}
              onClick={entry => onSelectVehicle(entry.name)}
              cursor="pointer"
            >
              {topVehicles.map((entry, index) => {
                const isSelected = selectedVehicle === entry.name;
                const isDimmed = selectedVehicle && !isSelected;
                let color = '#3b82f6'; // blue-500
                if (isSelected) color = '#f59e0b'; // amber-500
                if (isDimmed) color = '#27272a';

                return (
                  <Cell
                    key={`cell-v-${index}`}
                    fill={color}
                    opacity={isDimmed ? 0.4 : 1}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
