'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, X as XIcon, Phone, Calendar, Instagram } from 'lucide-react';
import './Header.css';

export default function Header({ siteInfo }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const instagramUrl = siteInfo?.instagram || 'https://www.instagram.com/laparentheseharmonieuse/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const prevPathnameRef = useRef(pathname);
    useEffect(() => {
        if (pathname !== prevPathnameRef.current) {
            prevPathnameRef.current = pathname;
            setMobileMenuOpen(false);
        }
    }, [pathname]);

    const closeMobileMenu = () => setMobileMenuOpen(false);
    const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const isTop = isHome && !scrolled && !mobileMenuOpen;

    return (
        <header className={`spa-header ${isTop ? 'header--transparent' : 'header--solid'}`}>
            <div className="container header-container">
                {/* 1. Logo & Identité Harmonie (Gauche) */}
                <Link href="/" className="spa-logo-link" aria-label="La Parenthèse Harmonieuse - Accueil">
                    <div className="spa-logo-circle">
                        <Image
                            src="/images/logo.png"
                            alt="Logo La Parenthèse Harmonieuse"
                            width={46}
                            height={46}
                            className="spa-logo-img"
                            priority
                            unoptimized
                        />
                    </div>
                    <div className="spa-brand-text">
                        <span className="spa-brand-title">La Parenthèse</span>
                        <span className="spa-brand-sub">Harmonieuse</span>
                    </div>
                </Link>

                {/* 2. Navigation Centre :
                     Ligne 1 : Liens (Accueil, Mon approche, Carte des soins, Carte cadeau, Contact)
                     Ligne 2 : Bouton "PRENDRE RDV" centré juste en dessous */}
                <div className="spa-nav-cluster">
                    <nav className="spa-nav-links" aria-label="Navigation principale">
                        <Link href="/" className={pathname === '/' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            Accueil
                        </Link>
                        <Link href="/mon-approche" className={pathname === '/mon-approche' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            Mon approche
                        </Link>
                        <Link href="/carte-des-soins" className={pathname === '/carte-des-soins' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            Carte des soins
                        </Link>
                        <Link href="/carte-cadeau" className={pathname === '/carte-cadeau' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            Carte cadeau
                        </Link>
                        <Link href="/contact" className={pathname === '/contact' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            Contact
                        </Link>
                    </nav>

                    <div className="spa-nav-sub">
                        <a
                            href={planityUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-book-rdv-compact"
                            id="header-btn-prendre-rdv"
                            title="Réserver sur Planity en ligne"
                        >
                            <Calendar size={13} className="btn-icon" />
                            <span>PRENDRE RDV</span>
                            <span className="btn-dot" aria-hidden="true">•</span>
                            <span className="btn-tag">Planity 24/7</span>
                        </a>
                    </div>
                </div>

                {/* 3. Actions Rapides Droite (Téléphone & Mobile Toggle) */}
                <div className="header-actions">
                    <a href={`tel:${phoneTel}`} className="header-phone-btn" title="Téléphoner à l'institut">
                        <Phone size={13} />
                        <span>{phone}</span>
                    </a>

                    <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="header-insta-btn hide-tablet"
                        aria-label="Instagram La Parenthèse Harmonieuse"
                        title="Nous suivre sur Instagram"
                    >
                        <Instagram size={15} />
                    </a>

                    <button
                        type="button"
                        className="spa-mobile-toggle"
                        onClick={toggleMobileMenu}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    >
                        {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div
                className={`spa-mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
                onClick={closeMobileMenu}
                aria-hidden={!mobileMenuOpen}
            />

            <div
                id="mobile-nav"
                className={`spa-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                inert={!mobileMenuOpen ? true : undefined}
            >
                <div className="spa-drawer-header">
                    <div className="spa-drawer-brand">
                        <span className="spa-drawer-title">La Parenthèse Harmonieuse</span>
                        <span className="spa-drawer-sub">Salon-de-Provence • Institut dédié aux femmes</span>
                    </div>
                    <button
                        type="button"
                        className="spa-drawer-close"
                        onClick={closeMobileMenu}
                        aria-label="Fermer le menu"
                    >
                        <XIcon size={22} />
                    </button>
                </div>

                <div className="spa-drawer-cta">
                    <a
                        href={planityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-book-rdv-drawer"
                        onClick={closeMobileMenu}
                    >
                        <Calendar size={16} />
                        <span>PRENDRE RDV SUR PLANITY</span>
                    </a>
                </div>

                <nav className="spa-drawer-links" aria-label="Navigation mobile">
                    <Link href="/" className={pathname === '/' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        Accueil
                    </Link>
                    <Link href="/mon-approche" className={pathname === '/mon-approche' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        Mon approche
                    </Link>
                    <Link href="/carte-des-soins" className={pathname === '/carte-des-soins' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        Carte des soins
                    </Link>
                    <Link href="/carte-cadeau" className={pathname === '/carte-cadeau' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        Carte cadeau
                    </Link>
                    <Link href="/contact" className={pathname === '/contact' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        Contact
                    </Link>
                </nav>

                <div className="spa-drawer-footer">
                    <a href={`tel:${phoneTel}`} className="drawer-phone-link">
                        <Phone size={15} />
                        <span>{phone}</span>
                    </a>
                    <p className="drawer-address">
                        418 Avenue Georges Guynemer<br />
                        Pôle Santé Georges Guynemer, 13300 Salon-de-Provence
                    </p>
                    <div className="drawer-socials">
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram size={18} />
                            <span>Instagram @laparentheseharmonieuse</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
