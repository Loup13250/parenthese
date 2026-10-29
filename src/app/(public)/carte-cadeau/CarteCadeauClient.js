'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Gift, CheckCircle2, Calendar, Sparkles, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './carte-cadeau.css';

export default function CarteCadeauClient({ siteInfo, services = [] }) {
    const { t, trans } = useLanguage();
    const searchParams = useSearchParams();
    const selectedSoin = searchParams?.get('soin')?.trim() || '';

    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');

    const contactHref = selectedSoin
        ? `/contact?soin=${encodeURIComponent(`Carte cadeau : ${selectedSoin}`)}`
        : `/contact?soin=${encodeURIComponent('Demande carte cadeau')}`;

    const giftIdeas = (services.filter((s) => s.is_featured).length >= 3
        ? services.filter((s) => s.is_featured)
        : services
    ).slice(0, 3);

    const occasions = [
        'Anniversaire',
        'Fête des mères',
        'Grossesse & Maternité',
        'Noël & Fêtes',
        'Remerciement',
        'Délicate attention',
    ];

    const physPerks = [
        'Pochette luxueuse et présentation soignée',
        'Valable 6 mois sur tous les soins',
        'Montant libre ou choix précis du rituel',
        'Retrait rapide au Pôle Santé Guynemer (sur simple appel)',
    ];

    const digPerks = [
        'Disponible 7j/7 et 24h/24',
        'Paiement 100% sécurisé sur Planity',
        'Réception instantanée par email',
        'La bénéficiaire réserve ensuite son créneau en ligne',
    ];

    return (
        <main id="main-content" className="cadeau-page">
            <section className="cadeau-details-section">
                <div className="container">
                    <div className="cadeau-compact-header-wrap">
                        <div>
                            <span className="cadeau-kicker">{t('gift.badge')}</span>
                            <h1 className="cadeau-compact-title">
                                {t('gift.title')} <span className="title-serif">{t('gift.titleItalic')}</span>
                            </h1>
                        </div>
                        <div className="cadeau-badges-strip">
                            <span className="badge-chip">{t('gift.chip1')}</span>
                            <span className="badge-chip-dot" aria-hidden="true">•</span>
                            <span className="badge-chip">{t('gift.chip2')}</span>
                            <span className="badge-chip-dot" aria-hidden="true">•</span>
                            <span className="badge-chip">{t('gift.chip3')}</span>
                        </div>
                    </div>

                    {selectedSoin && (
                        <div className="selected-gift-banner" role="status">
                            <Gift size={18} className="selected-gift-icon" />
                            <span>
                                {t('gift.selectedLabel')} <strong>{selectedSoin}</strong>
                            </span>
                        </div>
                    )}

                    <div className="cadeau-intro-card">
                        <div className="cadeau-intro-icon">
                            <Gift size={30} />
                        </div>
                        <h2>{t('gift.introTitle')}</h2>
                        <p className="cadeau-intro-lead">{t('gift.introLead')}</p>

                        <div className="occasions-pills">
                            {occasions.map((occ) => (
                                <span key={occ} className="occasion-pill">{occ}</span>
                            ))}
                        </div>
                    </div>

                    {/* Les 2 Formats */}
                    <div className="section-header-center" style={{ marginTop: '3.5rem', marginBottom: '2.5rem' }}>
                        <span className="section-tag">{t('gift.formatsTag')}</span>
                        <h2 className="section-title">
                            {t('gift.formatsTitle')} <span className="title-serif">{t('gift.formatsTitleItalic')}</span>
                        </h2>
                        <p className="section-subtitle">{t('gift.formatsSubtitle')}</p>
                    </div>

                    <div className="formats-grid">
                        {/* Format 1 : Bon Physique en Institut */}
                        <div className="format-card featured-format">
                            <div className="format-badge">{t('gift.physBadge')}</div>
                            <div className="format-icon-wrap">
                                <Sparkles size={28} />
                            </div>
                            <h3>{t('gift.physTitle')}</h3>
                            <p className="format-subtitle">{t('gift.physSub')}</p>
                            <p className="format-desc">{t('gift.physDesc')}</p>

                            <ul className="format-perks">
                                {physPerks.map((perk) => (
                                    <li key={perk}>
                                        <CheckCircle2 size={16} />
                                        <span>{perk}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="format-cta">
                                <a href={`tel:${phoneTel}`} className="btn-call-order" aria-label={`Commander une pochette cadeau par téléphone au ${phone}`}>
                                    <Phone size={16} />
                                    <span>{t('gift.physCallBtn', { phone })}</span>
                                </a>
                                <Link href={contactHref} className="link-contact-opt" aria-label="Contacter l'institut pour commander votre bon cadeau personnalisé">
                                    {t('gift.physMsgBtn')}
                                </Link>
                            </div>
                        </div>

                        {/* Format 2 : Bon Digital Planity */}
                        <div className="format-card">
                            <div className="format-icon-wrap">
                                <Calendar size={28} />
                            </div>
                            <h3>{t('gift.digTitle')}</h3>
                            <p className="format-subtitle">{t('gift.digSub')}</p>
                            <p className="format-desc">{t('gift.digDesc')}</p>

                            <ul className="format-perks">
                                {digPerks.map((perk) => (
                                    <li key={perk}>
                                        <CheckCircle2 size={16} />
                                        <span>{perk}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="format-cta">
                                <a
                                    href={planityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-planity-gift"
                                    aria-label="Commander une carte cadeau digitale en ligne sur Planity (ouvre un nouvel onglet)"
                                >
                                    <Gift size={16} />
                                    <span>{t('gift.digBtn')}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Soins suggérés pour un cadeau */}
                    <div className="gift-suggestions-box">
                        <span className="section-tag">{t('gift.inspTag')}</span>
                        <h3>{t('gift.inspTitle')}</h3>
                        <div className="suggestions-grid">
                            {giftIdeas.length > 0 ? (
                                giftIdeas.map((s) => (
                                    <div key={s.id} className="suggestion-item">
                                        <span className="sugg-category">{trans(s, 'category') || 'RITUEL SIGNATURE'}</span>
                                        <h4>{trans(s, 'title')}{s.duration ? ` (${s.duration})` : ''}</h4>
                                        <p>{trans(s, 'subtitle') || trans(s, 'description')}</p>
                                        <span className="sugg-price">{s.price}</span>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="suggestion-item">
                                        <span className="sugg-category">MASSAGE CORPS</span>
                                        <h4>Massage La Parenthèse (75 min)</h4>
                                        <p>Le temps idéal pour relâcher l&apos;ensemble du corps et cibler les zones de tension.</p>
                                        <span className="sugg-price">80 €</span>
                                    </div>
                                    <div className="suggestion-item">
                                        <span className="sugg-category">HAUTE BEAUTÉ</span>
                                        <h4>KOBIDO Japonais du Visage (75 min)</h4>
                                        <p>Un lifting naturel ancestral, relaxant et tonifiant aux résultats spectaculaires.</p>
                                        <span className="sugg-price">80 €</span>
                                    </div>
                                    <div className="suggestion-item">
                                        <span className="sugg-category">RITUEL CORPS &amp; VISAGE</span>
                                        <h4>Pack Le Cocoon (1h30)</h4>
                                        <p>45 min Massage Sur Mesure + 45 min Soin Visage Éclat avec Nohèm BIO.</p>
                                        <span className="sugg-price">95 €</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="suggestions-action">
                            <Link href="/carte-des-soins" className="btn-view-carte-outline">
                                {t('gift.viewAllBtn')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

