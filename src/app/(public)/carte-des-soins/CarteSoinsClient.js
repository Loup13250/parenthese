'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Gift, Info, Check, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import './carte-soins.css';

export default function CarteSoinsClient({ services = [], siteInfo }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedCardId, setExpandedCardId] = useState(null);

    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';

    const categories = [
        { id: 'all', label: 'Tous les rituels' },
        { id: 'massages', label: 'Massages sur mesure' },
        { id: 'drainage', label: 'Drainage & Madéro' },
        { id: 'kobido', label: 'Massage Kobido' },
        { id: 'visage', label: 'Soins visage Nohèm' },
        { id: 'maternite', label: 'Spécial Maternité' },
        { id: 'packs', label: 'Packs & Forfaits' },
    ];

    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter(s => s.category_slug === selectedCategory);

    const toggleExpand = (id) => {
        setExpandedCardId(expandedCardId === id ? null : id);
    };

    return (
        <div className="carte-soins-page">
            {/* Luminous Palace Hero */}
            <section className="carte-hero">
                <div className="container carte-hero-container">
                    <div className="carte-hero-badge">
                        <Sparkles size={14} className="hero-sparkle" />
                        <span>RITUELS & EXPERTISE SUR MESURE</span>
                    </div>
                    <h1 className="carte-hero-title">
                        Carte des Soins <br />
                        <span className="title-serif">& Massages d&apos;Excellence</span>
                    </h1>
                    <p className="carte-hero-sub">
                        Chaque soin est un moment unique sur mesure, réalisé exclusivement avec des huiles et cosmétiques certifiés BIO Nohèm et Green Spa dans un cocon privatif dédié aux femmes.
                    </p>
                    <div className="carte-hero-reassurance">
                        <span>Institut exclusivement féminin</span>
                        <span className="reassurance-dot">•</span>
                        <span>Sur rendez-vous</span>
                        <span className="reassurance-dot">•</span>
                        <span>Parking gratuit</span>
                    </div>
                </div>
            </section>

            {/* Content & Filters */}
            <section className="carte-content-section">
                <div className="container">
                    {/* Category Buttons */}
                    <div className="category-filter-bar">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Notice on appointments */}
                    <div className="booking-info-alert">
                        <Info size={20} className="alert-icon" />
                        <div>
                            <strong>Réservation en ligne 24h/24 & 7j/7 :</strong> Choisissez votre créneau en toute liberté sur Planity. Si vous hésitez entre deux soins, un temps d&apos;échange préalable est systématiquement prévu en début de séance pour adapter le protocole à vos envies et vos tensions.
                        </div>
                    </div>

                    {/* Treatments Catalogue Grid */}
                    <div className="soins-catalogue-grid">
                        {filteredServices.map((service) => {
                            const isExpanded = expandedCardId === service.id;
                            const imageSrc = service.image_url || '/images/massage-dos.jpg';

                            return (
                                <article key={service.id} className="catalogue-item-card">
                                    {/* Image with zoom effect */}
                                    <div className="catalogue-media">
                                        <Image
                                            src={imageSrc}
                                            alt={service.title}
                                            width={500}
                                            height={280}
                                            className="catalogue-img"
                                        />
                                        {service.badge && (
                                            <span className="catalogue-badge">{service.badge}</span>
                                        )}
                                        {service.duration && (
                                            <span className="catalogue-duration">
                                                <Clock size={12} />
                                                <span>{service.duration}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="catalogue-body">
                                        <div className="card-top-row">
                                            <span className="cat-chip">{service.category}</span>
                                            <span className="price-tag">{service.price}</span>
                                        </div>

                                        <h2 className="item-title">{service.title}</h2>
                                        {service.subtitle && (
                                            <p className="item-sub">{service.subtitle}</p>
                                        )}

                                        <div className="item-description">
                                            <p>{service.description}</p>
                                        </div>

                                        {/* Collapsible details (benefits & contraindications) */}
                                        {isExpanded && (
                                            <div className="expanded-details">
                                                {service.benefits && (
                                                    <div className="details-block">
                                                        <h4>✨ Les bienfaits du soin :</h4>
                                                        <p>{service.benefits}</p>
                                                    </div>
                                                )}

                                                {service.contraindications && (
                                                    <div className="details-block warning-block">
                                                        <h4><AlertCircle size={15} /> Contre-indications :</h4>
                                                        <p>{service.contraindications}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="card-actions-row">
                                            {(service.benefits || service.contraindications) && (
                                                <button
                                                    type="button"
                                                    className="btn-toggle-expand"
                                                    onClick={() => toggleExpand(service.id)}
                                                >
                                                    <span>{isExpanded ? 'Moins de détails' : 'Protocole & bienfaits'}</span>
                                                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                                </button>
                                            )}

                                            <div className="actions-buttons-group">
                                                <Link
                                                    href={`/carte-cadeau?soin=${encodeURIComponent(service.title)}`}
                                                    className="btn-offrir-card"
                                                    title="Offrir ce soin en bon cadeau"
                                                >
                                                    <Gift size={14} />
                                                    <span>Offrir</span>
                                                </Link>

                                                <a
                                                    href={service.planity_url || planityUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-reserver-direct"
                                                >
                                                    <Calendar size={14} />
                                                    <span>Réserver sur Planity</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Bottom reassurance card */}
                    <div className="carte-bottom-reassurance">
                        <div className="reassurance-card">
                            <span className="section-tag">ACCOMPAGNEMENT DÉDIÉ</span>
                            <h3>Vous hésitez sur le soin idéal ?</h3>
                            <p>
                                Harmonie vous guide volontiers. Vous pouvez réserver un créneau gratuit de <strong>Bilan Personnalisé</strong> (30 min) à l&apos;institut, ou la joindre par téléphone au <strong>{siteInfo?.phone || '06 51 65 21 42'}</strong>.
                            </p>
                            <div className="reassurance-actions">
                                <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-book-gold">
                                    <Calendar size={16} />
                                    <span>Prendre RDV Bilan sur Planity</span>
                                </a>
                                <Link href="/contact" className="btn-contact-simple">
                                    Poser une question par message
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
