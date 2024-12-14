'use client';

import React from 'react';
import { AnalyticsCardProps } from './types';

export const AnalyticsCard = ({
  title,
  children,
  className = '',
  actions,
}: AnalyticsCardProps) => {
  return (
    <div className={`bg-white shadow-sm rounded-xl border border-gray-100 ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          {actions && (
            <div className="flex items-center space-x-2">{actions}</div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};