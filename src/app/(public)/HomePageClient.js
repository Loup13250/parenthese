'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoHero from '@/components/VideoHero';
import { useLanguage } from '@/context/LanguageContext';
import {
    Calendar, Star, MapPin, Clock, Phone,
    Gift, ArrowRight, ShieldCheck, X, ChevronRight,
    Sparkles
} from 'lucide-react';
import './home.css';

const isDynamicImg = (src) => typeof src === 'string' && (src.startsWith('/api/media/') || src.startsWith('http'));

export default function HomePageClient({ siteInfo, services = [], testimonials = [] }) {
    const [selectedService, setSelectedService] = useState(null);
    const { t, trans } = useLanguage();

    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const reviewsUrl = siteInfo?.google_reviews || 'https://g.page/r/CQUzqKQ2SgYrEAE/review';
    const portraitSrc = siteInfo?.about_image || '/images/harmonie-portrait.jpg';
    const trip1Image = siteInfo?.home_trip1_image || '/images/spa-huiles.jpg';
    const trip2Image = siteInfo?.home_trip2_image || '/images/massage-detente.jpg';
    const trip3Image = siteInfo?.home_trip3_image || '/images/maternite-douceur.jpg';
    const institutImage = siteInfo?.home_institut_image || '/images/plaque-institut.png';

    const addressLine = trans(siteInfo, 'address') || '418 Avenue Georges Guynemer, 13300 Salon-de-Provence';
    const fullAddress = addressLine.includes('Salon-de-Provence')
        ? addressLine
        : `${addressLine}, ${siteInfo?.postal_code || '13300'} ${siteInfo?.city || 'Salon-de-Provence'}`;
    const parkingText = siteInfo?.parking_info || "Parking gratuit et places réservées devant l'entrée";

    const maxServicesSetting = siteInfo?.home_featured_services_count;
    const maxServices = maxServicesSetting === 'all' ? 999 : parseInt(maxServicesSetting || '6', 10) || 6;
    const featuredList = services.filter((s) => s.is_featured);
    const signatureServices = featuredList.length > 0 ? featuredList.slice(0, maxServices) : services.slice(0, Math.min(3, maxServices));

    const maxTestimonialsSetting = siteInfo?.home_testimonials_count;
    const maxTestimonials = maxTestimonialsSetting === 'all' ? 999 : parseInt(maxTestimonialsSetting || '3', 10) || 3;
    const limitedTestimonials = testimonials.slice(0, maxTestimonials);

    useEffect(() => {
        if (!selectedService) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedService(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [selectedService]);

    return (
        <main id="main-content" className="home-page">
            {/* 1. HERO VIDEO */}
            <VideoHero siteInfo={siteInfo} />

            {/* 2. LE COCON BIEN-ÊTRE */}
            <section className="section-bienvenue" id="bienvenue-section">
                <div className="container">
                    <div className="bienvenue-grid">
                        {/* Portrait Harmonie */}
                        <div className="bienvenue-media">
                            <div className="portrait-frame-bespoke">
                                <Image
                                    src={portraitSrc}
                                    alt="Harmonie, fondatrice et praticienne certifiée de La Parenthèse Harmonieuse"
                                    width={480}
                                    height={580}
                                    className="portrait-img-bespoke"
                                    unoptimized={isDynamicImg(portraitSrc)}
                                />
                                <div className="portrait-matting" />
                                <div className="portrait-caption-box">
                                    <span className="caption-name">Harmonie</span>
                                    <span className="caption-sub">{t('home.portraitRole')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Récit & Philosophie */}
                        <div className="bienvenue-content">
                            <span className="editorial-kicker">{t('home.welcomeKicker')}</span>
                            <h2 className="bienvenue-title">
                                {t('home.welcomeTitle')} <br />
                                <span className="title-serif">{t('home.welcomeTitleItalic')}</span>
                            </h2>
                            <div className="editorial-gold-line left-aligned" />

                            <p className="bienvenue-lead">{t('home.welcomeLead')}</p>
                            <p className="bienvenue-p">{t('home.welcomeP1')}</p>
                            <p className="bienvenue-p">{t('home.welcomeP2')}</p>

                            <div className="editorial-pillars-list">
                                <div className="pillar-row">
                                    <div className="pillar-bullet" aria-hidden="true" />
                                    <div>
                                        <h3 className="pillar-heading">{t('home.pillar1Title')}</h3>
                                        <p className="pillar-desc">{t('home.pillar1Desc')}</p>
                                    </div>
                                </div>
                                <div className="pillar-row">
                                    <div className="pillar-bullet" aria-hidden="true" />
                                    <div>
                                        <h3 className="pillar-heading">{t('home.pillar2Title')}</h3>
                                        <p className="pillar-desc">{t('home.pillar2Desc')}</p>
                                    </div>
                                </div>
                                <div className="pillar-row">
                                    <div className="pillar-bullet" aria-hidden="true" />
                                    <div>
                                        <h3 className="pillar-heading">{t('home.pillar3Title')}</h3>
                                        <p className="pillar-desc">{t('home.pillar3Desc')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bienvenue-actions">
                                <Link href="/mon-approche" className="btn-auberge-reserve" aria-label="Découvrir l'approche bien-être et le parcours d'Harmonie">
                                    {t('home.discoverApproachBtn')}
                                </Link>
                                <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-auberge-gift" aria-label="Prendre rendez-vous en ligne sur Planity (ouvre un nouvel onglet)">
                                    {t('nav.bookBtn')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. BANDEROLE TRIPTYQUE PHOTOGRAPHIQUE */}
            <section className="section-auberge-triptych">
                <div className="triptych-row">
                    <Link href="/mon-approche" className="triptych-tile">
                        <Image
                            src={trip1Image}
                            alt={t('home.trip1Title')}
                            fill
                            sizes="(max-width: 860px) 100vw, 33vw"
                            className="triptych-img"
                            unoptimized={isDynamicImg(trip1Image)}
                        />
                        <div className="triptych-overlay">
                            <span className="triptych-kicker">{t('home.trip1Kicker')}</span>
                            <h3 className="triptych-title">{t('home.trip1Title')}</h3>
                            <span className="triptych-cta">{t('home.trip1Cta')}</span>
                        </div>
                    </Link>

                    <Link href="/carte-des-soins" className="triptych-tile">
                        <Image
                            src={trip2Image}
                            alt={t('home.trip2Title')}
                            fill
                            sizes="(max-width: 860px) 100vw, 33vw"
                            className="triptych-img"
                            unoptimized={isDynamicImg(trip2Image)}
                        />
                        <div className="triptych-overlay">
                            <span className="triptych-kicker">{t('home.trip2Kicker')}</span>
                            <h3 className="triptych-title">{t('home.trip2Title')}</h3>
                            <span className="triptych-cta">{t('home.trip2Cta')}</span>
                        </div>
                    </Link>

                    <Link href="/carte-cadeau" className="triptych-tile">
                        <Image
                            src={trip3Image}
                            alt={t('home.trip3Title')}
                            fill
                            sizes="(max-width: 860px) 100vw, 33vw"
                            className="triptych-img"
                            unoptimized={isDynamicImg(trip3Image)}
                        />
                        <div className="triptych-overlay">
                            <span className="triptych-kicker">{t('home.trip3Kicker')}</span>
                            <h3 className="triptych-title">{t('home.trip3Title')}</h3>
                            <span className="triptych-cta">{t('home.trip3Cta')}</span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 4. PRENDRE RENDEZ-VOUS */}
            <section className="section-auberge-rdv">
                <div className="container">
                    <div className="section-header-editorial">
                        <span className="editorial-kicker">{t('home.rdvKicker')}</span>
                        <h2 className="editorial-title">
                            {t('home.rdvTitle')} <span className="title-serif">{t('home.rdvTitleItalic')}</span>
                        </h2>
                        <div className="editorial-gold-line" />
                    </div>

                    <div className="rdv-twins-grid">
                        <div className="rdv-card">
                            <div className="rdv-circle-icon">
                                <Sparkles size={26} strokeWidth={1.5} />
                            </div>
                            <h3 className="rdv-card-title">{t('home.soloTitle')}</h3>
                            <p className="rdv-card-text">{t('home.soloDesc')}</p>
                            <a
                                href={planityUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-rdv-action"
                                aria-label="Prendre rendez-vous en ligne sur Planity pour votre soin (ouvre un nouvel onglet)"
                            >
                                {t('home.soloBtn')}
                            </a>
                        </div>

                        <div className="rdv-card">
                            <div className="rdv-circle-icon">
                                <Gift size={26} strokeWidth={1.5} />
                            </div>
                            <h3 className="rdv-card-title">{t('home.hasGiftTitle')}</h3>
                            <p className="rdv-card-text">{t('home.hasGiftDesc')}</p>
                            <Link href="/contact" className="btn-rdv-action" aria-label="Contacter l'institut pour réserver avec votre carte cadeau">
                                {t('home.hasGiftBtn')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. VOS COUPS DE CŒUR */}
            <section className="section-coups-de-coeur" id="coups-de-coeur-section">
                <div className="container">
                    <div className="section-header-editorial">
                        <span className="editorial-kicker">{t('home.favKicker')}</span>
                        <h2 className="editorial-title">
                            {t('home.favTitle')} <span className="title-serif">{t('home.favTitleItalic')}</span>
                        </h2>
                        <div className="editorial-gold-line" />
                        <p className="editorial-lead">{t('home.favLead')}</p>
                    </div>

                    <div className="soins-auberge-grid">
                        {signatureServices.map((service) => {
                            const imgSrc = service.image_url || '/images/massage-dos.jpg';
                            const serviceTitle = trans(service, 'title');
                            const serviceCat = trans(service, 'category') || 'Massage Sur Mesure';
                            const serviceBadge = trans(service, 'badge');
                            return (
                                <article key={service.id} className="soin-auberge-card">
                                    <div className="soin-auberge-media">
                                        <Image
                                            src={imgSrc}
                                            alt={serviceTitle}
                                            width={420}
                                            height={420}
                                            className="soin-auberge-img"
                                            unoptimized={isDynamicImg(imgSrc)}
                                        />
                                        {service.duration && (
                                            <span className="soin-auberge-duration">{service.duration}</span>
                                        )}
                                        {serviceBadge && (
                                            <span className="soin-auberge-badge">{serviceBadge}</span>
                                        )}
                                    </div>

                                    <div className="soin-auberge-body">
                                        <span className="soin-auberge-cat">{serviceCat}</span>
                                        <h3 className="soin-auberge-title">{serviceTitle}</h3>

                                        <div className="soin-auberge-specs">
                                            {service.duration && (
                                                <div className="spec-item">
                                                    <span className="spec-label">{t('home.durationLabel')}</span>
                                                    <span className="spec-val">{service.duration}</span>
                                                </div>
                                            )}
                                            <div className="spec-item">
                                                <span className="spec-label">{t('home.priceLabel')}</span>
                                                <span className="spec-val price-val">{service.price}</span>
                                            </div>
                                        </div>

                                        <div className="soin-auberge-actions">
                                            <a
                                                href={service.planity_url || planityUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-auberge-reserve"
                                                aria-label={`Réserver le soin ${serviceTitle} sur Planity (ouvre un nouvel onglet)`}
                                            >
                                                {t('home.reserveBtn')}
                                            </a>
                                            <Link
                                                href={`/carte-cadeau?soin=${encodeURIComponent(serviceTitle)}`}
                                                className="btn-auberge-gift"
                                                aria-label={`Offrir le soin ${serviceTitle} en carte cadeau`}
                                            >
                                                {t('home.offerBtn')}
                                            </Link>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedService(service)}
                                            className="btn-auberge-details"
                                            aria-label={`Voir les détails et bienfaits du soin ${serviceTitle}`}
                                        >
                                            <span>{t('home.detailsBtn')}</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="soins-view-all-wrap">
                        <Link href="/carte-des-soins" className="btn-auberge-view-all">
                            <span>{t('home.viewAllSoins')}</span>
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. AVIS & RETOURS CLIENTES */}
            <section className="section-avis">
                <div className="container">
                    <div className="section-header-editorial">
                        <div className="stars-badge-clean" aria-label="5/5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="star-filled" fill="#A68052" stroke="#A68052" />
                            ))}
                        </div>
                        <span className="editorial-kicker">{t('reviews.badge')}</span>
                        <h2 className="editorial-title">
                            {t('reviews.title')} <span className="title-serif">{t('reviews.titleItalic')}</span>
                        </h2>
                        <div className="editorial-gold-line" />
                        <p className="editorial-lead">{t('reviews.subtitle')}</p>
                    </div>

                    <div className="testimonials-grid-bespoke">
                        {limitedTestimonials.map((testi) => (
                            <div key={testi.id} className="testimonial-card-bespoke">
                                <div className="testi-stars-row" aria-label={`${testi.rating || 5}/5`}>
                                    {[...Array(testi.rating || 5)].map((_, i) => (
                                        <Star key={i} size={14} className="star-filled" fill="#A68052" stroke="#A68052" />
                                    ))}
                                </div>
                                <p className="testi-comment-bespoke">&ldquo;{trans(testi, 'comment')}&rdquo;</p>
                                <div className="testi-author-footer">
                                    <div>
                                        <span className="testi-author-name">{testi.author}</span>
                                        {trans(testi, 'treatment_name') && (
                                            <span className="testi-treatment-sub">{trans(testi, 'treatment_name')}</span>
                                        )}
                                    </div>
                                    <span className="testi-verified-tag">{testi.source || 'Avis vérifié'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="avis-cta-wrap">
                        <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-auberge-view-all" aria-label="Consulter tous les avis vérifiés de clientes sur Google (ouvre un nouvel onglet)">
                            <span>{t('reviews.viewAll')}</span>
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* 7. L'ÉCRIN DU SALON */}
            <section className="section-institut">
                <div className="container">
                    <div className="institut-grid">
                        <div className="institut-content">
                            <span className="editorial-kicker">{t('home.placeKicker')}</span>
                            <h2 className="institut-title">
                                {t('home.placeTitle')} <br />
                                <span className="title-serif">{t('home.placeTitleItalic')}</span>
                            </h2>
                            <div className="editorial-gold-line left-aligned" />

                            <p className="institut-lead">{t('home.placeLead')}</p>
                            <p className="institut-p">{t('home.placeP')}</p>

                            <div className="institut-highlights-bespoke">
                                <div className="highlight-row">
                                    <MapPin size={16} className="highlight-icon" />
                                    <span>{fullAddress}</span>
                                </div>
                                <div className="highlight-row">
                                    <ShieldCheck size={16} className="highlight-icon" />
                                    <span>{parkingText}</span>
                                </div>
                                <div className="highlight-row">
                                    <Clock size={16} className="highlight-icon" />
                                    <span>{t('home.placeHours')}</span>
                                </div>
                            </div>

                            <div className="institut-action">
                                <a href={`tel:${phoneTel}`} className="btn-auberge-reserve" aria-label={`Appeler l'institut La Parenthèse Harmonieuse au ${phone}`}>
                                    <Phone size={15} style={{ marginRight: '6px' }} />
                                    {t('home.callBtn', { phone })}
                                </a>
                            </div>
                        </div>

                        <div className="institut-gallery-bespoke">
                            <div className="gallery-main-img-bespoke">
                                <Image
                                    src={institutImage}
                                    alt="Plaque murale de l'institut La Parenthèse Harmonieuse au Pôle Santé Georges Guynemer"
                                    width={640}
                                    height={460}
                                    className="inst-img-bespoke"
                                    unoptimized={isDynamicImg(institutImage)}
                                />
                                <div className="gallery-caption-overlay">
                                    <span>{t('home.plaqueCaption')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL DÉTAILS SOIN */}
            {selectedService && (
                <div
                    className="service-modal-backdrop"
                    onClick={() => setSelectedService(null)}
                >
                    <div
                        className="service-modal-box"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="home-service-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={() => setSelectedService(null)}
                            aria-label="Fermer la fenêtre de détail du soin"
                        >
                            <X size={20} />
                        </button>

                        <div className="modal-header">
                            <span className="modal-category">{trans(selectedService, 'category')}</span>
                            <h3 id="home-service-modal-title" className="modal-title">{trans(selectedService, 'title')}</h3>
                            {trans(selectedService, 'subtitle') && (
                                <p className="modal-subtitle">{trans(selectedService, 'subtitle')}</p>
                            )}
                        </div>

                        <div className="modal-meta-pills">
                            {selectedService.duration && (
                                <span className="meta-pill">
                                    <Clock size={14} />
                                    <span>{t('home.durationLabel')} : {selectedService.duration}</span>
                                </span>
                            )}
                            <span className="meta-pill price-pill">
                                <span>{t('home.priceLabel')} : {selectedService.price}</span>
                            </span>
                        </div>

                        <div className="modal-content">
                            <h4>{t('modal.descTitle')}</h4>
                            <p>{trans(selectedService, 'description')}</p>

                            {trans(selectedService, 'benefits') && (
                                <>
                                    <h4>{t('modal.benefitsTitle')}</h4>
                                    <p>{trans(selectedService, 'benefits')}</p>
                                </>
                            )}

                            {trans(selectedService, 'contraindications') && (
                                <div className="modal-contraindications">
                                    <h4>{t('modal.contraTitle')}</h4>
                                    <p>{trans(selectedService, 'contraindications')}</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <a
                                href={selectedService.planity_url || planityUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-btn-planity"
                                aria-label={`Réserver le soin ${trans(selectedService, 'title')} sur Planity (ouvre un nouvel onglet)`}
                            >
                                <Calendar size={16} />
                                <span>{t('modal.bookPlanity')}</span>
                            </a>
                            <Link
                                href={`/contact?soin=${encodeURIComponent(trans(selectedService, 'title'))}`}
                                className="modal-btn-contact"
                                onClick={() => setSelectedService(null)}
                                aria-label={`Poser une question à propos du soin ${trans(selectedService, 'title')}`}
                            >
                                {t('modal.askQuestion')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
