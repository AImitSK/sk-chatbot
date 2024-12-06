import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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

        const decoded = jwt.verify(token, secret) as {
            username: string;
            role: string;
        };

        return NextResponse.json({
            username: decoded.username,
            role: decoded.role
        });
    } catch (error) {
        console.error('Error getting user info:', error);
        return NextResponse.json(
            { message: 'Fehler beim Abrufen der Benutzerinformationen' },
            { status: 500 }
        );
    }
}
