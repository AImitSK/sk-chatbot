import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

// Definiere die Login-Seite und öffentliche Routen
const LOGIN_ROUTE = '/login';
const PUBLIC_API_ROUTES = ['/api/login', '/api/unlock'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Schließe statische Ressourcen und Bilder aus
  if (
      path.startsWith('/_next/') || // Next.js statische Dateien
      path.startsWith('/favicon.ico') || // Favicon
      path.startsWith('/images/') || // Öffentliche Bilder
      /\.(jpg|jpeg|png|svg|gif|webp|ico|bmp|tiff)$/i.test(path) // Bild-Dateierweiterungen
  ) {
    return NextResponse.next();
  }

  // Schließe API-Routen aus, die keine Authentifizierung benötigen
  if (PUBLIC_API_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Schließe die Login-Seite aus
  if (path.startsWith(LOGIN_ROUTE)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;

  // Überprüfe Authentifizierung
  if (!token) {
    // Umleiten zur Login-Seite, wenn kein Token vorhanden ist
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
  }

  try {
    // Überprüfe JWT-Token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, secretKey);

    // Überprüfe Token-Ablauf
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      // Umleiten zur Login-Seite, wenn Token abgelaufen ist
      return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    }

    // Setze Benutzer-Informationen in die Header des Requests
    request.headers.set('X-User-Id', payload.sub as string);
    request.headers.set('X-User-Role', payload.role as string);
  } catch (error) {
    // Bei einem ungültigen Token Umleitung zur Login-Seite
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
  }

  return NextResponse.next();
}

// Middleware-Konfiguration
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};