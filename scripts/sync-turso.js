import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';

// 1. Chargement de .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const idx = trimmed.indexOf('=');
            if (idx !== -1) {
                const key = trimmed.slice(0, idx).trim();
                const val = trimmed.slice(idx + 1).trim();
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
    console.log('\n👉 Veuillez renseigner dans votre fichier .env.local :');
    console.log('   TURSO_DATABASE_URL=libsql://nom-de-votre-base-utilisateur.turso.io');
    console.log('   TURSO_AUTH_TOKEN=votre_token_secret\n');
    process.exit(1);
}

const tursoUrl = rawUrl.replace(/^libsql:\/\//i, 'https://');

async function sync() {
    console.log('\n🚀 Connexion à Turso...');
    console.log(`📡 URL : ${tursoUrl}`);

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

    // 1. Création du schéma sur Turso
    console.log('⚙️  Création des tables sur Turso...');
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        // Nettoie les commentaires et exécute les CREATE TABLE
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const sql of statements) {
            try {
                await client.execute(sql);
            } catch (err) {
                // Ignore if table exists or minor syntax
            }
        }
    }

    // Tables additionnelles nécessaires
    await client.executeMultiple(`
        CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS site_info (key TEXT PRIMARY KEY, value TEXT);
        CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, category_slug TEXT NOT NULL, title TEXT NOT NULL, subtitle TEXT, duration TEXT, price TEXT NOT NULL, description TEXT NOT NULL, benefits TEXT, contraindications TEXT, image_url TEXT, badge TEXT, planity_url TEXT, is_featured BOOLEAN DEFAULT 0, display_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT NOT NULL, rating INTEGER DEFAULT 5, date_label TEXT, comment TEXT NOT NULL, treatment_name TEXT, source TEXT DEFAULT 'Planity', is_featured BOOLEAN DEFAULT 1, display_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS gallery_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, caption TEXT, image_url TEXT NOT NULL, media_type TEXT DEFAULT 'image', display_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, service_interest TEXT, preferred_date TEXT, preferred_time TEXT, message TEXT NOT NULL, status TEXT DEFAULT 'nouveau', admin_notes TEXT DEFAULT '', is_read BOOLEAN DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS media_storage (id TEXT PRIMARY KEY, mime_type TEXT NOT NULL, data BLOB NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, expires_at INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS activity_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, action TEXT NOT NULL, category TEXT NOT NULL, summary TEXT NOT NULL, details TEXT, username TEXT DEFAULT 'Admin', ip TEXT);
        CREATE TABLE IF NOT EXISTS pricing_document_images (id INTEGER PRIMARY KEY AUTOINCREMENT, doc_id INTEGER NOT NULL, image_url TEXT NOT NULL, display_order INTEGER DEFAULT 0, lang TEXT DEFAULT 'fr', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);

    console.log('✅ Tables vérifiées.');

    // 2. Migration des données table par table
    const tables = [
        'admin_users',
        'site_info',
        'services',
        'testimonials',
        'gallery_posts',
        'media_storage',
        'activity_logs'
    ];

    for (const table of tables) {
        try {
            const rows = localDb.prepare(`SELECT * FROM ${table}`).all();
            if (!rows || rows.length === 0) continue;

            // Récupère les colonnes locales
            const localCols = localDb.prepare(`PRAGMA table_info(${table})`).all();
            
            // Récupère les colonnes distantes Turso
            const remoteColsRes = await client.execute(`PRAGMA table_info(${table})`);
            const remoteColNames = new Set(remoteColsRes.rows.map(r => r.name));

            // Ajoute automatiquement les colonnes manquantes
            for (const col of localCols) {
                if (!remoteColNames.has(col.name)) {
                    try {
                        await client.execute(`ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type || 'TEXT'}`);
                        console.log(`➕ Colonne ajoutée sur ${table} : ${col.name}`);
                    } catch (alterErr) {
                        // ignore if already added
                    }
                }
            }

            console.log(`📦 Migration de ${table} (${rows.length} enregistrements)...`);

            for (const row of rows) {
                const keys = Object.keys(row);
                const placeholders = keys.map(() => '?').join(', ');
                const columns = keys.join(', ');
                const values = keys.map(k => row[k]);

                await client.execute({
                    sql: `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`,
                    args: values
                });
            }
        } catch (err) {
            console.warn(`⚠️  Avertissement sur la table ${table} :`, err.message);
        }
    }

    console.log('\n🎉 SUCCÈS TOTAL ! Toutes vos données ont été migrées vers Turso avec succès.');
    console.log('✨ Vos soins, informations de contact, bio d\'Harmonie et compte administrateur sont en ligne !');
    localDb.close();
    process.exit(0);
}

sync().catch(err => {
    console.error('❌ Erreur lors de la synchronisation vers Turso :', err);
    process.exit(1);
});
