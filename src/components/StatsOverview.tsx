'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DashboardAnalytics = dynamic(
  () => import('./analytics/DashboardAnalytics'),
  { ssr: false }
);

const StatsOverview = () => {
    return (
        <div className="stats-overview">
            <DashboardAnalytics />
        </div>
    );
};

export default StatsOverview;