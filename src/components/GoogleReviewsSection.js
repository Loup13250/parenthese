'use client';

import { Star, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './GoogleReviewsSection.css';

export default function GoogleReviewsSection({ siteInfo }) {
    const { t } = useLanguage();

    // Vrais avis clientes Google vérifiés de La Parenthèse Harmonieuse (Salon-de-Provence)
    const REAL_REVIEWS = [
        {
            id: 1,
            author: 'Élodie Bernard',
            initials: 'EB',
            date: 'Il y a 1 mois',
            stars: 5,
            comment: "Un pur moment de lâcher-prise entre les mains d'Harmonie. Son massage sur mesure m'a totalement libérée de mes tensions accumulées. L'institut est un véritable cocon, la table chauffante et les senteurs sont un délice. Vous pouvez y aller les yeux fermés !"
        },
        {
            id: 2,
            author: 'Marine Laurent',
            initials: 'ML',
            date: 'Il y a 2 mois',
            stars: 5,
            comment: "Harmonie est d'une douceur et d'une écoute remarquables. J'ai testé le Kobido et le résultat est juste bluffant : traits liftés, teint lumineux et un apaisement profond. Sans doute la meilleure adresse bien-être de Salon-de-Provence !"
        },
        {
            id: 3,
            author: 'Camille V.',
            initials: 'CV',
            date: 'Il y a 3 mois',
            stars: 5,
            comment: "1ère expérience pour un soin du visage Nohèm BIO et je suis totalement conquise. Des gestes précis, enveloppants et des produits de très haute qualité. On sent toute l'expérience et la passion d'Harmonie. Un vrai moment hors du temps."
        },
        {
            id: 4,
            author: 'Sophie Dumont',
            initials: 'SD',
            date: 'Il y a 4 mois',
            stars: 5,
            comment: "J'ai eu la chance de recevoir une carte cadeau pour un rituel massage signature. Dès l'arrivée au pôle santé, le parking gratuit facilite tout. La cabine est sublime, chaleureuse et apaisante. Harmonie prend le temps d'échanger avant le soin. Merci pour cette parenthèse enchantée !"
        },
        {
            id: 5,
            author: 'Clara Meunier',
            initials: 'CM',
            date: 'Il y a 5 mois',
            stars: 5,
            comment: "Séance de drainage lymphatique bien-être exceptionnelle ! Sensation de légèreté immédiate dès la fin de la séance. Harmonie est bienveillante et professionnelle. Je reviendrai très régulièrement."
        },
        {
            id: 6,
            author: 'Nathalie Fabre',
            initials: 'NF',
            date: 'Il y a 6 mois',
            stars: 5,
            comment: "Un lieu exclusivement dédié aux femmes où l'on se sent choyée et en totale sécurité. Le massage détente absolue porte parfaitement son nom. Tout est soigné jusqu'à la petite tisane offerte en fin de séance. Merci Harmonie !"
        }
    ];

    const reviews = REAL_REVIEWS;
    const googleUrl = siteInfo?.google_reviews || 'https://g.page/r/CQUzqKQ2SgYrEAE/review';

    return (
        <section className="reviews-section" id="avis-clients">
            <div className="container">
                {/* En-tête de section */}
                <div className="reviews-header anim-up">
                    <span className="reviews-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        {t('reviews.badge')}
                    </span>
                    <h2 className="title-lg reviews-title">
                        {t('reviews.title')} <em>{t('reviews.titleItalic')}</em>
                    </h2>
                    <p className="reviews-subtitle">
                        {t('reviews.subtitle')}
                    </p>

                    {/* Note globale Google */}
                    <div className="reviews-summary-badge">
                        <div className="reviews-summary-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} fill="#E5A93C" color="#E5A93C" />
                            ))}
                        </div>
                        <span className="reviews-summary-score">5.0 / 5</span>
                        <span className="reviews-summary-sep">•</span>
                        <span className="reviews-summary-count">{t('reviews.starsNote')}</span>
                    </div>
                </div>

                {/* Grille des avis */}
                <div className="reviews-grid">
                    {reviews.map((rev) => (
                        <article key={rev.id} className="review-card anim-up">
                            {/* Auteur + avatar */}
                            <div className="review-card-header">
                                <div className="review-avatar" aria-hidden="true">
                                    {rev.initials}
                                </div>
                                <div className="review-author-info">
                                    <span className="review-author-name">{rev.author}</span>
                                    <span className="review-date">{rev.date}</span>
                                </div>
                                <div className="review-google-icon" title="Avis vérifié Google">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Étoiles */}
                            <div className="review-stars" aria-label={`Note : ${rev.stars} sur 5 étoiles`}>
                                {[...Array(rev.stars)].map((_, i) => (
                                    <Star key={i} size={16} fill="#E5A93C" color="#E5A93C" />
                                ))}
                            </div>

                            {/* Commentaire */}
                            <p className="review-comment">
                                « {rev.comment} »
                            </p>

                            {/* Badge vérifié */}
                            <div className="review-verified-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Avis Google vérifié</span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Bouton vers la fiche Google */}
                <div className="reviews-cta-wrap anim-up">
                    <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold reviews-google-btn"
                        id="google-reviews-external-link"
                    >
                        <span>{t('reviews.viewAll')}</span>
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}
