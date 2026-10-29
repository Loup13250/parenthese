import Link from 'next/link';
import {
    getServices,
    getContactMessages,
    getUnreadMessageCount,
    getTestimonials,
    getSiteInfo,
} from '@/lib/data';
import {
    Sparkles,
    Star,
    MessageSquare,
    ExternalLink,
    ArrowRight,
    Heart,
    History,
    Home,
    Gift,
    Mail,
    Settings,
    Receipt,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Tableau de bord | Admin La Parenthèse Harmonieuse',
};

function parseDbDate(str) {
    if (!str) return null;
    return new Date(str.includes('T') ? str : str.replace(' ', 'T') + 'Z');
}

function frenchToday() {
    const now = new Date();
    const h = parseInt(
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', hour12: false, timeZone: 'Europe/Paris' }),
        10
    );
    const greeting = h >= 18 || h < 5 ? 'Bonsoir' : 'Bonjour';
    const date = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Paris',
    });
    return {
        greeting,
        date: date.charAt(0).toUpperCase() + date.slice(1),
    };
}

export default async function DashboardOverview() {
    const [services, messages, unreadCount, testimonials, siteInfo] = await Promise.all([
        getServices(),
        getContactMessages(),
        getUnreadMessageCount(),
        getTestimonials(false),
        getSiteInfo(),
    ]);

    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const recentMessages = messages.slice(0, 4);
    const { greeting, date } = frenchToday();

    const pageTiles = [
        {
            href: '/admin/dashboard/accueil',
            icon: Home,
            badge: 'Accueil',
            badgeColor: '#D97706',
            badgeBg: 'rgba(217, 119, 6, 0.12)',
            title: "Page d'Accueil",
            text: 'Bannière vidéo, accroches, triptyque, coups de cœur et présentation du lieu.',
            action: "Gérer l'accueil",
        },
        {
            href: '/admin/dashboard/a-propos',
            icon: Heart,
            badge: 'Mon Approche',
            badgeColor: '#EC4899',
            badgeBg: 'rgba(236, 72, 153, 0.12)',
            title: 'Page Mon Approche',
            text: "Portrait d'Harmonie, biographie, 4 engagements et cosmétiques BIO Nohèm.",
            action: 'Gérer la présentation',
        },
        {
            href: '/admin/dashboard/prestations',
            icon: Receipt,
            badge: `${services.length} soins`,
            badgeColor: '#059669',
            badgeBg: 'rgba(5, 150, 105, 0.12)',
            title: 'Page Carte des Soins',
            text: 'Massages, soins visage, drainage, Kobido, tarifs, durées et photos de soins.',
            action: 'Gérer les soins',
        },
        {
            href: '/admin/dashboard/carte-cadeau',
            icon: Gift,
            badge: 'Carte Cadeau',
            badgeColor: '#8B5CF6',
            badgeBg: 'rgba(139, 92, 246, 0.12)',
            title: 'Page Carte Cadeau',
            text: 'Pochette cadeau physique, bon digital instantané Planity et suggestions.',
            action: 'Gérer la carte cadeau',
        },
        {
            href: '/admin/dashboard/contact',
            icon: Mail,
            badge: 'Contact',
            badgeColor: '#0284C7',
            badgeBg: 'rgba(2, 132, 199, 0.12)',
            title: 'Page Contact & Accès',
            text: 'Formulaire de contact, parking gratuit du Pôle Santé Guynemer et horaires.',
            action: 'Gérer le contact',
        },
    ];

    const shortcuts = [
        { href: '/admin/dashboard/accueil', icon: Home, title: 'Page Accueil', text: 'Bannière vidéo & accroches', color: '#B45309', bg: 'rgba(180, 83, 9, 0.1)', border: 'rgba(180, 83, 9, 0.25)' },
        { href: '/admin/dashboard/a-propos', icon: Heart, title: 'Page Mon Approche', text: 'Portrait, histoire & marques', color: '#C2572D', bg: 'rgba(194, 87, 45, 0.1)', border: 'rgba(194, 87, 45, 0.25)' },
        { href: '/admin/dashboard/prestations', icon: Receipt, title: 'Page Carte des Soins', text: `${services.length} rituels & tarifs`, color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.25)' },
        { href: '/admin/dashboard/carte-cadeau', icon: Gift, title: 'Page Carte Cadeau', text: 'Formats physique & digital', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.25)' },
        { href: '/admin/dashboard/contact', icon: Mail, title: 'Page Contact', text: 'Accès, parking & formulaire', color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)', border: 'rgba(2, 132, 199, 0.25)' },
        { href: '/admin/dashboard/avis', icon: Star, title: 'Avis Clientes', text: `${testimonials.length} témoignages vérifiés`, color: '#9E7153', bg: 'rgba(158, 113, 83, 0.12)', border: 'rgba(158, 113, 83, 0.25)' },
        { href: '/admin/dashboard/messages', icon: MessageSquare, title: 'Demandes & Messages', text: `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`, color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)', border: 'rgba(2, 132, 199, 0.25)' },
        { href: '/admin/dashboard/settings', icon: Settings, title: 'Paramètres Généraux', text: 'Logo, coordonnées, mot de passe', color: '#8D5B4C', bg: 'rgba(141, 91, 76, 0.1)', border: 'rgba(141, 91, 76, 0.25)' },
        { href: '/admin/dashboard/logs', icon: History, title: 'Journal d’activité', text: 'Audit trail des modifications', color: '#475569', bg: 'rgba(71, 85, 105, 0.1)', border: 'rgba(71, 85, 105, 0.25)' },
    ];

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* En-tête */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.25rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--admin-border)',
            }}>
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        marginBottom: '0.6rem',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, rgba(158, 113, 83, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)',
                        border: '1px solid rgba(158, 113, 83, 0.25)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#9E7153',
                        letterSpacing: '0.04em'
                    }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#9E7153' }} />
                        {date}
                    </div>
                    <h1 style={{ fontSize: '2.6rem', lineHeight: 1.05, color: 'var(--admin-text)', margin: 0 }}>
                        {greeting}, <span style={{ color: '#9E7153' }}>Harmonie</span>
                    </h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.95rem', margin: '0.6rem 0 0' }}>
                        Espace de gestion • La Parenthèse Harmonieuse (Salon-de-Provence)
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                        href={planityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn"
                        style={{
                            background: '#FFFFFF',
                            color: '#9E7153',
                            border: '1px solid rgba(158, 113, 83, 0.35)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            fontWeight: 600,
                            padding: '9px 16px',
                        }}
                    >
                        <ExternalLink size={15} /> Planning Planity
                    </a>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-primary"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            padding: '9px 18px',
                        }}
                    >
                        <ExternalLink size={15} /> Voir le site en ligne
                    </a>
                </div>
            </header>

            {/* GESTION PAR PAGE */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>
                        Gestion des Pages du Site
                    </h2>
                    <span style={{ flex: 1, height: '1px', background: 'var(--admin-border)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                    {pageTiles.map(({ href, icon: Icon, badge, badgeColor, badgeBg, title, text, action }) => (
                        <Link
                            key={href}
                            href={href}
                            className="admin-tile"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '1.4rem',
                            }}
                        >
                            <div>
                                <div className="admin-tile-top" style={{ marginBottom: '0.85rem' }}>
                                    <span className="admin-tile-eyebrow" style={{ color: badgeColor }}>
                                        <span style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            background: badgeBg,
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                            color: badgeColor, flexShrink: 0
                                        }}>
                                            <Icon size={15} />
                                        </span>
                                        {badge}
                                    </span>
                                </div>
                                <h3 className="admin-tile-title" style={{ fontSize: '1.15rem', marginBottom: '0.45rem' }}>{title}</h3>
                                <p className="admin-tile-text" style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>{text}</p>
                            </div>
                            <span className="admin-tile-go" style={{ marginTop: '1.25rem' }}>
                                {action} <ArrowRight size={15} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Raccourcis de gestion */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.1rem' }}>
                    <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>
                        Tous les modules de gestion
                    </h2>
                    <span style={{ flex: 1, height: '1px', background: 'var(--admin-border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
                    {shortcuts.map(({ href, icon: Icon, title, text, color, bg, border }) => (
                        <Link
                            key={href}
                            href={href}
                            className="admin-tile admin-tile--compact"
                            style={{
                                '--tile-color': color,
                                '--tile-bg': bg,
                                '--tile-border': border,
                            }}
                        >
                            <span className="admin-tile-icon">
                                <Icon size={19} strokeWidth={1.8} />
                            </span>
                            <span style={{ minWidth: 0 }}>
                                <strong className="admin-tile-title" style={{ display: 'block' }}>{title}</strong>
                                <span className="admin-tile-text" style={{ display: 'block' }}>{text}</span>
                            </span>
                            <ArrowRight size={16} className="admin-tile-arrow" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Derniers messages */}
            <section>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.1rem' }}>
                    <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>
                        Dernières demandes reçues
                    </h2>
                    <span style={{ flex: 1, height: '1px', background: 'var(--admin-border)' }} />
                    <Link href="/admin/dashboard/messages" className="admin-link-btn" style={{ textDecoration: 'none' }}>
                        Toutes les demandes →
                    </Link>
                </div>

                {recentMessages.length === 0 ? (
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem' }}>
                        Aucun message reçu pour le moment.
                    </p>
                ) : (
                    <div className="admin-log-list">
                        {recentMessages.map((msg) => {
                            const dt = parseDbDate(msg.created_at);
                            return (
                                <Link key={msg.id} href="/admin/dashboard/messages" className="admin-msg-row">
                                    <span className="admin-msg-dot" data-unread={!msg.is_read} aria-hidden="true" />
                                    <span style={{ minWidth: 0, flex: 1 }}>
                                        <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
                                            <strong style={{ fontSize: '0.95rem', fontWeight: msg.is_read ? 550 : 700, color: 'var(--admin-text)' }}>{msg.name}</strong>
                                            {msg.service_interest && (
                                                <span style={{ fontSize: '0.74rem', color: '#9E7153', fontStyle: 'italic' }}>{msg.service_interest}</span>
                                            )}
                                            {msg.phone && (
                                                <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)' }}>• {msg.phone}</span>
                                            )}
                                        </span>
                                        <span style={{ display: 'block', fontSize: '0.86rem', color: 'var(--admin-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {msg.message}
                                        </span>
                                    </span>
                                    <span style={{ fontSize: '0.76rem', color: 'var(--admin-text-subtle)', whiteSpace: 'nowrap' }}>
                                        {dt ? dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', timeZone: 'Europe/Paris' }) : ''}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
