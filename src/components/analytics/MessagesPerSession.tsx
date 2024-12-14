'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { MessagesPerSessionProps, CustomTooltipProps } from './types';
import { COLORS, CHART_MARGINS, CHART_CONFIG, GRADIENT_STOPS } from './constants';
import { formatDate, sortDataByDate } from './utils';

export const MessagesPerSession = ({ data }: MessagesPerSessionProps) => {
  const sortedData = useMemo(() => sortDataByDate(data), [data]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100 text-xs">
          <p className="text-gray-600 mb-1">{formatDate(label || '')}</p>
          <p className="font-medium" style={{ color: COLORS.bot }}>
            Messages: {Math.round(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnalyticsCard 
      title="Messages per Session" 
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
              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset={GRADIENT_STOPS.start.offset} stopColor={COLORS.bot} stopOpacity={GRADIENT_STOPS.start.opacity}/>
                <stop offset={GRADIENT_STOPS.end.offset} stopColor={COLORS.bot} stopOpacity={GRADIENT_STOPS.end.opacity}/>
              </linearGradient>
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
            <Area
              type="monotone"
              dataKey="messages"
              name="Messages"
              stroke={COLORS.bot}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMessages)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
};