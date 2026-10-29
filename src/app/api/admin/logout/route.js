import { NextResponse } from 'next/server';
import { SESSION_COOKIE, destroySession, getSessionUser, clientIp } from '@/lib/auth';
import { logActivity } from '@/lib/logs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
    if (sessionToken) {
        const user = await getSessionUser(sessionToken).catch(() => null);
        await destroySession(sessionToken).catch(() => {});
        if (user) {
            await logActivity({
                action: 'logout',
                category: 'Connexions',
                summary: `Déconnexion de l'administration (${user})`,
                username: user,
                ip: clientIp(request.headers),
            });
        }
    }
    const response = NextResponse.redirect(new URL('/admin', request.url), 303);
    response.cookies.delete(SESSION_COOKIE);
    return response;
}
