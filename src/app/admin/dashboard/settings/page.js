import { getAdminSiteInfo } from '@/lib/data';
import SettingsFormClient from './SettingsFormClient';
import { Settings } from 'lucide-react';

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
        <div className="anim-fade" style={{ width: '100%' }}>
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-page-icon" aria-hidden="true">
                        <Settings size={24} />
                    </div>
                    <div>
                        <span className="admin-eyebrow">Configuration Globale</span>
                        <h1 className="admin-title">Paramètres Généraux, Identité &amp; Sécurité</h1>
                        <p className="admin-subtitle">
                            Gérez en un seul endroit votre logo, l&apos;icône du navigateur, vos coordonnées, horaires d&apos;ouverture, liens Planity / Instagram, mentions légales, sauvegardes et votre mot de passe administrateur.
                        </p>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ width: '100%' }}>
                <SettingsFormClient info={info} />
            </div>
        </div>
    );
}
