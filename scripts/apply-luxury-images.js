const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const brainDir = 'C:/Users/Dev/.gemini/antigravity-ide/brain/ab16ea09-95c4-44d3-afad-1e95adca96c0';
const publicDir = path.join(__dirname, '..', 'public', 'images');

// 1. Copy generated images
fs.copyFileSync(path.join(brainDir, 'massage_detente_spa_1793127303448.jpg'), path.join(publicDir, 'massage-detente.jpg'));
fs.copyFileSync(path.join(brainDir, 'soin_visage_bio_1793127319806.jpg'), path.join(publicDir, 'soin-visage-bio.jpg'));
fs.copyFileSync(path.join(brainDir, 'maternite_douceur_1793127336903.jpg'), path.join(publicDir, 'maternite-douceur.jpg'));

// 2. Remove the old corporate images (soin-1, soin-2, soin-3)
['soin-1.jpg', 'soin-2.jpg', 'soin-3.jpg'].forEach(f => {
    const p = path.join(publicDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
});

// 3. Update database
const dbPath = path.join(__dirname, '..', 'database', 'laparenthese.db');
const db = new Database(dbPath);

const mapping = [
    { id: 1, img: '/images/massage-dos.jpg' },        // 60 min
    { id: 2, img: '/images/spa-huiles.jpg' },         // 75 min
    { id: 3, img: '/images/massage-detente.jpg' },    // 90 min
    { id: 4, img: '/images/spa-huiles.jpg' },         // Drainage 1h15
    { id: 5, img: '/images/massage-dos.jpg' },        // Drainage + Madero
    { id: 6, img: '/images/kobido-visage.jpg' },      // Kobido
    { id: 7, img: '/images/soin-visage-bio.jpg' },    // Soin Visage Nohèm
    { id: 8, img: '/images/maternite-douceur.jpg' },  // Femme Enceinte
    { id: 9, img: '/images/cabine-soin.jpg' },        // Pack Le Cocoon
];

const stmt = db.prepare('UPDATE services SET image_url = ? WHERE id = ?');
for (const item of mapping) {
    stmt.run(item.img, item.id);
}

const check = db.prepare('SELECT id, title, image_url FROM services').all();
console.log('Database updated successfully with luxury imagery:');
console.log(check);
