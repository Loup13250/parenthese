import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SAFE_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf',
]);

const EXT_MIME_MAP = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    jfif: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    avif: 'image/avif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    pdf: 'application/pdf',
};

function resolveMimeType(rawMime, id) {
    const clean = (rawMime || '').toLowerCase().split(';')[0].trim();
    if (SAFE_MIME_TYPES.has(clean)) return clean;
    const ext = (id.split('.').pop() || '').toLowerCase();
    return EXT_MIME_MAP[ext] || 'application/octet-stream';
}

function toBuffer(raw) {
    if (Buffer.isBuffer(raw)) return raw;
    if (raw instanceof ArrayBuffer) return Buffer.from(raw);
    if (raw instanceof Uint8Array) return Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength);
    if (typeof raw === 'string') {
        const base64Data = raw.replace(/^data:[^;]+;base64,/, '');
        return Buffer.from(base64Data, 'base64');
    }
    return Buffer.from(raw);
}

async function serveMedia(request, params, headOnly = false) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams?.id;
        if (!id || typeof id !== 'string' || id.includes('..') || id.includes('/')) {
            return new NextResponse('Not found', { status: 404 });
        }

        const db = getDb();
        const item = await db.prepare('SELECT mime_type, data FROM media_storage WHERE id = ?').get(id);

        if (!item || !item.data) {
            return new NextResponse('Media not found', { status: 404 });
        }

        const buffer = toBuffer(item.data);
        const total = buffer.length;
        const mimeType = resolveMimeType(item.mime_type, id);

        const baseHeaders = {
            'Content-Type': mimeType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
            'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; sandbox",
        };

        if (mimeType === 'application/pdf') {
            baseHeaders['Content-Disposition'] = 'inline; filename="document.pdf"';
        } else if (mimeType === 'application/octet-stream') {
            baseHeaders['Content-Disposition'] = 'attachment';
        }

        const rangeHeader = request.headers.get('range');
        if (rangeHeader && rangeHeader.startsWith('bytes=')) {
            const [startStr, endStr] = rangeHeader.replace(/bytes=/, '').split('-');
            let start = startStr ? parseInt(startStr, 10) : 0;
            let end = endStr ? parseInt(endStr, 10) : total - 1;

            if (!startStr && endStr) {
                // Suffix byte-range-spec (e.g. bytes=-500)
                const suffixLen = parseInt(endStr, 10);
                start = Math.max(0, total - suffixLen);
                end = total - 1;
            }

            if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || start >= total || start > end) {
                return new NextResponse(null, {
                    status: 416,
                    headers: {
                        ...baseHeaders,
                        'Content-Range': `bytes */${total}`,
                    },
                });
            }

            end = Math.min(end, total - 1);
            const chunk = buffer.subarray(start, end + 1);
            return new NextResponse(headOnly ? null : chunk, {
                status: 206,
                headers: {
                    ...baseHeaders,
                    'Content-Range': `bytes ${start}-${end}/${total}`,
                    'Content-Length': String(chunk.length),
                },
            });
        }

        return new NextResponse(headOnly ? null : buffer, {
            status: 200,
            headers: {
                ...baseHeaders,
                'Content-Length': String(total),
            },
        });
    } catch (err) {
        console.error('[Media API Error]:', err);
        return new NextResponse('Error loading media', { status: 500 });
    }
}

export async function GET(request, context) {
    return serveMedia(request, context.params, false);
}

export async function HEAD(request, context) {
    return serveMedia(request, context.params, true);
}
