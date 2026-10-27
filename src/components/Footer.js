'use client';
import Link from 'next/link';
import { Instagram, MapPin, Phone, Mail, Clock, Calendar, Heart, ShieldCheck } from 'lucide-react';
import './Footer.css';

export default function Footer({ siteInfo }) {
    const info = siteInfo || {};
    const phone = info.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const email = info.contact_email || 'laparentheseharmonieuse@gmail.com';
    const planityUrl = info.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const instagramUrl = info.instagram || 'https://www.instagram.com/laparentheseharmonieuse/';

    return (
        <footer className="spa-footer">
            <div className="footer-top">
                <div className="container footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col footer-brand-col">
                        <span className="footer-brand-title">La Parenthèse Harmonieuse</span>
                        <p className="footer-brand-tagline">
                            Offrez-vous une parenthèse de bien-être...
                        </p>
                        <p className="footer-brand-desc">
                            Un cocon de douceur et d&apos;écoute bienveillante exclusivement dédié aux femmes. Massages sur mesure, soins du visage bio, drainage lymphatique et Kobido à Salon-de-Provence.
                        </p>
                        <div className="footer-social-links">
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram La Parenthèse Harmonieuse" className="footer-social-btn">
                                <Instagram size={17} />
                                <span>Instagram</span>
                            </a>
                        </div>
                    </div>

                    {/* Navigation / Soins */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Carte des Soins</h3>
                        <ul className="footer-menu">
                            <li><Link href="/carte-des-soins">Massages Sur Mesure Green Spa</Link></li>
                            <li><Link href="/carte-des-soins">Drainage Lymphatique Méthode Experte</Link></li>
                            <li><Link href="/carte-des-soins">Combo Madérothérapie & Drainage</Link></li>
                            <li><Link href="/carte-des-soins">Massage Liftant Visage Kobido</Link></li>
                            <li><Link href="/carte-des-soins">Soins Visage Personnalisés Nohèm BIO</Link></li>
                            <li><Link href="/carte-des-soins">Soins Spécial Maternité & Grossesse</Link></li>
                            <li><Link href="/carte-des-soins">Packs, Cures & Forfaits</Link></li>
                        </ul>
                    </div>

                    {/* Accès & Contact */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Institut & Contact</h3>
                        <ul className="footer-contact-list">
                            <li>
                                <MapPin size={16} className="contact-icon" />
                                <span>
                                    418 Avenue Georges Guynemer<br />
                                    Pôle Santé Georges Guynemer<br />
                                    13300 Salon-de-Provence
                                </span>
                            </li>
                            <li className="footer-parking-tag">
                                <ShieldCheck size={14} className="contact-icon" />
                                <span>Parking gratuit devant le pôle santé</span>
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
                                <span>Prendre RDV sur Planity</span>
                            </a>
                        </div>
                    </div>

                    {/* Horaires d'ouverture */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Horaires d&apos;Ouverture</h3>
                        <div className="footer-hours-table">
                            <div className="hours-row">
                                <span className="day">Mardi</span>
                                <span className="time">10:00 - 13:30<br />14:30 - 19:00</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">Mercredi</span>
                                <span className="time">14:00 - 19:00</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">Jeudi</span>
                                <span className="time">10:00 - 13:30<br />14:30 - 18:00</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">Vendredi</span>
                                <span className="time">10:00 - 13:30<br />14:30 - 17:30</span>
                            </div>
                            <div className="hours-row">
                                <span className="day">Samedi</span>
                                <span className="time">09:30 - 14:00</span>
                            </div>
                            <div className="hours-row closed">
                                <span className="day">Lundi & Dimanche</span>
                                <span className="time">Fermé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p className="copyright">
                        © {new Date().getFullYear()} La Parenthèse Harmonieuse. Tous droits réservés.
                    </p>
                    <div className="footer-legal-links">
                        <Link href="/mentions-legales">Mentions légales</Link>
                        <span className="dot">•</span>
                        <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
                        <span className="dot">•</span>
                        <Link href="/conditions-generales-de-ventes">CGV</Link>
                        <span className="dot">•</span>
                        <Link href="/admin" className="admin-link">Espace Pro</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
