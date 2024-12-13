import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { client } from '@/sanity/lib/client';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'Nicht authentifiziert' },
                { status: 401 }
            );
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jose.jwtVerify(token, secretKey);
        const decoded = payload as {
            username: string;
            role: string;
        };

        // Benutzerinformationen aus Sanity abrufen
        const user = await client.fetch(`*[_type == "user" && username == $username][0]{
            username,
            email,
            role,
            "profileImage": profileImage.asset->url
        }`, { username: decoded.username });

        if (!user) {
            return NextResponse.json(
                { message: 'Benutzer nicht gefunden' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            username: user.username,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || null
        });
    } catch (error) {
        console.error('Error getting user info:', error);
        return NextResponse.json(
            { message: 'Fehler beim Abrufen der Benutzerinformationen' },
            { status: 500 }
        );
    }
}