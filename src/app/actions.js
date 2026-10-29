'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendContactNotification } from '@/lib/email';
import { cookies, headers } from 'next/headers';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
    isAdminRequest,
    destroySession,
    destroyAllSessions,
    createSession,
    sessionCookieOptions,
    SESSION_COOKIE,
    hashPassword,
    verifyPassword,
    getSessionUser,
    isRateLimited,
    registerHit,
    clientIp,
} from '@/lib/auth';
import {
    CUSTOM_TEXTS_KEY,
    CUSTOM_TEXT_MAX_LENGTH,
    parseCustomTexts,
    isEditableTextKey,
} from '@/lib/siteTexts';
import { logActivity } from '@/lib/logs';

// --- OUTILS D'AUTHENTIFICATION & CONTEXTE ADMIN ---
export async function verifyAdminAuth() {
    return isAdminRequest();
}

export async function requireAdminAuth() {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
        throw new Error('Non autorisé. Veuillez vous connecter.');
    }
}

async function getAdminAuditContext() {
    try {
        const cookieStore = await cookies();
        const reqHeaders = await headers();
        const token = cookieStore.get(SESSION_COOKIE)?.value;
        const username = (await getSessionUser(token)) || 'Admin';
        const ip = clientIp(reqHeaders);
        return { username, ip };
    } catch {
        return { username: 'Admin', ip: null };
    }
}

function extractId(idOrFormData) {
    if (!idOrFormData) return null;
    if (typeof idOrFormData === 'object' && typeof idOrFormData.get === 'function') {
        const val = idOrFormData.get('id');
        return val ? parseInt(val, 10) : null;
    }
    return parseInt(idOrFormData, 10);
}

function revalidateSite(...extraPaths) {
    revalidatePath('/', 'layout');
    for (const p of extraPaths) {
        if (p) revalidatePath(p);
    }
}

// --- ACTIONS D'AUTHENTIFICATION ---
export async function adminLogout() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
        const user = await getSessionUser(token).catch(() => null);
        const reqHeaders = await headers();
        await logActivity({
            action: 'logout',
            category: 'Connexions',
            summary: `Déconnexion de l'administration (${user || 'Admin'})`,
            username: user || 'Admin',
            ip: clientIp(reqHeaders),
        });
        await destroySession(token).catch(() => {});
    }
    cookieStore.delete(SESSION_COOKIE);
    redirect('/admin');
}

export async function changeAdminPassword(currentPasswordOrFormData, maybeNewPassword) {
    try {
        await requireAdminAuth();

        let currentPassword = '';
        let newPassword = '';
        let confirmPassword = null;

        if (currentPasswordOrFormData && typeof currentPasswordOrFormData.get === 'function') {
            currentPassword = String(currentPasswordOrFormData.get('current_password') || '');
            newPassword = String(currentPasswordOrFormData.get('new_password') || '');
            confirmPassword = String(currentPasswordOrFormData.get('confirm_password') || '');
            if (confirmPassword && confirmPassword !== newPassword) {
                return { error: 'La confirmation du nouveau mot de passe ne correspond pas.' };
            }
        } else {
            currentPassword = String(currentPasswordOrFormData || '');
            newPassword = String(maybeNewPassword || '');
        }

        if (!currentPassword) {
            return { error: 'Veuillez saisir votre mot de passe actuel.' };
        }
        if (!newPassword || newPassword.length < 8) {
            return { error: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' };
        }

        const cookieStore = await cookies();
        const reqHeaders = await headers();
        const token = cookieStore.get(SESSION_COOKIE)?.value;
        const username = await getSessionUser(token);
        if (!username) return { error: 'Session invalide. Veuillez vous reconnecter.' };

        const db = getDb();
        const user = await db.prepare('SELECT password FROM admin_users WHERE username = ?').get(username);
        if (!user) return { error: 'Utilisateur introuvable.' };

        const check = await verifyPassword(currentPassword, user.password);
        if (!check.ok) {
            return { error: 'Mot de passe actuel incorrect.' };
        }

        const newHashed = await hashPassword(newPassword);
        await db.prepare('UPDATE admin_users SET password = ? WHERE username = ?').run(newHashed, username);

        // Révoque toutes les anciennes sessions et recrée une session fraîche pour l'administratrice courante
        await destroyAllSessions(username);
        const freshToken = await createSession(username);
        cookieStore.set(SESSION_COOKIE, freshToken, sessionCookieOptions());

        await logActivity({
            action: 'security',
            category: 'Sécurité',
            summary: `Modification du mot de passe administrateur pour « ${username} »`,
            username,
            ip: clientIp(reqHeaders),
        });

        return { success: true, message: 'Mot de passe mis à jour avec succès.' };
    } catch (err) {
        console.error('changeAdminPassword error:', err);
        return { error: err.message || 'Erreur lors de la modification du mot de passe.' };
    }
}

// --- ENVOI SÉCURISÉ & NETTOYAGE DE FICHIERS ---
const ALLOWED_EXTENSIONS = new Set([
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico',
    '.mp4', '.webm', '.mov',
    '.jfif', '.heic', '.heif', '.avif', '.bmp', '.pdf',
]);

const EXT_TO_MIME = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jfif': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.pdf': 'application/pdf',
};

async function saveUploadedFile(file, options = {}) {
    if (!file || typeof file === 'string' || !file.name || file.size === 0) return null;

    const isVercel = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');
    const maxSize = isVercel ? 4.5 * 1024 * 1024 : 50 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error('Le fichier sélectionné dépasse la limite autorisée (max 4,5 Mo en ligne). Choisissez un fichier plus léger ou collez un lien direct.');
    }

    let ext = path.extname(file.name || '').toLowerCase();
    const rawMime = (file.type || '').toLowerCase().split(';')[0].trim();

    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
        if (rawMime === 'image/svg+xml') ext = '.svg';
        else if (rawMime === 'image/x-icon' || rawMime === 'image/vnd.microsoft.icon') ext = '.ico';
        else if (rawMime === 'image/png') ext = '.png';
        else if (rawMime.startsWith('image/')) ext = '.webp';
        else if (rawMime === 'video/webm') ext = '.webm';
        else if (rawMime === 'video/quicktime') ext = '.mov';
        else if (rawMime.startsWith('video/')) ext = '.mp4';
        else if (rawMime === 'application/pdf') ext = '.pdf';
        else ext = '.webp';
    }

    try {
        const bytes = await file.arrayBuffer();
        let buffer = Buffer.from(bytes);
        let mimeType = EXT_TO_MIME[ext] || rawMime || 'application/octet-stream';

        // Optimise automatiquement côté serveur les photos brutes non recadrées (.jpg/.png/.heic/.bmp > 300 Ko)
        const isRasterPhoto = ['.jpg', '.jpeg', '.jfif', '.png', '.heic', '.heif', '.bmp'].includes(ext);
        const keepPng = Boolean(options.preserveFormat) && (ext === '.png' || ext === '.svg' || ext === '.ico');

        if (isRasterPhoto && !keepPng && (buffer.length > 350 * 1024 || ['.heic', '.heif', '.bmp', '.jfif'].includes(ext))) {
            try {
                const maxDim = options.maxWidth || 1800;
                buffer = await sharp(buffer)
                    .rotate()
                    .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: 84 })
                    .toBuffer();
                ext = '.webp';
                mimeType = 'image/webp';
            } catch (sharpErr) {
                console.warn('[saveUploadedFile] Sharp optimization skipped:', sharpErr.message);
            }
        }

        const mediaId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const db = getDb();
        await db.prepare('INSERT INTO media_storage (id, mime_type, data) VALUES (?, ?, ?)').run(mediaId, mimeType, buffer);
        return `/api/media/${mediaId}`;
    } catch (err) {
        console.error('Erreur enregistrement fichier :', err);
        throw new Error(err.message || "Impossible d'enregistrer le fichier.");
    }
}

async function deleteMediaIfUnused(mediaUrl) {
    if (!mediaUrl || typeof mediaUrl !== 'string') return;
    const trimmed = mediaUrl.trim();

    if (trimmed.startsWith('/uploads/')) {
        const localPath = path.join(process.cwd(), 'public', trimmed);
        if (fs.existsSync(localPath)) {
            try { fs.unlinkSync(localPath); } catch {}
        }
        return;
    }

    if (!trimmed.startsWith('/api/media/')) return;
    const mediaId = trimmed.slice('/api/media/'.length).split('?')[0];
    if (!mediaId || mediaId.includes('/') || mediaId.includes('..')) return;

    try {
        const db = getDb();
        const refInfo = await db.prepare('SELECT 1 FROM site_info WHERE value = ? LIMIT 1').get(trimmed);
        if (refInfo) return;
        const refSrv = await db.prepare('SELECT 1 FROM services WHERE image_url = ? LIMIT 1').get(trimmed);
        if (refSrv) return;
        const refGal = await db.prepare('SELECT 1 FROM gallery_posts WHERE image_url = ? OR thumbnail_url = ? LIMIT 1').get(trimmed, trimmed);
        if (refGal) return;

        await db.prepare('DELETE FROM media_storage WHERE id = ?').run(mediaId);
    } catch (err) {
        console.warn('[deleteMediaIfUnused] Warning:', err.message);
    }
}

// --- INFORMATIONS, COORDONNÉES, BANNIÈRE & PARAMÈTRES DU SITE ---
export async function updateSiteInfo(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const db = getDb();

        const fields = [
            'business_name', 'creator_name', 'legal_status', 'siren', 'siret', 'vat_number', 'naf_ape',
            'headquarters_address', 'creation_date',
            'tagline', 'tagline_en', 'subtitle', 'subtitle_en', 'audience',
            'contact_email', 'notification_email', 'phone',
            'address', 'address_en', 'city', 'postal_code', 'full_address', 'parking_info',
            'hours', 'hours_en',
            'hours_tue', 'hours_wed', 'hours_thu', 'hours_fri', 'hours_sat', 'hours_sun_mon',
            'planity_url', 'instagram', 'facebook', 'google_reviews', 'brands',
            'about_title', 'about_text', 'about_text_en',
            'hero_video', 'hero_poster',
            'formspree_url', 'smtp_pass', 'resend_api_key',
        ];

        const stmt = db.prepare(`
            INSERT INTO site_info (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);

        const updatedKeys = [];
        for (const field of fields) {
            if (!formData.has(field)) continue;
            const raw = formData.get(field);
            if (raw === null || raw === undefined) continue;
            const val = raw.toString().trim();
            // N'écrase pas un mot de passe SMTP ou clé API existants par une chaîne vide accidentelle
            if ((field === 'smtp_pass' || field === 'resend_api_key') && val === '') continue;
            await stmt.run(field, val);
            updatedKeys.push(field);

            if (field === 'phone' && val) {
                await stmt.run('phone_raw', val.replace(/\s+/g, ''));
            }
            if (field === 'about_text') {
                await stmt.run('about_bio', val);
            }
        }

        // Réinitialisations éventuelles demandées par l'admin
        if (formData.get('remove_logo') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'logo'").get();
            await db.prepare("DELETE FROM site_info WHERE key = 'logo'").run();
            if (old?.value) await deleteMediaIfUnused(old.value);
            updatedKeys.push('logo (réinitialisé)');
        }
        if (formData.get('remove_site_icon') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'site_icon'").get();
            await db.prepare("DELETE FROM site_info WHERE key = 'site_icon'").run();
            if (old?.value) await deleteMediaIfUnused(old.value);
            updatedKeys.push('site_icon (réinitialisé)');
        }
        if (formData.get('reset_hero_video') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_video'").get();
            await stmt.run('hero_video', '/videos/hero-massage.mp4');
            if (old?.value) await deleteMediaIfUnused(old.value);
            updatedKeys.push('hero_video (par défaut)');
        }
        if (formData.get('reset_hero_poster') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_poster'").get();
            await stmt.run('hero_poster', '/images/hero-poster.jpg');
            if (old?.value) await deleteMediaIfUnused(old.value);
            updatedKeys.push('hero_poster (par défaut)');
        }

        const logoFile = formData.get('logo_file');
        const siteIconFile = formData.get('site_icon_file');
        const aboutFile = formData.get('about_file');
        const heroVideoFile = formData.get('hero_video_file');
        const heroPosterFile = formData.get('hero_poster_file');

        if (logoFile && logoFile.size > 0) {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'logo'").get();
            const logoUrl = await saveUploadedFile(logoFile, { preserveFormat: true, maxWidth: 1024 });
            if (logoUrl) {
                await stmt.run('logo', logoUrl);
                if (old?.value && old.value !== logoUrl) await deleteMediaIfUnused(old.value);
                updatedKeys.push('logo');
            }
        }

        if (siteIconFile && siteIconFile.size > 0) {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'site_icon'").get();
            const iconUrl = await saveUploadedFile(siteIconFile, { preserveFormat: true, maxWidth: 512 });
            if (iconUrl) {
                await stmt.run('site_icon', iconUrl);
                if (old?.value && old.value !== iconUrl) await deleteMediaIfUnused(old.value);
                updatedKeys.push('site_icon');
            }
        }

        if (aboutFile && aboutFile.size > 0) {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'about_image'").get();
            const aboutUrl = await saveUploadedFile(aboutFile, { maxWidth: 1600 });
            if (aboutUrl) {
                await stmt.run('about_image', aboutUrl);
                if (old?.value && old.value !== aboutUrl) await deleteMediaIfUnused(old.value);
                updatedKeys.push('about_image');
            }
        }

        if (heroVideoFile && heroVideoFile.size > 0) {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_video'").get();
            const videoUrl = await saveUploadedFile(heroVideoFile);
            if (videoUrl) {
                await stmt.run('hero_video', videoUrl);
                if (old?.value && old.value !== videoUrl) await deleteMediaIfUnused(old.value);
                updatedKeys.push('hero_video');
            }
        }

        if (heroPosterFile && heroPosterFile.size > 0) {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_poster'").get();
            const posterUrl = await saveUploadedFile(heroPosterFile, { maxWidth: 1920 });
            if (posterUrl) {
                await stmt.run('hero_poster', posterUrl);
                if (old?.value && old.value !== posterUrl) await deleteMediaIfUnused(old.value);
                updatedKeys.push('hero_poster');
            }
        }

        if (updatedKeys.length > 0) {
            await logActivity({
                action: 'update',
                category: 'Logo & Paramètres',
                summary: `Mise à jour des réglages du site (${updatedKeys.length} élément${updatedKeys.length > 1 ? 's' : ''})`,
                details: { fields: updatedKeys },
                username,
                ip,
            });
        }

        revalidateSite('/admin/dashboard/settings', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('updateSiteInfo error:', err);
        return { error: err.message || "Erreur lors de l'enregistrement des informations." };
    }
}

export async function updateSiteLogo(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const db = getDb();

        if (formData.get('reset') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'logo'").get();
            await db.prepare("DELETE FROM site_info WHERE key = 'logo'").run();
            if (old?.value) await deleteMediaIfUnused(old.value);
            await logActivity({
                action: 'update',
                category: 'Logo & Paramètres',
                summary: 'Rétablissement du logo officiel par défaut',
                username,
                ip,
            });
            revalidateSite('/admin/dashboard/settings');
            return { success: true, url: '/images/logo.png' };
        }

        const file = formData.get('logo_file');
        if (!file || file.size === 0) return { error: 'Aucun fichier de logo fourni.' };

        const old = await db.prepare("SELECT value FROM site_info WHERE key = 'logo'").get();
        const logoUrl = await saveUploadedFile(file, { preserveFormat: true, maxWidth: 1024 });
        if (!logoUrl) return { error: "Erreur lors de l'enregistrement du logo." };

        await db.prepare(`
            INSERT INTO site_info (key, value) VALUES ('logo', ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run(logoUrl);

        if (old?.value && old.value !== logoUrl) await deleteMediaIfUnused(old.value);

        await logActivity({
            action: 'update',
            category: 'Logo & Paramètres',
            summary: 'Changement du logo principal de navigation',
            details: { url: logoUrl, fileName: file.name, size: file.size },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/settings');
        return { success: true, url: logoUrl };
    } catch (err) {
        console.error('updateSiteLogo error:', err);
        return { error: err.message || 'Erreur lors de la mise à jour du logo.' };
    }
}

export async function updateSiteIcon(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const db = getDb();

        if (formData.get('reset') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'site_icon'").get();
            await db.prepare("DELETE FROM site_info WHERE key = 'site_icon'").run();
            if (old?.value) await deleteMediaIfUnused(old.value);
            await logActivity({
                action: 'update',
                category: 'Logo & Paramètres',
                summary: "Rétablissement de l'icône d'onglet navigateur par défaut",
                username,
                ip,
            });
            revalidateSite('/admin/dashboard/settings');
            return { success: true, url: '/icon.png' };
        }

        const file = formData.get('site_icon_file');
        if (!file || file.size === 0) return { error: "Aucun fichier d'icône fourni." };

        const old = await db.prepare("SELECT value FROM site_info WHERE key = 'site_icon'").get();
        const iconUrl = await saveUploadedFile(file, { preserveFormat: true, maxWidth: 512 });
        if (!iconUrl) return { error: "Erreur lors de l'enregistrement de l'icône." };

        await db.prepare(`
            INSERT INTO site_info (key, value) VALUES ('site_icon', ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run(iconUrl);

        if (old?.value && old.value !== iconUrl) await deleteMediaIfUnused(old.value);

        await logActivity({
            action: 'update',
            category: 'Logo & Paramètres',
            summary: "Changement de l'icône d'onglet navigateur (favicon)",
            details: { url: iconUrl, fileName: file.name, size: file.size },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/settings');
        return { success: true, url: iconUrl };
    } catch (err) {
        console.error('updateSiteIcon error:', err);
        return { error: err.message || "Erreur lors de la mise à jour de l'icône." };
    }
}

export async function updateHeroMedia(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO site_info (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);

        let heroVideoUrl = null;
        let heroPosterUrl = null;

        if (formData.get('reset_video') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_video'").get();
            heroVideoUrl = '/videos/hero-massage.mp4';
            await stmt.run('hero_video', heroVideoUrl);
            if (old?.value) await deleteMediaIfUnused(old.value);
        } else {
            const videoFile = formData.get('hero_video_file');
            const videoUrlInput = (formData.get('hero_video_url') || '').toString().trim();
            if (videoFile && videoFile.size > 0) {
                const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_video'").get();
                heroVideoUrl = await saveUploadedFile(videoFile);
                await stmt.run('hero_video', heroVideoUrl);
                if (old?.value && old.value !== heroVideoUrl) await deleteMediaIfUnused(old.value);
            } else if (videoUrlInput) {
                const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_video'").get();
                heroVideoUrl = videoUrlInput;
                await stmt.run('hero_video', heroVideoUrl);
                if (old?.value && old.value !== heroVideoUrl) await deleteMediaIfUnused(old.value);
            }
        }

        if (formData.get('reset_poster') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_poster'").get();
            heroPosterUrl = '/images/hero-poster.jpg';
            await stmt.run('hero_poster', heroPosterUrl);
            if (old?.value) await deleteMediaIfUnused(old.value);
        } else {
            const posterFile = formData.get('hero_poster_file');
            const posterUrlInput = (formData.get('hero_poster_url') || '').toString().trim();
            if (posterFile && posterFile.size > 0) {
                const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_poster'").get();
                heroPosterUrl = await saveUploadedFile(posterFile, { maxWidth: 1920 });
                await stmt.run('hero_poster', heroPosterUrl);
                if (old?.value && old.value !== heroPosterUrl) await deleteMediaIfUnused(old.value);
            } else if (posterUrlInput) {
                const old = await db.prepare("SELECT value FROM site_info WHERE key = 'hero_poster'").get();
                heroPosterUrl = posterUrlInput;
                await stmt.run('hero_poster', heroPosterUrl);
                if (old?.value && old.value !== heroPosterUrl) await deleteMediaIfUnused(old.value);
            }
        }

        await logActivity({
            action: 'update',
            category: 'Bannière Accueil',
            summary: "Mise à jour de la vidéo ou de l'image d'accueil",
            details: { hero_video: heroVideoUrl, hero_poster: heroPosterUrl },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/settings', '/admin/dashboard');
        return { success: true, hero_video: heroVideoUrl, hero_poster: heroPosterUrl };
    } catch (err) {
        console.error('updateHeroMedia error:', err);
        return { error: err.message || "Erreur lors de la mise à jour de la bannière d'accueil." };
    }
}

export async function clearActivityLogs() {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const db = getDb();
        await db.prepare('DELETE FROM activity_logs').run();
        await logActivity({
            action: 'delete',
            category: 'Administration',
            summary: "Réinitialisation complète du journal d'activité",
            username,
            ip,
        });
        revalidatePath('/admin/dashboard/logs');
        return { success: true };
    } catch (err) {
        console.error('clearActivityLogs error:', err);
        return { error: err.message || 'Erreur lors de la suppression du journal.' };
    }
}

// --- TEXTES DU SITE (FR / EN) ---
export async function saveSiteTexts(updates) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        if (!updates || typeof updates !== 'object') return { error: 'Données invalides.' };

        const db = getDb();
        const row = await db.prepare('SELECT value FROM site_info WHERE key = ?').get(CUSTOM_TEXTS_KEY);
        const current = parseCustomTexts(row?.value);

        const frUpdates = updates.fr || updates;
        if (frUpdates && typeof frUpdates === 'object') {
            for (const [key, rawVal] of Object.entries(frUpdates)) {
                if (!isEditableTextKey(key)) continue;
                const val = typeof rawVal === 'string' ? rawVal.trim() : '';
                if (!val) {
                    delete current.fr[key];
                } else {
                    current.fr[key] = val.slice(0, CUSTOM_TEXT_MAX_LENGTH);
                }
            }
        }

        const stmt = db.prepare(`
            INSERT INTO site_info (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);
        await stmt.run(CUSTOM_TEXTS_KEY, JSON.stringify(current));

        // Synchronise le slogan avec site_info.tagline s'il a été édité
        if (frUpdates && ('about.pageTagline' in frUpdates || 'footer.tagline' in frUpdates)) {
            const nextFr = current.fr['about.pageTagline'] || current.fr['footer.tagline'] || 'Offrez-vous une parenthèse de bien-être...';
            await stmt.run('tagline', nextFr);
        }

        const modifiedCount = Object.keys(frUpdates || {}).length;
        await logActivity({
            action: 'update',
            category: 'Textes du site',
            summary: `Mise à jour des textes personnalisés (${modifiedCount} entrée${modifiedCount > 1 ? 's' : ''})`,
            details: { keys: Object.keys(frUpdates || {}) },
            username,
            ip,
        });

        revalidateSite('/', '/carte-des-soins', '/mon-approche', '/carte-cadeau', '/contact', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('saveSiteTexts error:', err);
        return { error: err.message || "Erreur lors de l'enregistrement des textes." };
    }
}

// --- MON APPROCHE (HISTOIRE, MARQUES & PHOTO) ---
export async function updateAboutInfo(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const db = getDb();

        const stmt = db.prepare(`
            INSERT INTO site_info (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);

        if (formData.has('about_title')) {
            await stmt.run('about_title', (formData.get('about_title') || '').toString().trim());
        }
        if (formData.has('about_text')) {
            const textFr = (formData.get('about_text') || '').toString().trim();
            await stmt.run('about_text', textFr);
            await stmt.run('about_bio', textFr);
        }
        if (formData.has('brands')) {
            await stmt.run('brands', (formData.get('brands') || '').toString().trim());
        }
        if (formData.has('tagline')) {
            const tagline = (formData.get('tagline') || '').toString().trim();
            await stmt.run('tagline', tagline);
            const textsRow = await db.prepare('SELECT value FROM site_info WHERE key = ?').get(CUSTOM_TEXTS_KEY);
            const custom = parseCustomTexts(textsRow?.value);
            if (tagline) {
                custom.fr['about.pageTagline'] = tagline;
                custom.fr['footer.tagline'] = tagline;
            } else {
                delete custom.fr['about.pageTagline'];
                delete custom.fr['footer.tagline'];
            }
            await stmt.run(CUSTOM_TEXTS_KEY, JSON.stringify(custom));
        }

        let newAboutUrl = null;
        if (formData.get('reset_about_image') === '1') {
            const old = await db.prepare("SELECT value FROM site_info WHERE key = 'about_image'").get();
            await db.prepare("DELETE FROM site_info WHERE key = 'about_image'").run();
            if (old?.value) await deleteMediaIfUnused(old.value);
        } else {
            const aboutFile = formData.get('about_file');
            if (aboutFile && aboutFile.size > 0) {
                const old = await db.prepare("SELECT value FROM site_info WHERE key = 'about_image'").get();
                newAboutUrl = await saveUploadedFile(aboutFile, { maxWidth: 1600 });
                if (newAboutUrl) {
                    await stmt.run('about_image', newAboutUrl);
                    if (old?.value && old.value !== newAboutUrl) await deleteMediaIfUnused(old.value);
                }
            }
        }

        await logActivity({
            action: 'update',
            category: 'Mon Approche',
            summary: 'Mise à jour de la présentation et de la photo Mon Approche',
            details: { hasNewImage: Boolean(newAboutUrl) },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/a-propos', '/admin/dashboard/textes', '/admin/dashboard/settings');
        return { success: true, about_image: newAboutUrl };
    } catch (err) {
        console.error('[updateAboutInfo Error]:', err);
        return { error: err.message || "Erreur lors de l'enregistrement de Mon Approche." };
    }
}

// --- CARTE DES SOINS (PRESTATIONS & RITUELS) ---
export async function addService(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();

        const title = (formData.get('title') || '').toString().trim();
        const title_en = (formData.get('title_en') || '').toString().trim();
        const category = (formData.get('category') || 'Massages Sur Mesure').toString().trim();
        const category_slug = (formData.get('category_slug') || 'massages').toString().trim();
        const subtitle = (formData.get('subtitle') || '').toString().trim();
        const subtitle_en = (formData.get('subtitle_en') || '').toString().trim();
        const duration = (formData.get('duration') || '').toString().trim();
        const price = (formData.get('price') || '').toString().trim();
        const description = (formData.get('description') || '').toString().trim();
        const description_en = (formData.get('description_en') || '').toString().trim();
        const benefits = (formData.get('benefits') || '').toString().trim();
        const benefits_en = (formData.get('benefits_en') || '').toString().trim();
        const contraindications = (formData.get('contraindications') || '').toString().trim();
        const contraindications_en = (formData.get('contraindications_en') || '').toString().trim();
        const badge = (formData.get('badge') || '').toString().trim();
        const badge_en = (formData.get('badge_en') || '').toString().trim();
        const planity_url = (formData.get('planity_url') || '').toString().trim();
        const is_featured = formData.get('is_featured') === '1' || formData.get('is_featured') === 'on' ? 1 : 0;

        if (!title || !description || !price) {
            return { error: 'Veuillez renseigner au minimum le titre, le tarif et la description du soin.' };
        }

        const file = formData.get('image_file');
        let image_url = (formData.get('image_url') || '').toString().trim();
        if (file && file.size > 0) {
            const uploaded = await saveUploadedFile(file, { maxWidth: 1600 });
            if (uploaded) image_url = uploaded;
        }
        if (!image_url) {
            image_url = '/images/massage-dos.jpg';
        }

        const db = getDb();
        const maxRow = await db.prepare('SELECT MAX(display_order) as maxOrder FROM services').get();
        const nextOrder = (Number(maxRow?.maxOrder) || 0) + 1;

        await db.prepare(`
            INSERT INTO services (
                category, category_slug, title, title_en, subtitle, subtitle_en,
                duration, price, description, description_en,
                benefits, benefits_en, contraindications, contraindications_en,
                image_url, badge, badge_en, planity_url, is_featured, display_order
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            category, category_slug, title, title_en, subtitle, subtitle_en,
            duration, price, description, description_en,
            benefits, benefits_en, contraindications, contraindications_en,
            image_url, badge, badge_en, planity_url, is_featured, nextOrder
        );

        await logActivity({
            action: 'add',
            category: 'Carte des Soins',
            summary: `Ajout du soin : « ${title} » (${price})`,
            details: { title, category, price, duration },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/prestations', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[addService Error]:', err);
        return { error: err.message || "Une erreur est survenue lors de l'ajout du soin." };
    }
}

export async function editService(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(formData);
        if (!id) return { error: 'Identifiant de soin invalide.' };

        const title = (formData.get('title') || '').toString().trim();
        const title_en = (formData.get('title_en') || '').toString().trim();
        const category = (formData.get('category') || 'Massages Sur Mesure').toString().trim();
        const category_slug = (formData.get('category_slug') || 'massages').toString().trim();
        const subtitle = (formData.get('subtitle') || '').toString().trim();
        const subtitle_en = (formData.get('subtitle_en') || '').toString().trim();
        const duration = (formData.get('duration') || '').toString().trim();
        const price = (formData.get('price') || '').toString().trim();
        const description = (formData.get('description') || '').toString().trim();
        const description_en = (formData.get('description_en') || '').toString().trim();
        const benefits = (formData.get('benefits') || '').toString().trim();
        const benefits_en = (formData.get('benefits_en') || '').toString().trim();
        const contraindications = (formData.get('contraindications') || '').toString().trim();
        const contraindications_en = (formData.get('contraindications_en') || '').toString().trim();
        const badge = (formData.get('badge') || '').toString().trim();
        const badge_en = (formData.get('badge_en') || '').toString().trim();
        const planity_url = (formData.get('planity_url') || '').toString().trim();
        const is_featured = formData.get('is_featured') === '1' || formData.get('is_featured') === 'on' ? 1 : 0;

        if (!title || !description || !price) {
            return { error: 'Veuillez renseigner au minimum le titre, le tarif et la description du soin.' };
        }

        const db = getDb();
        const existing = await db.prepare('SELECT * FROM services WHERE id = ?').get(id);
        if (!existing) return { error: 'Soin introuvable.' };

        const file = formData.get('image_file');
        const resetImage = formData.get('reset_image') === '1';
        let image_url = (formData.get('image_url') || '').toString().trim();

        if (resetImage) {
            image_url = '/images/massage-dos.jpg';
        } else if (file && file.size > 0) {
            const uploaded = await saveUploadedFile(file, { maxWidth: 1600 });
            if (uploaded) image_url = uploaded;
        } else if (!image_url) {
            image_url = existing.image_url || '/images/massage-dos.jpg';
        }

        await db.prepare(`
            UPDATE services
            SET category = ?, category_slug = ?, title = ?, title_en = ?, subtitle = ?, subtitle_en = ?,
                duration = ?, price = ?, description = ?, description_en = ?,
                benefits = ?, benefits_en = ?, contraindications = ?, contraindications_en = ?,
                image_url = ?, badge = ?, badge_en = ?, planity_url = ?, is_featured = ?
            WHERE id = ?
        `).run(
            category, category_slug, title, title_en, subtitle, subtitle_en,
            duration, price, description, description_en,
            benefits, benefits_en, contraindications, contraindications_en,
            image_url, badge, badge_en, planity_url, is_featured, id
        );

        if (existing.image_url && existing.image_url !== image_url) {
            await deleteMediaIfUnused(existing.image_url);
        }

        await logActivity({
            action: 'update',
            category: 'Carte des Soins',
            summary: `Modification du soin : « ${title} » (ID #${id})`,
            details: { id, title, price, duration, is_featured },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/prestations', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[editService Error]:', err);
        return { error: err.message || 'Une erreur est survenue lors de la modification du soin.' };
    }
}

export async function deleteService(idOrFormData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide' };

        const db = getDb();
        const srv = await db.prepare('SELECT title, image_url FROM services WHERE id = ?').get(id);
        await db.prepare('DELETE FROM services WHERE id = ?').run(id);

        if (srv?.image_url) {
            await deleteMediaIfUnused(srv.image_url);
        }

        await logActivity({
            action: 'delete',
            category: 'Carte des Soins',
            summary: `Suppression du soin : « ${srv?.title || 'Sans titre'} » (ID #${id})`,
            details: { id, title: srv?.title },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/prestations', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[deleteService Error]:', err);
        return { error: err.message || 'Une erreur est survenue lors de la suppression du soin.' };
    }
}

export async function toggleServiceFeatured(idOrFormData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide' };

        const db = getDb();
        const srv = await db.prepare('SELECT id, title, is_featured FROM services WHERE id = ?').get(id);
        if (!srv) return { error: 'Soin introuvable' };

        const newStatus = srv.is_featured ? 0 : 1;
        await db.prepare('UPDATE services SET is_featured = ? WHERE id = ?').run(newStatus, id);

        await logActivity({
            action: 'toggle',
            category: 'Carte des Soins',
            summary: `${newStatus ? 'Mise en avant Coup de Cœur' : 'Retrait Coup de Cœur'} accueil : « ${srv.title} »`,
            details: { id, title: srv.title, is_featured: newStatus },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/prestations');
        return { success: true, is_featured: newStatus };
    } catch (err) {
        console.error('[toggleServiceFeatured Error]:', err);
        return { error: err.message || 'Une erreur est survenue.' };
    }
}

export async function reorderService(id, direction, categorySlug = null) {
    try {
        await requireAdminAuth();
        const targetId = Number(id);
        const db = getDb();

        // Normalise d'abord l'ordre global 1..N pour éviter toute collision de display_order
        const allServices = await db.prepare('SELECT id, category_slug FROM services ORDER BY display_order ASC, id ASC').all();
        const subset = categorySlug && categorySlug !== 'all'
            ? allServices.filter((s) => s.category_slug === categorySlug)
            : allServices;

        const subIdx = subset.findIndex((s) => Number(s.id) === targetId);
        if (subIdx === -1) return { error: 'Prestation non trouvée.' };

        const neighborSubIdx = direction === 'up' ? subIdx - 1 : subIdx + 1;
        if (neighborSubIdx < 0 || neighborSubIdx >= subset.length) return { success: true };

        const globalIdxA = allServices.findIndex((s) => Number(s.id) === Number(subset[subIdx].id));
        const globalIdxB = allServices.findIndex((s) => Number(s.id) === Number(subset[neighborSubIdx].id));
        const temp = allServices[globalIdxA];
        allServices[globalIdxA] = allServices[globalIdxB];
        allServices[globalIdxB] = temp;

        const stmt = db.prepare('UPDATE services SET display_order = ? WHERE id = ?');
        for (let i = 0; i < allServices.length; i++) {
            await stmt.run(i + 1, allServices[i].id);
        }

        revalidateSite('/admin/dashboard/prestations');
        return { success: true };
    } catch (err) {
        console.error('[reorderService Error]:', err);
        return { error: err.message || 'Une erreur est survenue.' };
    }
}

// --- AVIS CLIENTES (TÉMOIGNAGES) ---
export async function addTestimonial(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();

        const author = (formData.get('author') || '').toString().trim();
        const rating = Math.min(5, Math.max(1, parseInt(formData.get('rating') || '5', 10) || 5));
        const date_label = (formData.get('date_label') || '').toString().trim();
        const comment = (formData.get('comment') || '').toString().trim();
        const comment_en = (formData.get('comment_en') || '').toString().trim();
        const treatment_name = (formData.get('treatment_name') || '').toString().trim();
        const treatment_name_en = (formData.get('treatment_name_en') || '').toString().trim();
        const source = (formData.get('source') || 'Planity').toString().trim();
        const is_featured = formData.get('is_featured') === '0' ? 0 : 1;

        if (!author || !comment) {
            return { error: "Veuillez renseigner le prénom de la cliente et le texte de l'avis." };
        }

        const db = getDb();
        await db.prepare('UPDATE testimonials SET display_order = display_order + 1').run();
        await db.prepare(`
            INSERT INTO testimonials (author, rating, date_label, comment, comment_en, treatment_name, treatment_name_en, source, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).run(author, rating, date_label, comment, comment_en, treatment_name, treatment_name_en, source, is_featured);

        await logActivity({
            action: 'add',
            category: 'Avis Clientes',
            summary: `Ajout d'un avis cliente : « ${author} » (${rating}/5)`,
            details: { author, rating, source, treatment_name },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/avis', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[addTestimonial Error]:', err);
        return { error: err.message || "Erreur lors de l'ajout de l'avis." };
    }
}

export async function editTestimonial(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(formData);
        if (!id) return { error: 'ID invalide.' };

        const author = (formData.get('author') || '').toString().trim();
        const rating = Math.min(5, Math.max(1, parseInt(formData.get('rating') || '5', 10) || 5));
        const date_label = (formData.get('date_label') || '').toString().trim();
        const comment = (formData.get('comment') || '').toString().trim();
        const comment_en = (formData.get('comment_en') || '').toString().trim();
        const treatment_name = (formData.get('treatment_name') || '').toString().trim();
        const treatment_name_en = (formData.get('treatment_name_en') || '').toString().trim();
        const source = (formData.get('source') || 'Planity').toString().trim();
        const is_featured = formData.get('is_featured') === '1' || formData.get('is_featured') === 'on' ? 1 : 0;

        if (!author || !comment) {
            return { error: "Veuillez renseigner le prénom de la cliente et le texte de l'avis." };
        }

        const db = getDb();
        await db.prepare(`
            UPDATE testimonials
            SET author = ?, rating = ?, date_label = ?, comment = ?, comment_en = ?, treatment_name = ?, treatment_name_en = ?, source = ?, is_featured = ?
            WHERE id = ?
        `).run(author, rating, date_label, comment, comment_en, treatment_name, treatment_name_en, source, is_featured, id);

        await logActivity({
            action: 'update',
            category: 'Avis Clientes',
            summary: `Modification de l'avis de « ${author} » (ID #${id})`,
            details: { id, author, rating, source, is_featured },
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/avis', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[editTestimonial Error]:', err);
        return { error: err.message || "Erreur lors de la modification de l'avis." };
    }
}

export async function deleteTestimonial(idOrFormData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide.' };

        const db = getDb();
        const row = await db.prepare('SELECT author FROM testimonials WHERE id = ?').get(id);
        await db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);

        await logActivity({
            action: 'delete',
            category: 'Avis Clientes',
            summary: `Suppression de l'avis de « ${row?.author || 'Cliente'} » (ID #${id})`,
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/avis', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[deleteTestimonial Error]:', err);
        return { error: err.message || "Erreur lors de la suppression de l'avis." };
    }
}

export async function toggleTestimonialFeatured(idOrFormData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide.' };

        const db = getDb();
        const row = await db.prepare('SELECT id, author, is_featured FROM testimonials WHERE id = ?').get(id);
        if (!row) return { error: 'Avis introuvable.' };

        const next = row.is_featured ? 0 : 1;
        await db.prepare('UPDATE testimonials SET is_featured = ? WHERE id = ?').run(next, id);

        await logActivity({
            action: 'toggle',
            category: 'Avis Clientes',
            summary: `${next ? 'Affichage sur l’accueil' : 'Masquage sur l’accueil'} de l'avis de « ${row.author} »`,
            username,
            ip,
        });

        revalidateSite('/admin/dashboard/avis');
        return { success: true, is_featured: next };
    } catch (err) {
        console.error('[toggleTestimonialFeatured Error]:', err);
        return { error: err.message || 'Une erreur est survenue.' };
    }
}

export async function reorderTestimonial(id, direction) {
    try {
        await requireAdminAuth();
        const targetId = Number(id);
        const db = getDb();
        const list = await db.prepare('SELECT id FROM testimonials ORDER BY display_order ASC, id ASC').all();
        const idx = list.findIndex((t) => Number(t.id) === targetId);
        if (idx === -1) return { error: 'Avis introuvable.' };

        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= list.length) return { success: true };

        const tmp = list[idx];
        list[idx] = list[swapIdx];
        list[swapIdx] = tmp;

        const stmt = db.prepare('UPDATE testimonials SET display_order = ? WHERE id = ?');
        for (let i = 0; i < list.length; i++) {
            await stmt.run(i + 1, list[i].id);
        }

        revalidateSite('/admin/dashboard/avis');
        return { success: true };
    } catch (err) {
        console.error('[reorderTestimonial Error]:', err);
        return { error: err.message || 'Une erreur est survenue.' };
    }
}

// --- GALERIE PHOTOS & VIDÉOS CABINE ---
export async function seedSampleGalleryPosts() {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const db = getDb();

        const maxRow = await db.prepare('SELECT MAX(display_order) as maxOrder FROM gallery_posts').get();
        let nextOrder = (Number(maxRow?.maxOrder) || 0) + 1;

        const samples = [
            {
                title: 'Le Cocon de Soin',
                title_en: 'The Treatment Cocoon',
                caption: 'Lumière tamisée, linge doux et table chauffante pour une déconnexion immédiate dès votre arrivée.',
                caption_en: 'Soft lighting, warm linens and a heated treatment table for instant serenity.',
                image_url: '/images/cabine-soin.jpg',
            },
            {
                title: 'Soin Visage Bio Nohèm',
                title_en: 'Nohèm Organic Facial Ritual',
                caption: 'Des actifs naturels et biologiques certifiés Ecocert pour révéler l’éclat originel de votre peau.',
                caption_en: 'Ecocert-certified organic botanical actives to restore your skin’s natural radiance.',
                image_url: '/images/soin-visage-bio.jpg',
            },
            {
                title: 'Rituel Kobido — Lifting Japonais',
                title_en: 'Kobido Japanese Facial Lifting',
                caption: 'Gestuelle ancestrale alliant drainage, lissages profonds et acupressions pour défroisser les traits.',
                caption_en: 'Ancestral Japanese facial artistry combining deep smoothing and acupressure.',
                image_url: '/images/kobido-visage.jpg',
            },
            {
                title: 'Huiles Sensorielles Green Spa',
                title_en: 'Green Spa Botanical Oils',
                caption: 'Fragrances délicates et textures enveloppantes adaptées aux besoins de votre corps.',
                caption_en: 'Delicate fragrances and enveloping organic textures tailored to your body.',
                image_url: '/images/spa-huiles.jpg',
            },
        ];

        for (const post of samples) {
            await db.prepare(`
                INSERT INTO gallery_posts (title, title_en, caption, caption_en, image_url, thumbnail_url, media_type, display_order)
                VALUES (?, ?, ?, ?, ?, ?, 'image', ?)
            `).run(post.title, post.title_en, post.caption, post.caption_en, post.image_url, post.image_url, nextOrder++);
        }

        await logActivity({
            action: 'add',
            category: 'Galerie',
            summary: `Ajout de ${samples.length} photos d'ambiance de l'institut dans la galerie`,
            details: { count: samples.length },
            username,
            ip,
        });

        revalidateSite('/carte-des-soins', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('seedSampleGalleryPosts error:', err);
        return { error: err.message || "Erreur lors de l'ajout des photos d'exemple." };
    }
}

export async function addGalleryPost(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();

        const title = (formData.get('title') || '').toString().trim();
        const title_en = (formData.get('title_en') || '').toString().trim();
        const caption = (formData.get('caption') || '').toString().trim();
        const caption_en = (formData.get('caption_en') || '').toString().trim();
        let media_type = (formData.get('media_type') || 'image').toString().trim();
        const image_url_text = (formData.get('image_url') || '').toString().trim();
        const file = formData.get('image_file');

        let image_url = image_url_text;
        let thumbnail_url = (formData.get('thumbnail_url') || '').toString().trim();

        if (file && file.size > 0) {
            const fileExt = path.extname(file.name || '').toLowerCase();
            if ((file.type && file.type.startsWith('video/')) || ['.mp4', '.webm', '.mov'].includes(fileExt)) {
                media_type = 'video';
            }
            const uploaded = await saveUploadedFile(file);
            if (uploaded) image_url = uploaded;
        } else if (image_url && /\.(mp4|webm|mov)(\?|$)/i.test(image_url)) {
            media_type = 'video';
        }

        const thumbFile = formData.get('thumbnail_file');
        if (thumbFile && thumbFile.size > 0) {
            const uploadedThumb = await saveUploadedFile(thumbFile, { maxWidth: 900 });
            if (uploadedThumb) thumbnail_url = uploadedThumb;
        }
        if (!thumbnail_url && media_type !== 'video') {
            thumbnail_url = image_url;
        }

        if (!image_url) {
            return { error: 'Veuillez sélectionner un fichier photo/vidéo ou coller un lien direct.' };
        }

        const db = getDb();
        await db.prepare('UPDATE gallery_posts SET display_order = display_order + 1').run();
        await db.prepare(`
            INSERT INTO gallery_posts (title, title_en, caption, caption_en, image_url, thumbnail_url, media_type, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `).run(title, title_en, caption, caption_en, image_url, thumbnail_url || '', media_type);

        // Nettoyage automatique : conserver les 40 publications les plus récentes/ordonnées
        const allPosts = await db.prepare('SELECT id, image_url, thumbnail_url FROM gallery_posts ORDER BY display_order ASC, id ASC').all();
        if (allPosts.length > 40) {
            const postsToDelete = allPosts.slice(40);
            for (const oldPost of postsToDelete) {
                await db.prepare('DELETE FROM gallery_posts WHERE id = ?').run(oldPost.id);
                await deleteMediaIfUnused(oldPost.image_url);
                if (oldPost.thumbnail_url && oldPost.thumbnail_url !== oldPost.image_url) {
                    await deleteMediaIfUnused(oldPost.thumbnail_url);
                }
            }
        }

        await logActivity({
            action: 'add',
            category: 'Galerie',
            summary: `Ajout d'une ${media_type === 'video' ? 'vidéo' : 'photo'} dans la galerie : « ${title || 'Sans titre'} »`,
            details: { title, media_type, image_url },
            username,
            ip,
        });

        revalidateSite('/carte-des-soins', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[Gallery] Erreur :', err);
        return { error: err.message || 'Une erreur est survenue lors de la publication.' };
    }
}

export async function editGalleryPost(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(formData);
        if (!id) return { error: 'ID invalide' };

        const title = (formData.get('title') || '').toString().trim();
        const title_en = (formData.get('title_en') || '').toString().trim();
        const caption = (formData.get('caption') || '').toString().trim();
        const caption_en = (formData.get('caption_en') || '').toString().trim();

        const db = getDb();
        const existing = await db.prepare('SELECT * FROM gallery_posts WHERE id = ?').get(id);
        if (!existing) return { error: 'Publication introuvable.' };

        const file = formData.get('image_file');
        const thumbFile = formData.get('thumbnail_file');
        const urlOverride = (formData.get('image_url') || '').toString().trim();

        let newImageUrl = null;
        let newThumbUrl = null;
        let nextMediaType = existing.media_type || 'image';

        if (file && file.size > 0) {
            const fileExt = path.extname(file.name || '').toLowerCase();
            nextMediaType = ((file.type && file.type.startsWith('video/')) || ['.mp4', '.webm', '.mov'].includes(fileExt))
                ? 'video'
                : 'image';
            const uploaded = await saveUploadedFile(file);
            if (uploaded) {
                newImageUrl = uploaded;
                await db.prepare('UPDATE gallery_posts SET image_url = ?, media_type = ? WHERE id = ?').run(uploaded, nextMediaType, id);
            }
        } else if (urlOverride && urlOverride !== existing.image_url) {
            nextMediaType = /\.(mp4|webm|mov)(\?|$)/i.test(urlOverride) ? 'video' : 'image';
            newImageUrl = urlOverride;
            await db.prepare('UPDATE gallery_posts SET image_url = ?, media_type = ? WHERE id = ?').run(urlOverride, nextMediaType, id);
        }

        if (thumbFile && thumbFile.size > 0) {
            const uploadedThumb = await saveUploadedFile(thumbFile, { maxWidth: 900 });
            if (uploadedThumb) {
                newThumbUrl = uploadedThumb;
                await db.prepare('UPDATE gallery_posts SET thumbnail_url = ? WHERE id = ?').run(uploadedThumb, id);
            }
        } else if (newImageUrl && nextMediaType === 'image') {
            newThumbUrl = newImageUrl;
            await db.prepare('UPDATE gallery_posts SET thumbnail_url = ? WHERE id = ?').run(newImageUrl, id);
        }

        if (formData.has('title') || formData.has('caption') || formData.has('title_en') || formData.has('caption_en')) {
            await db.prepare('UPDATE gallery_posts SET title = ?, title_en = ?, caption = ?, caption_en = ? WHERE id = ?').run(
                title, title_en, caption, caption_en, id
            );
        }

        if (newImageUrl && existing.image_url && existing.image_url !== newImageUrl) {
            await deleteMediaIfUnused(existing.image_url);
        }
        if (newThumbUrl && existing.thumbnail_url && existing.thumbnail_url !== newThumbUrl) {
            await deleteMediaIfUnused(existing.thumbnail_url);
        }

        await logActivity({
            action: 'update',
            category: 'Galerie',
            summary: `Modification d'une publication de la galerie : « ${title || existing.title || 'Sans titre'} » (ID #${id})`,
            details: { id, title, newImageUrl: Boolean(newImageUrl), newThumbUrl: Boolean(newThumbUrl) },
            username,
            ip,
        });

        revalidateSite('/carte-des-soins', '/admin/dashboard');
        return { success: true, image_url: newImageUrl, thumbnail_url: newThumbUrl, media_type: nextMediaType };
    } catch (err) {
        console.error('[Gallery Edit] Erreur :', err);
        return { error: err.message || 'Erreur lors de la mise à jour.' };
    }
}

export async function deleteGalleryPost(idOrFormData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide' };

        const db = getDb();
        const post = await db.prepare('SELECT title, image_url, thumbnail_url FROM gallery_posts WHERE id = ?').get(id);
        await db.prepare('DELETE FROM gallery_posts WHERE id = ?').run(id);

        if (post) {
            await deleteMediaIfUnused(post.image_url);
            if (post.thumbnail_url && post.thumbnail_url !== post.image_url) {
                await deleteMediaIfUnused(post.thumbnail_url);
            }
        }

        await logActivity({
            action: 'delete',
            category: 'Galerie',
            summary: `Suppression d'une publication de la galerie : « ${post?.title || 'Sans titre'} » (ID #${id})`,
            details: { id, title: post?.title },
            username,
            ip,
        });

        revalidateSite('/carte-des-soins', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[deleteGalleryPost] Erreur :', err);
        return { error: err.message || 'Erreur lors de la suppression.' };
    }
}

export async function moveGalleryPostPosition(idOrFormData, targetPosition) {
    try {
        await requireAdminAuth();
        const id = extractId(idOrFormData);
        const targetPos = parseInt(targetPosition, 10);
        if (!id || Number.isNaN(targetPos) || targetPos < 1) return { error: 'Paramètres invalides' };

        const db = getDb();
        // Même ordre exact que getGalleryPosts() (display_order ASC, id ASC)
        const posts = await db.prepare('SELECT id, display_order FROM gallery_posts ORDER BY display_order ASC, id ASC').all();
        const currentIndex = posts.findIndex((p) => Number(p.id) === id);
        if (currentIndex === -1) return { error: 'Publication introuvable' };

        const targetIndex = Math.max(0, Math.min(posts.length - 1, targetPos - 1));
        if (currentIndex === targetIndex) return { success: true };

        const [moved] = posts.splice(currentIndex, 1);
        posts.splice(targetIndex, 0, moved);

        const stmt = db.prepare('UPDATE gallery_posts SET display_order = ? WHERE id = ?');
        for (let i = 0; i < posts.length; i++) {
            await stmt.run(i + 1, posts[i].id);
        }

        revalidateSite('/carte-des-soins', '/admin/dashboard');
        return { success: true };
    } catch (err) {
        console.error('[moveGalleryPostPosition] Erreur :', err);
        return { error: err.message || 'Erreur lors du réordonnancement.' };
    }
}

export async function reorderGalleryPost(idOrFormData, direction) {
    try {
        await requireAdminAuth();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide' };

        const db = getDb();
        const posts = await db.prepare('SELECT id FROM gallery_posts ORDER BY display_order ASC, id ASC').all();
        const currentIndex = posts.findIndex((p) => Number(p.id) === id);
        if (currentIndex === -1) return { error: 'Publication introuvable' };

        const targetPos = direction === 'up' ? currentIndex : currentIndex + 2;
        if (targetPos < 1 || targetPos > posts.length) return { success: true };

        return moveGalleryPostPosition(id, targetPos);
    } catch (err) {
        console.error('[reorderGalleryPost] Erreur :', err);
        return { error: err.message || 'Erreur lors du déplacement.' };
    }
}

// --- FORMULAIRE DE CONTACT CLIENTÈLE (PUBLIC) ---
export async function submitContactForm(formData) {
    try {
        const headerStore = await headers();
        const ip = clientIp(headerStore);
        const limitKey = `contact:${ip}`;
        if (await isRateLimited(limitKey, 5, 10 * 60 * 1000)) {
            return { error: 'Trop de messages envoyés récemment. Merci de patienter quelques minutes avant de renouveler votre demande.' };
        }

        // Piège anti-spam (honeypot)
        const website = (formData.get('website') || formData.get('_hp_check') || '').toString().trim();
        if (website) {
            return { success: true };
        }

        const name = (formData.get('name') || '').toString().trim().slice(0, 120);
        const email = (formData.get('email') || '').toString().trim().toLowerCase().slice(0, 160);
        const phone = (formData.get('phone') || '').toString().trim().slice(0, 40);
        const service_interest = (
            formData.get('service_interest') ||
            formData.get('event_type') ||
            'Renseignement soin'
        ).toString().trim().slice(0, 160);
        const preferred_date = (
            formData.get('preferred_date') ||
            formData.get('event_date') ||
            ''
        ).toString().trim().slice(0, 40);
        const preferred_time = (
            formData.get('preferred_time') ||
            ''
        ).toString().trim().slice(0, 80);
        const message = (formData.get('message') || '').toString().trim().slice(0, 4000);

        if (!name || name.length < 2) {
            return { error: 'Veuillez renseigner votre nom et prénom.' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            return { error: 'Veuillez saisir une adresse email valide.' };
        }
        if (phone) {
            const digits = phone.replace(/[^\d+]/g, '');
            if (digits.length < 8 || digits.length > 16) {
                return { error: 'Veuillez saisir un numéro de téléphone valide (ex : 06 51 65 21 42).' };
            }
        }
        if (preferred_date) {
            const today = new Date().toISOString().split('T')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(preferred_date) && preferred_date < today) {
                return { error: 'La date souhaitée ne peut pas être dans le passé.' };
            }
        }
        if (!message || message.length < 5) {
            return { error: 'Veuillez préciser votre demande en quelques mots (au moins 5 caractères).' };
        }

        await registerHit(limitKey, 10 * 60 * 1000);

        const db = getDb();
        await db.prepare(`
            INSERT INTO contact_messages (name, email, phone, service_interest, preferred_date, preferred_time, message, status, admin_notes, is_read)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'nouveau', '', 0)
        `).run(name, email, phone || '', service_interest, preferred_date, preferred_time, message);

        // Notification email asynchrone tolérante aux pannes
        try {
            await sendContactNotification({
                name,
                email,
                phone,
                service_interest,
                preferred_date,
                preferred_time,
                message,
            });
        } catch (emailErr) {
            console.error('[submitContactForm] Email notification error:', emailErr);
        }

        revalidatePath('/admin/dashboard', 'layout');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/dashboard/messages');
        return { success: true };
    } catch (err) {
        console.error('[submitContactForm Error]:', err);
        return { error: "Une erreur technique est survenue lors de l'envoi. Vous pouvez aussi contacter Harmonie directement au 06 51 65 21 42." };
    }
}

export async function markMessageRead(idOrFormData) {
    try {
        await requireAdminAuth();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide' };

        const db = getDb();
        await db.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?').run(id);
        revalidatePath('/admin/dashboard', 'layout');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/dashboard/messages');
        return { success: true };
    } catch (err) {
        console.error('markMessageRead error:', err);
        return { error: err.message || 'Erreur lors de la mise à jour.' };
    }
}

export async function updateMessageStatus(id, status) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const validStatuses = new Set(['nouveau', 'en_cours', 'traite', 'effectue', 'archive', 'annule']);
        const cleanStatus = validStatuses.has(status) ? status : 'en_cours';

        const db = getDb();
        const msg = await db.prepare('SELECT name FROM contact_messages WHERE id = ?').get(Number(id));
        const markRead = cleanStatus === 'nouveau' ? 0 : 1;
        await db.prepare('UPDATE contact_messages SET status = ?, is_read = ? WHERE id = ?').run(cleanStatus, markRead, Number(id));

        await logActivity({
            action: 'update',
            category: 'Messages',
            summary: `Statut du message de « ${msg?.name || 'Cliente'} » passé à « ${cleanStatus} »`,
            username,
            ip,
        });

        revalidatePath('/admin/dashboard', 'layout');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/dashboard/messages');
        return { success: true };
    } catch (err) {
        console.error('updateMessageStatus error:', err);
        return { error: err.message || 'Erreur lors du changement de statut.' };
    }
}

export async function updateMessageNotes(id, notes) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const cleanNotes = String(notes || '').slice(0, 4000);

        const db = getDb();
        const msg = await db.prepare('SELECT name FROM contact_messages WHERE id = ?').get(Number(id));
        await db.prepare('UPDATE contact_messages SET admin_notes = ?, is_read = 1 WHERE id = ?').run(cleanNotes, Number(id));

        await logActivity({
            action: 'update',
            category: 'Messages',
            summary: `Note interne enregistrée sur la demande de « ${msg?.name || 'Cliente'} »`,
            username,
            ip,
        });

        revalidatePath('/admin/dashboard', 'layout');
        revalidatePath('/admin/dashboard/messages');
        return { success: true };
    } catch (err) {
        console.error('updateMessageNotes error:', err);
        return { error: err.message || "Erreur lors de l'enregistrement de la note." };
    }
}

export async function deleteMessage(idOrFormData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();
        const id = extractId(idOrFormData);
        if (!id) return { error: 'ID invalide' };

        const db = getDb();
        const msg = await db.prepare('SELECT name, email FROM contact_messages WHERE id = ?').get(id);
        await db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);

        await logActivity({
            action: 'delete',
            category: 'Messages',
            summary: `Suppression du message de « ${msg?.name || 'Cliente'} »`,
            details: { id, email: msg?.email },
            username,
            ip,
        });

        revalidatePath('/admin/dashboard', 'layout');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/dashboard/messages');
        return { success: true };
    } catch (err) {
        console.error('deleteMessage error:', err);
        return { error: err.message || 'Erreur lors de la suppression du message.' };
    }
}

// --- RESTAURATION SÉCURISÉE DE SAUVEGARDE JSON ---
export async function restoreDatabaseFromBackup(formData) {
    try {
        await requireAdminAuth();
        const { username, ip } = await getAdminAuditContext();

        const file = formData.get('backup_file');
        if (!file || typeof file === 'string' || file.size === 0) {
            return { error: 'Veuillez sélectionner un fichier de sauvegarde (.json) valide.' };
        }

        const rawText = await file.text();
        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            return { error: 'Le fichier sélectionné n’est pas un fichier JSON valide.' };
        }

        const tables = parsed?.tables || parsed?.data;
        if (!tables || typeof tables !== 'object') {
            return { error: 'Structure de sauvegarde non reconnue (section tables/data absente).' };
        }

        const db = getDb();
        const counts = {};

        // 1. site_info (fusion sans écraser les clés email secrètes déjà présentes)
        if (Array.isArray(tables.site_info) && tables.site_info.length > 0) {
            const stmt = db.prepare(`
                INSERT INTO site_info (key, value) VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
            `);
            let n = 0;
            for (const row of tables.site_info) {
                if (!row?.key) continue;
                await stmt.run(String(row.key), row.value != null ? String(row.value) : '');
                n++;
            }
            counts.site_info = n;
        }

        // 2. services (valide d'abord le schéma bien-être avant de remplacer)
        if (Array.isArray(tables.services) && tables.services.length > 0) {
            const validServices = tables.services.filter((s) => s && s.title && (s.category || s.category_slug) && s.price != null);
            if (validServices.length > 0) {
                await db.prepare('DELETE FROM services').run();
                const stmt = db.prepare(`
                    INSERT INTO services (
                        id, category, category_slug, title, title_en, subtitle, subtitle_en,
                        duration, price, description, description_en,
                        benefits, benefits_en, contraindications, contraindications_en,
                        image_url, badge, badge_en, planity_url, is_featured, display_order, created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
                `);
                for (const s of validServices) {
                    await stmt.run(
                        s.id || null,
                        s.category || 'Massages Sur Mesure',
                        s.category_slug || 'massages',
                        s.title,
                        s.title_en || '',
                        s.subtitle || '',
                        s.subtitle_en || '',
                        s.duration || '',
                        String(s.price),
                        s.description || '',
                        s.description_en || '',
                        s.benefits || '',
                        s.benefits_en || '',
                        s.contraindications || '',
                        s.contraindications_en || '',
                        s.image_url || '/images/massage-dos.jpg',
                        s.badge || '',
                        s.badge_en || '',
                        s.planity_url || '',
                        s.is_featured ? 1 : 0,
                        Number(s.display_order) || 0,
                        s.created_at || null
                    );
                }
                counts.services = validServices.length;
            }
        }

        // 3. testimonials
        if (Array.isArray(tables.testimonials) && tables.testimonials.length > 0) {
            const validReviews = tables.testimonials.filter((t) => t && t.author && t.comment);
            if (validReviews.length > 0) {
                await db.prepare('DELETE FROM testimonials').run();
                const stmt = db.prepare(`
                    INSERT INTO testimonials (
                        id, author, rating, date_label, comment, comment_en,
                        treatment_name, treatment_name_en, source, is_featured, display_order, created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
                `);
                for (const t of validReviews) {
                    await stmt.run(
                        t.id || null,
                        t.author,
                        Number(t.rating) || 5,
                        t.date_label || '',
                        t.comment,
                        t.comment_en || '',
                        t.treatment_name || '',
                        t.treatment_name_en || '',
                        t.source || 'Planity',
                        t.is_featured !== undefined ? (t.is_featured ? 1 : 0) : 1,
                        Number(t.display_order) || 0,
                        t.created_at || null
                    );
                }
                counts.testimonials = validReviews.length;
            }
        }

        // 4. gallery_posts
        if (Array.isArray(tables.gallery_posts)) {
            await db.prepare('DELETE FROM gallery_posts').run();
            const stmt = db.prepare(`
                INSERT INTO gallery_posts (
                    id, title, title_en, caption, caption_en,
                    image_url, thumbnail_url, media_type, display_order, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
            `);
            let n = 0;
            for (const g of tables.gallery_posts) {
                if (!g?.image_url) continue;
                await stmt.run(
                    g.id || null,
                    g.title || '',
                    g.title_en || '',
                    g.caption || '',
                    g.caption_en || '',
                    g.image_url,
                    g.thumbnail_url || g.image_url,
                    g.media_type || 'image',
                    Number(g.display_order) || 0,
                    g.created_at || null
                );
                n++;
            }
            counts.gallery_posts = n;
        }

        // 5. contact_messages
        if (Array.isArray(tables.contact_messages) && tables.contact_messages.length > 0) {
            await db.prepare('DELETE FROM contact_messages').run();
            const stmt = db.prepare(`
                INSERT INTO contact_messages (
                    id, name, email, phone, service_interest, preferred_date, preferred_time,
                    message, status, admin_notes, is_read, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
            `);
            let n = 0;
            for (const m of tables.contact_messages) {
                if (!m?.name || !m?.email || !m?.message) continue;
                await stmt.run(
                    m.id || null,
                    m.name,
                    m.email,
                    m.phone || '',
                    m.service_interest || m.event_type || '',
                    m.preferred_date || m.event_date || '',
                    m.preferred_time || '',
                    m.message,
                    m.status || 'nouveau',
                    m.admin_notes || '',
                    m.is_read ? 1 : 0,
                    m.created_at || null
                );
                n++;
            }
            counts.contact_messages = n;
        }

        // 6. media_storage (décodage binaire Base64 -> Buffer BLOB)
        if (Array.isArray(tables.media_storage) && tables.media_storage.length > 0) {
            const stmt = db.prepare(`
                INSERT OR REPLACE INTO media_storage (id, mime_type, data, created_at)
                VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
            `);
            let n = 0;
            for (const m of tables.media_storage) {
                if (!m?.id || m.data == null) continue;
                let buf;
                if (typeof m.data === 'string') {
                    const cleanB64 = m.data.replace(/^data:[^;]+;base64,/, '');
                    buf = Buffer.from(cleanB64, 'base64');
                } else if (Buffer.isBuffer(m.data)) {
                    buf = m.data;
                } else if (Array.isArray(m.data)) {
                    buf = Buffer.from(m.data);
                } else {
                    continue;
                }
                if (buf.length === 0) continue;
                await stmt.run(m.id, m.mime_type || 'image/webp', buf, m.created_at || null);
                n++;
            }
            counts.media_storage = n;
        }

        await logActivity({
            action: 'restore',
            category: 'Sauvegarde',
            summary: 'Restauration complète des données depuis un fichier de sauvegarde JSON',
            details: counts,
            username,
            ip,
        });

        revalidateSite('/admin/dashboard');
        return { success: true, counts };
    } catch (err) {
        console.error('[restoreDatabaseFromBackup Error]:', err);
        return { error: err.message || 'Erreur lors de la restauration de la sauvegarde.' };
    }
}
