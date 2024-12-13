'use client';

import React, { useEffect, useState } from 'react';
import botpressClient from '../../botpress/config';
import type { StatsData } from '../../botpress/types/stats';
import StatsCardSkeleton from '@/components/bpComponents/StatsCardSkeleton';

export default function BotpressStats() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<StatsData | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 30);

                const conversations = await botpressClient.list.conversations({
                    from: startDate.toISOString(),
                    to: endDate.toISOString()
                }).collect();

                let totalMessages = 0;
                let messagesByUser = 0;
                let messagesByBot = 0;
                let uniqueUsers = new Set<string>();

                const recentConversations = conversations.slice(-10);

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
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-16">
                    Conversations Dashboard
                </h2>
                <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-gray-900">Letzte 30 Tage</h3>
                    <StatsCardSkeleton />
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="p-4">
                <p className="text-red-600">Fehler: {error}</p>
            </div>
        );
    }

    const statsItems = stats ? [
        { 
            name: 'Anzahl Konversationen', 
            stat: stats.totalConversations.toString()
        },
        { 
            name: 'Nachrichten von Nutzern', 
            stat: stats.messagesByUser.toString()
        },
        { 
            name: 'Aktive Nutzer', 
            stat: stats.activeUsers.toString()
        }
    ] : [];

    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-16">
                Conversations Dashboard
            </h2>
            <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-gray-900">Letzte 30 Tage</h3>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {statsItems.map((item) => (
                        <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}