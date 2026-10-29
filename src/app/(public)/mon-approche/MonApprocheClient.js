'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, Feather } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './approche.css';

const isDynamicImg = (src) => typeof src === 'string' && (src.startsWith('/api/media/') || src.startsWith('http'));

const DEFAULT_BRANDS_FR = [
    {
        badge: 'BIO CERTIFIÉ ECOCERT',
        name: 'NOHÈM',
        desc: 'Marque française inspirée des rituels de beauté ancestraux du monde entier. Des soins aux textures précieuses et aux principes actifs performants qui subliment tous les types de peaux.',
    },
    {
        badge: 'COSMOS ORGANIC',
        name: 'GREEN SPA',
        desc: "Huiles de massage d'excellence, 100% formulées à partir d'ingrédients issus de l'agriculture biologique et fabriquées artisanalement en France. Un délice pour les sens.",
    },
    {
        badge: 'INNOVATION SENSORIELLE',
        name: 'OH MY JELLY',
        desc: "Des masques innovants en poudre qui se transforment en gelée fraîche lors de l'application, enrichis en extraits de fruits et de plantes pour apaiser, repulper et illuminer.",
    },
];

function parseBrands(rawBrands) {
    if (rawBrands && typeof rawBrands === 'string') {
        try {
            const parsed = JSON.parse(rawBrands);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch {
            // Fallback to default structured brands if stored as plain string
        }
    }
    return DEFAULT_BRANDS_FR;
}

export default function MonApprocheClient({ siteInfo }) {
    const { t } = useLanguage();
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const photoUrl = siteInfo?.about_image || '/images/harmonie-portrait.jpg';

    const customTitle = siteInfo?.about_title && siteInfo.about_title.trim()
        && siteInfo.about_title.trim() !== 'Mon Approche du Bien-être Féminin'
        ? siteInfo.about_title.trim()
        : '';

    const aboutText = siteInfo?.about_text && siteInfo.about_text.trim()
        ? siteInfo.about_text.trim()
        : '';

    const brands = parseBrands(siteInfo?.brands);
    const canvasRef = useRef(null);

    // Effet féerique & élégant de confettis dorés et scintillements au survol de la souris
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', handleResize);

        const colors = ['#C5A880', '#D8B685', '#EAD8C0', '#B88B46', '#F3E5D0', '#A07335', '#E2BA7D'];
        const shapes = ['rect', 'star', 'circle', 'diamond'];
        const particles = [];
        let animId = null;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.07;
                p.vx *= 0.985;
                p.rotation += p.rotSpeed;
                p.alpha -= p.fadeRate;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size / 2, -p.size * 0.7, p.size, p.size * 1.4);
                } else if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.shape === 'diamond') {
                    ctx.beginPath();
                    ctx.moveTo(0, -p.size);
                    ctx.lineTo(p.size * 0.65, 0);
                    ctx.lineTo(0, p.size);
                    ctx.lineTo(-p.size * 0.65, 0);
                    ctx.closePath();
                    ctx.fill();
                } else if (p.shape === 'star') {
                    const s = p.size;
                    ctx.beginPath();
                    ctx.moveTo(0, -s);
                    ctx.quadraticCurveTo(0, 0, s, 0);
                    ctx.quadraticCurveTo(0, 0, 0, s);
                    ctx.quadraticCurveTo(0, 0, -s, 0);
                    ctx.quadraticCurveTo(0, 0, 0, -s);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            }

            if (particles.length > 0) {
                animId = requestAnimationFrame(render);
            } else {
                animId = null;
            }
        };

        const section = canvas.parentElement;
        if (!section) return () => window.removeEventListener('resize', handleResize);

        let lastSpawn = 0;
        const handleMouseMove = (e) => {
            const now = performance.now();
            if (now - lastSpawn < 35) return;
            lastSpawn = now;

            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const count = Math.floor(Math.random() * 2) + 2;
            for (let k = 0; k < count; k++) {
                if (particles.length > 70) break;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.2 + 0.6;
                particles.push({
                    x: x + (Math.random() - 0.5) * 14,
                    y: y + (Math.random() - 0.5) * 14,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.2,
                    size: Math.random() * 3.5 + 3.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    shape: shapes[Math.floor(Math.random() * shapes.length)],
                    rotation: Math.random() * Math.PI,
                    rotSpeed: (Math.random() - 0.5) * 0.15,
                    alpha: 1,
                    fadeRate: Math.random() * 0.018 + 0.015,
                });
            }

            if (!animId) {
                animId = requestAnimationFrame(render);
            }
        };

        section.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            section.removeEventListener('mousemove', handleMouseMove);
            if (animId) cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <main id="main-content" className="approche-page">
            <section className="approche-story-section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-media">
                            <div className="story-portrait-frame">
                                <Image
                                    src={photoUrl}
                                    alt="Harmonie, fondatrice et praticienne certifiée de La Parenthèse Harmonieuse"
                                    width={480}
                                    height={580}
                                    className="story-img"
                                    preload
                                    unoptimized={isDynamicImg(photoUrl)}
                                />
                                <div className="story-aura" />
                                <div className="story-badge">
                                    <Feather size={16} className="badge-icon" />
                                    <span>{t('about.portraitBadge')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="story-text">
                            <span className="section-tag">{t('about.pageBadge')}</span>
                            <h1 className="section-title">
                                {customTitle ? (
                                    customTitle
                                ) : (
                                    <>
                                        {t('about.pageTitle')} <br />
                                        <span className="title-serif">{t('about.pageTitleItalic')}</span>
                                    </>
                                )}
                            </h1>

                            <div className="story-reassurance-chips">
                                <span>{t('about.chip1')}</span>
                                <span className="reassurance-dot" aria-hidden="true">•</span>
                                <span>{t('about.chip2')}</span>
                                <span className="reassurance-dot" aria-hidden="true">•</span>
                                <span>{t('about.chip3')}</span>
                            </div>

                            {aboutText ? (
                                <div className="story-paragraphs">
                                    {aboutText.split(/\n\s*\n/).map((paragraph, index) => (
                                        <p key={index} className={index === 0 ? 'story-lead' : 'story-p'}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <p className="story-lead">
                                        Je m&apos;appelle Harmonie, originaire de Château-Gontier en Mayenne, et je me consacre depuis plus de 10 ans avec passion au bien-être et à l&apos;esthétique.
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

            {/* Ce que je vous offre */}
            <section className="approche-values-section">
                <canvas ref={canvasRef} className="values-sparkle-canvas" aria-hidden="true" />
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-tag">{t('about.valuesBadge')}</span>
                        <h2 className="section-title">
                            {t('about.valuesTitle')} <span className="title-serif">{t('about.valuesTitleItalic')}</span>
                        </h2>
                        <p className="section-subtitle">{t('about.valuesSubtitle')}</p>
                    </div>

                    <div className="values-cards-grid">
                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">{t('about.val1Title')}</h3>
                            <p className="value-desc">{t('about.val1Desc')}</p>
                        </div>

                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">{t('about.val2Title')}</h3>
                            <p className="value-desc">{t('about.val2Desc')}</p>
                        </div>

                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">{t('about.val3Title')}</h3>
                            <p className="value-desc">{t('about.val3Desc')}</p>
                        </div>

                        <div className="value-card">
                            <div className="value-gold-bullet" />
                            <h3 className="value-title">{t('about.val4Title')}</h3>
                            <p className="value-desc">{t('about.val4Desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Produits partenaires BIO */}
            <section className="approche-brands-section">
                <div className="container">
                    <div className="brands-box">
                        <span className="section-tag">{t('about.brandsBadge')}</span>
                        <h2 className="section-title">
                            {t('about.brandsTitle')} <span className="title-serif">{t('about.brandsTitleItalic')}</span>
                        </h2>
                        <p className="brands-intro">{t('about.brandsIntro')}</p>

                        <div className="brands-list-grid">
                            {brands.map((brand, idx) => (
                                <div key={`${brand.name || idx}`} className="brand-item">
                                    {brand.badge && <div className="brand-badge-label">{brand.badge}</div>}
                                    <h3>{brand.name}</h3>
                                    <p>{brand.desc || brand.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="approche-cta-section">
                <div className="container">
                    <div className="approche-cta-box">
                        <span className="section-tag-light">{t('about.ctaBadge')}</span>
                        <h2 className="cta-box-title">{t('about.ctaTitle')}</h2>
                        <p className="cta-box-desc">{t('about.ctaDesc')}</p>
                        <div className="approche-cta-buttons">
                            <a
                                href={planityUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-book-gold"
                                aria-label="Prendre rendez-vous avec Harmonie sur Planity (ouvre un nouvel onglet)"
                            >
                                <Calendar size={17} />
                                <span>{t('about.ctaBookBtn')}</span>
                            </a>
                            <Link href="/carte-des-soins" className="btn-view-carte" aria-label="Découvrir l'ensemble de la carte des soins et tarifs">
                                <span>{t('about.ctaMenuBtn')}</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

