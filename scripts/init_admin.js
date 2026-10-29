import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';
import { getDb } from '../src/lib/db.js';

const scrypt = promisify(crypto.scrypt);

// Charge .env.local s'il est présent afin d'initialiser aussi Turso si configuré
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = val;
    }
}

async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const derived = await scrypt(password, salt, 64);
    return `scrypt$${salt.toString('base64')}$${derived.toString('base64')}`;
}

async function main() {
    const defaultUsername = process.env.ADMIN_USER || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD;

    if (!defaultPassword || defaultPassword.length < 8) {
        console.error('❌ Erreur : Veuillez définir la variable ADMIN_PASSWORD (8 caractères minimum) dans votre environnement.');
        process.exit(1);
    }

    const db = getDb();
    const hashed = await hashPassword(defaultPassword);

    const existing = await db.prepare('SELECT id FROM admin_users WHERE username = ?').get(defaultUsername);
    if (!existing) {
        await db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)').run(defaultUsername, hashed);
        console.log(`✅ Compte administrateur « ${defaultUsername} » créé avec succès (mot de passe chiffré scrypt).`);
    } else {
        await db.prepare('UPDATE admin_users SET password = ? WHERE username = ?').run(hashed, defaultUsername);
        console.log(`✅ Mot de passe du compte administrateur « ${defaultUsername} » mis à jour avec succès.`);
    }
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
