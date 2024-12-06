'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

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
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: '#e53e3e',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'background-color 0.2s',
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
    );
}
