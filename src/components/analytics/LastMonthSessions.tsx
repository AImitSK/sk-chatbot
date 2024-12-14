'use client';

import React from 'react';
import { AnalyticsCard } from './AnalyticsCard';
import { LastMonthSessionsProps } from './types';
import { COLORS } from './constants';

export const LastMonthSessions = ({ 
  botMessages, 
  userMessages, 
  sessions 
}: LastMonthSessionsProps) => {
  const stats = [
    {
      title: 'Bot Messages',
      value: botMessages,
      color: COLORS.bot
    },
    {
      title: 'User Messages',
      value: userMessages,
      color: COLORS.user
    },
    {
      title: 'Sessions',
      value: sessions,
      color: COLORS.returning
    }
  ];

  return (
    <AnalyticsCard title="Last Month Sessions">
      <div className="mt-4 space-y-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.title} 
            className={index !== stats.length - 1 ? 'pb-4 border-b border-gray-100' : ''}
          >
            <div className="flex flex-col">
              <span className="text-4xl font-semibold text-gray-900">
                {stat.value.toLocaleString()}
              </span>
              <span 
                className="text-sm mt-1"
                style={{ color: stat.color }}
              >
                {stat.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
};