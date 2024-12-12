'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import StatsOverview from '@/components/StatsOverview';

// Dynamischer Import der Botpress-Komponente
const BotpressStats = dynamic(() => import('@/botpress/components/BotpressStats'), {
    ssr: false,
    loading: () => <div>Lade Botpress...</div>
});

export default function Page() {
    return (
        <main className="container mx-auto mt-10 px-4">
            <BotpressStats />
            <StatsOverview />
        </main>
    );
}