'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Divider } from '@/components/divider';
import { Heading, Subheading } from '@/components/heading';
import { Select } from '@/components/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { getRecentOrders } from '@/data';

// Client-Komponente dynamisch importieren
const BotpressTestClient = dynamic(() => import('../components/BotpressTest'), {
    ssr: false,
    loading: () => <div>Lade Botpress...</div>
});

async function getBot() {
    try {
        const { bot } = await botpressClient.getBot({ 
            id: process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID ?? '' 
        });
        console.log('Bot-Daten erfolgreich abgerufen:', bot);
        return bot;
    } catch (err) {
        console.error('Fehler beim Abrufen der Bot-Daten:', err);
        throw err;
    }
}

function BotpressTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initBotpress() {
            try {
                await getBot();
                setStatus('success');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
                setStatus('error');
            }
        }

        initBotpress();
    }, []);

    if (status === 'loading') {
        return <div>Botpress wird initialisiert...</div>;
    }

    if (status === 'error') {
        return <div className="text-red-500">Fehler: {error}</div>;
    }

    return <div className="text-green-500">Botpress erfolgreich initialisiert!</div>;
}

function Stat({ title, value, change }: { title: string; value: string; change: string }) {
    return (
        <div className="stat">
            <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
            <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
            <div className="mt-3 text-sm/6 sm:text-xs/6">
                <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
                <span className="text-zinc-500">vs. letzte Woche</span>
            </div>
        </div>
    );
}

export default async function Page() {
    const orders = await getRecentOrders();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <BotpressTestClient />
            <Heading>Good afternoon, Erica</Heading>
            <div className="mt-8 flex items-end justify-between">
                <Subheading>Overview</Subheading>
                <div>
                    <Select name="period">
                        <option value="last_week">Last week</option>
                        <option value="last_two">Last two weeks</option>
                        <option value="last_month">Last month</option>
                        <option value="last_quarter">Last quarter</option>
                    </Select>
                </div>
            </div>
            <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                <Stat title="Total revenue" value="$2.6M" change="+4.5%" />
                <Stat title="Average order value" value="$455" change="-0.5%" />
                <Stat title="Tickets sold" value="5,888" change="+4.5%" />
                <Stat title="Pageviews" value="823,067" change="+21.2%" />
            </div>
            <Subheading className="mt-14">Recent orders</Subheading>
            <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                <TableHead>
                    <TableRow>
                        <TableHeader>Order number</TableHeader>
                        <TableHeader>Purchase date</TableHeader>
                        <TableHeader>Customer</TableHeader>
                        <TableHeader>Event</TableHeader>
                        <TableHeader className="text-right">Amount</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell className="text-zinc-500">{order.date}</TableCell>
                            <TableCell>{order.customer.name}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar src={order.event.thumbUrl} className="size-6" />
                                    <span>{order.event.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{/* Hier muss der restliche Code weitergeführt werden */}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main>
    );
}