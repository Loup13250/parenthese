import Image from 'next/image';
import Link from 'next/link';
import { getSiteInfo } from '@/lib/data';
import { Calendar, ArrowRight, Feather } from 'lucide-react';
import './approche.css';

export const metadata = {
    title: 'Mon Approche | La Parenthèse Harmonieuse',
    description: 'Découvrez la philosophie d’Harmonie, praticienne bien-être et esthéticienne passionnée à Salon-de-Provence. Des soins sur mesure et bienveillants dans un espace dédié aux femmes.',
};

export default async function MonApprochePage() {
    const siteInfo = await getSiteInfo();
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const photoUrl = siteInfo?.about_image || '/images/harmonie-portrait.jpg';
    const aboutText = siteInfo?.about_text;

    return (
        <div className="approche-page">
            {/* Story Section démarrant directement en haut (Zéro double en-tête, zéro espace vide) */}
            <section className="approche-story-section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-media">
                            <div className="story-portrait-frame">
                                <Image
                                    src={photoUrl}
                                    alt="Harmonie - Fondatrice de La Parenthèse Harmonieuse"
                                    width={480}
                                    height={580}
                                    className="story-img"
                                    priority
                                />
                                <div className="story-aura" />
                                <div className="story-badge">
                                    <Feather size={16} className="badge-icon" />
                                    <span>Harmonie • 10 ans de pratique passionnée</span>
                                </div>
                            </div>
                        </div>

                        <div className="story-text">
                            <span className="section-tag">PHILOSOPHIE &amp; HISTOIRE</span>
                            <h1 className="section-title">
                                Mon Approche du <br />
                                <span className="title-serif">Bien-être Féminin</span>
                            </h1>

                            {/* Badges sobres sans émojis */}
                            <div className="story-reassurance-chips">
                                <span>Institut 100% dédié aux femmes</span>
                                <span className="reassurance-dot">•</span>
                                <span>Sur mesure absolu</span>
                                <span className="reassurance-dot">•</span>
                                <span>Cosmétiques BIO certifiés</span>
                            </div>

                            {aboutText ? (
                                <div className="story-paragraphs">
                                    {aboutText.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className={index === 0 ? "story-lead" : "story-p"}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <p className="story-lead">
                                        Je m&apos;appelle Harmonie, j&apos;ai 29 ans, originaire de Château-Gontier en Mayenne, et je me consacre depuis plus de 10 ans avec passion au bien-être et à l&apos;esthétique.
                                    </p>
                                    <p className="story-p">
                                        Au fil des années, j&apos;ai eu la chance d&apos;exercer dans des environnements très variés : instituts traditionnels, spas d&apos;hôtels étoilés, résidences de vacances prestigieuses, tant en France qu&apos;à l&apos;étranger.
                                    </p>
                                    <p className="story-p">
                                        Ces expériences m&apos;ont énormément appris sur l&apos;exigence du geste et la rigueur technique. Mais elles m&apos;ont aussi fait prendre conscience de ce que je voulais offrir : <strong>prendre le temps</strong>, vous écouter et vous accompagner avec une douceur sincère.
                                    </p>
                                    <blockquote className="story-quote">
                                        &ldquo;C&apos;est de ce constat qu&apos;est née La Parenthèse Harmonieuse : un cocon intime et sécurisant pensé uniquement pour vous à Salon-de-Provence.&rdquo;
                                    </blockquote>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Ce que je vous offre - Cartes épurées SANS numéros (01 02 03 04 retirés) */}
            <section className="approche-values-section">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-tag">MON ENGAGEMENT</span>
                        <h2 className="section-title">
                            Bien plus <span className="title-serif">qu&apos;un simple soin</span>
                        </h2>
                        <p className="section-subtitle">
                            Chaque rendez-vous est une invitation au lâcher-prise dans un cadre respectueux, bienveillant et confidentiel.
                        </p>
                    </div>

                    <div className="values-cards-grid">
                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">Un espace sécurisant</h3>
                            <p className="value-desc">
                                Un lieu calme, discret et chaleureux où vous pouvez déposer votre charge mentale, souffler et relâcher toutes les tensions accumulées.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">Une écoute sans jugement</h3>
                            <p className="value-desc">
                                Une présence bienveillante et sincère. Avant chaque séance, nous échangeons sur vos ressentis du jour, vos besoins prioritaires et vos préférences.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">Le sur-mesure absolu</h3>
                            <p className="value-desc">
                                Pas de protocole figé. Les manœuvres, la pression, le rythme et le choix des synergies d&apos;huiles sont modulés précisément selon votre corps.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">Une expérience sensorielle</h3>
                            <p className="value-desc">
                                Des senteurs délicates, des textures nobles, une table chauffante ultra-confortable et une atmosphère tamisée propice au repos nerveux.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Produits partenaires BIO */}
            <section className="approche-brands-section">
                <div className="container">
                    <div className="brands-box">
                        <span className="section-tag">EXCELLENCE &amp; NATURE</span>
                        <h2 className="section-title">
                            Des Cosmétiques BIO <span className="title-serif">sélectionnés avec exigence</span>
                        </h2>
                        <p className="brands-intro">
                            Pour respecter l&apos;équilibre délicat de votre peau et vous offrir le meilleur de la nature, j&apos;ai choisi des marques françaises éco-responsables et certifiées :
                        </p>

                        <div className="brands-list-grid">
                            <div className="brand-item">
                                <div className="brand-badge-label">BIO CERTIFIÉ ECOCERT</div>
                                <h3>NOHÈM</h3>
                                <p>
                                    Marque française inspirée des rituels de beauté ancestraux du monde entier. Des soins aux textures précieuses et aux principes actifs performants qui subliment tous les types de peaux.
                                </p>
                            </div>

                            <div className="brand-item">
                                <div className="brand-badge-label">COSMOS ORGANIC</div>
                                <h3>GREEN SPA</h3>
                                <p>
                                    Huiles de massage d&apos;excellence, 100% formulées à partir d&apos;ingrédients issus de l&apos;agriculture biologique et fabriquées artisanalement en France. Un délice pour les sens.
                                </p>
                            </div>

                            <div className="brand-item">
                                <div className="brand-badge-label">INNOVATION SENSORIELLE</div>
                                <h3>OH MY JELLY</h3>
                                <p>
                                    Des masques innovants en poudre qui se transforment en gelée fraîche lors de l&apos;application, enrichis en extraits de fruits et de plantes pour apaiser, repulper et illuminer.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner avec texte blanc lumineux parfaitement lisible */}
            <section className="approche-cta-section">
                <div className="container">
                    <div className="approche-cta-box">
                        <span className="section-tag-light">RÉSERVATION FACILE</span>
                        <h2 className="cta-box-title">Envie de vivre votre parenthèse ?</h2>
                        <p className="cta-box-desc">Prenez rendez-vous en ligne en quelques clics ou contactez-moi pour un conseil sur mesure.</p>
                        <div className="approche-cta-buttons">
                            <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-book-gold">
                                <Calendar size={17} />
                                <span>Prendre RDV sur Planity</span>
                            </a>
                            <Link href="/carte-des-soins" className="btn-view-carte">
                                <span>Voir la carte des soins</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
