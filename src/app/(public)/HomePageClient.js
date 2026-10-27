'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoHero from '@/components/VideoHero';
import { 
    Calendar, Sparkles, Star, MapPin, Clock, Phone, Heart, 
    Gift, ArrowRight, ShieldCheck, Check, Info, X, ChevronRight 
} from 'lucide-react';
import './home.css';

export default function HomePageClient({ siteInfo, services = [], testimonials = [] }) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);

    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const reviewsUrl = siteInfo?.google_reviews || 'https://g.page/r/CQUzqKQ2SgYrEAE/review';

    const categories = [
        { id: 'all', label: 'Tous les soins' },
        { id: 'massages', label: 'Massages sur mesure' },
        { id: 'drainage', label: 'Drainage & Madéro' },
        { id: 'kobido', label: 'Kobido Liftant' },
        { id: 'visage', label: 'Soins Visage Bio' },
        { id: 'maternite', label: 'Femmes Enceintes' },
        { id: 'packs', label: 'Packs & Forfaits' },
    ];

    const filteredServices = activeCategory === 'all' 
        ? services 
        : services.filter(s => s.category_slug === activeCategory);

    return (
        <div className="home-page">
            {/* 1. HERO VIDEO */}
            <VideoHero siteInfo={siteInfo} />

            {/* 2. BIENVENUE & APPROCHE */}
            <section className="section-bienvenue" id="bienvenue-section">
                <div className="container">
                    <div className="bienvenue-grid">
                        {/* Photo Harmonie */}
                        <div className="bienvenue-media">
                            <div className="portrait-frame">
                                <Image
                                    src="/images/harmonie-portrait.jpg"
                                    alt="Harmonie - La Parenthèse Harmonieuse"
                                    width={480}
                                    height={580}
                                    className="portrait-img"
                                    priority
                                />
                                <div className="portrait-aura" />
                                <div className="portrait-badge">
                                    <Sparkles size={16} className="badge-sparkle" />
                                    <div>
                                        <span className="badge-name">Harmonie</span>
                                        <span className="badge-title">Fondatrice & Praticienne</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Texte de bienvenue */}
                        <div className="bienvenue-content">
                            <div className="section-tag">
                                <span>LE COCON BIEN-ÊTRE</span>
                            </div>
                            <h2 className="section-title">
                                Bienvenue à <br />
                                <span className="title-serif">La Parenthèse Harmonieuse</span>
                            </h2>
                            <p className="bienvenue-lead">
                                Je vous accueille dans un petit cocon chaleureux, exclusivement dédié aux femmes.
                            </p>
                            <p className="bienvenue-p">
                                Après plus de 10 ans d&apos;exercice passionné au sein d&apos;instituts reconnus et de spas d&apos;hôtels étoilés, j&apos;ai souhaité créer un lieu à taille humaine, où l&apos;on ne se presse jamais.
                            </p>
                            <p className="bienvenue-p">
                                Chaque soin est pensé sur mesure, adapté à vos besoins physiques et émotionnels du moment. L&apos;écoute attentive, la douceur et la bienveillance sont au cœur de chaque rendez-vous, pour faire de ce moment une véritable bulle hors du temps.
                            </p>

                            {/* 4 Piliers */}
                            <div className="pillars-grid">
                                <div className="pillar-item">
                                    <div className="pillar-icon-box">
                                        <Heart size={18} />
                                    </div>
                                    <div>
                                        <h4>Sur Mesure</h4>
                                        <p>Bilan préalable pour adapter les pressions et les zones ciblées.</p>
                                    </div>
                                </div>
                                <div className="pillar-item">
                                    <div className="pillar-icon-box">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <h4>100% Dédié aux Femmes</h4>
                                        <p>Un espace privatif intime et sécurisant pour lâcher prise.</p>
                                    </div>
                                </div>
                                <div className="pillar-item">
                                    <div className="pillar-icon-box">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <h4>Cosmétiques BIO</h4>
                                        <p>Partenaires certifiés : Nohèm (BIO Ecocert) et Green Spa.</p>
                                    </div>
                                </div>
                                <div className="pillar-item">
                                    <div className="pillar-icon-box">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <h4>Prendre le Temps</h4>
                                        <p>Aucun enchaînement à la chaîne, un vrai sas de décompression.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bienvenue-actions">
                                <Link href="/mon-approche" className="btn-approach">
                                    <span>Découvrir mon approche</span>
                                    <ArrowRight size={16} />
                                </Link>
                                <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-reserve-inline">
                                    <Calendar size={16} />
                                    <span>Prendre rendez-vous</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CARTE DES SOINS (Auberge de Beauté aesthetic) */}
            <section className="section-soins" id="soins-section">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-tag">RITUELS & EXPERTISE</span>
                        <h2 className="section-title">
                            Nos Soins <span className="title-serif">Coups de Cœur</span>
                        </h2>
                        <p className="section-subtitle">
                            Chaque prestation allie gestuelle experte, écoute et produits biologiques d&apos;excellence.
                        </p>

                        {/* Onglets Filtres */}
                        <div className="category-tabs" role="tablist">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeCategory === cat.id}
                                    className={`cat-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grille de cartes soins */}
                    <div className="soins-grid">
                        {filteredServices.map((service) => (
                            <div key={service.id} className="soin-card">
                                <div className="soin-card-media">
                                    <Image
                                        src={service.image_url || '/images/massage-dos.jpg'}
                                        alt={service.title}
                                        width={400}
                                        height={260}
                                        className="soin-card-img"
                                    />
                                    {service.badge && (
                                        <span className="soin-badge">{service.badge}</span>
                                    )}
                                    {service.duration && (
                                        <span className="soin-duration-tag">
                                            <Clock size={12} />
                                            {service.duration}
                                        </span>
                                    )}
                                </div>

                                <div className="soin-card-body">
                                    <span className="soin-category-label">{service.category}</span>
                                    <h3 className="soin-card-title">{service.title}</h3>
                                    {service.subtitle && (
                                        <p className="soin-card-subtitle">{service.subtitle}</p>
                                    )}
                                    <p className="soin-card-desc">
                                        {service.description.length > 150 
                                            ? `${service.description.substring(0, 150)}...` 
                                            : service.description}
                                    </p>

                                    <div className="soin-card-footer">
                                        <div className="soin-price-wrap">
                                            <span className="soin-price-label">Tarif</span>
                                            <span className="soin-price-val">{service.price}</span>
                                        </div>

                                        <div className="soin-actions-wrap">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedService(service)}
                                                className="btn-card-details"
                                                title="Voir les détails complets"
                                            >
                                                <Info size={14} />
                                                <span>Détails</span>
                                            </button>

                                            <a
                                                href={service.planity_url || planityUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-card-reserve"
                                            >
                                                <span>Réserver</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="soins-view-all">
                        <Link href="/carte-des-soins" className="btn-view-all-soins">
                            <span>Consulter toute la carte des soins (tarifs & protocoles)</span>
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. MODAL DÉTAILS SOIN */}
            {selectedService && (
                <div className="service-modal-backdrop" onClick={() => setSelectedService(null)}>
                    <div className="service-modal-box" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={() => setSelectedService(null)}
                            aria-label="Fermer"
                        >
                            <X size={20} />
                        </button>

                        <div className="modal-header">
                            <span className="modal-category">{selectedService.category}</span>
                            <h3 className="modal-title">{selectedService.title}</h3>
                            {selectedService.subtitle && (
                                <p className="modal-subtitle">{selectedService.subtitle}</p>
                            )}
                        </div>

                        <div className="modal-meta-pills">
                            {selectedService.duration && (
                                <span className="meta-pill">
                                    <Clock size={14} />
                                    <span>Durée : {selectedService.duration}</span>
                                </span>
                            )}
                            <span className="meta-pill price-pill">
                                <span>Tarif : {selectedService.price}</span>
                            </span>
                        </div>

                        <div className="modal-content">
                            <h4>Description du soin</h4>
                            <p>{selectedService.description}</p>

                            {selectedService.benefits && (
                                <>
                                    <h4>Bienfaits & Spécificités</h4>
                                    <p>{selectedService.benefits}</p>
                                </>
                            )}

                            {selectedService.contraindications && (
                                <div className="modal-contraindications">
                                    <h4>⚠️ Contre-indications à noter</h4>
                                    <p>{selectedService.contraindications}</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <a
                                href={selectedService.planity_url || planityUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-btn-planity"
                            >
                                <Calendar size={16} />
                                <span>Réserver ce soin sur Planity</span>
                            </a>
                            <Link href="/contact" className="modal-btn-contact" onClick={() => setSelectedService(null)}>
                                Poser une question
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. CARTE CADEAU BANNER */}
            <section className="section-cadeau-banner">
                <div className="container">
                    <div className="cadeau-banner-card">
                        <div className="cadeau-banner-content">
                            <div className="cadeau-icon-wrap">
                                <Gift size={28} />
                            </div>
                            <span className="section-tag-light">IDÉE CADEAU</span>
                            <h2 className="cadeau-title">
                                Offrir une <span className="title-serif">Parenthèse de Bien-être</span>
                            </h2>
                            <p className="cadeau-desc">
                                Anniversaire, grossesse, fête, remerciement ou simple envie de faire plaisir... 
                                Offrez un moment de pure détente et de reconnexion à soi.
                            </p>
                            <div className="cadeau-formats">
                                <div className="format-item">
                                    <Check size={16} className="format-check" />
                                    <span><strong>Carte physique</strong> : Jolie pochette cadeau à retirer à l&apos;institut</span>
                                </div>
                                <div className="format-item">
                                    <Check size={16} className="format-check" />
                                    <span><strong>Carte numérique</strong> : Envoi instantané par email via Planity</span>
                                </div>
                            </div>
                            <div className="cadeau-actions">
                                <Link href="/carte-cadeau" className="btn-cadeau-details">
                                    <span>En savoir plus sur les cartes cadeaux</span>
                                </Link>
                                <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-cadeau-planity">
                                    <span>Offrir directement sur Planity</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. AVIS & RETOURS CLIENTES */}
            <section className="section-avis">
                <div className="container">
                    <div className="section-header-center">
                        <div className="stars-badge">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className="star-filled" fill="#B9925E" />
                            ))}
                        </div>
                        <span className="section-tag">VOS RETOURS</span>
                        <h2 className="section-title">
                            Ce que disent <span className="title-serif">nos clientes</span>
                        </h2>
                        <p className="section-subtitle">
                            Note de <strong>5,0 / 5</strong> basée sur les avis vérifiés de la patientèle sur Planity et Google.
                        </p>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((testi) => (
                            <div key={testi.id} className="testimonial-card">
                                <div className="testi-stars">
                                    {[...Array(testi.rating || 5)].map((_, i) => (
                                        <Star key={i} size={15} className="star-filled" fill="#B9925E" />
                                    ))}
                                </div>
                                <p className="testi-comment">&ldquo;{testi.comment}&rdquo;</p>
                                <div className="testi-meta">
                                    <div className="testi-author-info">
                                        <span className="testi-author">{testi.author}</span>
                                        {testi.treatment_name && (
                                            <span className="testi-treatment">{testi.treatment_name}</span>
                                        )}
                                    </div>
                                    <span className="testi-source-badge">{testi.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="avis-cta-wrap">
                        <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-google-review">
                            <Star size={16} />
                            <span>Lire tous les avis ou laisser un témoignage</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* 7. L'INSTITUT & AMBIANCE */}
            <section className="section-institut">
                <div className="container">
                    <div className="institut-grid">
                        <div className="institut-content">
                            <span className="section-tag">LE LIEU</span>
                            <h2 className="section-title">
                                Un Écrin de Calme <br />
                                <span className="title-serif">au Pôle Santé Guynemer</span>
                            </h2>
                            <p className="institut-lead">
                                Situé à Salon-de-Provence, l&apos;institut est facilement accessible avec un parking gratuit réservé devant le bâtiment.
                            </p>
                            <p className="institut-p">
                                La cabine de soin a été minutieusement aménagée pour stimuler vos sens tout en apaisant le système nerveux : table de massage chauffée et grand confort, éclairage ambré tamisé, musique douce et arômes subtils d&apos;huiles essentielles bio.
                            </p>

                            <div className="institut-highlights">
                                <div className="highlight-pill">
                                    <MapPin size={16} />
                                    <span>418 Avenue Georges Guynemer, 13300 Salon-de-Provence</span>
                                </div>
                                <div className="highlight-pill">
                                    <ShieldCheck size={16} />
                                    <span>Parking gratuit et places réservées</span>
                                </div>
                                <div className="highlight-pill">
                                    <Clock size={16} />
                                    <span>Sur rendez-vous du Mardi au Samedi</span>
                                </div>
                            </div>

                            <div className="institut-action">
                                <a href={`tel:${phoneTel}`} className="btn-contact-institut">
                                    <Phone size={16} />
                                    <span>Appeler au {phone}</span>
                                </a>
                            </div>
                        </div>

                        <div className="institut-gallery">
                            <div className="gallery-main-img">
                                <Image
                                    src="/images/cabine-soin.jpg"
                                    alt="La cabine de soin La Parenthèse Harmonieuse"
                                    width={500}
                                    height={340}
                                    className="inst-img"
                                />
                            </div>
                            <div className="gallery-sub-row">
                                <div className="gallery-sub-img">
                                    <Image
                                        src="/images/soin-1.jpg"
                                        alt="Produits de soins bio et espace beauté"
                                        width={240}
                                        height={180}
                                        className="inst-img"
                                    />
                                </div>
                                <div className="gallery-sub-img">
                                    <Image
                                        src="/images/massage-dos.jpg"
                                        alt="Pratique du massage à La Parenthèse Harmonieuse"
                                        width={240}
                                        height={180}
                                        className="inst-img"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
