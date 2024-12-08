'use client';

import React, { useEffect, useState } from 'react';
import botpressClient from '../bottpress/config';

// Hilfsfunktion zur Validierung der UUID
function isValidUUID(uuid: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

export default function BotpressTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initBotpress() {
            try {
                const botId = process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? '';
                
                // Überprüfe die Bot-ID
                if (!botId) {
                    throw new Error('Keine Bot-ID konfiguriert');
                }
                
                if (!isValidUUID(botId)) {
                    throw new Error('Ungültige Bot-ID: Bot-ID muss eine gültige UUID sein');
                }

                const { bot } = await botpressClient.getBot({ id: botId });
                console.log('Bot-Daten erfolgreich abgerufen:', bot);
                setStatus('success');
            } catch (err) {
                console.error('Fehler beim Abrufen der Bot-Daten:', err);
                setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
                setStatus('error');
            }
        }

        initBotpress();
    }, []);

    if (status === 'loading') {
        return <div className="p-4 text-blue-600">Botpress wird initialisiert...</div>;
    }

    if (status === 'error') {
        return (
            <div className="p-4 border border-red-300 rounded bg-red-50">
                <p className="text-red-600">Fehler: {error}</p>
                <p className="text-sm text-red-500 mt-2">
                    Bitte überprüfen Sie die Bot-ID in Ihrer .env.local Datei. 
                    Sie sollte im Format "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" sein.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 border border-green-300 rounded bg-green-50">
            <p className="text-green-600">Botpress erfolgreich initialisiert!</p>
        </div>
    );
}
