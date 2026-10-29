import { cache } from 'react';
import { getDb } from './db';
import { isAdminRequest } from './auth';

export const SENSITIVE_SITE_INFO_KEYS = new Set([
    'smtp_pass',
    'smtp_user',
    'smtp_host',
    'smtp_port',
    'smtp_secure',
    'resend_api_key',
    'formspree_url',
    'notification_email',
]);

function cleanMediaUrl(url) {
    if (!url || typeof url !== 'string') return url;
    return url.trim();
}

const DEFAULT_PUBLIC_SITE_INFO = {
    business_name: 'La Parenthèse Harmonieuse',
    creator_name: 'Harmonie PERRAULT',
    legal_status: 'Entrepreneur Individuel (EI)',
    siren: '980 474 340',
    siret: '980 474 340 00018',
    vat_number: 'FR76980474340',
    naf_ape: '9602B (Soins de beauté)',
    headquarters_address: 'Chemin de Saint-Jean, Résidence Lurian, 13300 Salon-de-Provence',
    creation_date: '21 octobre 2023',
    tagline: 'Offrez-vous une parenthèse de bien-être...',
    subtitle: 'Massages sur mesure • Soins Visage • Drainage Lymphatique • Kobido',
    audience: 'Institut exclusivement dédié aux femmes',
    phone: '06 51 65 21 42',
    phone_raw: '0651652142',
    address: '418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer',
    city: 'Salon-de-Provence',
    postal_code: '13300',
    full_address: '418 Avenue Georges Guynemer, 13300 Salon-de-Provence',
    parking_info: "Parking gratuit et facile d'accès directement devant le Pôle Santé",
    contact_email: 'laparentheseharmonieuse@gmail.com',
    planity_url: 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence',
    instagram: 'https://www.instagram.com/laparentheseharmonieuse/',
    google_reviews: 'https://g.page/r/CQUzqKQ2SgYrEAE/review',
    hero_video: '/videos/hero-massage.mp4',
    hero_poster: '/images/hero-poster.jpg',
    home_featured_services_count: '6',
    home_testimonials_count: '3',
    home_trip1_image: '/images/spa-huiles.jpg',
    home_trip2_image: '/images/massage-detente.jpg',
    home_trip3_image: '/images/maternite-douceur.jpg',
    home_institut_image: '/images/plaque-institut.png',
    brands: 'Nohèm (BIO certifié Ecocert), Green Spa (BIO Cosmos), Oh My Jelly',
    hours: 'Mardi : 10h00–13h30 / 14h30–19h00 · Mercredi : 14h00–19h00 · Jeudi : 10h00–13h30 / 14h30–18h00 · Vendredi : 10h00–13h30 / 14h30–17h30 · Samedi : 09h30–14h00',
    hours_tue: '10:00 - 13:30 | 14:30 - 19:00',
    hours_wed: '14:00 - 19:00',
    hours_thu: '10:00 - 13:30 | 14:30 - 18:00',
    hours_fri: '10:00 - 13:30 | 14:30 - 17:30',
    hours_sat: '09:30 - 14:00',
    hours_sun_mon: 'Fermé',
};

// --- Informations publiques du site (filtrées : aucun secret exposé au client) ---
export const getSiteInfo = cache(async function getSiteInfo() {
    const db = getDb();
    try {
        const rows = await db.prepare('SELECT key, value FROM site_info').all();
        const info = { ...DEFAULT_PUBLIC_SITE_INFO };
        for (const row of rows) {
            if (!row?.key || SENSITIVE_SITE_INFO_KEYS.has(row.key)) continue;
            if (row.value !== null && row.value !== undefined && String(row.value).trim() !== '') {
                info[row.key] = cleanMediaUrl(row.value);
            }
        }
        // Harmonise about_text et about_bio pour que toute modification dans l'admin s'applique partout
        if (rows.some((r) => r.key === 'about_text' && r.value)) {
            info.about_bio = info.about_text;
        } else if (info.about_bio && !info.about_text) {
            info.about_text = info.about_bio;
        }
        return info;
    } catch (err) {
        console.error('Error fetching site_info:', err);
        return { ...DEFAULT_PUBLIC_SITE_INFO };
    }
});

// --- Informations d'administration (inclut notification_email & formspree_url, sans jamais exposer les mots de passe/clés API) ---
export async function getAdminSiteInfo() {
    const publicInfo = await getSiteInfo();
    if (!(await isAdminRequest())) return publicInfo;
    const db = getDb();
    try {
        const rows = await db
            .prepare("SELECT key, value FROM site_info WHERE key IN ('notification_email', 'formspree_url')")
            .all();
        const adminInfo = { ...publicInfo };
        for (const row of rows) {
            if (row?.key && row.value !== null && row.value !== undefined) {
                adminInfo[row.key] = String(row.value).trim();
            }
        }
        return adminInfo;
    } catch (err) {
        console.error('Error fetching admin site_info:', err);
        return publicInfo;
    }
}

// --- Prestations & Carte des Soins ---
export const getServices = cache(async function getServices(categorySlug = null) {
    const db = getDb();
    try {
        let query = 'SELECT * FROM services ORDER BY display_order ASC, id ASC';
        let params = [];
        if (categorySlug && categorySlug !== 'all') {
            query = 'SELECT * FROM services WHERE category_slug = ? ORDER BY display_order ASC, id ASC';
            params = [categorySlug];
        }
        const rows = await db.prepare(query).all(...params);
        return rows.map((item) => ({
            ...item,
            image_url: cleanMediaUrl(item.image_url),
        }));
    } catch (err) {
        console.error('Error fetching services:', err);
        return [];
    }
});

export const getFeaturedServices = cache(async function getFeaturedServices() {
    const db = getDb();
    try {
        const rows = await db
            .prepare('SELECT * FROM services WHERE is_featured = 1 ORDER BY display_order ASC, id ASC LIMIT 6')
            .all();
        return rows.map((item) => ({
            ...item,
            image_url: cleanMediaUrl(item.image_url),
        }));
    } catch (err) {
        console.error('Error fetching featured services:', err);
        return [];
    }
});

// --- Avis clientes ---
export const getTestimonials = cache(async function getTestimonials(onlyFeatured = false) {
    const db = getDb();
    try {
        const query = onlyFeatured
            ? 'SELECT * FROM testimonials WHERE is_featured = 1 ORDER BY display_order ASC, id ASC'
            : 'SELECT * FROM testimonials ORDER BY display_order ASC, id ASC';
        return await db.prepare(query).all();
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        return [];
    }
});

// --- Galerie / Photos & Vidéos de l'institut ---
export const getGalleryPosts = cache(async function getGalleryPosts() {
    const db = getDb();
    try {
        const rows = await db.prepare('SELECT * FROM gallery_posts ORDER BY display_order ASC, id ASC').all();
        return rows.map((post) => ({
            ...post,
            image_url: cleanMediaUrl(post.image_url),
            thumbnail_url: cleanMediaUrl(post.thumbnail_url),
        }));
    } catch (err) {
        console.error('Error fetching gallery posts:', err);
        return [];
    }
});

// --- Messages reçus (Admin uniquement) ---
export async function getContactMessages() {
    if (!(await isAdminRequest())) return [];
    const db = getDb();
    try {
        return await db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC').all();
    } catch (err) {
        console.error('Error fetching contact messages:', err);
        return [];
    }
}

export async function getUnreadMessageCount() {
    if (!(await isAdminRequest())) return 0;
    const db = getDb();
    try {
        const row = await db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0').get();
        return Number(row?.count || 0);
    } catch {
        return 0;
    }
}
