import React, { useEffect, useState } from 'react';

// Ihre Funktion, um Statistiken abzurufen
const fetchStats = async () => {
    try {
        const response = await fetch('https://api.example.com/stats', {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: 'Bearer Ihr_Authorisierungs_Token'
            }
        });

        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Statistiken');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler:', error);
        throw error;
    }
};

// Ihre Stat-Komponente für einzelne Statistiken
function Stat({ title, value, change }: { title: string; value: string; change: string }) {
    return (
        <div className="stat">
            <h3>{title}</h3>
            <p>{value}</p>
            <span>{change}%</span>
        </div>
    );
}

export default function StatsOverview() {
    const [stats, setStats] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                console.log('Abgerufene Statistiken:', data);  // Debugging
                setStats(data);
            } catch (err) {
                console.error('Fehler beim Abrufen der Statistiken:', err);
                setError('Ein Fehler ist aufgetreten');
            }
        };

        loadStats();
    }, []);

    if (error) {
        return <div className="text-red-500">Fehler: {error}</div>;
    }

    return (
        <div className="stats-overview">
            {stats.map((stat, index) => (
                <Stat key={index} title={stat.title} value={stat.value} change={stat.change} />
            ))}
        </div>
    );
}