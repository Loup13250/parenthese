import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getDb } from '../src/lib/db.js';

async function optimizeUploads() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) return;

    const files = fs.readdirSync(uploadsDir);
    console.log(`Checking ${files.length} files in public/uploads...`);

    for (const file of files) {
        const fullPath = path.join(uploadsDir, file);
        const stat = fs.statSync(fullPath);
        if (!stat.isFile()) continue;

        if (/\.(png|jpg|jpeg)$/i.test(file)) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const webpPath = path.join(uploadsDir, `${baseName}.webp`);

            try {
                const buffer = fs.readFileSync(fullPath);
                const metadata = await sharp(buffer).metadata();
                let pipeline = sharp(buffer).rotate();
                if (metadata.width && metadata.width > 1600) {
                    pipeline = pipeline.resize(1600, null, { withoutEnlargement: true });
                }
                const webpBuffer = await pipeline.webp({ quality: 82, effort: 6 }).toBuffer();
                fs.writeFileSync(webpPath, webpBuffer);
                console.log(`Converted ${file} -> ${baseName}.webp (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err.message);
            }
        }
    }
}

async function optimizeMediaStorage() {
    console.log('Checking media_storage in DB...');
    const db = getDb();
    try {
        const items = await db.prepare('SELECT id, mime_type, data FROM media_storage').all();
        console.log(`Found ${items.length} items in media_storage`);

        for (const item of items) {
            if (!item.data || item.mime_type?.startsWith('video/') || item.mime_type === 'image/svg+xml' || item.mime_type === 'application/pdf') {
                continue;
            }

            let buffer;
            if (typeof item.data === 'string') {
                const base64Data = item.data.replace(/^data:[^;]+;base64,/, '');
                buffer = Buffer.from(base64Data, 'base64');
            } else if (Buffer.isBuffer(item.data)) {
                buffer = item.data;
            } else {
                buffer = Buffer.from(item.data);
            }

            if (buffer.length > 350 * 1024) {
                try {
                    const metadata = await sharp(buffer).metadata();
                    let pipeline = sharp(buffer).rotate();
                    if (metadata.width && metadata.width > 1600) {
                        pipeline = pipeline.resize(1600, null, { withoutEnlargement: true });
                    }
                    const optimizedBuffer = await pipeline.webp({ quality: 82, effort: 6 }).toBuffer();
                    if (optimizedBuffer.length < buffer.length) {
                        await db.prepare('UPDATE media_storage SET data = ?, mime_type = ? WHERE id = ?').run(optimizedBuffer, 'image/webp', item.id);
                        console.log(`Optimized DB item ${item.id}: ${(buffer.length / 1024).toFixed(1)} KB -> ${(optimizedBuffer.length / 1024).toFixed(1)} KB`);
                    }
                } catch (e) {
                    console.error(`Error optimizing DB media ${item.id}:`, e.message);
                }
            }
        }
    } catch (dbErr) {
        console.error('Error optimizing media_storage:', dbErr);
    }
}

async function main() {
    await optimizeUploads();
    await optimizeMediaStorage();
    console.log('All image optimizations complete.');
}

main().catch(console.error);
