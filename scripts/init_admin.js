import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';
import Database from 'better-sqlite3';

const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const derived = await scrypt(password, salt, 64);
    return `scrypt$${salt.toString('base64')}$${derived.toString('base64')}`;
}

async function main() {
    const dbDir = path.join(process.cwd(), 'database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, 'laparenthese.db');
    const schemaPath = path.join(dbDir, 'schema.sql');

    console.log(`Initialisation de la base SQLite locale : ${dbPath}`);
    const db = new Database(dbPath);

    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema);
        console.log('Schéma et données initiales exécutés avec succès.');
    } else {
        console.error('schema.sql introuvable.');
        process.exit(1);
    }

    // Création ou mise à jour du compte administrateur
    const defaultUsername = process.env.ADMIN_USER || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD;

    if (!defaultPassword) {
        console.error('❌ Erreur : Veuillez définir la variable ADMIN_PASSWORD dans votre environnement.');
        process.exit(1);
    }

    const hashed = await hashPassword(defaultPassword);

    const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(defaultUsername);
    if (!existing) {
        db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)').run(defaultUsername, hashed);
        console.log(`Compte administrateur créé : Identifiant "${defaultUsername}", Mot de passe "${defaultPassword}"`);
    } else {
        console.log(`Compte administrateur "${defaultUsername}" déjà existant.`);
    }

    db.close();
    console.log('Initialisation terminée !');
}

main().catch(console.error);
