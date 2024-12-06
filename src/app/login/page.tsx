'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.refresh) {
                    // Seite neu laden, um die Navigation zu aktualisieren
                    window.location.href = '/';
                } else {
                    router.push('/');
                }
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Unbekannter Fehler beim Login');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Netzwerkfehler oder Server nicht erreichbar');
            } else {
                setError('Unerwarteter Fehler');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="username">Benutzername</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Benutzername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password">Passwort</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Passwort"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', width: '100%' }}>
                    Login
                </button>
            </form>
        </div>
    );
}