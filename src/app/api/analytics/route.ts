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
        console.error('Fehler beim Validieren des Tokens:', error);
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
        console.log('Auth Token:', token ? 'Vorhanden' : 'Nicht vorhanden');
        
        if (!token) {
            return NextResponse.json(
                { error: 'Nicht authentifiziert' },
                { status: 401 }
            );
        }

        // Benutzername aus Token extrahieren
        const username = await getUsernameFromToken(token);
        console.log('Username:', username);
        
        if (!username) {
            return NextResponse.json(
                { error: 'Ungültiges Token' },
                { status: 401 }
            );
        }

        // Benutzerdaten abrufen
        const projects = await fetchUserData(username);
        if (!projects) {
            console.log('No projects found for user:', username);
            return NextResponse.json({ error: 'No projects found' }, { status: 404 });
        }

        // Log nur die Projekt-IDs statt der kompletten Konfiguration
        console.log('Found projects for user:', projects.projects.map(p => p.name));
        
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
            console.error('Fehlende Botpress-Konfiguration:', {
                hasToken: !!project.botpress?.personalAccessToken,
                hasWorkspaceId: !!project.botpress?.workspaceId,
                hasBotId: !!project.botpress?.botId
            });
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
            console.log('API Request URL:', url);
            console.log('API Request Params:', params);
            
            const analyticsResponse = await axios.get(url, { 
                ...config,
                params,
                headers: {
                    ...config.headers,
                    'accept': 'application/json',
                    'x-workspace-id': project.botpress.workspaceId
                }
            });
            console.log('Botpress API Response:', JSON.stringify(analyticsResponse.data, null, 2));

            // Die Antwort enthält bereits das richtige Format
            return NextResponse.json({
                analytics: analyticsResponse.data
            });
        } catch (error: any) {
            console.error('Fehler in der Analytics API:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data,
                status: error.response?.status
            });

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
        console.error('Fehler beim Abrufen des aktiven Projekts:', error);
        return NextResponse.json(
            { error: 'Fehler beim Abrufen des aktiven Projekts' },
            { status: 500 }
        );
    }
}
