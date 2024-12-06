'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

export default function LogoutPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        // Benutzernamen aus dem Token extrahieren
        const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
        if (token) {
            try {
                const decoded = jwt.decode(token) as { username: string };
                setUsername(decoded.username);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                router.push('/login');
            } else {
                console.error('Fehler beim Ausloggen');
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/login');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f7fafc',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h2 style={{
                    marginBottom: '1rem',
                    fontSize: '1.5rem',
                    color: '#2d3748'
                }}>
                    Eingeloggt als: {username}
                </h2>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#e53e3e',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 500,
                        width: '100%',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#c53030';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#e53e3e';
                    }}
                >
                    Abmelden
                </button>
            </div>
        </div>
    );
}
