CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_info (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  subtitle TEXT,
  subtitle_en TEXT,
  duration TEXT,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT,
  benefits TEXT,
  benefits_en TEXT,
  contraindications TEXT,
  contraindications_en TEXT,
  image_url TEXT,
  badge TEXT,
  badge_en TEXT,
  planity_url TEXT,
  is_featured BOOLEAN DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  date_label TEXT,
  comment TEXT NOT NULL,
  comment_en TEXT,
  treatment_name TEXT,
  treatment_name_en TEXT,
  source TEXT DEFAULT 'Planity',
  is_featured BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  title_en TEXT,
  caption TEXT,
  caption_en TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  media_type TEXT DEFAULT 'image',
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  service_interest TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nouveau',
  admin_notes TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_storage (
  id TEXT PRIMARY KEY,
  mime_type TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  username TEXT DEFAULT 'Admin',
  ip TEXT
);

-- ==========================================
-- Initial Data - La Parenthèse Harmonieuse
-- ==========================================

INSERT OR IGNORE INTO site_info (key, value) VALUES
('business_name', 'La Parenthèse Harmonieuse'),
('creator_name', 'Harmonie'),
('legal_status', 'Entrepreneur Individuel (Micro-entreprise)'),
('siret', 'En cours d''immatriculation / Communiqué sur demande'),
('tagline', 'Offrez-vous une parenthèse de bien-être...'),
('tagline_en', 'Treat yourself to a moment of pure serenity...'),
('subtitle', 'Massages sur mesure • Soins Visage • Drainage Lymphatique • Kobido'),
('subtitle_en', 'Tailor-made Massages • Organic Facials • Lymphatic Drainage • Kobido'),
('audience', 'Institut exclusivement dédié aux femmes'),
('phone', '06 51 65 21 42'),
('phone_raw', '0651652142'),
('address', '418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer'),
('city', 'Salon-de-Provence'),
('postal_code', '13300'),
('full_address', '418 Avenue Georges Guynemer, 13300 Salon-de-Provence'),
('parking_info', 'Parking gratuit et facile d''accès directement devant le Pôle Santé'),
('contact_email', 'laparentheseharmonieuse@gmail.com'),
('planity_url', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence'),
('instagram', 'https://www.instagram.com/laparentheseharmonieuse/'),
('google_reviews', 'https://g.page/r/CQUzqKQ2SgYrEAE/review'),
('hero_video', '/videos/hero-massage.mp4'),
('hero_poster', '/images/hero-poster.jpg'),
('about_title', 'Une esthéticienne et masseuse passionnée, un lieu pensé pour vous'),
('about_bio', 'Je m''appelle Harmonie, j''ai 29 ans, et je suis originaire de Château-Gontier, en Mayenne. Depuis plus de 10 ans, je me consacre avec passion au bien-être et à l''esthétique. J''ai exercé dans des environnements variés : instituts, spas d''hôtels étoilés, résidences de vacances... en France comme à l''étranger.

Ces expériences m''ont beaucoup appris, mais aussi fait réaliser ce que je ne voulais plus : enchaîner les soins sans prendre le temps, faire du bien sans pouvoir vraiment accompagner.

C''est de ce constat qu''est née La Parenthèse Harmonieuse : un lieu dédié aux femmes, pensé comme une bulle hors du temps où chaque détail a été soigné pour vous faire vivre un pur moment de relaxation et de reconnexion à soi.'),
('about_text', 'Je m''appelle Harmonie, j''ai 29 ans, et je suis originaire de Château-Gontier, en Mayenne. Depuis plus de 10 ans, je me consacre avec passion au bien-être et à l''esthétique. J''ai exercé dans des environnements variés : instituts, spas d''hôtels étoilés, résidences de vacances... en France comme à l''étranger.

Ces expériences m''ont beaucoup appris, mais aussi fait réaliser ce que je ne voulais plus : enchaîner les soins sans prendre le temps, faire du bien sans pouvoir vraiment accompagner.

C''est de ce constat qu''est née La Parenthèse Harmonieuse : un lieu dédié aux femmes, pensé comme une bulle hors du temps où chaque détail a été soigné pour vous faire vivre un pur moment de relaxation et de reconnexion à soi.'),
('brands', 'Nohèm (BIO certifié Ecocert), Green Spa (BIO Cosmos), Oh My Jelly'),
('hours', 'Mardi : 10h00–13h30 / 14h30–19h00 · Mercredi : 14h00–19h00 · Jeudi : 10h00–13h30 / 14h30–18h00 · Vendredi : 10h00–13h30 / 14h30–17h30 · Samedi : 09h30–14h00'),
('hours_tue', '10:00 - 13:30 | 14:30 - 19:00'),
('hours_wed', '14:00 - 19:00'),
('hours_thu', '10:00 - 13:30 | 14:30 - 18:00'),
('hours_fri', '10:00 - 13:30 | 14:30 - 17:30'),
('hours_sat', '09:30 - 14:00'),
('hours_sun_mon', 'Fermé');

-- Services / Carte des Soins (insérés uniquement si la table est vide)
INSERT INTO services (category, category_slug, title, subtitle, duration, price, description, benefits, badge, image_url, planity_url, is_featured, display_order)
SELECT * FROM (
  SELECT 'Massages Sur Mesure', 'massages', 'Massage La Parenthèse (30 min)', 'Pause détente express et ciblée', '30 min (rendez-vous 45 min)', '40 €', 'Idéal pour relâcher rapidement les tensions sur une zone spécifique au choix (dos, nuque et trapèzes ou jambes). Parfait pour s''accorder une parenthèse relaxante dans un emploi du temps chargé.', 'Détente musculaire ciblée, huiles Green Spa BIO certifiées Cosmos.', 'Express 30 min', '/images/massage-dos.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 1
  UNION ALL
  SELECT 'Massages Sur Mesure', 'massages', 'Massage La Parenthèse (45 min)', 'Détente ciblée du haut ou bas du corps', '45 min (rendez-vous 1h15)', '55 €', 'Un format intermédiaire idéal pour dénouer en profondeur les tensions du dos, des épaules et de la nuque, ou pour revitaliser les jambes fatiguées.', 'Soulagement musculaire durable, huiles biologiques d’exception.', 'Pause Sérénité', '/images/spa-huiles.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 2
  UNION ALL
  SELECT 'Massages Sur Mesure', 'massages', 'Massage La Parenthèse (60 min)', 'Votre moment sur mesure d''excellence', '60 min (rendez-vous 1h30)', '70 €', 'Vous choisissez la durée de votre massage, puis grâce à une fiche personnalisée vous déterminez vos attentes : les zones à privilégier ou à éviter, le niveau de pression souhaité, ainsi que les objectifs de votre soin. C''est un instant unique, conçu par vous, pour vous.', 'Huiles Green Spa BIO certifiées Cosmos par Ecocert, artisanales et sensorielles.', 'Coup de Cœur', '/images/massage-dos.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 1, 3
  UNION ALL
  SELECT 'Massages Sur Mesure', 'massages', 'Massage La Parenthèse (75 min)', 'Immersion profonde et personnalisée', '75 min (rendez-vous 1h45)', '80 €', 'Idéal pour dénouer les tensions de l''ensemble du corps avec un temps dédié prolongé sur les zones de votre choix (dos, nuque, jambes, pieds, cuir chevelu).', 'Pressions sur mesure, huiles bio d''excellence.', 'Le Plus Demandé', '/images/spa-huiles.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 1, 4
  UNION ALL
  SELECT 'Massages Sur Mesure', 'massages', 'Massage La Parenthèse (90 min)', 'Le lâcher-prise absolu', '90 min (rendez-vous 2h00)', '95 €', 'L''expérience signature ultime : 1h30 complète de massage bien-être fluide, enveloppant et profond, adapté au rythme de vos besoins.', 'Détente neuromusculaire totale, évasion sensorielle.', 'Signature', '/images/massage-detente.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 5
  UNION ALL
  SELECT 'Drainage Lymphatique', 'drainage', 'Drainage Lymphatique (1h)', 'Relance circulatoire et légèreté immédiate', '1h (rendez-vous 1h30)', '80 €', 'Soin drainant stimulant la circulation lymphatique et veineuse par des manœuvres douces, rythmées et précises. Idéal en séance d''entretien ou pour retrouver des jambes légères.', 'Décongestion des tissus, relance de la circulation, bien-être intérieur.', 'Légèreté 1h', '/images/spa-huiles.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 6
  UNION ALL
  SELECT 'Drainage Lymphatique', 'drainage', 'Drainage Lymphatique (1h15 - 1er RDV)', 'Bilan complet personnalisé + Séance corps', '1h15 (rendez-vous 2h00)', '90 €', 'Bien plus qu''un simple massage, le drainage lymphatique est un véritable reset du corps. Grâce à des manœuvres précises et rythmées, ce soin stimule en profondeur la lymphe, soutient les émonctoires, favorise la détoxification, allège les tissus et affine la silhouette.', 'Sensation immédiate de jambes légères, dégonflement visible et regain d''énergie vitale.', 'Bilan Inclus', '/images/spa-huiles.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 1, 7
  UNION ALL
  SELECT 'Drainage Lymphatique', 'drainage', 'Drainage Lymphatique + Madérothérapie', 'Synergie minceur, fermeté et légèreté', '1h30 (rendez-vous 2h00)', '110 €', 'L''alliance parfaite entre les manœuvres drainantes et les instruments en bois d''ébène/hêtre sculptés pour casser les capitons adipeux, lisser les capitons et stimuler la synthèse de collagène.', 'Réduction de la cellulite, raffermissement cutané et élimination des toxines.', 'Combo Expert', '/images/massage-dos.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 1, 8
  UNION ALL
  SELECT 'Massage Kobido', 'kobido', 'KOBIDO - Lifting Japonais du Visage (45 min)', 'Rituel liftant éclat & fraîcheur', '45 min (rendez-vous 1h15)', '50 €', 'Massage facial ancestral japonais tonifiant les muscles du visage, lissant les traits et stimulant l''oxygénation des cellules cutanées.', 'Teint lumineux, traits reposés, stimulation du collagène.', 'Éclat 45 min', '/images/kobido-visage.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 9
  UNION ALL
  SELECT 'Massage Kobido', 'kobido', 'KOBIDO - Lifting Japonais du Visage (75 min)', 'Le rituel jeunesse et fermeté par excellence', '75 min (rendez-vous 1h45)', '80 €', 'Art traditionnel japonais millénaire. Idéal pour les visages fatigués et marqués. Alternance de percussions, lissages profonds, drainages et acupressions sur le visage, le cou et le décolleté.', 'Effet liftant immédiat, stimulation du collagène, oxygénation et éclat spectaculaire.', 'Anti-Âge Star', '/images/kobido-visage.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 1, 10
  UNION ALL
  SELECT 'Soins Visage', 'visage', 'Soin Visage L''Éclat Naturel (30 min)', 'Coup d’éclat express aux cosmétiques BIO', '30 min (rendez-vous 1h00)', '40 €', 'Nettoyage délicat, exfoliation douce, masque révélateur d''éclat et hydratation personnalisée Nohèm pour redonner fraîcheur et luminosité au teint.', 'Peau nette, hydratée et lumineuse en 30 minutes.', 'Express BIO', '/images/soin-visage-bio.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 11
  UNION ALL
  SELECT 'Soins Visage', 'visage', 'Soin Visage L''Éclat Sérénité (45 min)', 'Nettoyage approfondi et relaxation du visage', '45 min (rendez-vous 1h15)', '55 €', 'Double nettoyage, vapeur, gommage doux, masque gelée Oh My Jelly et massage apaisant du visage et du décolleté avec les soins Nohèm BIO.', 'Détente sensorielle profonde, peau purifiée et veloutée.', 'Sérénité 45 min', '/images/soin-visage-bio.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 12
  UNION ALL
  SELECT 'Soins Visage', 'visage', 'Soin Visage L''Éclat Harmonieux (60 min)', 'Soin complet sur mesure avec Nohèm BIO', '60 min (rendez-vous 1h30)', '70 €', 'Double nettoyage, bain de vapeur bienfaisant, extraction d''impuretés, exfoliation enzymatique, pose de masque innovant Oh My Jelly, massage relaxant nuque-trapèzes et visage, sérum et crème sur mesure.', 'Peau purifiée, hydratée en profondeur, lumineuse et reposée.', 'BIO Nohèm', '/images/soin-visage-bio.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 1, 13
  UNION ALL
  SELECT 'Femmes Enceintes', 'maternite', 'Soin Visage Spécial Femme Enceinte (45 min)', 'Cocon de douceur adapté dès le début de grossesse', '45 min (rendez-vous 1h15)', '55 €', 'Double nettoyage très doux, gommage délicat, masque hydratant gorgé d''eau, massage relaxant du cuir chevelu et massage enveloppant du visage et de la nuque sans aucune huile essentielle contre-indiquée.', 'Pause sérénité absolue pour la future maman et éclat naturel de la peau.', 'Spécial Maternité', '/images/maternite-douceur.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 14
  UNION ALL
  SELECT 'Femmes Enceintes', 'maternite', 'Drainage Lymphatique Femme Enceinte (1h)', 'Soulagement des jambes lourdes et rétention d’eau', '1h (rendez-vous 1h30)', '70 €', 'Spécialement adapté à la grossesse, ce soin ultra-doux relance la circulation des membres inférieurs, allège les jambes gonflées et procure une profonde sensation de légèreté.', 'Jambes légères, dégonflement visible, détente sans risque pour bébé.', 'Légèreté Future Maman', '/images/maternite-douceur.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 15
  UNION ALL
  SELECT 'Packs & Forfaits', 'packs', 'Pack L''Évasion (1h00)', 'Massage Sur Mesure 30 min + Soin Visage Éclat 30 min', '1h00 (rendez-vous 1h30)', '70 €', 'La formule duo idéale pour détendre le corps et illuminer le visage en une seule séance harmonieuse à tarif préférentiel.', 'Duo corps & visage express, déconnexion complète.', 'Formule Duo', '/images/cabine-soin.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 16
  UNION ALL
  SELECT 'Packs & Forfaits', 'packs', 'Pack Le Cocoon (1h30)', '45 min Massage Sur Mesure + 45 min Soin Visage', '1h30 (rendez-vous 2h00)', '95 €', 'La formule détente parfaite pour choyer à la fois votre corps et votre visage en une seule séance avec un tarif avantageux.', 'Évasion complète et harmonie globale.', 'Pack Avantage', '/images/cabine-soin.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 0, 17
  UNION ALL
  SELECT 'Packs & Forfaits', 'packs', 'Pack Le Ressourçant (2h15)', 'Massage Sur Mesure 1h15 + Soin Visage Harmonieux 1h00', '2h15 (rendez-vous 2h45)', '130 €', 'L''expérience bien-être ultime de La Parenthèse Harmonieuse : plus de 2 heures d''abandon total combinant un grand massage du corps complet et un soin du visage d''exception.', 'Régénération globale, peau sublimée et lâcher-prise absolu.', 'Prestige 2h15', '/images/massage-detente.jpg', 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence', 1, 18
)
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

-- Testimonials vérifiés (insérés uniquement si la table est vide)
INSERT INTO testimonials (author, rating, date_label, comment, treatment_name, source, is_featured, display_order)
SELECT * FROM (
  SELECT 'Sophie M.', 5, 'Il y a 2 semaines', 'Une véritable parenthèse de sérénité ! Harmonie est d''une douceur et d''une écoute exceptionnelles. Le massage sur mesure était exactement ce dont j''avais besoin. L''institut est un vrai petit cocon où l''on se sent immédiatement apaisée.', 'Massage La Parenthèse 75 min', 'Planity', 1, 1
  UNION ALL
  SELECT 'Camille D.', 5, 'Il y a 1 mois', 'Séance de drainage lymphatique spectaculaire. Je suis ressortie avec les jambes légères comme des plumes et un bien-être intérieur incroyable. Harmonie prend le temps d''expliquer et de personnaliser chaque geste.', 'Drainage Lymphatique', 'Planity', 1, 2
  UNION ALL
  SELECT 'Élodie R.', 5, 'Il y a 3 semaines', 'Le massage Kobido est bluffant ! Traits reposés, effet lift immédiat et détente totale. Le pôle santé est très facile d''accès avec son parking gratuit. Je recommande les yeux fermés !', 'KOBIDO Lifting Japonais', 'Google Avis', 1, 3
  UNION ALL
  SELECT 'Mélanie V.', 5, 'Il y a 1 mois', 'J''ai reçu une carte cadeau pour un soin du visage. Une pure merveille. Les produits sentent divinement bon, la table de massage est chauffée et ultra confortable. Merci Harmonie pour ce moment magique.', 'Soin Visage L''Éclat Harmonieux', 'Planity', 1, 4
)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
