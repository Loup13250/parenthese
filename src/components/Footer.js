'use client';
import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './Footer.css';

function renderHoursLines(value, fallback) {
    const raw = (value && String(value).trim()) || fallback;
    const parts = raw.split(/\s*(?:\/|\n)\s*/).filter(Boolean);
    return parts.map((part, idx) => (
        <span key={idx}>
            {idx > 0 && <br />}
            {part}
        </span>
    ));
}

export default function Footer({ siteInfo }) {
    const { t } = useLanguage();
    const info = siteInfo || {};
    const businessName = info.business_name || 'La Parenthèse Harmonieuse';
    const phone = info.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const email = info.contact_email || 'laparentheseharmonieuse@gmail.com';
    const planityUrl = info.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const instagramUrl = info.instagram || 'https://www.instagram.com/laparentheseharmonieuse/';
    const facebookUrl = info.facebook || '';

    const tagline = info.tagline || t('footer.tagline');
    const addressText = info.address || '418 Avenue Georges Guynemer, Pôle Santé Georges Guynemer';
    const cityLine = [info.postal_code || '13300', info.city || 'Salon-de-Provence'].filter(Boolean).join(' ');
    const parkingText = info.parking_info || 'Parking gratuit devant le pôle santé';
    const sunMonValue = info.hours_sun_mon || t('footer.closed');
    const isClosedLabel = /ferm|clos/i.test(sunMonValue);

    return (
        <footer className="spa-footer">
            <div className="footer-top">
                <div className="container footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col footer-brand-col">
                        <span className="footer-brand-title">{businessName}</span>
                        <p className="footer-brand-tagline">
                            {tagline}
                        </p>
                        <p className="footer-brand-desc">
                            {t('footer.desc')}
                        </p>
                        <div className="footer-social-links">
                            {instagramUrl && (
                                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${businessName}`} className="footer-social-btn">
                                    <Instagram size={17} />
                                    <span>Instagram</span>
                                </a>
                            )}
                            {facebookUrl && (
                                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label={`Facebook ${businessName}`} className="footer-social-btn">
                                    <Facebook size={17} />
                                    <span>Facebook</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Navigation du site */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Navigation</h3>
                        <ul className="footer-menu">
                            <li><Link href="/">Accueil</Link></li>
                            <li><Link href="/mon-approche">Mon Approche</Link></li>
                            <li><Link href="/carte-des-soins">Carte des Soins</Link></li>
                            <li><Link href="/carte-cadeau">Carte Cadeau</Link></li>
                            <li><Link href="/contact">Contact &amp; Accès</Link></li>
                        </ul>
                    </div>

                    {/* Accès & Contact */}
                    <div className="footer-col">
                        <h3 className="footer-heading">{t('footer.contactTitle')}</h3>
                        <ul className="footer-contact-list">
                            <li>
                                <MapPin size={16} className="contact-icon" />
                                <span>
                                    {addressText.split(/,\s*/).map((line, idx) => (
                                        <span key={idx}>
                                            {idx > 0 && <br />}
                                            {line}
                                        </span>
                                    ))}
                                    {!addressText.includes('Salon-de-Provence') && cityLine ? (
                                        <>
                                            <br />
                                            {cityLine}
                                        </>
                                    ) : null}
                                </span>
                            </li>
                            <li className="footer-parking-tag">
                                <ShieldCheck size={14} className="contact-icon" />
                                <span>{parkingText}</span>
                            </li>
                            <li>
                                <Phone size={16} className="contact-icon" />
                                <a href={`tel:${phoneTel}`}>{phone}</a>
                            </li>
                            <li>
                                <Mail size={16} className="contact-icon" />
                                <a href={`mailto:${email}`}>{email}</a>
                            </li>
                        </ul>

                        <div className="footer-cta-wrap">
                            <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="footer-planity-btn">
                                <Calendar size={15} />
                                <span>{t('footer.bookPlanity')}</span>
                            </a>
                        </div>
                    </div>

                    {/* Horaires d'ouverture */}
                    <div className="footer-col">
                        <h3 className="footer-heading">{t('footer.hoursTitle')}</h3>
                        <div className="footer-hours-table">
                            <div className="hours-row">
                                <span className="day">{t('footer.dayTue')}</span>
                                <span className="time">{renderHoursLines(info.hours_tue, '10:00 - 13:30 / 14:30 - 19:00')}</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">{t('footer.dayWed')}</span>
                                <span className="time">{renderHoursLines(info.hours_wed, '14:00 - 19:00')}</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">{t('footer.dayThu')}</span>
                                <span className="time">{renderHoursLines(info.hours_thu, '10:00 - 13:30 / 14:30 - 18:00')}</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">{t('footer.dayFri')}</span>
                                <span className="time">{renderHoursLines(info.hours_fri, '10:00 - 13:30 / 14:30 - 17:30')}</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">{t('footer.daySat')}</span>
                                <span className="time">{renderHoursLines(info.hours_sat, '09:30 - 14:00')}</span>
                            </div>
                            <div className="hours-row closed">
                                <span className="day">{t('footer.daySunMon')}</span>
                                <span className="time">{sunMonValue}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p className="copyright">
                        © {new Date().getFullYear()} {t('footer.copyright')}
                    </p>
                    <div className="footer-legal-links">
                        <Link href="/mentions-legales">{t('footer.legalNotice')}</Link>
                        <span className="dot" aria-hidden="true">•</span>
                        <Link href="/politique-de-confidentialite">{t('footer.privacyPolicy')}</Link>
                        <span className="dot" aria-hidden="true">•</span>
                        <Link href="/conditions-generales-de-ventes">{t('footer.cgv')}</Link>
                        <span className="dot" aria-hidden="true">•</span>
                        <Link href="/admin" className="admin-link">{t('footer.proSpace')}</Link>
                    </div>
                    <p className="footer-credits">
                        Conçu par{' '}
                        <a
                            href="https://jl-developpement.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-developer-link"
                        >
                            JL-Développement
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
