import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { DailyTrendStat } from '../types';
import { fmtPKR, fmtCompact } from '../data/initialData';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  data: DailyTrendStat[];
  onSelectDateRange?: (date: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: DailyTrendStat = payload[0].payload;
    return (
      <div className="bg-[#09090b] border border-zinc-800 p-3 rounded-xl shadow-xl font-mono text-xs z-50">
        <div className="text-zinc-400 mb-1 font-semibold">{data.date}</div>
        <div className="text-amber-400 font-bold text-sm">
          {fmtPKR(data.value)}
        </div>
        <div className="text-zinc-500 text-[11px] mt-0.5">
          {data.count} expense entry{data.count > 1 ? 'ies' : ''}
        </div>
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center h-[340px]">
        <span className="text-xs text-zinc-500 font-mono">No dated entries matching current filter</span>
      </div>
    );
  }

  const avgValue = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col h-[340px] hover:border-zinc-700/80 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Daily Spend Timeline
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Total logged maintenance expenditure per day across fleet
          </p>
        </div>

        <div className="font-mono text-[11px] text-zinc-400 bg-[#09090b] px-3 py-1 rounded-full border border-zinc-800">
          Daily Avg: <span className="text-amber-400 font-semibold">{fmtCompact(avgValue)}</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke="#52525b"
              tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
              dy={5}
            />

            <YAxis
              stroke="#52525b"
              tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={value => fmtCompact(value)}
              tickLine={false}
              axisLine={{ stroke: '#27272a' }}
              width={45}
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={avgValue}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: 'AVG',
                fill: '#f59e0b',
                fontSize: 9,
                fontFamily: 'monospace',
                position: 'right',
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#trendGradient)"
              activeDot={{ r: 5, fill: '#3b82f6', stroke: '#09090b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
