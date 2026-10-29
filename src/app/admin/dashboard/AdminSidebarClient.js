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
} from 'lucide-react';

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

    return (
        <div className="admin-dashboard-layout">
            {/* Header Mobile */}
            <header className="admin-mobile-header">
                <a href="/" target="_blank" rel="noopener noreferrer" className="brand-title">
                    <span>La Parenthèse Harmonieuse</span>
                </a>
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
                    <a href="/" target="_blank" rel="noopener noreferrer" className="admin-brand-link" title="Voir le site public">
                        <span className="admin-brand-title">La Parenthèse</span>
                        <span className="admin-brand-sub">Harmonieuse • Admin</span>
                    </a>
                </div>

                <nav className="admin-nav-container" aria-label="Menu d'administration">
                    {/* TABLEAU DE BORD */}
                    <div className="admin-nav-group">
                        <Link
                            href="/admin/dashboard"
                            className={`admin-nav-item nav-theme-amber ${isDashboardActive ? 'active' : ''}`}
                        >
                            <div className="admin-nav-item-icon">
                                <LayoutDashboard size={18} />
                            </div>
                            <span className="admin-nav-item-text">Tableau de bord</span>
                            {isDashboardActive && <span className="admin-nav-active-pill" />}
                        </Link>
                    </div>

                    {/* SECTION 1 : PAGES DU SITE */}
                    <div className="admin-nav-section-title">
                        <span>PAGES DU SITE</span>
                    </div>

                    {/* Page Accueil */}
                    <Link
                        href="/admin/dashboard/accueil"
                        className={`admin-nav-item nav-theme-amber ${isAccueilActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Home size={18} />
                        </div>
                        <span className="admin-nav-item-text">Page Accueil</span>
                        {isAccueilActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* Page Mon Approche */}
                    <Link
                        href="/admin/dashboard/a-propos"
                        className={`admin-nav-item nav-theme-pink ${isAProposActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Heart size={18} />
                        </div>
                        <span className="admin-nav-item-text">Page Mon Approche</span>
                        {isAProposActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* Page Carte des Soins */}
                    <Link
                        href="/admin/dashboard/prestations"
                        className={`admin-nav-item nav-theme-terracotta ${isTarifsActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Receipt size={18} />
                        </div>
                        <span className="admin-nav-item-text">Page Carte des Soins</span>
                        {isTarifsActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* Page Carte Cadeau */}
                    <Link
                        href="/admin/dashboard/carte-cadeau"
                        className={`admin-nav-item nav-theme-rose ${isGiftActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Gift size={18} />
                        </div>
                        <span className="admin-nav-item-text">Page Carte Cadeau</span>
                        {isGiftActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* Page Contact */}
                    <Link
                        href="/admin/dashboard/contact"
                        className={`admin-nav-item nav-theme-blue ${isContactActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Mail size={18} />
                        </div>
                        <span className="admin-nav-item-text">Page Contact</span>
                        {isContactActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* SECTION 2 : GESTION & CLIENTÈLE */}
                    <div className="admin-nav-section-title" style={{ marginTop: '0.6rem' }}>
                        <span>GESTION &amp; CLIENTS</span>
                    </div>

                    {/* Avis Clientes */}
                    <Link
                        href="/admin/dashboard/avis"
                        className={`admin-nav-item nav-theme-amber ${isAvisActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Star size={18} />
                        </div>
                        <span className="admin-nav-item-text">Avis Clientes</span>
                        {isAvisActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* Demandes & Messages */}
                    <Link
                        href="/admin/dashboard/messages"
                        className={`admin-nav-item nav-theme-blue ${isMessagesActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <MessageSquare size={18} />
                        </div>
                        <span className="admin-nav-item-text">Demandes &amp; Messages</span>
                        {unreadCount > 0 ? (
                            <span className="admin-nav-badge-unread">{unreadCount}</span>
                        ) : (
                            isMessagesActive && <span className="admin-nav-active-pill" />
                        )}
                    </Link>

                    {/* SECTION 3 : CONFIGURATION */}
                    <div className="admin-nav-section-title" style={{ marginTop: '0.6rem' }}>
                        <span>CONFIGURATION</span>
                    </div>

                    {/* Paramètres Généraux */}
                    <Link
                        href="/admin/dashboard/settings"
                        className={`admin-nav-item nav-theme-amber ${isSettingsActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <Settings size={18} />
                        </div>
                        <span className="admin-nav-item-text">Paramètres Généraux</span>
                        {isSettingsActive && <span className="admin-nav-active-pill" />}
                    </Link>

                    {/* Journal d'Activité */}
                    <Link
                        href="/admin/dashboard/logs"
                        className={`admin-nav-item nav-theme-indigo ${isLogsActive ? 'active' : ''}`}
                    >
                        <div className="admin-nav-item-icon">
                            <History size={18} />
                        </div>
                        <span className="admin-nav-item-text">Journal d&apos;Activité</span>
                        {isLogsActive && <span className="admin-nav-active-pill" />}
                    </Link>
                </nav>

                {/* Footer Sidebar */}
                <div className="admin-sidebar-footer">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-footer-btn"
                        title="Voir le site en ligne"
                    >
                        <ExternalLink size={15} />
                        <span>Voir le site</span>
                    </a>
                    <form action={adminLogout} style={{ display: 'inline', width: '100%' }}>
                        <button
                            type="submit"
                            className="admin-footer-btn admin-logout-btn"
                            title="Se déconnecter"
                        >
                            <LogOut size={15} />
                            <span>Déconnexion</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="admin-main-content">
                <div className="admin-content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
}
