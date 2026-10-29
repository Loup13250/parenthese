'use client';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Instagram, Facebook, Mail, Calendar, Car } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './contact.css';

function formatHours(value, fallback) {
    const raw = (value && String(value).trim()) || fallback;
    return raw.replace(/\s*\/\s*/g, ' | ');
}

export default function ContactClient({ info, services = [] }) {
    const { t, trans } = useLanguage();
    const businessName = info?.business_name || 'La Parenthèse Harmonieuse';
    const phone = info?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const email = info?.contact_email || 'laparentheseharmonieuse@gmail.com';
    const planityUrl = info?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const instagramUrl = info?.instagram || 'https://www.instagram.com/laparentheseharmonieuse/';
    const facebookUrl = info?.facebook || '';
    const addressText = trans(info, 'address') || '418 Avenue Georges Guynemer, Pôle Santé Georges Guynemer';
    const cityLine = [info?.postal_code || '13300', info?.city || 'Salon-de-Provence'].filter(Boolean).join(' ');
    const parkingText = info?.parking_info || 'Places de parking gratuit réservées devant le pôle santé · Accès PMR de plain-pied.';
    const sunMonValue = info?.hours_sun_mon || t('footer.closed');
    const isClosedLabel = /ferm|clos/i.test(sunMonValue);

    const instagramHandle = (() => {
        try {
            const u = new URL(instagramUrl);
            const slug = u.pathname.replace(/^\/+|\/+$/g, '');
            return slug ? `@${slug}` : '@laparentheseharmonieuse';
        } catch {
            return '@laparentheseharmonieuse';
        }
    })();

    return (
        <main id="main-content" className="contact-page-main">
            <section className="contact-content-section">
                <div className="container">
                    <div className="contact-compact-header-wrap">
                        <div>
                            <span className="contact-kicker">{t('contact.badge')}</span>
                            <h1 className="contact-compact-title">
                                {t('contact.title')} <span className="title-serif">{t('contact.titleItalic')}</span>
                            </h1>
                        </div>
                        <div className="contact-badges-strip">
                            <span className="badge-chip">{t('contact.chip1')}</span>
                            <span className="badge-chip-dot" aria-hidden="true">•</span>
                            <span className="badge-chip">{t('contact.chip2')}</span>
                            <span className="badge-chip-dot" aria-hidden="true">•</span>
                            <span className="badge-chip">{t('contact.chip3')}</span>
                        </div>
                    </div>

                    <div className="contact-dual-layout">
                        <div className="contact-form-column">
                            <ContactForm services={services} />
                        </div>

                        <div className="contact-info-column">
                            {/* Rendez-vous prioritaire Planity */}
                            <div className="info-box planity-box">
                                <span className="box-badge">{t('contact.planityBadge')}</span>
                                <h3>{t('contact.planityTitle')}</h3>
                                <p>{t('contact.planityDesc')}</p>
                                <a
                                    href={planityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-planity-contact"
                                >
                                    <Calendar size={16} />
                                    <span>{t('contact.planityBtn')}</span>
                                </a>
                            </div>

                            {/* Coordonnées directes */}
                            <div className="info-box">
                                <span className="box-badge">{t('contact.directBadge')}</span>
                                <h3>{t('contact.directTitle')}</h3>
                                <div className="info-list-stacked">
                                    <div className="info-item-row">
                                        <div className="icon-circle">
                                            <Phone size={17} />
                                        </div>
                                        <div className="info-item-text">
                                            <span className="info-label">{t('contact.directPhoneLabel')}</span>
                                            <a href={`tel:${phoneTel}`} className="info-link-highlight" aria-label={`Téléphoner à l'institut au ${phone}`}>{phone}</a>
                                        </div>
                                    </div>

                                    <div className="info-item-row">
                                        <div className="icon-circle">
                                            <Mail size={17} />
                                        </div>
                                        <div className="info-item-text">
                                            <span className="info-label">Email</span>
                                            <a href={`mailto:${email}`} className="info-link" aria-label={`Envoyer un email à ${email}`}>{email}</a>
                                        </div>
                                    </div>

                                    {instagramUrl && (
                                        <div className="info-item-row">
                                            <div className="icon-circle">
                                                <Instagram size={17} />
                                            </div>
                                            <div className="info-item-text">
                                                <span className="info-label">Instagram</span>
                                                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="info-link" aria-label="Suivre La Parenthèse Harmonieuse sur Instagram (ouvre un nouvel onglet)">
                                                    {instagramHandle}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {facebookUrl && (
                                        <div className="info-item-row">
                                            <div className="icon-circle">
                                                <Facebook size={17} />
                                            </div>
                                            <div className="info-item-text">
                                                <span className="info-label">Facebook</span>
                                                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="info-link">
                                                    {businessName}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Adresse & Parking */}
                            <div className="info-box">
                                <span className="box-badge">{t('contact.accessBadge')}</span>
                                <h3>{t('contact.locTitle')}</h3>
                                <div className="info-item-row address-row">
                                    <div className="icon-circle">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="info-item-text">
                                        <p className="address-text">
                                            <strong>{businessName}</strong><br />
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
                                        </p>
                                    </div>
                                </div>

                                <div className="parking-alert-row">
                                    <div className="icon-circle icon-circle-small">
                                        <Car size={16} />
                                    </div>
                                    <div className="info-item-text">
                                        <span>{parkingText}</span>
                                    </div>
                                </div>

                                <div className="map-link-wrap">
                                    <a
                                        href="https://www.google.com/maps?daddr=43.62820135848179,5.104028208438731"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-open-maps"
                                        aria-label="Ouvrir l'itinéraire Google Maps vers l'institut au Pôle Santé Georges Guynemer (nouvel onglet)"
                                    >
                                        {t('contact.mapsBtn')}
                                    </a>
                                </div>
                            </div>

                            {/* Horaires */}
                            <div className="info-box">
                                <span className="box-badge">{t('contact.hoursBadge')}</span>
                                <h3>{t('contact.hoursTitle')}</h3>
                                <div className="hours-grid">
                                    <div className="hour-item">
                                        <span className="day">{t('footer.dayTue')}</span>
                                        <span className="hour">{formatHours(info?.hours_tue, '10:00 - 13:30 | 14:30 - 19:00')}</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">{t('footer.dayWed')}</span>
                                        <span className="hour">{formatHours(info?.hours_wed, '14:00 - 19:00')}</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">{t('footer.dayThu')}</span>
                                        <span className="hour">{formatHours(info?.hours_thu, '10:00 - 13:30 | 14:30 - 18:00')}</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">{t('footer.dayFri')}</span>
                                        <span className="hour">{formatHours(info?.hours_fri, '10:00 - 13:30 | 14:30 - 17:30')}</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">{t('footer.daySat')}</span>
                                        <span className="hour">{formatHours(info?.hours_sat, '09:30 - 14:00')}</span>
                                    </div>
                                    <div className="hour-item closed">
                                        <span className="day">{t('footer.daySunMon')}</span>
                                        <span className="hour">{sunMonValue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
