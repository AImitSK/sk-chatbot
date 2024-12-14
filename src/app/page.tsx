'use client';

import React from 'react';
import StatsOverview from '@/components/StatsOverview';

export default function Page() {
    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <StatsOverview />
        </div>
    );
}