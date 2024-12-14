'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalyticsCard } from './AnalyticsCard';
import { LastMonthUserTypesProps, CustomTooltipProps } from './types';
import { COLORS, CHART_CONFIG } from './constants';
import { calculatePercentage } from './utils';

export const LastMonthUserTypes = ({ 
  newUsers, 
  returningUsers 
}: LastMonthUserTypesProps) => {
  const data = useMemo(() => [
    { name: 'New Users', value: newUsers },
    { name: 'Returning Users', value: returningUsers }
  ], [newUsers, returningUsers]);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const total = newUsers + returningUsers;
      const percentage = calculatePercentage(payload[0].value, total);
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100 text-xs">
          <p style={{ color: payload[0].color }} className="font-medium">
            {payload[0].name}
          </p>
          <p className="text-gray-600">
            {payload[0].value.toLocaleString()} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnalyticsCard title="Last Month User Types">
      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              <Cell fill={COLORS.new} />
              <Cell fill={COLORS.returning} />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={CHART_CONFIG.legendHeight}
              iconType="circle"
              iconSize={CHART_CONFIG.iconSize}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
};