import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Erstelle Response
        const response = NextResponse.json(
            { message: 'Erfolgreich ausgeloggt' },
            { status: 200 }
        );

        // Lösche den Auth-Token
        response.cookies.delete('authToken', {
            path: '/',
            secure: true,
            sameSite: 'strict'
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Fehler beim Ausloggen' },
            { status: 500 }
        );
    }
}
