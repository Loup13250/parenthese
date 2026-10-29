import Link from 'next/link';
import {
    getServices,
    getContactMessages,
    getUnreadMessageCount,
    getTestimonials,
    getSiteInfo,
} from '@/lib/data';
import {
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
    CalendarCheck,
    Sparkles,
    CheckCircle2,
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
    const recentMessages = messages.slice(0, 5);
    const featuredServicesCount = services.filter((s) => s.is_featured).length;
    const { greeting, date } = frenchToday();

    const pageTiles = [
        {
            step: 'Page 1',
            href: '/admin/dashboard/accueil',
            publicHref: '/',
            icon: Home,
            accentColor: '#9E7339',
            accentBg: 'rgba(158, 115, 57, 0.12)',
            title: "Page d'Accueil",
            text: "Bannière vidéo, photos du triptyque, plaque de l'institut, nombre de soins/avis affichés et textes d'accueil.",
            action: "Modifier l'accueil",
        },
        {
            step: 'Page 2',
            href: '/admin/dashboard/a-propos',
            publicHref: '/mon-approche',
            icon: Heart,
            accentColor: '#BE185D',
            accentBg: 'rgba(190, 24, 93, 0.10)',
            title: 'Page Mon Approche',
            text: "Portrait officiel d'Harmonie (partagé avec l'accueil), biographie, 4 engagements et marques BIO partenaires.",
            action: 'Modifier Mon Approche',
        },
        {
            step: 'Page 3',
            href: '/admin/dashboard/prestations',
            publicHref: '/carte-des-soins',
            icon: Receipt,
            accentColor: '#047857',
            accentBg: 'rgba(4, 120, 87, 0.10)',
            title: 'Page Carte des Soins',
            text: `${services.length} soins enregistrés (${featuredServicesCount} en Coup de Cœur). Gérez les tarifs, durées, photos et catégories.`,
            action: 'Gérer la carte des soins',
        },
        {
            step: 'Page 4',
            href: '/admin/dashboard/carte-cadeau',
            publicHref: '/carte-cadeau',
            icon: Gift,
            accentColor: '#6D28D9',
            accentBg: 'rgba(109, 40, 217, 0.10)',
            title: 'Page Carte Cadeau',
            text: 'Textes et explications de la Pochette Cadeau Physique et du Bon Digital Instantané Planity.',
            action: 'Modifier la Carte Cadeau',
        },
        {
            step: 'Page 5',
            href: '/admin/dashboard/contact',
            publicHref: '/contact',
            icon: Mail,
            accentColor: '#0369A1',
            accentBg: 'rgba(3, 105, 161, 0.10)',
            title: 'Page Contact & Accès',
            text: 'Textes du formulaire, indications de parking gratuit au Pôle Santé Georges Guynemer et coordonnées.',
            action: 'Modifier la page Contact',
        },
    ];

    const tools = [
        {
            href: '/admin/dashboard/messages',
            icon: MessageSquare,
            title: 'Boîte de Réception Clients',
            text: unreadCount > 0
                ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''} demande${unreadCount > 1 ? 's' : ''} à consulter`
                : `${messages.length} demande${messages.length > 1 ? 's' : ''} reçue${messages.length > 1 ? 's' : ''} (toutes lues)`,
            color: unreadCount > 0 ? '#D97706' : '#0369A1',
            bg: unreadCount > 0 ? 'rgba(217, 119, 6, 0.14)' : 'rgba(3, 105, 161, 0.10)',
            border: unreadCount > 0 ? 'rgba(217, 119, 6, 0.35)' : 'rgba(3, 105, 161, 0.25)',
        },
        {
            href: '/admin/dashboard/avis',
            icon: Star,
            title: 'Avis & Témoignages Clientes',
            text: `${testimonials.length} avis vérifiés (Planity & Google) affichés sur le site`,
            color: '#9E7339',
            bg: 'rgba(158, 115, 57, 0.12)',
            border: 'rgba(158, 115, 57, 0.28)',
        },
        {
            href: '/admin/dashboard/settings',
            icon: Settings,
            title: 'Paramètres Généraux & Sécurité',
            text: 'Logo, téléphone, horaires, liens Planity/Instagram, sauvegardes & mot de passe',
            color: '#334155',
            bg: 'rgba(51, 65, 85, 0.10)',
            border: 'rgba(51, 65, 85, 0.24)',
        },
        {
            href: '/admin/dashboard/logs',
            icon: History,
            title: "Journal d'Activité & Sécurité",
            text: 'Historique horodaté des modifications et connexions à votre espace',
            color: '#475569',
            bg: 'rgba(71, 85, 105, 0.10)',
            border: 'rgba(71, 85, 105, 0.22)',
        },
    ];

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* BANNIÈRE DE BIENVENUE */}
            <div className="admin-page-header" style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6EE 100%)',
                borderColor: 'var(--admin-gold-border)',
                padding: '1.85rem 2.15rem',
                marginBottom: '2.25rem',
            }}>
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        marginBottom: '0.55rem',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        background: 'var(--admin-gold-soft)',
                        border: '1px solid var(--admin-gold-border)',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        color: 'var(--admin-gold-dark)',
                    }}>
                        <Sparkles size={13} />
                        {date}
                    </div>
                    <h1 className="admin-title" style={{ fontSize: 'clamp(1.85rem, 2.6vw, 2.45rem)', marginBottom: '0.35rem' }}>
                        {greeting}, <span style={{ color: 'var(--admin-gold)' }}>Harmonie</span>
                    </h1>
                    <p className="admin-subtitle">
                        Bienvenue dans votre espace de gestion sur mesure. Choisissez une page ci-dessous pour modifier ses photos, ses soins ou ses textes en quelques clics.
                    </p>
                </div>

                <div className="admin-page-actions">
                    <a
                        href={planityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                    >
                        <CalendarCheck size={15} style={{ color: 'var(--admin-gold)' }} />
                        Ouvrir mon Planning Planity
                    </a>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-primary"
                    >
                        <ExternalLink size={15} />
                        Voir le site public
                    </a>
                </div>
            </div>

            {/* SECTION 1 : LES 5 PAGES DU SITE */}
            <section style={{ marginBottom: '2.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.15rem' }}>
                    <div>
                        <span className="admin-eyebrow">Édition par page</span>
                        <h2 style={{ fontSize: '1.45rem', marginTop: '0.15rem' }}>
                            Quelle page du site souhaitez-vous modifier ?
                        </h2>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                        Chaque page regroupe ses propres images, réglages et textes
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.15rem' }}>
                    {pageTiles.map(({ step, href, icon: Icon, accentColor, accentBg, title, text, action }) => (
                        <Link
                            key={href}
                            href={href}
                            className="admin-tile"
                        >
                            <div>
                                <div className="admin-tile-top">
                                    <span className="admin-tile-eyebrow" style={{ color: accentColor }}>
                                        <span style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '9px',
                                            background: accentBg,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: accentColor,
                                            flexShrink: 0,
                                        }}>
                                            <Icon size={16} />
                                        </span>
                                        {step}
                                    </span>
                                </div>
                                <h3 className="admin-tile-title">{title}</h3>
                                <p className="admin-tile-text">{text}</p>
                            </div>
                            <span className="admin-tile-go">
                                {action} <ArrowRight size={15} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SECTION 2 : COLONNE GAUCHE (MESSAGES) & COLONNE DROITE (OUTILS & CONFIGURATION) */}
            <div className="admin-grid-2col" style={{ alignItems: 'start' }}>
                {/* Colonne Gauche : Demandes & Messages */}
                <section className="admin-card" style={{ marginBottom: 0, padding: '1.5rem 1.65rem' }}>
                    <div className="admin-card-header" style={{ marginBottom: '1rem', paddingBottom: '0.85rem' }}>
                        <div>
                            <span className="admin-eyebrow">Formulaire de contact</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                Dernières demandes reçues
                                {unreadCount > 0 && (
                                    <span style={{
                                        fontSize: '0.72rem',
                                        fontFamily: 'var(--font-body), sans-serif',
                                        padding: '2px 9px',
                                        borderRadius: '999px',
                                        background: '#FEF3C7',
                                        color: '#B45309',
                                        border: '1px solid #FDE68A',
                                        fontWeight: 700,
                                    }}>
                                        {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </h2>
                        </div>
                        <Link href="/admin/dashboard/messages" className="admin-link-btn">
                            Tout voir <ArrowRight size={14} />
                        </Link>
                    </div>

                    {recentMessages.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2.25rem 1rem',
                            background: 'var(--admin-surface-subtle)',
                            borderRadius: 'var(--admin-radius-md)',
                            border: '1px dashed var(--admin-border)',
                        }}>
                            <CheckCircle2 size={28} style={{ color: 'var(--admin-sage)', margin: '0 auto 0.5rem' }} />
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--admin-text)' }}>
                                Aucune demande en attente
                            </p>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                Les messages envoyés depuis la page Contact s&apos;afficheront ici.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-log-list">
                            {recentMessages.map((msg) => {
                                const dt = parseDbDate(msg.created_at);
                                return (
                                    <Link key={msg.id} href="/admin/dashboard/messages" className="admin-msg-row">
                                        <span className="admin-msg-dot" data-unread={!msg.is_read} aria-hidden="true" />
                                        <span style={{ minWidth: 0, flex: 1 }}>
                                            <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <strong style={{ fontSize: '0.92rem', fontWeight: msg.is_read ? 600 : 700, color: 'var(--admin-text)' }}>
                                                    {msg.name}
                                                </strong>
                                                {msg.service_interest && (
                                                    <span style={{ fontSize: '0.74rem', color: 'var(--admin-gold-dark)', fontWeight: 600 }}>
                                                        • {msg.service_interest}
                                                    </span>
                                                )}
                                            </span>
                                            <span style={{ display: 'block', fontSize: '0.83rem', color: 'var(--admin-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {msg.message}
                                            </span>
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)', whiteSpace: 'nowrap' }}>
                                            {dt ? dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', timeZone: 'Europe/Paris' }) : ''}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Colonne Droite : Avis, Paramètres & Journal */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {tools.map(({ href, icon: Icon, title, text, color, bg, border }) => (
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
                                <Icon size={20} strokeWidth={1.8} />
                            </span>
                            <span style={{ minWidth: 0, flex: 1 }}>
                                <strong className="admin-tile-title" style={{ display: 'block' }}>{title}</strong>
                                <span className="admin-tile-text" style={{ display: 'block' }}>{text}</span>
                            </span>
                            <ArrowRight size={16} className="admin-tile-arrow" />
                        </Link>
                    ))}
                </section>
            </div>
        </div>
    );
}
