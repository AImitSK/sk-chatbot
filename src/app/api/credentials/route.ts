import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import * as jose from 'jose';
import { groq } from 'next-sanity';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('authToken')?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: 'Nicht authentifiziert' },
                { status: 401 }
            );
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jose.jwtVerify(token, secretKey);
        const username = payload.username as string;

        const query = groq`*[_type == "user" && username == $username][0]{
            _id,
            username,
            role,
            "projekt": *[_type == "projekt" && references(^._id)][0]{
                _id,
                title,
                "botpress": botpress{
                    token,
                    workspaceId,
                    botId,
                    clientId,
                    personalAccessToken
                }
            }
        }`;

        const data = await client.fetch(query, { username });

        if (!data?.projekt?.botpress) {
            return NextResponse.json(
                { error: 'Keine Botpress-Konfiguration gefunden' },
                { status: 404 }
            );
        }

        const credentials = {
            token: data.projekt.botpress.token || data.projekt.botpress.personalAccessToken,
            workspaceId: data.projekt.botpress.workspaceId,
            botId: data.projekt.botpress.botId,
            clientId: data.projekt.botpress.clientId
        };

        return NextResponse.json({ credentials });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Fehler beim Abrufen der Credentials' },
            { status: 500 }
        );
    }
}
