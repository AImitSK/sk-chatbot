import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { getUserFromSanity } from '@/sanity/queries';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return NextResponse.json({ user: null });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        
        try {
            const { payload } = await jose.jwtVerify(token, secret);
            const username = payload.username as string;
            
            // Benutzer aus Sanity abrufen
            const user = await getUserFromSanity(username);
            
            if (!user) {
                return NextResponse.json({ user: null });
            }

            return NextResponse.json({
                user: {
                    username: user.username,
                    email: user.email,
                    role: user.role || 'user',
                    profileImage: user.profileImage,
                }
            });
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ user: null });
        }
    } catch (error) {
        console.error('Error in /api/me:', error);
        return NextResponse.json({ user: null });
    }
}
