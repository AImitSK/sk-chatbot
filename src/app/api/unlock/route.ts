import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Erstelle eine neue Response
        const response = NextResponse.json(
            { message: 'Konto erfolgreich entsperrt' },
            { status: 200 }
        );

        // Setze den failedAttempts Cookie zurück
        response.cookies.set('failedAttempts', '0', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 60 // 30 Minuten
        });

        // Lösche auch den authToken falls vorhanden
        response.cookies.delete('authToken');

        return response;
    } catch (error) {
        console.error('Fehler beim Entsperren:', error);
        return NextResponse.json(
            { message: 'Fehler beim Entsperren des Kontos' },
            { status: 500 }
        );
    }
}
