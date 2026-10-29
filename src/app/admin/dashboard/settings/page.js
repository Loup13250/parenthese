import { getAdminSiteInfo } from '@/lib/data';
import SettingsFormClient from './SettingsFormClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Informations & Visuels du Site | Admin La Parenthèse Harmonieuse',
};

export default async function SettingsPage() {
    let info = {};
    try {
        info = (await getAdminSiteInfo()) || {};
    } catch (e) {
        console.error('SettingsPage getAdminSiteInfo error:', e);
    }

    return (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.25rem', maxWidth: '720px' }}>
                <span className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                    Configuration Globale
                </span>
                <h1 style={{ fontSize: '1.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--admin-text)' }}>
                    Informations, Visuels &amp; Sécurité
                </h1>
                <p style={{ color: 'var(--admin-text-muted)', lineHeight: '1.6', fontSize: '0.94rem' }}>
                    Gérez en un seul endroit votre logo, l&apos;icône du navigateur, la vidéo et l&apos;image d&apos;accueil, vos coordonnées, horaires, liens Planity / réseaux, mentions légales, sauvegardes et mot de passe administrateur.
                </p>
            </div>

            <div className="admin-card" style={{ width: '100%', maxWidth: '820px' }}>
                <SettingsFormClient info={info} />
            </div>
        </div>
    );
}
