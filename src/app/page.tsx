'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Client } from '@botpress/client'
import StatsOverview from '@/components/StatsOverview'; // Import der StatsOverview-Komponente

// Dynamischer Import der Botpress-Komponente

const BotpressTestClient = dynamic(() => import('../components/botpressTest'), {
    ssr: false,
    loading: () => <div>Lade Botpress...</div>
});


// Funktion, um Bot-Daten abzurufen
async function fetchBotData() {
    try {
        const { bot } = await client.getBot({
            id: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? ''
        });
        console.log('Bot-Daten erfolgreich abgerufen:', bot);
        return bot;
    } catch (err) {
        console.error('Fehler beim Abrufen der Bot-Daten:', err);
        throw err;
    }
}

// Komponente zur Anzeige der Bot-Daten
function BotpressTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [botData, setBotData] = useState<any>(null);

    useEffect(() => {
        // IIFE zur Initialisierung
        (async () => {
            try {
                const bot = await fetchBotData();
                setBotData(bot);
                setStatus('success');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
                setStatus('error');
            }
        })();
    }, []);

    if (status === 'loading') {
        return <div>Botpress wird initialisiert...</div>;
    }

    if (status === 'error') {
        return <div className="text-red-500">Fehler: {error}</div>;
    }

    return (
        <div className="text-green-500">
            {botData ? (
                <>
                    <p><strong>Bot Name:</strong> {botData.name}</p>
                    <p><strong>Status:</strong> {botData.status}</p>
                    <p><strong>Erstellt am:</strong> {new Date(botData.createdAt).toLocaleDateString()}</p>
                    <p><strong>Zuletzt aktualisiert:</strong> {new Date(botData.updatedAt).toLocaleDateString()}</p>
                    <p><strong>Deployed am:</strong> {new Date(botData.deployedAt).toLocaleDateString()}</p>
                </>
            ) : (
                <p>Keine Bot-Daten verfügbar</p>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <main className="container mx-auto mt-10 px-4">
            <BotpressTestClient />
            <StatsOverview /> {/* Einfügen der StatsOverview-Komponente */}
        </main>
    );
}