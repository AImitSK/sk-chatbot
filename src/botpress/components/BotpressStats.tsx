'use client';

import React, { useEffect, useState } from 'react';
import { Client } from '@botpress/client';
import botpressClient from '../config';
import type { StatsData } from '../types/stats';

export default function BotpressStats() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loadingStep, setLoadingStep] = useState('Initialisiere...');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoadingStep('Verbinde mit Botpress...');
                
                // Zeitraum der letzten 30 Tage
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 30);

                setLoadingStep('Lade Konversationen...');

                // Konversationen abrufen
                const conversations = await botpressClient.list.conversations({
                    from: startDate.toISOString(),
                    to: endDate.toISOString()
                }).collect();

                // Nachrichten und User für jede Konversation analysieren
                let totalMessages = 0;
                let messagesByUser = 0;
                let messagesByBot = 0;
                let uniqueUsers = new Set<string>();

                setLoadingStep('Analysiere Nachrichten...');
                const recentConversations = conversations.slice(-10); // Limitiere auf die letzten 10 Konversationen für Performance

                for (const conversation of recentConversations) {
                    const messages = await botpressClient.list.messages({
                        conversationId: conversation.id,
                        from: startDate.toISOString(),
                        to: endDate.toISOString()
                    }).collect();

                    messages.forEach(message => {
                        totalMessages++;
                        if (message.direction === 'incoming') {
                            messagesByUser++;
                            uniqueUsers.add(message.userId);
                        } else {
                            messagesByBot++;
                        }
                    });
                }

                setStats({
                    totalConversations: conversations.length,
                    totalMessages,
                    messagesByUser,
                    messagesByBot,
                    activeUsers: uniqueUsers.size
                });

                setStatus('success');
            } catch (err) {
                console.error('Fehler:', err);
                setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
                setStatus('error');
            }
        };

        fetchStats();
    }, []);

    if (status === 'loading') {
        return (
            <div className="p-4">
                <p className="text-blue-600">{loadingStep}</p>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded">
                    <div className="h-1 bg-blue-600 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="p-4 border border-red-300 rounded bg-red-50">
                <p className="text-red-600">Fehler: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 border border-green-300 rounded bg-green-50">
            <h2 className="text-xl font-bold text-green-800 mb-4">Chatbot Statistiken (letzte 30 Tage)</h2>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-semibold text-gray-800 mb-2">Konversationen</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalConversations}</p>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-semibold text-gray-800 mb-2">Nachrichten</h3>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Gesamt: <span className="font-bold text-blue-600">{stats.totalMessages}</span></p>
                            <p className="text-sm text-gray-600">Von Benutzern: <span className="font-bold text-blue-600">{stats.messagesByUser}</span></p>
                            <p className="text-sm text-gray-600">Vom Bot: <span className="font-bold text-blue-600">{stats.messagesByBot}</span></p>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow">
                        <h3 className="font-semibold text-gray-800 mb-2">Aktive Benutzer</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.activeUsers}</p>
                    </div>
                </div>
            )}
        </div>
    );
}