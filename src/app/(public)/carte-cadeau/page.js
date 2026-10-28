import Image from 'next/image';
import Link from 'next/link';
import { getSiteInfo } from '@/lib/data';
import { Gift, CheckCircle2, Clock, Calendar, Mail, Sparkles, Heart, Phone } from 'lucide-react';
import './carte-cadeau.css';

export const metadata = {
    title: 'Offrir une Carte Cadeau | La Parenthèse Harmonieuse',
    description: 'Offrez un moment de pure détente et de douceur à Salon-de-Provence. Carte cadeau physique élégante à l’institut ou numérique sur Planity.',
};

export default async function CarteCadeauPage() {
    const siteInfo = await getSiteInfo();
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const phone = siteInfo?.phone || '06 51 65 21 42';

    return (
        <div className="cadeau-page">
            {/* Explanation & Formats Section démarrant directement en haut */}
            <section className="cadeau-details-section">
                <div className="container">
                    {/* Header compact intégré (Zéro espace vide en haut) */}
                    <div className="cadeau-compact-header-wrap">
                        <div>
                            <span className="cadeau-kicker">BONS CADEAUX HAUTE BEAUTÉ</span>
                            <h1 className="cadeau-compact-title">
                                Offrir une <span className="title-serif">Parenthèse de Douceur</span>
                            </h1>
                        </div>
                        <div className="cadeau-badges-strip">
                            <span className="badge-chip">Valable 6 mois</span>
                            <span className="badge-chip-dot">•</span>
                            <span className="badge-chip">Sur tous les rituels</span>
                            <span className="badge-chip-dot">•</span>
                            <span className="badge-chip">Écrin physique ou e-bon</span>
                        </div>
                    </div>
                    <div className="cadeau-intro-card">
                        <div className="cadeau-intro-icon">
                            <Gift size={30} />
                        </div>
                        <h2>Offrez une bulle hors du temps, sur mesure et sans compromis</h2>
                        <p className="cadeau-intro-lead">
                            Un moment d&apos;évasion profonde et de ressourcement dédié aux femmes à Salon-de-Provence. Nos bons cadeaux sont valables sur l&apos;ensemble de la carte des soins ou pour un montant libre.
                        </p>

                        <div className="occasions-pills">
                            <span className="occasion-pill">Anniversaire</span>
                            <span className="occasion-pill">Fête des mères</span>
                            <span className="occasion-pill">Grossesse &amp; Maternité</span>
                            <span className="occasion-pill">Noël &amp; Fêtes</span>
                            <span className="occasion-pill">Remerciement</span>
                            <span className="occasion-pill">Délicate attention</span>
                        </div>
                    </div>

                    {/* Les 2 Formats */}
                    <div className="section-header-center" style={{ marginTop: '3.5rem', marginBottom: '2.5rem' }}>
                        <span className="section-tag">FLEXIBILITÉ &amp; ÉLÉGANCE</span>
                        <h2 className="section-title">
                            Deux formats <span className="title-serif">selon vos envies</span>
                        </h2>
                        <p className="section-subtitle">
                            Que vous souhaitiez offrir un écrin physique raffiné en main propre ou envoyer un bon numérique immédiat de dernière minute.
                        </p>
                    </div>

                    <div className="formats-grid">
                        {/* Format 1 : Bon Physique en Institut */}
                        <div className="format-card featured-format">
                            <div className="format-badge">LE PLUS RAFFINÉ</div>
                            <div className="format-icon-wrap">
                                <Sparkles size={28} />
                            </div>
                            <h3>La Carte Cadeau Physique</h3>
                            <p className="format-subtitle">Retrait soigné directement à l&apos;institut</p>

                            <p className="format-desc">
                                Présentée dans un bel écrin satiné aux couleurs de La Parenthèse Harmonieuse, personnalisée avec votre petit mot doux et glissée dans une pochette dorée prête à offrir.
                            </p>

                            <ul className="format-perks">
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>Pochette luxueuse et présentation soignée</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>Valable 6 mois sur tous les soins</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>Montant libre ou choix précis du rituel</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>Retrait rapide au Pôle Santé Guynemer (sur simple appel)</span>
                                </li>
                            </ul>

                            <div className="format-cta">
                                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn-call-order">
                                    <Phone size={16} />
                                    <span>Commander au {phone}</span>
                                </a>
                                <Link href="/contact" className="link-contact-opt">
                                    Ou m&apos;écrire un message
                                </Link>
                            </div>
                        </div>

                        {/* Format 2 : Bon Digital Planity */}
                        <div className="format-card">
                            <div className="format-icon-wrap">
                                <Calendar size={28} />
                            </div>
                            <h3>La Carte Cadeau Digitale</h3>
                            <p className="format-subtitle">Achat en ligne 24h/24 &amp; Réception immédiate</p>

                            <p className="format-desc">
                                Idéal pour un cadeau de dernière minute ou si vous vivez loin. Vous commandez directement en ligne sur Planity et recevez le bon par email à imprimer ou à transférer.
                            </p>

                            <ul className="format-perks">
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>Disponible 7j/7 et 24h/24</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>Paiement 100% sécurisé sur Planity</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>Réception instantanée par email</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} />
                                    <span>La bénéficiaire réserve ensuite son créneau en ligne</span>
                                </li>
                            </ul>

                            <div className="format-cta">
                                <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-planity-gift">
                                    <Gift size={16} />
                                    <span>Acheter en ligne sur Planity</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Soins suggérés pour un cadeau */}
                    <div className="gift-suggestions-box">
                        <span className="section-tag">INSPIRATIONS</span>
                        <h3>Nos soins les plus plébiscités en cadeau</h3>
                        <div className="suggestions-grid">
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
                        </div>

                        <div className="suggestions-action">
                            <Link href="/carte-des-soins" className="btn-view-carte-outline">
                                Découvrir tous les soins de la carte
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
