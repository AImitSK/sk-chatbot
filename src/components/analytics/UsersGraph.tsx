'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { UsersGraphProps, CustomTooltipProps } from './types';
import { COLORS, CHART_MARGINS, CHART_CONFIG, GRADIENT_STOPS } from './constants';
import { formatDate, sortDataByDate } from './utils';

export const UsersGraph = ({ data }: UsersGraphProps) => {
  const sortedData = useMemo(() => sortDataByDate(data), [data]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100 text-xs">
          <p className="text-gray-600 mb-1">{formatDate(label || '')}</p>
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
      title="Users Graph" 
      className="col-span-2"
      actions={
        <span className="text-xs text-gray-500">
          Last 30 Days
        </span>
      }
    >
      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sortedData}
            margin={CHART_MARGINS}
          >
            <defs>
              {Object.entries(COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset={GRADIENT_STOPS.start.offset} stopColor={color} stopOpacity={GRADIENT_STOPS.start.opacity}/>
                  <stop offset={GRADIENT_STOPS.end.offset} stopColor={color} stopOpacity={GRADIENT_STOPS.end.opacity}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="#f5f5f5" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#9ca3af"
              fontSize={CHART_CONFIG.fontSize}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={CHART_CONFIG.fontSize}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => Math.round(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={CHART_CONFIG.legendHeight}
              iconType="circle"
              iconSize={CHART_CONFIG.iconSize}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Total Users"
              stroke={COLORS.total}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colortotal)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="new"
              name="New Users"
              stroke={COLORS.new}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colornew)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="returning"
              name="Returning Users"
              stroke={COLORS.returning}
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