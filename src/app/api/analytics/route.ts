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
        const userData = await fetchUserData(username);
        const projects = userData?.projects || [];
        console.log('Projekte:', JSON.stringify(projects, null, 2));
        
        if (!projects || projects.length === 0) {
            return NextResponse.json(
                { error: 'Keine Projekte gefunden' },
                { status: 404 }
            );
        }

        // Da wir nur ein Projekt haben, nehmen wir das erste
        const project = projects[0];
        console.log('Gewähltes Projekt:', JSON.stringify(project, null, 2));
        
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
            // Setze das Start- und Enddatum für den letzten Monat
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);

            // Formatiere die Daten für die Botpress API
            const startDateString = startDate.toISOString();
            const endDateString = endDate.toISOString();

            console.log('API Request Konfiguration:', {
                botId: project.botpress.botId,
                workspaceId: project.botpress.workspaceId,
                startDate: startDateString,
                endDate: endDateString
            });

            // Konfiguriere den API-Request mit den Projekt-spezifischen Zugangsdaten
            const config = {
                headers: {
                    'Authorization': `Bearer ${project.botpress.personalAccessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            // Hole die Analytics-Daten von Botpress
            // Der neue Endpunkt für die Botpress Cloud API v1
            const url = `https://api.botpress.cloud/v1/bots/${project.botpress.botId}/analytics/conversations`;
            console.log('API Request URL:', url);
            
            const analyticsResponse = await axios.get(url, config);
            console.log('Botpress API Response:', JSON.stringify(analyticsResponse.data, null, 2));

            // Transformiere die Daten in das erwartete Format
            const records = analyticsResponse.data.records || [];

            // Transformiere die Daten in das Format, das der Hook erwartet
            const response = {
                analytics: {
                    records: records.map((record: {
                        startTime: string;
                        endTime: string;
                        newUsers: number;
                        returningUsers: number;
                        sessions: number;
                        userMessages: number;
                        botMessages: number;
                    }) => ({
                        startDate: new Date(record.startTime).toISOString(),
                        endDate: new Date(record.endTime).toISOString(),
                        newUsers: record.newUsers || 0,
                        returningUsers: record.returningUsers || 0,
                        sessions: record.sessions || 0,
                        userMessages: record.userMessages || 0,
                        botMessages: record.botMessages || 0
                    }))
                }
            };

            console.log('Final response:', JSON.stringify(response, null, 2));
            return NextResponse.json(response);

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
