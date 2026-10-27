'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoHero from '@/components/VideoHero';
import { 
    Calendar, Sparkles, Star, MapPin, Clock, Phone, Heart, 
    Gift, ArrowRight, ShieldCheck, Check, Info, X, ChevronRight,
    User, Users
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
        { id: 'packs', label: 'Packs & Rituels' },
    ];

    const filteredServices = activeCategory === 'all' 
        ? services 
        : services.filter(s => s.category_slug === activeCategory);

    return (
        <div className="home-page">
            {/* 1. HERO VIDEO */}
            <VideoHero siteInfo={siteInfo} />

            {/* 2. VOS COUPS DE CŒUR (Inspiration Auberge de Beauté) */}
            <section className="section-coups-de-coeur" id="coups-de-coeur-section">
                <div className="container">
                    <div className="section-header-editorial">
                        <span className="editorial-kicker">SÉLECTION SIGNATURE DU SALON</span>
                        <h2 className="editorial-title">
                            Vos Coups de <span className="title-serif">Cœur</span>
                        </h2>
                        <div className="editorial-gold-line" />
                        <p className="editorial-lead">
                            Les rituels et modelages les plus plébiscités par nos clientes pour dénouer les tensions, apaiser l&apos;esprit et retrouver une harmonie profonde.
                        </p>

                        {/* Onglets Filtres Élégants */}
                        <div className="soins-filter-bar" role="tablist">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeCategory === cat.id}
                                    className={`soins-filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grille Style Auberge de Beauté (Cartes carrées/portrait épurées) */}
                    <div className="soins-auberge-grid">
                        {filteredServices.map((service) => (
                            <article key={service.id} className="soin-auberge-card">
                                <div className="soin-auberge-media">
                                    <Image
                                        src={service.image_url || '/images/massage-dos.jpg'}
                                        alt={service.title}
                                        width={420}
                                        height={360}
                                        className="soin-auberge-img"
                                    />
                                    {service.duration && (
                                        <span className="soin-auberge-duration">{service.duration}</span>
                                    )}
                                    {service.badge && (
                                        <span className="soin-auberge-badge">{service.badge}</span>
                                    )}
                                </div>

                                <div className="soin-auberge-body">
                                    <span className="soin-auberge-cat">{service.category || 'Massage Sur Mesure'}</span>
                                    <h3 className="soin-auberge-title">{service.title}</h3>
                                    
                                    <div className="soin-auberge-specs">
                                        {service.duration && (
                                            <div className="spec-item">
                                                <span className="spec-label">Durée</span>
                                                <span className="spec-val">{service.duration}</span>
                                            </div>
                                        )}
                                        <div className="spec-item">
                                            <span className="spec-label">Tarif</span>
                                            <span className="spec-val price-val">{service.price}</span>
                                        </div>
                                    </div>

                                    {/* Boutons Haute Beauté : RÉSERVER et OFFRIR côte à côte */}
                                    <div className="soin-auberge-actions">
                                        <a
                                            href={service.planity_url || planityUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-auberge-reserve"
                                        >
                                            RÉSERVER
                                        </a>
                                        <Link
                                            href="/carte-cadeau"
                                            className="btn-auberge-gift"
                                        >
                                            OFFRIR
                                        </Link>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedService(service)}
                                        className="btn-auberge-details"
                                    >
                                        <span>Détails &amp; bienfaits du soin →</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="soins-view-all-wrap">
                        <Link href="/carte-des-soins" className="btn-auberge-view-all">
                            <span>Consulter toute la carte des soins (tarifs &amp; protocoles)</span>
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. PRENDRE RENDEZ-VOUS (Signature Auberge de Beauté) */}
            <section className="section-auberge-rdv">
                <div className="container">
                    <div className="section-header-editorial">
                        <span className="editorial-kicker">DISPONIBILITÉS &amp; FORMULES</span>
                        <h2 className="editorial-title">
                            Prendre <span className="title-serif">Rendez-Vous</span>
                        </h2>
                        <div className="editorial-gold-line" />
                    </div>

                    <div className="rdv-triptych-grid">
                        {/* 1. Solo */}
                        <div className="rdv-card">
                            <div className="rdv-circle-icon">
                                <User size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="rdv-card-title">En Solo</h3>
                            <p className="rdv-card-text">
                                Un moment d&apos;évasion rien que pour vous. Déconnectez du quotidien le temps d&apos;un massage composé sur-mesure.
                            </p>
                            <a
                                href={planityUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-rdv-action"
                            >
                                RÉSERVER
                            </a>
                        </div>

                        {/* 2. Duo */}
                        <div className="rdv-card">
                            <div className="rdv-circle-icon">
                                <Users size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="rdv-card-title">En Duo / Complice</h3>
                            <p className="rdv-card-text">
                                Partagez une parenthèse de sérénité et de lâcher-prise en duo : entre amies, mère &amp; fille ou en couple.
                            </p>
                            <Link
                                href="/contact"
                                className="btn-rdv-action"
                            >
                                CONTACTEZ-NOUS
                            </Link>
                        </div>

                        {/* 3. Carte Cadeau */}
                        <div className="rdv-card">
                            <div className="rdv-circle-icon">
                                <Gift size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="rdv-card-title">J&apos;ai une Carte Cadeau</h3>
                            <p className="rdv-card-text">
                                Vous avez reçu une jolie pochette ou un bon numérique ? Activez votre séance et choisissez votre moment.
                            </p>
                            <Link
                                href="/contact"
                                className="btn-rdv-action"
                            >
                                PRENDRE CONTACT
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. TRIPTYQUE PHOTOGRAPHIQUE (Atmosphère & Histoire - comme Auberge de Beauté) */}
            <section className="section-auberge-triptych">
                <div className="triptych-row">
                    <Link href="/mon-approche" className="triptych-tile">
                        <Image
                            src="/images/spa-huiles.jpg"
                            alt="Mon Histoire & Approche"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="triptych-img"
                        />
                        <div className="triptych-overlay">
                            <span className="triptych-kicker">PHILOSOPHIE DU COCON</span>
                            <h3 className="triptych-title">MON HISTOIRE &amp; MON APPROCHE</h3>
                            <span className="triptych-cta">Découvrir le parcours →</span>
                        </div>
                    </Link>

                    <Link href="/carte-des-soins" className="triptych-tile">
                        <Image
                            src="/images/massage-detente.jpg"
                            alt="La Carte des Soins et Tarifs"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="triptych-img"
                        />
                        <div className="triptych-overlay">
                            <span className="triptych-kicker">RITUELS &amp; MASSAGES</span>
                            <h3 className="triptych-title">CARTE DES SOINS &amp; TARIFS</h3>
                            <span className="triptych-cta">Explorer tous les protocoles →</span>
                        </div>
                    </Link>

                    <Link href="/carte-cadeau" className="triptych-tile">
                        <Image
                            src="/images/maternite-douceur.jpg"
                            alt="Offrir une Carte Cadeau"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="triptych-img"
                        />
                        <div className="triptych-overlay">
                            <span className="triptych-kicker">ATTENTION DÉLICATE</span>
                            <h3 className="triptych-title">OFFRIR UNE PARENTHÈSE</h3>
                            <span className="triptych-cta">Pochettes &amp; bons en ligne →</span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 5. L'APPROCHE D'HARMONIE (Éditorial & Cocon Privatif) */}
            <section className="section-bienvenue" id="bienvenue-section">
                <div className="container">
                    <div className="bienvenue-grid">
                        {/* Portrait Harmonie - Cadre Architectural Rectangulaire Noble */}
                        <div className="bienvenue-media">
                            <div className="portrait-frame-bespoke">
                                <Image
                                    src="/images/harmonie-portrait.jpg"
                                    alt="Harmonie - Fondatrice de La Parenthèse Harmonieuse"
                                    width={480}
                                    height={580}
                                    className="portrait-img-bespoke"
                                    priority
                                />
                                <div className="portrait-matting" />
                                <div className="portrait-caption-box">
                                    <span className="caption-name">Harmonie</span>
                                    <span className="caption-sub">Fondatrice &amp; Praticienne Bien-Être Certifiée</span>
                                </div>
                            </div>
                        </div>

                        {/* Récit & Philosophie */}
                        <div className="bienvenue-content">
                            <span className="editorial-kicker">LE COCON BIEN-ÊTRE</span>
                            <h2 className="bienvenue-title">
                                Une écoute sincère, <br />
                                <span className="title-serif">un toucher d&apos;exception</span>
                            </h2>
                            <div className="editorial-gold-line left-aligned" />

                            <p className="bienvenue-lead">
                                Je vous accueille dans un petit cocon chaleureux, exclusivement dédié aux femmes, au Pôle Santé Guynemer à Salon-de-Provence.
                            </p>
                            <p className="bienvenue-p">
                                Après plus de 10 ans d&apos;exercice passionné au sein d&apos;instituts reconnus et de spas d&apos;hôtels étoilés, j&apos;ai souhaité créer un lieu à taille humaine, où l&apos;on ne se presse jamais.
                            </p>
                            <p className="bienvenue-p">
                                Chaque soin est pensé sur mesure, adapté à vos besoins physiques et émotionnels du moment. L&apos;écoute attentive, la douceur et la bienveillance sont au cœur de chaque rendez-vous, pour faire de ce moment une véritable bulle hors du temps.
                            </p>

                            {/* 3 Piliers Éditoriaux Aérés (Zéro icône cartoon) */}
                            <div className="editorial-pillars-list">
                                <div className="pillar-row">
                                    <span className="pillar-num">01</span>
                                    <div>
                                        <h4 className="pillar-heading">Gestuelle Sur-Mesure</h4>
                                        <p className="pillar-desc">Bilan attentif préalable pour cibler vos zones de tension et adapter le rythme ainsi que la pression.</p>
                                    </div>
                                </div>
                                <div className="pillar-row">
                                    <span className="pillar-num">02</span>
                                    <div>
                                        <h4 className="pillar-heading">Cocon Privatif Exclusif</h4>
                                        <p className="pillar-desc">Un espace intime et sécurisant dédié à une seule cliente à la fois pour un lâcher-prise total sans précipitation.</p>
                                    </div>
                                </div>
                                <div className="pillar-row">
                                    <span className="pillar-num">03</span>
                                    <div>
                                        <h4 className="pillar-heading">Cosmétiques Biologiques</h4>
                                        <p className="pillar-desc">Partenariats d&apos;excellence avec Nohèm (certifié BIO Ecocert) et Green Spa pour respecter votre peau et la planète.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bienvenue-actions">
                                <Link href="/mon-approche" className="btn-auberge-reserve">
                                    DÉCOUVRIR MON APPROCHE
                                </Link>
                                <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-auberge-gift">
                                    PRENDRE RENDEZ-VOUS
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. AVIS & RETOURS CLIENTES (Livre d'or Élégance) */}
            <section className="section-avis">
                <div className="container">
                    <div className="section-header-editorial">
                        <div className="stars-badge-clean">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="star-filled" fill="#A68052" stroke="#A68052" />
                            ))}
                        </div>
                        <span className="editorial-kicker">LIVRE D&apos;OR &amp; TÉMOIGNAGES</span>
                        <h2 className="editorial-title">
                            Ce que disent <span className="title-serif">nos clientes</span>
                        </h2>
                        <div className="editorial-gold-line" />
                        <p className="editorial-lead">
                            Note d&apos;excellence de <strong>5,0 / 5</strong> basée sur les avis vérifiés de nos clientes sur Planity et Google.
                        </p>
                    </div>

                    <div className="testimonials-grid-bespoke">
                        {testimonials.map((testi) => (
                            <div key={testi.id} className="testimonial-card-bespoke">
                                <div className="testi-stars-row">
                                    {[...Array(testi.rating || 5)].map((_, i) => (
                                        <Star key={i} size={14} className="star-filled" fill="#A68052" stroke="#A68052" />
                                    ))}
                                </div>
                                <p className="testi-comment-bespoke">&ldquo;{testi.comment}&rdquo;</p>
                                <div className="testi-author-footer">
                                    <div>
                                        <span className="testi-author-name">{testi.author}</span>
                                        {testi.treatment_name && (
                                            <span className="testi-treatment-sub">{testi.treatment_name}</span>
                                        )}
                                    </div>
                                    <span className="testi-verified-tag">{testi.source || 'Avis vérifié'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="avis-cta-wrap">
                        <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-auberge-view-all">
                            <span>Lire tous les avis ou déposer votre témoignage</span>
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* 7. L'ÉCRIN DU SALON (Salon-de-Provence) */}
            <section className="section-institut">
                <div className="container">
                    <div className="institut-grid">
                        <div className="institut-content">
                            <span className="editorial-kicker">LE LIEU</span>
                            <h2 className="institut-title">
                                Un Écrin de Calme <br />
                                <span className="title-serif">au Pôle Santé Guynemer</span>
                            </h2>
                            <div className="editorial-gold-line left-aligned" />

                            <p className="institut-lead">
                                Situé à Salon-de-Provence, l&apos;institut est facilement accessible avec un parking gratuit réservé devant le bâtiment.
                            </p>
                            <p className="institut-p">
                                La cabine de soin a été minutieusement pensée pour stimuler vos sens tout en apaisant le système nerveux : table de massage chauffée et grand confort, éclairage ambré tamisé, musique douce et arômes subtils d&apos;huiles essentielles bio.
                            </p>

                            <div className="institut-highlights-bespoke">
                                <div className="highlight-row">
                                    <MapPin size={16} className="highlight-icon" />
                                    <span>418 Avenue Georges Guynemer, 13300 Salon-de-Provence</span>
                                </div>
                                <div className="highlight-row">
                                    <ShieldCheck size={16} className="highlight-icon" />
                                    <span>Parking gratuit et places réservées devant l&apos;entrée</span>
                                </div>
                                <div className="highlight-row">
                                    <Clock size={16} className="highlight-icon" />
                                    <span>Sur rendez-vous du Mardi au Samedi</span>
                                </div>
                            </div>

                            <div className="institut-action">
                                <a href={`tel:${phoneTel}`} className="btn-auberge-reserve">
                                    <Phone size={15} style={{ marginRight: '6px' }} />
                                    APPELER AU {phone}
                                </a>
                            </div>
                        </div>

                        <div className="institut-gallery-bespoke">
                            <div className="gallery-main-img-bespoke">
                                <Image
                                    src="/images/cabine-soin.jpg"
                                    alt="La cabine de soin La Parenthèse Harmonieuse"
                                    width={560}
                                    height={400}
                                    className="inst-img-bespoke"
                                />
                                <div className="gallery-caption-overlay">
                                    <span>Cabine privative · Ambiance feutrée &amp; table chauffante</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL DÉTAILS SOIN */}
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
                                    <h4>Bienfaits &amp; Spécificités</h4>
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
        </div>
    );
}
