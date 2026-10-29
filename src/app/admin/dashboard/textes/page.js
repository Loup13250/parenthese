import Link from 'next/link';
import { getSiteInfo } from '@/lib/data';
import {
    SITE_TEXT_GROUPS,
    HOME_PAGE_TEXT_SECTIONS,
    ABOUT_PAGE_TEXT_SECTIONS,
    TARIFS_PAGE_TEXT_SECTIONS,
    GIFT_PAGE_TEXT_SECTIONS,
    CONTACT_PAGE_TEXT_SECTIONS,
    LAYOUT_TEXT_SECTIONS,
    parseCustomTexts,
    CUSTOM_TEXTS_KEY,
} from '@/lib/siteTexts';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import {
    BookOpen,
    Home,
    Heart,
    Receipt,
    Gift,
    Mail,
    Settings,
    ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Gestion des Pages & Textes | Admin La Parenthèse Harmonieuse',
};

const PAGE_ICONS = {
    accueil: Home,
    'mon-approche': Heart,
    'carte-des-soins': Receipt,
    'carte-cadeau': Gift,
    contact: Mail,
    layout: Settings,
};

export default async function SiteTextsAdminPage() {
    const info = await getSiteInfo();
    const overrides = parseCustomTexts(info?.[CUSTOM_TEXTS_KEY]);

    const allSections = [
        ...HOME_PAGE_TEXT_SECTIONS,
        ...ABOUT_PAGE_TEXT_SECTIONS,
        ...TARIFS_PAGE_TEXT_SECTIONS,
        ...GIFT_PAGE_TEXT_SECTIONS,
        ...CONTACT_PAGE_TEXT_SECTIONS,
        ...LAYOUT_TEXT_SECTIONS,
    ];

    return (
        <div className="anim-fade" style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="admin-title" style={{ color: 'var(--admin-text)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <BookOpen size={26} style={{ color: 'var(--admin-gold)' }} />
                    Gestion des Pages &amp; Textes
                </h1>
                <p className="admin-subtitle">
                    Chaque page du site possède désormais son espace dédié avec ses médias et ses textes associés.
                    Accédez directement à la page de votre choix ci-dessous :
                </p>
            </div>

            {/* Grille des pages */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {SITE_TEXT_GROUPS.map((group) => {
                    const Icon = PAGE_ICONS[group.id] || BookOpen;
                    return (
                        <div
                            key={group.id}
                            className="admin-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '1.35rem',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(184, 139, 70, 0.12)', color: 'var(--admin-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={20} />
                                    </div>
                                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
                                        {group.title}
                                    </h2>
                                </div>
                                <p style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                    {group.description}
                                </p>
                            </div>
                            <div style={{ marginTop: '1.25rem' }}>
                                <Link
                                    href={group.href}
                                    className="admin-btn admin-btn-primary"
                                    style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.84rem', padding: '9px 14px' }}
                                >
                                    Gérer cette page <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recherche & Éditeur global rapide */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={20} style={{ color: 'var(--admin-gold)' }} />
                        Recherche Rapide Multi-Pages
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Retrouvez ou modifiez instantanément n&apos;importe quel texte du site par mot-clé.
                    </span>
                </div>

                <SiteTextsEditor
                    sections={allSections}
                    overrides={overrides}
                    searchable
                    collapsible
                    defaultOpenFirst={false}
                />
            </div>
        </div>
    );
}
