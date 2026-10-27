import { cache } from 'react';
import { getDb } from './db';

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

async function normalizeUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('data:image/') || url.startsWith('data:video/')) {
        try {
            const db = getDb();
            const match = url.match(/^data:([^;]+);base64,(.+)$/);
            if (match) {
                const mimeType = match[1];
                const base64Data = match[2];
                const ext = mimeType.split('/')[1] || 'jpg';
                const mediaId = `media-${Math.abs(hashString(base64Data))}.${ext}`;
                
                try {
                    await db.prepare('INSERT OR IGNORE INTO media_storage (id, mime_type, data) VALUES (?, ?, ?)').run(mediaId, mimeType, base64Data);
                } catch {
                    try {
                        await db.exec(`CREATE TABLE IF NOT EXISTS media_storage (id TEXT PRIMARY KEY, mime_type TEXT NOT NULL, data BLOB NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`);
                        await db.prepare('INSERT OR IGNORE INTO media_storage (id, mime_type, data) VALUES (?, ?, ?)').run(mediaId, mimeType, base64Data);
                    } catch {}
                }
                return `/api/media/${mediaId}`;
            }
        } catch (e) {
            console.error('Error migrating Data URI to media_storage:', e);
        }
    }
    return url;
}

// --- Informations du site ---
export const getSiteInfo = cache(async function getSiteInfo() {
    const db = getDb();
    try {
        const rows = await db.prepare('SELECT * FROM site_info').all();
        const info = {};
        for (const row of rows) {
            info[row.key] = await normalizeUrl(row.value);
        }
        return info;
    } catch (err) {
        console.error('Error fetching site_info:', err);
        return {
            business_name: 'La Parenthèse Harmonieuse',
            creator_name: 'Harmonie',
            tagline: 'Offrez-vous une parenthèse de bien-être...',
            subtitle: 'Massages sur mesure • Soins Visage • Drainage Lymphatique • Kobido',
            phone: '06 51 65 21 42',
            address: '418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer, 13300 Salon-de-Provence',
            contact_email: 'laparentheseharmonieuse@gmail.com',
            planity_url: 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence',
            instagram: 'https://www.instagram.com/laparentheseharmonieuse/'
        };
    }
});

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
        return Promise.all(rows.map(async item => ({
            ...item,
            image_url: await normalizeUrl(item.image_url)
        })));
    } catch (err) {
        console.error('Error fetching services:', err);
        return [];
    }
});

export const getFeaturedServices = cache(async function getFeaturedServices() {
    const db = getDb();
    try {
        const rows = await db.prepare('SELECT * FROM services WHERE is_featured = 1 ORDER BY display_order ASC, id ASC LIMIT 6').all();
        return Promise.all(rows.map(async item => ({
            ...item,
            image_url: await normalizeUrl(item.image_url)
        })));
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

// --- Galerie / Photos institut ---
export const getGalleryPosts = cache(async function getGalleryPosts() {
    const db = getDb();
    try {
        const rows = await db.prepare('SELECT * FROM gallery_posts ORDER BY display_order ASC, id ASC').all();
        return Promise.all(rows.map(async post => ({
            ...post,
            image_url: await normalizeUrl(post.image_url)
        })));
    } catch (err) {
        console.error('Error fetching gallery posts:', err);
        return [];
    }
});

// --- Messages reçus (Admin) ---
export async function getContactMessages() {
    const db = getDb();
    try {
        return await db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    } catch (err) {
        console.error('Error fetching contact messages:', err);
        return [];
    }
}

export async function getUnreadMessageCount() {
    const db = getDb();
    try {
        const row = await db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0').get();
        return row?.count || 0;
    } catch {
        return 0;
    }
}

// --- Fonctions de compatibilité (anciens composants) ---
export async function getPricingDocuments() {
    return [];
}

export async function getAllWeeklyMenus() {
    return [];
}

export async function getCurrentWeeklyMenu() {
    return null;
}

export async function getCarouselImages() {
    return [];
}

export async function getFixedPrices() {
    return [];
}

