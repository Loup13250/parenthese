import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isAdminRequest, SESSION_COOKIE, getSessionUser, clientIp } from '@/lib/auth';
import { SENSITIVE_SITE_INFO_KEYS } from '@/lib/data';
import { logActivity } from '@/lib/logs';
import { cookies, headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function encodeBinary(rows) {
    return rows.map((row) => {
        const data = row.data;
        if (data == null || typeof data === 'string') return row;
        const buf = Buffer.isBuffer(data)
            ? data
            : data instanceof ArrayBuffer
                ? Buffer.from(data)
                : data instanceof Uint8Array
                    ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
                    : Buffer.from(data);
        return { ...row, data: buf.toString('base64'), data_encoding: 'base64' };
    });
}

export async function GET() {
    if (!(await isAdminRequest())) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const db = getDb();
        const store = await cookies();
        const reqHeaders = await headers();
        const username = (await getSessionUser(store.get(SESSION_COOKIE)?.value)) || 'Admin';

        const tables = [
            'site_info',
            'services',
            'testimonials',
            'gallery_posts',
            'contact_messages',
            'media_storage',
            'activity_logs',
        ];

        const exportedTables = {};

        for (const table of tables) {
            try {
                const rows = await db.prepare(`SELECT * FROM ${table}`).all();
                if (table === 'media_storage') {
                    exportedTables[table] = encodeBinary(rows);
                } else if (table === 'site_info') {
                    exportedTables[table] = rows.filter((r) => !SENSITIVE_SITE_INFO_KEYS.has(r.key));
                } else {
                    exportedTables[table] = rows;
                }
            } catch (err) {
                console.warn(`Backup: could not export table ${table}`, err);
                exportedTables[table] = [];
            }
        }

        const backupData = {
            version: '2.0',
            site: 'La Parenthèse Harmonieuse',
            timestamp: new Date().toISOString(),
            tables: exportedTables,
            data: exportedTables,
        };

        await logActivity({
            action: 'update',
            category: 'Sauvegarde',
            summary: 'Téléchargement d’une sauvegarde complète de la base de données',
            username,
            ip: clientIp(reqHeaders),
        });

        const dateStr = new Date().toISOString().split('T')[0];
        const jsonContent = JSON.stringify(backupData, null, 2);

        return new NextResponse(jsonContent, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Content-Disposition': `attachment; filename="laparenthese_backup_${dateStr}.json"`,
            },
        });
    } catch (err) {
        console.error('Failed to create backup:', err);
        return NextResponse.json({ error: 'Erreur lors de la création de la sauvegarde' }, { status: 500 });
    }
}
