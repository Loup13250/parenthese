'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Gift, Info, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './carte-soins.css';

const isDynamicImg = (src) => typeof src === 'string' && (src.startsWith('/api/media/') || src.startsWith('http'));

export default function CarteSoinsClient({ services = [], siteInfo }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedCardId, setExpandedCardId] = useState(null);
    const { t, trans } = useLanguage();

    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const phone = siteInfo?.phone || '06 51 65 21 42';

    const categories = [
        { id: 'all', label: t('tarifs.catAll') || 'Tous les soins' },
        { id: 'massages', label: t('tarifs.catMassages') || 'Massages Sur Mesure' },
        { id: 'drainage', label: t('tarifs.catDrainage') || 'Drainage Lymphatique' },
        { id: 'kobido', label: t('tarifs.catKobido') || 'Massage Kobido' },
        { id: 'visage', label: t('tarifs.catVisage') || 'Soins Visage' },
        { id: 'maternite', label: t('tarifs.catMaternite') || 'Femmes Enceintes' },
        { id: 'packs', label: t('tarifs.catPacks') || 'Packs & Forfaits' },
    ];

    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter((s) => s.category_slug === selectedCategory);

    const toggleExpand = (id) => {
        setExpandedCardId(expandedCardId === id ? null : id);
    };

    return (
        <main id="main-content" className="carte-soins-page">
            <section className="carte-content-section">
                <div className="container">
                    {/* Header compact intégré */}
                    <div className="carte-compact-header-wrap">
                        <div>
                            <span className="carte-kicker">{t('tarifs.badge')}</span>
                            <h1 className="carte-compact-title">
                                {t('tarifs.title')} <span className="title-serif">{t('tarifs.titleItalic')}</span>
                            </h1>
                        </div>
                        <div className="carte-badges-strip">
                            <span className="badge-chip">{t('tarifs.chip1')}</span>
                            <span className="badge-chip-dot" aria-hidden="true">•</span>
                            <span className="badge-chip">{t('tarifs.chip2')}</span>
                            <span className="badge-chip-dot" aria-hidden="true">•</span>
                            <span className="badge-chip">{t('tarifs.chip3')}</span>
                        </div>
                    </div>

                    {/* Category Buttons */}
                    <div className="category-filter-bar" role="tablist" aria-label={t('tarifs.title')}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                role="tab"
                                aria-selected={selectedCategory === cat.id}
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
                            <strong>{t('tarifs.bookingNoticeTitle')}</strong> {t('tarifs.bookingNoticeText')}
                        </div>
                    </div>

                    {/* Treatments Catalogue Grid */}
                    <div className="soins-catalogue-grid">
                        {filteredServices.map((service) => {
                            const isExpanded = expandedCardId === service.id;
                            const imageSrc = service.image_url || '/images/massage-dos.jpg';
                            const serviceTitle = trans(service, 'title');
                            const serviceSub = trans(service, 'subtitle');
                            const serviceDesc = trans(service, 'description');
                            const serviceBenefits = trans(service, 'benefits');
                            const serviceContra = trans(service, 'contraindications');
                            const serviceBadge = trans(service, 'badge');
                            const serviceCat = trans(service, 'category');

                            return (
                                <article key={service.id} className="catalogue-item-card">
                                    <div className="catalogue-media">
                                        <Image
                                            src={imageSrc}
                                            alt={`Photographie illustrant le soin ${serviceTitle}`}
                                            width={500}
                                            height={280}
                                            className="catalogue-img"
                                            unoptimized={isDynamicImg(imageSrc)}
                                        />
                                        {serviceBadge && (
                                            <span className="catalogue-badge">{serviceBadge}</span>
                                        )}
                                        {service.duration && (
                                            <span className="catalogue-duration">
                                                <Clock size={12} />
                                                <span>{service.duration}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="catalogue-body">
                                        <div className="card-top-row">
                                            <span className="cat-chip">{serviceCat}</span>
                                            <span className="price-tag">{service.price}</span>
                                        </div>

                                        <h2 className="item-title">{serviceTitle}</h2>
                                        {serviceSub && (
                                            <p className="item-sub">{serviceSub}</p>
                                        )}

                                        <div className="item-description">
                                            <p>{serviceDesc}</p>
                                        </div>

                                        {isExpanded && (
                                            <div className="expanded-details">
                                                {serviceBenefits && (
                                                    <div className="details-block">
                                                        <h4>{t('tarifs.benefitsLabel')}</h4>
                                                        <p>{serviceBenefits}</p>
                                                    </div>
                                                )}

                                                {serviceContra && (
                                                    <div className="details-block warning-block">
                                                        <h4><AlertCircle size={15} /> {t('tarifs.contraLabel')}</h4>
                                                        <p>{serviceContra}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="card-actions-row">
                                            {(serviceBenefits || serviceContra) && (
                                                <button
                                                    type="button"
                                                    className="btn-toggle-expand"
                                                    aria-expanded={isExpanded}
                                                    aria-label={`${isExpanded ? 'Masquer les détails de' : 'Afficher les bienfaits et contre-indications de'} ${serviceTitle}`}
                                                    onClick={() => toggleExpand(service.id)}
                                                >
                                                    <span>{isExpanded ? t('tarifs.lessDetails') : t('tarifs.moreDetails')}</span>
                                                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                                </button>
                                            )}

                                            <div className="actions-buttons-group">
                                                <Link
                                                    href={`/carte-cadeau?soin=${encodeURIComponent(serviceTitle)}`}
                                                    className="btn-offrir-card"
                                                    title={t('tarifs.offerBtn')}
                                                    aria-label={`Offrir le soin ${serviceTitle} sous forme de carte cadeau`}
                                                >
                                                    <Gift size={14} />
                                                    <span>{t('tarifs.offerBtn')}</span>
                                                </Link>

                                                <a
                                                    href={service.planity_url || planityUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-reserver-direct"
                                                    aria-label={`Réserver le soin ${serviceTitle} en ligne sur Planity (ouvre un nouvel onglet)`}
                                                >
                                                    <Calendar size={14} />
                                                    <span>{t('tarifs.bookBtn')}</span>
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
                            <span className="section-tag">{t('tarifs.helpTag')}</span>
                            <h3>{t('tarifs.ctaTitle')}</h3>
                            <p>{t('tarifs.ctaDesc', { phone })}</p>
                            <div className="reassurance-actions">
                                <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-book-gold">
                                    <Calendar size={16} />
                                    <span>{t('tarifs.bilanBtn')}</span>
                                </a>
                                <Link href="/contact" className="btn-contact-simple">
                                    {t('tarifs.askBtn')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
