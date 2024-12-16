'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { UsersGraphProps, CustomTooltipProps } from './types';
import { formatDate, sortDataByDate } from './utils';
import { AnalyticsCard } from './AnalyticsCard';

export const UsersGraph = ({ data }: UsersGraphProps) => {
  const sortedData = useMemo(() => {
    // Die Daten kommen bereits im richtigen Format (DD.MM)
    return sortDataByDate(data);
  }, [data]);

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
      title="Benutzerzahlen" 
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
              <linearGradient id="colortotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colornew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorreturning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Gesamtbenutzer"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colortotal)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="new"
              name="Neue Benutzer"
              stroke="#16a34a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colornew)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="returning"
              name="Wiederkehrende Benutzer"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorreturning)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
};