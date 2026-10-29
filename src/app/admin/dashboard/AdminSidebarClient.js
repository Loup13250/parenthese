'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminLogout } from '@/app/actions';
import {
    LayoutDashboard,
    Home,
    Heart,
    Receipt,
    Gift,
    Mail,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X,
    ExternalLink,
    History,
    Star,
    MessageSquare,
    ChevronRight,
    ArrowLeft,
    CalendarCheck,
} from 'lucide-react';

const PAGE_LABELS = {
    '/admin/dashboard': { label: 'Tableau de bord', publicUrl: '/' },
    '/admin/dashboard/accueil': { label: "Page d'Accueil", publicUrl: '/' },
    '/admin/dashboard/a-propos': { label: 'Page Mon Approche', publicUrl: '/mon-approche' },
    '/admin/dashboard/prestations': { label: 'Page Carte des Soins', publicUrl: '/carte-des-soins' },
    '/admin/dashboard/tarifs': { label: 'Page Carte des Soins', publicUrl: '/carte-des-soins' },
    '/admin/dashboard/carte-cadeau': { label: 'Page Carte Cadeau', publicUrl: '/carte-cadeau' },
    '/admin/dashboard/contact': { label: 'Page Contact & Accès', publicUrl: '/contact' },
    '/admin/dashboard/avis': { label: 'Avis & Témoignages Clientes', publicUrl: '/' },
    '/admin/dashboard/messages': { label: 'Demandes & Messages Reçus', publicUrl: '/contact' },
    '/admin/dashboard/settings': { label: 'Paramètres Généraux & Sécurité', publicUrl: '/' },
    '/admin/dashboard/logs': { label: "Journal d'Activité", publicUrl: '/' },
};

export default function AdminSidebarClient({ children, unreadCount = 0 }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setMobileOpen(false);
    }

    useEffect(() => {
        if (!mobileOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen]);

    const isDashboardActive = pathname === '/admin/dashboard';
    const isAccueilActive = pathname === '/admin/dashboard/accueil';
    const isAProposActive = pathname === '/admin/dashboard/a-propos';
    const isTarifsActive = pathname === '/admin/dashboard/prestations' || pathname === '/admin/dashboard/tarifs';
    const isGiftActive = pathname === '/admin/dashboard/carte-cadeau';
    const isContactActive = pathname === '/admin/dashboard/contact';
    const isAvisActive = pathname === '/admin/dashboard/avis';
    const isMessagesActive = pathname === '/admin/dashboard/messages';
    const isSettingsActive = pathname === '/admin/dashboard/settings';
    const isLogsActive = pathname === '/admin/dashboard/logs';

    const currentMeta = PAGE_LABELS[pathname] || { label: 'Administration', publicUrl: '/' };

    return (
        <div className="admin-dashboard-layout">
            {/* Header Mobile */}
            <header className="admin-mobile-header">
                <Link href="/admin/dashboard" className="brand-title">
                    <span>La Parenthèse • Admin</span>
                </Link>
                <button
                    type="button"
                    className="admin-mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                >
                    {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
                </button>
            </header>

            {/* Voile sombre pour mobile */}
            <div
                className={`admin-sidebar-overlay ${mobileOpen ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Barre latérale principale */}
            <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
                <div className="admin-brand-header">
                    <Link href="/admin/dashboard" className="admin-brand-link" title="Retour au tableau de bord">
                        <div className="admin-brand-monogram" aria-hidden="true">PH</div>
                        <div className="admin-brand-text">
                            <span className="admin-brand-title">La Parenthèse</span>
                            <span className="admin-brand-sub">Espace Harmonie</span>
                        </div>
                    </Link>
                </div>

                <nav className="admin-nav-container" aria-label="Menu d'administration">
                    {/* VUE D'ENSEMBLE */}
                    <div className="admin-nav-group">
                        <Link
                            href="/admin/dashboard"
                            className={`admin-nav-item ${isDashboardActive ? 'active' : ''}`}
                        >
                            <div className="admin-nav-item-icon">
                                <LayoutDashboard size={17} />
                            </div>
                            <span className="admin-nav-item-text">Tableau de bord</span>
                            {isDashboardActive && <span className="admin-nav-active-pill" />}
                        </Link>
                    </div>

                    {/* SECTION 1 : PAGES DU SITE */}
                    <div className="admin-nav-section-title">
                        <span>PAGES DU SITE</span>
                    </div>

                    <Link
                        href="/admin/dashboard/accueil"
                        className={`admin-nav-item ${isAccueilActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Home size={17} />
                        </div>
                        <span className="admin-nav-item-text">1. Page Accueil</span>
                        {isAccueilActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    <Link
                        href="/admin/dashboard/a-propos"
                        className={`admin-nav-item ${isAProposActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Heart size={17} />
                        </div>
                        <span className="admin-nav-item-text">2. Mon Approche</span>
                        {isAProposActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    <Link
                        href="/admin/dashboard/prestations"
                        className={`admin-nav-item ${isTarifsActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Receipt size={17} />
                        </div>
                        <span className="admin-nav-item-text">3. Carte des Soins</span>
                        {isTarifsActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    <Link
                        href="/admin/dashboard/carte-cadeau"
                        className={`admin-nav-item ${isGiftActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Gift size={17} />
                        </div>
                        <span className="admin-nav-item-text">4. Carte Cadeau</span>
                        {isGiftActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    <Link
                        href="/admin/dashboard/contact"
                        className={`admin-nav-item ${isContactActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Mail size={17} />
                        </div>
                        <span className="admin-nav-item-text">5. Page Contact</span>
                        {isContactActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* SECTION 2 : GESTION & CLIENTÈLE */}
                    <div className="admin-nav-section-title">
                        <span>CLIENTÈLE &amp; AVIS</span>
                    </div>

                    <Link
                        href="/admin/dashboard/messages"
                        className={`admin-nav-item ${isMessagesActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <MessageSquare size={17} />
                        </div>
                        <span className="admin-nav-item-text">Messages Reçus</span>
                        {unreadCount > 0 ? (
                            <span className="admin-nav-badge-unread">{unreadCount}</span>
                        ) : (
                            isMessagesActive && <span className="admin-nav-active-pill" />
                        )}
                    </Link>

                    <Link
                        href="/admin/dashboard/avis"
                        className={`admin-nav-item ${isAvisActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Star size={17} />
                        </div>
                        <span className="admin-nav-item-text">Avis Clientes</span>
                        {isAvisActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* SECTION 3 : CONFIGURATION */}
                    <div className="admin-nav-section-title">
                        <span>CONFIGURATION</span>
                    </div>

                    <Link
                        href="/admin/dashboard/settings"
                        className={`admin-nav-item ${isSettingsActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Settings size={17} />
                        </div>
                        <span className="admin-nav-item-text">Paramètres &amp; Accès</span>
                        {isSettingsActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    <Link
                        href="/admin/dashboard/logs"
                        className={`admin-nav-item ${isLogsActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <History size={17} />
                        </div>
                        <span className="admin-nav-item-text">Journal d&apos;Activité</span>
                        {isLogsActive && <span className="admin-nav-active-pill" />}
                    </Link>
                </nav>

                {/* Footer Sidebar */}
                <div className="admin-sidebar-footer-custom">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-sidebar-public-btn"
                        title="Ouvrir le site public dans un nouvel onglet"
                    >
                        <ExternalLink size={15} />
                        <span>Voir le site public</span>
                    </a>
                    <form action={adminLogout} style={{ display: 'block', width: '100%', margin: 0 }}>
                        <button
                            type="submit"
                            className="admin-sidebar-logout-btn"
                            title="Fermer la session administrateur"
                        >
                            <LogOut size={15} />
                            <span>Se déconnecter</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Zone principale avec barre supérieure ergonomique */}
            <main className="admin-content">
                <div className="admin-topbar">
                    <div className="admin-topbar-crumbs">
                        {!isDashboardActive ? (
                            <>
                                <Link href="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <ArrowLeft size={14} /> Tableau de bord
                                </Link>
                                <ChevronRight size={14} style={{ opacity: 0.45 }} />
                                <span className="admin-topbar-current">{currentMeta.label}</span>
                            </>
                        ) : (
                            <span className="admin-topbar-current">Vue d&apos;ensemble • Espace de gestion</span>
                        )}
                    </div>

                    <div className="admin-topbar-actions">
                        {unreadCount > 0 && (
                            <Link
                                href="/admin/dashboard/messages"
                                className="admin-topbar-pill"
                                style={{ borderColor: '#D97706', background: '#FFFBEB', color: '#B45309' }}
                            >
                                <MessageSquare size={13} />
                                {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                            </Link>
                        )}
                        <a
                            href="https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-topbar-pill"
                        >
                            <CalendarCheck size={13} /> Planity
                        </a>
                        <a
                            href={currentMeta.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-topbar-pill admin-topbar-pill--gold"
                        >
                            <ExternalLink size={13} /> Aperçu en direct
                        </a>
                    </div>
                </div>

                <div className="admin-content-body">
                    {children}
                </div>
            </main>
        </div>
    );
}
