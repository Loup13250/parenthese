'use client';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Clock, Instagram, Mail, Calendar, ShieldCheck, Car } from 'lucide-react';
import './contact.css';

export default function ContactClient({ info }) {
    const phone = info?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const email = info?.contact_email || 'laparentheseharmonieuse@gmail.com';
    const planityUrl = info?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const instagramUrl = info?.instagram || 'https://www.instagram.com/laparentheseharmonieuse/';

    return (
        <main className="contact-page-main">
            <section className="contact-content-section">
                <div className="container">
                    {/* Header compact intégré (Zéro espace vide en haut) */}
                    <div className="contact-compact-header-wrap">
                        <div>
                            <span className="contact-kicker">INSTITUT PRIVÉ • SALON-DE-PROVENCE</span>
                            <h1 className="contact-compact-title">
                                Me Contacter &amp; <span className="title-serif">Venir à l&apos;Institut</span>
                            </h1>
                        </div>
                        <div className="contact-badges-strip">
                            <span className="badge-chip">Parking gratuit</span>
                            <span className="badge-chip-dot">•</span>
                            <span className="badge-chip">Accès PMR</span>
                            <span className="badge-chip-dot">•</span>
                            <span className="badge-chip">Mardi au Samedi sur RDV</span>
                        </div>
                    </div>

                    <div className="contact-dual-layout">
                        {/* Formulaire de contact à gauche */}
                        <div className="contact-form-column">
                            <ContactForm />
                        </div>

                        {/* Coordonnées, Planning & Accès à droite - Parfaitement alignés */}
                        <div className="contact-info-column">
                            {/* Rendez-vous prioritaire Planity */}
                            <div className="info-box planity-box">
                                <span className="box-badge">RÉSERVATION 24H/24</span>
                                <h3>Prendre rendez-vous en ligne</h3>
                                <p>
                                    Le planning Planity est synchronisé en temps réel. Choisissez directement le soin, le jour et l&apos;heure qui vous conviennent le mieux.
                                </p>
                                <a
                                    href={planityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-planity-contact"
                                >
                                    <Calendar size={16} />
                                    <span>Accéder au planning Planity</span>
                                </a>
                            </div>

                            {/* Coordonnées directes - Alignement icône + texte impeccable */}
                            <div className="info-box">
                                <span className="box-badge">COORDONNÉES</span>
                                <h3>Contact direct</h3>
                                <div className="info-list-stacked">
                                    <div className="info-item-row">
                                        <div className="icon-circle">
                                            <Phone size={17} />
                                        </div>
                                        <div className="info-item-text">
                                            <span className="info-label">Téléphone</span>
                                            <a href={`tel:${phoneTel}`} className="info-link-highlight">{phone}</a>
                                        </div>
                                    </div>

                                    <div className="info-item-row">
                                        <div className="icon-circle">
                                            <Mail size={17} />
                                        </div>
                                        <div className="info-item-text">
                                            <span className="info-label">Email</span>
                                            <a href={`mailto:${email}`} className="info-link">{email}</a>
                                        </div>
                                    </div>

                                    <div className="info-item-row">
                                        <div className="icon-circle">
                                            <Instagram size={17} />
                                        </div>
                                        <div className="info-item-text">
                                            <span className="info-label">Instagram</span>
                                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="info-link">
                                                @laparentheseharmonieuse
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Adresse & Parking */}
                            <div className="info-box">
                                <span className="box-badge">ACCÈS &amp; PARKING</span>
                                <h3>Localisation</h3>
                                <div className="info-item-row address-row">
                                    <div className="icon-circle">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="info-item-text">
                                        <p className="address-text">
                                            <strong>La Parenthèse Harmonieuse</strong><br />
                                            418 Avenue Georges Guynemer<br />
                                            Au sein du Pôle Santé Georges Guynemer<br />
                                            13300 Salon-de-Provence
                                        </p>
                                    </div>
                                </div>

                                <div className="parking-alert-row">
                                    <div className="icon-circle icon-circle-small">
                                        <Car size={16} />
                                    </div>
                                    <div className="info-item-text">
                                        <span>Places de <strong>parking gratuit</strong> réservées devant le pôle santé · Accès PMR de plain-pied.</span>
                                    </div>
                                </div>

                                <div className="map-link-wrap">
                                    <a
                                        href="https://www.google.com/maps?daddr=43.62820135848179,5.104028208438731"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-open-maps"
                                    >
                                        Ouvrir l&apos;itinéraire Google Maps
                                    </a>
                                </div>
                            </div>

                            {/* Horaires */}
                            <div className="info-box">
                                <span className="box-badge">HORAIRES D&apos;OUVERTURE</span>
                                <h3>Créneaux de soins (sur RDV)</h3>
                                <div className="hours-grid">
                                    <div className="hour-item">
                                        <span className="day">Mardi</span>
                                        <span className="hour">10:00 - 13:30 | 14:30 - 19:00</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">Mercredi</span>
                                        <span className="hour">14:00 - 19:00</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">Jeudi</span>
                                        <span className="hour">10:00 - 13:30 | 14:30 - 18:00</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">Vendredi</span>
                                        <span className="hour">10:00 - 13:30 | 14:30 - 17:30</span>
                                    </div>
                                    <div className="hour-item">
                                        <span className="day">Samedi</span>
                                        <span className="hour">09:30 - 14:00</span>
                                    </div>
                                    <div className="hour-item closed">
                                        <span className="day">Lundi &amp; Dimanche</span>
                                        <span className="hour">Fermé</span>
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
