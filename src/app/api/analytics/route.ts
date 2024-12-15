import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { fetchUserData } from '@/sanity/queries';
import axios from 'axios';
import { Project } from '@/types/sanity';

// Hilfsfunktion zum Extrahieren des Benutzernamens aus dem Token
async function getUsernameFromToken(token: string): Promise<string | null> {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        return payload.username as string;
    } catch (error) {
        return null;
    }
}

// Analytics Record Typ-Definition
interface AnalyticsRecord {
    startDateTimeUtc: string;
    endDateTimeUtc: string;
    returningUsers: number;
    newUsers: number;
    sessions: number;
    userMessages: number;
    botMessages: number;
    events: number;
    eventTypes: Record<string, number>;
    customEvents: Record<string, number>;
    llm: Record<string, any>;
    messages: number;
}

interface AnalyticsResponse {
    records: AnalyticsRecord[];
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

        // Benutzerdaten abrufen
        const projects = await fetchUserData(username);
        if (!projects) {
            return NextResponse.json({ error: 'No projects found' }, { status: 404 });
        }
        
        // Da wir nur ein Projekt haben, nehmen wir das erste
        const project = projects.projects[0];
        
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

        try {
            // Konfiguriere den API-Request mit den Projekt-spezifischen Zugangsdaten
            const config = {
                headers: {
                    'Authorization': `Bearer ${project.botpress.personalAccessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            // Der neue Endpunkt für die Botpress Cloud API v1
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30); // Letzten 30 Tage

            const url = `https://api.botpress.cloud/v1/admin/bots/${project.botpress.botId}/analytics`;
            const params = {
                startDate: startDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
                endDate: endDate.toISOString().split('T')[0],     // Format: YYYY-MM-DD
            };
            
            const analyticsResponse = await axios.get(url, { 
                ...config,
                params,
                headers: {
                    ...config.headers,
                    'accept': 'application/json',
                    'x-workspace-id': project.botpress.workspaceId
                }
            });

            // Die Antwort enthält bereits das richtige Format
            return NextResponse.json({
                analytics: analyticsResponse.data
            });
        } catch (error: any) {
            // Spezifische Fehlermeldungen basierend auf dem Fehlertyp
            if (error.response?.status === 401) {
                return NextResponse.json(
                    { error: 'Nicht autorisiert bei Botpress' },
                    { status: 401 }
                );
            }

            if (error.response?.status === 404) {
                return NextResponse.json(
                    { error: 'Bot oder Workspace nicht gefunden' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { 
                    error: 'Fehler beim Abrufen der Analytics-Daten',
                    details: error.message
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Fehler beim Abrufen des aktiven Projekts' },
            { status: 500 }
        );
    }
}
