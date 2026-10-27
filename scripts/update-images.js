const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'laparenthese.db');
const db = new Database(dbPath);

const updates = [
    { id: 1, img: '/images/massage-dos.jpg' },
    { id: 2, img: '/images/spa-huiles.jpg' },
    { id: 3, img: '/images/soin-3.jpg' },
    { id: 4, img: '/images/spa-huiles.jpg' },
    { id: 5, img: '/images/massage-dos.jpg' },
    { id: 6, img: '/images/kobido-visage.jpg' },
    { id: 7, img: '/images/soin-1.jpg' },
    { id: 8, img: '/images/soin-2.jpg' },
    { id: 9, img: '/images/cabine-soin.jpg' },
];

const stmt = db.prepare('UPDATE services SET image_url = ? WHERE id = ?');
for (const u of updates) {
    stmt.run(u.img, u.id);
}

const check = db.prepare('SELECT id, title, image_url FROM services').all();
console.log('Updated services in laparenthese.db:', check);
