import Link from 'next/link';
import { getServices, getContactMessages, getUnreadMessageCount, getGalleryPosts } from '@/lib/data';
import { Sparkles, Mail, Camera, Settings, ExternalLink, ArrowRight, MessageSquare, Heart, Languages, History, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Tableau de bord | Admin La Parenthèse Harmonieuse',
};

const SHORTCUTS = [
    { href: '/admin/dashboard/prestations', icon: Sparkles, title: 'Carte des soins', text: 'Massages, visages & rituels', color: '#9E7153', bg: 'rgba(158, 113, 83, 0.12)', border: 'rgba(158, 113, 83, 0.25)' },
    { href: '/admin/dashboard/messages', icon: MessageSquare, title: 'Demandes & Contact', text: 'Boîte de réception', color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)', border: 'rgba(2, 132, 199, 0.25)' },
    { href: '/admin/dashboard/galerie', icon: Camera, title: 'Galerie cabine', text: 'Photos de l’institut', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.25)' },
    { href: '/admin/dashboard/a-propos', icon: Heart, title: 'Mon Approche', text: 'Présentation & cosmétiques', color: '#C2572D', bg: 'rgba(194, 87, 45, 0.1)', border: 'rgba(194, 87, 45, 0.25)' },
    { href: '/admin/dashboard/textes', icon: Languages, title: 'Textes & Horaires', text: 'Horaires, adresses et bio', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)' },
    { href: '/admin/dashboard/settings', icon: Settings, title: 'Sécurité & Réglages', text: 'Mot de passe et coordonnées', color: '#8D5B4C', bg: 'rgba(141, 91, 76, 0.1)', border: 'rgba(141, 91, 76, 0.25)' },
    { href: '/admin/dashboard/logs', icon: History, title: 'Journal d’activité', text: 'Modifications et connexions', color: '#475569', bg: 'rgba(71, 85, 105, 0.1)', border: 'rgba(71, 85, 105, 0.25)' },
];

function frenchToday() {
    const now = new Date();
    const hour = Number(new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', hour12: false, timeZone: 'Europe/Paris' }).format(now));
    const date = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris',
    }).format(now);
    return {
        greeting: hour >= 18 || hour < 5 ? 'Bonsoir' : 'Bonjour',
        date: date.charAt(0).toUpperCase() + date.slice(1),
    };
}

export default async function DashboardOverview() {
    const [services, messages, unreadCount, galleryPosts] = await Promise.all([
        getServices(),
        getContactMessages(),
        getUnreadMessageCount(),
        getGalleryPosts(),
    ]);

    const recentMessages = messages.slice(0, 4);
    const { greeting, date } = frenchToday();

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
                        href="https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn"
                        style={{
                            background: '#FFFFFF',
                            color: '#1A1816',
                            border: '1px solid var(--admin-border)',
                            padding: '10px 16px',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                        }}
                    >
                        <Calendar size={15} /> Agenda Planity <ExternalLink size={12} />
                    </a>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn"
                        style={{
                            background: 'linear-gradient(135deg, #9E7153 0%, #7A5338 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(158, 113, 83, 0.28)',
                            padding: '10px 18px',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                        }}
                    >
                        <ExternalLink size={15} /> Voir le site public
                    </a>
                </div>
            </header>

            {/* Information de persistance */}
            {!process.env.TURSO_DATABASE_URL && (
                <div style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--admin-radius-md)',
                    padding: '1rem 1.25rem',
                    marginBottom: '2rem',
                    color: 'var(--admin-text-muted)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    background: 'var(--admin-card-bg)',
                }}>
                    <strong style={{ color: 'var(--admin-text)' }}>Mode local SQLite actif.</strong>{' '}
                    Vos modifications sont directement enregistrées dans <code>database/laparenthese.db</code>. Pour un déploiement Vercel persistant, configurez les variables <code>TURSO_DATABASE_URL</code> et <code>TURSO_AUTH_TOKEN</code>.
                </div>
            )}

            {/* Trois tuiles d'état */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem', marginBottom: '3rem' }}>
                <Link href="/admin/dashboard/messages" className="admin-tile admin-tile--blue">
                    <div className="admin-tile-top">
                        <span className="admin-tile-eyebrow" style={{ color: '#2563EB' }}>
                            <span style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: 'rgba(37, 99, 235, 0.12)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                color: '#2563EB', flexShrink: 0
                            }}>
                                <Mail size={14} />
                            </span>
                            Messages &amp; Contact
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                            background: unreadCount > 0 ? '#FEE2E2' : '#EFF6FF',
                            color: unreadCount > 0 ? '#DC2626' : '#2563EB',
                            border: unreadCount > 0 ? '1px solid #FCA5A5' : '1px solid #BFDBFE'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: unreadCount > 0 ? '#DC2626' : '#2563EB' }} />
                            {unreadCount > 0 ? `${unreadCount} non lu${unreadCount > 1 ? 's' : ''}` : 'À jour'}
                        </span>
                    </div>
                    <h2 className="admin-tile-title">Messages &amp; Demandes</h2>
                    <p className="admin-tile-text">
                        {messages.length} message{messages.length > 1 ? 's' : ''} reçu{messages.length > 1 ? 's' : ''} via le formulaire du site.
                    </p>
                    <span className="admin-tile-go">Consulter les messages <ArrowRight size={15} /></span>
                </Link>

                <Link href="/admin/dashboard/prestations" className="admin-tile admin-tile--terra">
                    <div className="admin-tile-top">
                        <span className="admin-tile-eyebrow" style={{ color: '#9E7153' }}>
                            <span style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: 'rgba(158, 113, 83, 0.12)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                color: '#9E7153', flexShrink: 0
                            }}>
                                <Sparkles size={14} />
                            </span>
                            Carte des Soins
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                            background: '#ECFDF5',
                            color: '#059669',
                            border: '1px solid #A7F3D0'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                            {services.length} soins
                        </span>
                    </div>
                    <h2 className="admin-tile-title">Massages &amp; Soins Visage</h2>
                    <p className="admin-tile-text">
                        Modifiez les tarifs, durées, contre-indications et descriptifs de vos rituels.
                    </p>
                    <span className="admin-tile-go">Gérer les soins <ArrowRight size={15} /></span>
                </Link>

                <Link href="/admin/dashboard/galerie" className="admin-tile admin-tile--amber">
                    <div className="admin-tile-top">
                        <span className="admin-tile-eyebrow" style={{ color: '#D97706' }}>
                            <span style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: 'rgba(217, 119, 6, 0.12)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                color: '#D97706', flexShrink: 0
                            }}>
                                <Camera size={14} />
                            </span>
                            Ambiance &amp; Cabine
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                            background: galleryPosts.length > 0 ? '#FEF3C7' : '#F3F4F6',
                            color: galleryPosts.length > 0 ? '#B45309' : '#6B7280',
                            border: galleryPosts.length > 0 ? '1px solid #FDE68A' : '1px solid #E5E7EB'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: galleryPosts.length > 0 ? '#D97706' : '#9CA3AF' }} />
                            {galleryPosts.length > 0 ? `${galleryPosts.length} photos` : 'Vide'}
                        </span>
                    </div>
                    <h2 className="admin-tile-title">Photos de l’institut</h2>
                    <p className="admin-tile-text">Photos de la cabine de soin, des cosmétiques et des rituels.</p>
                    <span className="admin-tile-go">Gérer la galerie <ArrowRight size={15} /></span>
                </Link>
            </div>

            {/* Raccourcis de gestion */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.1rem' }}>
                    <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>Raccourcis de gestion</h2>
                    <span style={{ flex: 1, height: '1px', background: 'var(--admin-border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
                    {SHORTCUTS.map(({ href, icon: Icon, title, text, color, bg, border }) => (
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
                    <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>Dernières demandes reçues</h2>
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
                        {recentMessages.map(msg => (
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
                                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }) : ''}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

