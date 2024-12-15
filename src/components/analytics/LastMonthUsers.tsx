'use client';

import React from 'react';
import { LastMonthUsersProps } from './types';
import { AnalyticsCard } from './AnalyticsCard';

export const LastMonthUsers = ({ totalUsers }: LastMonthUsersProps) => {
  return (
    <AnalyticsCard title="Last Month Users">
      <div className="mt-4">
        <div className="flex flex-col">
          <span className="text-4xl font-semibold text-gray-900">
            {totalUsers.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 mt-1">Total Users</span>
        </div>
      </div>
    </AnalyticsCard>
  );
};