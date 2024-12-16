'use client';

import React from 'react';
import { LastMonthUsersProps } from './types';
import { AnalyticsCard } from './AnalyticsCard';

export const LastMonthUsers = ({ totalUsers }: LastMonthUsersProps) => {
  return (
    <AnalyticsCard title="Benutzer des letzten Monats">
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">Gesamtbenutzer</p>
        <p className="text-5xl font-semibold mt-2">{totalUsers}</p>
      </div>
    </AnalyticsCard>
  );
};