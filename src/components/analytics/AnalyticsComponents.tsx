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
  const sortedData = React.useMemo(() => {
    // Filtere NaN-Werte und ersetze sie mit 0
    return [...data]
      .map(item => ({
        ...item,
        total: isNaN(item.total) ? 0 : item.total,
        new: isNaN(item.new) ? 0 : item.new,
        returning: isNaN(item.returning) ? 0 : item.returning,
        // Formatiere das Datum
        date: new Date(item.date).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit'
        })
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <AnalyticsCard 
      title="User Statistics" 
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              allowDecimals={false}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="left"
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Gesamte Nutzer"
              stroke={COLORS.total}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            <Area
              type="monotone"
              dataKey="new"
              name="New Users"
              stroke={COLORS.new}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNew)"
            />
            <Area
              type="monotone"
              dataKey="returning"
              name="Returning Users"
              stroke={COLORS.returning}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReturning)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
};

export const MessagesPerSession: React.FC<{ data: MessageData[] }> = ({ data }) => {
  const sortedData = React.useMemo(() => 
    [...data]
      .map(item => ({
        ...item,
        messages: isNaN(item.messages) ? 0 : item.messages,
        date: new Date(item.date).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit'
        })
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  , [data]);

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
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100 text-xs">
                    <p className="text-gray-600 mb-1">{label}</p>
                    <p style={{ color: COLORS.bot }} className="font-medium">
                      Nachrichten: {payload[0].value !== undefined ? Math.round(Number(payload[0].value)) : 0}
                    </p>
                  </div>
                );
              }
              return null;
            }} />
            <Area
              type="monotone"
              dataKey="messages"
              name="Nachrichten"
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
