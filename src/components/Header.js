'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, X as XIcon, Phone, Calendar, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './Header.css';

export default function Header({ siteInfo }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { t, trans } = useLanguage();

    // Détection de la page d'accueil (si pathname est null lors de l'hydratation ou SSR, défaut sur transparent pour l'accueil)
    const cleanPath = pathname ? pathname.replace(/\/$/, '') : '';
    const isHome = !pathname || cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html';

    const logoSrc = siteInfo?.logo || '/images/logo.png';
    const businessName = siteInfo?.business_name || 'La Parenthèse Harmonieuse';
    const brandParts = businessName.trim().split(/\s+/);
    const brandMain = brandParts.length > 1 ? brandParts.slice(0, -1).join(' ') : businessName;
    const brandSub = brandParts.length > 1 ? brandParts[brandParts.length - 1] : '';

    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const instagramUrl = siteInfo?.instagram || 'https://www.instagram.com/laparentheseharmonieuse/';
    const facebookUrl = siteInfo?.facebook || '';
    const addressText = trans(siteInfo, 'address') || '418 Avenue Georges Guynemer, Pôle Santé Georges Guynemer';
    const cityLine = [siteInfo?.postal_code || '13300', siteInfo?.city || 'Salon-de-Provence'].filter(Boolean).join(' ');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
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
        if (!mobileMenuOpen) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [mobileMenuOpen]);

    const isTop = isHome && !scrolled && !mobileMenuOpen;

    return (
        <header className={`spa-header ${isTop ? 'header--transparent' : 'header--solid'}`}>
            <a href="#main-content" className="skip-to-content">
                {t('nav.skipContent')}
            </a>

            <div className="container header-container">
                {/* 1. Logo & Identité Harmonie (Gauche) */}
                <Link href="/" className="spa-logo-link" aria-label={`${businessName} - ${t('nav.home')}`}>
                    <div className="spa-logo-circle">
                        <Image
                            src={logoSrc}
                            alt={`Logo ${businessName}`}
                            width={46}
                            height={46}
                            className="spa-logo-img"
                            preload
                            unoptimized
                        />
                    </div>
                    <div className="spa-brand-text">
                        <span className="spa-brand-title">{brandMain}</span>
                        {brandSub && <span className="spa-brand-sub">{brandSub}</span>}
                    </div>
                </Link>

                {/* 2. Navigation Centre :
                     Ligne 1 : Liens (Accueil, Mon approche, Carte des soins, Carte cadeau, Galerie, Contact)
                     Ligne 2 : Bouton "PRENDRE RENDEZ-VOUS" centré juste en dessous */}
                <div className="spa-nav-cluster">
                    <nav className="spa-nav-links" aria-label="Navigation principale">
                        <Link href="/" className={pathname === '/' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            {t('nav.home')}
                        </Link>
                        <Link href="/mon-approche" className={pathname === '/mon-approche' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            {t('nav.about')}
                        </Link>
                        <Link href="/carte-des-soins" className={pathname === '/carte-des-soins' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            {t('nav.tarifs')}
                        </Link>
                        <Link href="/carte-cadeau" className={pathname === '/carte-cadeau' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            {t('nav.gift')}
                        </Link>
                        <Link href="/contact" className={pathname === '/contact' ? 'spa-nav-link active' : 'spa-nav-link'}>
                            {t('nav.contact')}
                        </Link>
                    </nav>

                    <div className="spa-nav-sub">
                        <a
                            href={planityUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-book-rdv-compact"
                            id="header-btn-prendre-rdv"
                            title={t('nav.bookPlanity')}
                        >
                            <span>{t('nav.bookBtn')}</span>
                        </a>
                    </div>
                </div>

                {/* 3. Actions Rapides Droite (Téléphone, Réseaux, Langue & Mobile Toggle) */}
                <div className="header-actions">
                    <a href={`tel:${phoneTel}`} className="header-phone-btn" title={t('nav.callUs')} aria-label={`${t('nav.callUs')} : ${phone}`}>
                        <Phone size={13} />
                        <span>{phone}</span>
                    </a>

                    {instagramUrl && (
                        <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="header-insta-btn hide-tablet"
                            aria-label={`Instagram ${businessName}`}
                            title="Instagram"
                        >
                            <Instagram size={15} />
                        </a>
                    )}

                    <button
                        type="button"
                        className="spa-mobile-toggle"
                        onClick={toggleMobileMenu}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
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
                aria-label={businessName}
                inert={!mobileMenuOpen ? true : undefined}
            >
                <div className="spa-drawer-header">
                    <div className="spa-drawer-brand">
                        <span className="spa-drawer-title">{businessName}</span>
                        <span className="spa-drawer-sub">{t('nav.brandSubtitle')}</span>
                    </div>
                    <button
                        type="button"
                        className="spa-drawer-close"
                        onClick={closeMobileMenu}
                        aria-label={t('nav.closeMenu')}
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
                        <span>{t('nav.bookPlanity')}</span>
                    </a>
                </div>

                <nav className="spa-drawer-links" aria-label="Navigation mobile">
                    <Link href="/" className={pathname === '/' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        {t('nav.home')}
                    </Link>
                    <Link href="/mon-approche" className={pathname === '/mon-approche' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        {t('nav.about')}
                    </Link>
                    <Link href="/carte-des-soins" className={pathname === '/carte-des-soins' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        {t('nav.tarifs')}
                    </Link>
                    <Link href="/carte-cadeau" className={pathname === '/carte-cadeau' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        {t('nav.gift')}
                    </Link>
                    <Link href="/contact" className={pathname === '/contact' ? 'drawer-link active' : 'drawer-link'} onClick={closeMobileMenu}>
                        {t('nav.contact')}
                    </Link>
                </nav>

                <div className="spa-drawer-footer">
                    <a href={`tel:${phoneTel}`} className="drawer-phone-link">
                        <Phone size={15} />
                        <span>{phone}</span>
                    </a>
                    <p className="drawer-address">
                        {addressText}
                        {!addressText.includes('Salon-de-Provence') && cityLine ? (
                            <>
                                <br />
                                {cityLine}
                            </>
                        ) : null}
                    </p>
                    <div className="drawer-socials">
                        {instagramUrl && (
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram size={18} />
                                <span>Instagram</span>
                            </a>
                        )}
                        {facebookUrl && (
                            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <Facebook size={18} />
                                <span>Facebook</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
