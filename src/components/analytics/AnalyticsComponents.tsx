'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { COLORS, CHART_MARGINS, CHART_CONFIG } from './constants';
import { formatDate } from './utils';
import { AnalyticsCard } from './AnalyticsCard';
import { CustomTooltipProps, UserGraphData, MessageData } from './types';

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, valueKey = 'value' as const, colorKey = 'color' as const }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100 text-xs">
        <p className="text-gray-600 mb-1">{label !== undefined ? formatDate(label) : 'No date available'}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry[colorKey] }} className="font-medium">
            {entry.name}: {Math.round(entry[valueKey])}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const UsersGraph: React.FC<{ data: UserGraphData[] }> = ({ data }) => {
  const sortedData = React.useMemo(() => 
    [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  , [data]);

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
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={COLORS.total} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.new} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={COLORS.new} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.returning} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={COLORS.returning} stopOpacity={0}/>
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
              tickFormatter={(value, index) => `${Math.round(value)}`}
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
              fill="url(#colorTotal)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="new"
              name="New Users"
              stroke={COLORS.new}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNew)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="returning"
              name="Returning Users"
              stroke={COLORS.returning}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReturning)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
};

export const MessagesPerSession: React.FC<{ data: MessageData[] }> = ({ data }) => {
  const sortedData = React.useMemo(() => 
    [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  , [data]);

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
                <stop offset="5%" stopColor={COLORS.bot} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={COLORS.bot} stopOpacity={0}/>
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
              tickFormatter={(value, index) => `${Math.round(value)}`}
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
