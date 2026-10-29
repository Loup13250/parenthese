const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'laparenthese.db');
const db = new Database(dbPath);

const aboutFr = `Je m'appelle Harmonie, et depuis plus de 10 ans, je me consacre avec passion au bien-être et à l'esthétique. J'ai exercé dans des environnements variés : spas d'hôtels étoilés, instituts de prestige et résidences d'exception, en France comme à l'étranger.

Ces expériences m'ont permis de perfectionner mon toucher et de concevoir des protocoles sur mesure, mais surtout de comprendre ce qui compte le plus : prendre le temps d'écouter, d'apaiser et de sublimer chaque femme.

La Parenthèse Harmonieuse est née de cette vocation : un cocon d'exception à Salon-de-Provence, pensé comme un refuge hors du temps où chaque détail est dédié à votre lâcher-prise absolu.`;

const aboutEn = `My name is Harmonie. For over a decade, I have passionately devoted myself to the art of wellness and aesthetic rituals. Having practiced in prestigious luxury spas and institutes in France and abroad, I created La Parenthèse Harmonieuse as a sanctuary where time stands still and every woman receives tailor-made care.`;

const upsertStmt = db.prepare(`
  INSERT INTO site_info (key, value) VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);

upsertStmt.run('about_text', aboutFr);
upsertStmt.run('about_bio', aboutFr);
upsertStmt.run('about_text_en', aboutEn);
upsertStmt.run('tagline_en', 'Treat yourself to a moment of pure serenity...');

db.close();
console.log('Database site_info updated with Harmonie bio successfully.');
