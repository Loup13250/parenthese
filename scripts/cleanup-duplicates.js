const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'laparenthese.db');
const db = new Database(dbPath);

db.exec("DELETE FROM services WHERE id > 9;");

const rows = db.prepare('SELECT id, title, category, image_url, price FROM services').all();
console.log('Cleaned services table. Remaining count:', rows.length);
console.log(rows);
