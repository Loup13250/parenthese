import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';

// 1. Chargement de .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const idx = trimmed.indexOf('=');
            if (idx !== -1) {
                const key = trimmed.slice(0, idx).trim();
                const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
                if (!process.env[key]) {
                    process.env[key] = val;
                }
            }
        }
    }
}

const rawUrl = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || process.env.DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

if (!rawUrl || !token || rawUrl.includes('xxx') || token.includes('xxx')) {
    console.error('\n❌ Erreur : Identifiants Turso manquants ou incomplets dans .env.local.');
    process.exit(1);
}

const tursoUrl = rawUrl.replace(/^libsql:\/\//i, 'https://');

async function sync() {
    console.log('\n🚀 Connexion à Turso...');

    const client = createClient({
        url: tursoUrl,
        authToken: token,
    });

    const localDbPath = path.join(process.cwd(), 'database', 'laparenthese.db');
    if (!fs.existsSync(localDbPath)) {
        console.error(`❌ Fichier local introuvable : ${localDbPath}`);
        process.exit(1);
    }

    const localDb = new Database(localDbPath);
    console.log('📂 Base SQLite locale chargée avec succès.');

    // 1. Exécution du schéma complet sur Turso (en retirant proprement les lignes de commentaires --)
    console.log('⚙️  Vérification du schéma sur Turso...');
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
        const rawSchema = fs.readFileSync(schemaPath, 'utf-8');
        const cleanedSchema = rawSchema
            .split(/\r?\n/)
            .filter((line) => !line.trim().startsWith('--'))
            .join('\n');
        const statements = cleanedSchema
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        for (const sql of statements) {
            try {
                await client.execute(sql);
            } catch {}
        }
    }

    // 2. Migration des colonnes et données table par table
    const tables = [
        'admin_users',
        'site_info',
        'services',
        'testimonials',
        'gallery_posts',
        'contact_messages',
        'media_storage',
        'activity_logs',
    ];

    for (const table of tables) {
        try {
            const localCols = localDb.prepare(`PRAGMA table_info(${table})`).all();
            const remoteColsRes = await client.execute(`PRAGMA table_info(${table})`);
            const remoteColNames = new Set(remoteColsRes.rows.map((r) => r.name));

            for (const col of localCols) {
                if (!remoteColNames.has(col.name)) {
                    try {
                        await client.execute(`ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type || 'TEXT'}`);
                        console.log(`➕ Colonne ajoutée sur ${table} : ${col.name}`);
                    } catch {}
                }
            }

            const rows = localDb.prepare(`SELECT * FROM ${table}`).all();
            if (!rows || rows.length === 0) continue;

            console.log(`📦 Synchronisation de ${table} (${rows.length} enregistrements)...`);

            for (const row of rows) {
                const keys = Object.keys(row);
                const placeholders = keys.map(() => '?').join(', ');
                const columns = keys.join(', ');
                const values = keys.map((k) => row[k]);

                await client.execute({
                    sql: `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`,
                    args: values,
                });
            }
        } catch (err) {
            console.warn(`⚠️  Avertissement sur la table ${table} :`, err.message);
        }
    }

    console.log('\n🎉 Synchronisation vers Turso terminée avec succès.');
    localDb.close();
    process.exit(0);
}

sync().catch((err) => {
    console.error('❌ Erreur lors de la synchronisation vers Turso :', err);
    process.exit(1);
});
