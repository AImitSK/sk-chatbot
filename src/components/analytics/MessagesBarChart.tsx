'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { MessagesBarChartProps, CustomTooltipProps } from './types';
import { COLORS, CHART_MARGINS, CHART_CONFIG } from './constants';
import { formatDate, sortDataByDate } from './utils';

export const MessagesBarChart = ({ data }: MessagesBarChartProps) => {
  const sortedData = useMemo(() => sortDataByDate(data), [data]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100 text-xs">
          <p className="text-gray-600 mb-1">{formatDate(label || '')}</p>
          <p className="font-medium" style={{ color: COLORS.bot }}>
            Messages: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnalyticsCard 
      title="Messages" 
      className="col-span-2"
      actions={
        <span className="text-xs text-gray-500">Last 30 Days</span>
      }
    >
      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={CHART_MARGINS}
          >
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
            <Bar
              dataKey="messages"
              name="Messages"
              fill={COLORS.bot}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
};