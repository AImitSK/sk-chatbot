'use client';

import React from 'react';
import StatsOverview from '@/components/StatsOverview';

export default function Page() {
    return (
        <main className="container mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <StatsOverview />
        </main>
    );
}