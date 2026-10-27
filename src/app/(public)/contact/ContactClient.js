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
            {/* Luminous Palace Hero */}
            <section className="contact-hero">
                <div className="container contact-hero-container">
                    <div className="contact-hero-badge">
                        <ShieldCheck size={14} className="hero-sparkle" />
                        <span>INSTITUT PRIVÉ • SALON-DE-PROVENCE</span>
                    </div>
                    <h1 className="contact-hero-title">
                        Me Contacter & <br />
                        <span className="title-serif">Venir à l&apos;Institut</span>
                    </h1>
                    <p className="contact-hero-sub">
                        Situé au sein du Pôle Santé Georges Guynemer à Salon-de-Provence, l&apos;institut vous accueille sur rendez-vous dans un cocon intime et sécurisant.
                    </p>
                    <div className="contact-hero-reassurance">
                        <span>Parking gratuit sur place</span>
                        <span className="reassurance-dot">•</span>
                        <span>Accès PMR</span>
                        <span className="reassurance-dot">•</span>
                        <span>Sur rendez-vous du Mardi au Samedi</span>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="contact-content-section">
                <div className="container">
                    <div className="contact-dual-layout">
                        {/* Formulaire à gauche */}
                        <div className="contact-form-column">
                            <ContactForm />
                        </div>

                        {/* Coordonnées & Horaires à droite */}
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

                            {/* Coordonnées directes */}
                            <div className="info-box">
                                <span className="box-badge">COORDONNÉES</span>
                                <h3>Contact direct</h3>
                                <ul className="info-list">
                                    <li>
                                        <div className="icon-circle">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <span className="info-label">Téléphone</span>
                                            <a href={`tel:${phoneTel}`} className="info-link-highlight">{phone}</a>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="icon-circle">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <span className="info-label">Email</span>
                                            <a href={`mailto:${email}`} className="info-link">{email}</a>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="icon-circle">
                                            <Instagram size={16} />
                                        </div>
                                        <div>
                                            <span className="info-label">Instagram</span>
                                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="info-link">
                                                @laparentheseharmonieuse
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Adresse & Parking */}
                            <div className="info-box">
                                <span className="box-badge">ACCÈS & PARKING</span>
                                <h3>Localisation</h3>
                                <div className="address-block">
                                    <MapPin size={18} className="map-icon" />
                                    <p>
                                        <strong>La Parenthèse Harmonieuse</strong><br />
                                        418 Avenue Georges Guynemer<br />
                                        Au sein du Pôle Santé Georges Guynemer<br />
                                        13300 Salon-de-Provence
                                    </p>
                                </div>

                                <div className="parking-alert">
                                    <Car size={16} className="car-icon" />
                                    <span>Plusieurs places de <strong>parking gratuit</strong> sont disponibles directement devant le pôle santé.</span>
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
                                <h3>Créneaux de soins</h3>
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
                                        <span className="day">Lundi & Dimanche</span>
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
