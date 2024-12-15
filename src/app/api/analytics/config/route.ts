import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { fetchUserData } from '@/sanity/queries';

// Hilfsfunktion zum Extrahieren des Benutzernamens aus dem Token
async function getUsernameFromToken(token: string): Promise<string | null> {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        return payload.username as string;
    } catch (error) {
        console.error('Fehler beim Validieren des Tokens:', error);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        // Token aus Cookies extrahieren
        const token = req.cookies.get('authToken')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Nicht authentifiziert' },
                { status: 401 }
            );
        }

        // Benutzername aus Token extrahieren
        const username = await getUsernameFromToken(token);
        if (!username) {
            return NextResponse.json(
                { error: 'Ungültiges Token' },
                { status: 401 }
            );
        }

        // Projekte des Benutzers abrufen
        const projects = await fetchUserData(username);
        if (!projects || projects.length === 0) {
            return NextResponse.json(
                { error: 'Keine Projekte gefunden' },
                { status: 404 }
            );
        }

        // Da wir nur ein Projekt haben, nehmen wir das erste
        const project = projects[0];
        if (!project) {
            return NextResponse.json(
                { error: 'Kein Projekt gefunden' },
                { status: 404 }
            );
        }

        // Überprüfen der Botpress-Konfiguration
        if (!project.botpress?.personalAccessToken || !project.botpress?.workspaceId || !project.botpress?.botId) {
            return NextResponse.json(
                { error: 'Botpress-Konfiguration unvollständig' },
                { status: 400 }
            );
        }

        // Sende nur die benötigten Botpress-Konfigurationsdaten zurück
        return NextResponse.json({
            personalAccessToken: project.botpress.personalAccessToken,
            workspaceId: project.botpress.workspaceId,
            botId: project.botpress.botId
        });

    } catch (error) {
        console.error('Fehler beim Abrufen der Botpress-Konfiguration:', error);
        return NextResponse.json(
            { error: 'Interner Server-Fehler' },
            { status: 500 }
        );
    }
}
