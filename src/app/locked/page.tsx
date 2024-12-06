// src/app/locked/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LockedPage = () => {
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleUnlock = async () => {
        try {
            const response = await fetch('/api/unlock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setMessage('Ihr Konto wurde erfolgreich entsperrt.');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                const data = await response.json();
                setMessage(data.message || 'Fehler beim Entsperren des Kontos.');
            }
        } catch (error) {
            setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        }
    };

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '50px auto', 
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ 
                color: '#e53e3e',
                marginBottom: '20px'
            }}>
                Ihr Zugang wurde gesperrt
            </h1>
            
            <p style={{ 
                marginBottom: '20px',
                color: '#4a5568'
            }}>
                Ihr Konto wurde aufgrund mehrerer fehlgeschlagener Anmeldeversuche gesperrt. 
                Sie können Ihr Konto durch Klicken auf den Button unten entsperren.
            </p>

            {message && (
                <p style={{ 
                    marginBottom: '20px',
                    color: message.includes('erfolgreich') ? '#48bb78' : '#e53e3e'
                }}>
                    {message}
                </p>
            )}

            <button
                onClick={handleUnlock}
                style={{
                    backgroundColor: '#4299e1',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4299e1'}
            >
                Konto entsperren
            </button>
        </div>
    );
};

export default LockedPage;
