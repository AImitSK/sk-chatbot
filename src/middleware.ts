import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose';
import rateLimit from './utils/rateLimit';

// Definiere geschützte Routen
const PROTECTED_ROUTES = [
  '/api/credentials',
  '/api/me',
  '/api/analytics',
  '/api/user'
];

// Definiere öffentliche API-Routen für Rate-Limiting
const PUBLIC_API_ROUTES = [
  '/api/login',
  '/api/unlock'
];

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Setze wichtige Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.botpress.cloud https://*.sanity.io;"
  );

  const path = request.nextUrl.pathname;

  // Rate Limiting für öffentliche API-Routen
  if (PUBLIC_API_ROUTES.some(route => path.startsWith(route))) {
    try {
      await limiter.check(response, 60, request.ip ?? 'anonymous'); // 60 requests per minute
    } catch {
      return new NextResponse(JSON.stringify({ error: 'Zu viele Anfragen. Bitte warten Sie eine Minute.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Überprüfe geschützte Routen
  if (PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Nicht authentifiziert' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jose.jwtVerify(token, secretKey);

      // Überprüfe Token-Ablauf
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return new NextResponse(
          JSON.stringify({ error: 'Token abgelaufen' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Füge User-Info zum Request hinzu
      request.headers.set('X-User-Id', payload.sub as string);
      request.headers.set('X-User-Role', payload.role as string);
      
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Ungültiger Token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return response;
}

// Definiere die Middleware-Konfiguration für alle Routen
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
