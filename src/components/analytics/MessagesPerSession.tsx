'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MessagesPerSessionProps, CustomTooltipProps } from './types';
import { formatDate, sortDataByDate } from './utils';
import { AnalyticsCard } from './AnalyticsCard';

export const MessagesPerSession = ({ data }: MessagesPerSessionProps) => {
  const sortedData = useMemo(() => sortDataByDate(data), [data]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100 text-xs">
          <p className="text-gray-600 mb-1">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {Math.round(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AnalyticsCard 
      title="Nachrichten pro Sitzung" 
      className="col-span-2"
      actions={
        <span className="text-xs text-gray-500">
          Letzte 30 Tage
        </span>
      }
    >
      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sortedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colormessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f5f5f5" vertical={false} />
            <XAxis 
              dataKey="date"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => Math.round(value).toString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="messages"
              name="Nachrichten"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colormessages)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
};