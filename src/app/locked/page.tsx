// src/app/locked/page.tsx

import React from 'react';

const LockedPage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Ihr Zugang wurde gesperrt</h1>
            <p>Ihr Konto wurde aufgrund mehrerer fehlgeschlagener Anmeldeversuche gesperrt. Bitte wenden Sie sich an den Administrator, um Ihr Konto wieder freizuschalten.</p>
        </div>
    );
};

export default LockedPage;
