'use client';
import Link from 'next/link';
import { Phone, Calendar, ArrowRight } from 'lucide-react';
import InstagramGallery from '@/components/InstagramGallery';
import { useLanguage } from '@/context/LanguageContext';

export default function RealisationsClient({ siteInfo, galleryPosts }) {
    const { t } = useLanguage();
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';

    return (
        <main id="main-content" className="galerie-page-main" style={{ background: '#FAF7F2', paddingTop: '1.25rem' }}>
            {/* EN-TÊTE COMPACT */}
            <section style={{ padding: '1.5rem 0 2.5rem' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        paddingBottom: '1.25rem',
                        borderBottom: '1px solid rgba(197, 168, 128, 0.22)',
                    }}>
                        <div>
                            <span style={{
                                display: 'block',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#8E662F',
                                marginBottom: '0.35rem',
                            }}>
                                {t('gallery.badge')}
                            </span>
                            <h1 style={{
                                fontFamily: 'var(--font-cormorant), Georgia, serif',
                                fontSize: 'clamp(1.85rem, 3.6vw, 2.8rem)',
                                fontWeight: 400,
                                lineHeight: 1.15,
                                color: '#231E1B',
                                margin: 0,
                            }}>
                                {t('gallery.title')} <span className="title-serif" style={{ color: '#8E662F' }}>{t('gallery.titleItalic')}</span>
                            </h1>
                        </div>
                        <p style={{
                            maxWidth: '460px',
                            fontSize: '0.94rem',
                            color: '#4A403A',
                            lineHeight: 1.65,
                            margin: 0,
                        }}>
                            {t('gallery.desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* GRILLE DE LA GALERIE (inclut l'état vide élégant si aucun post) */}
            <section style={{ paddingBottom: '4.5rem' }}>
                <InstagramGallery posts={galleryPosts} siteInfo={siteInfo} showHeader={false} />
            </section>

            {/* APPEL À L'ACTION */}
            <section style={{ background: '#F4EFE8', padding: '4.5rem 0', borderTop: '1px solid rgba(197, 168, 128, 0.25)' }}>
                <div className="container text-center">
                    <span className="section-tag">{t('gallery.ctaBadge')}</span>
                    <h2 style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                        fontWeight: 400,
                        color: '#231E1B',
                        marginBottom: '0.85rem',
                    }}>
                        {t('gallery.ctaTitle')}
                    </h2>
                    <p style={{ color: '#4A403A', maxWidth: '520px', margin: '0 auto 2.25rem', fontSize: '0.98rem', lineHeight: 1.7 }}>
                        {t('gallery.ctaDesc')}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href={planityUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-terra"
                        >
                            <Calendar size={16} />
                            <span>{t('nav.bookPlanity')}</span>
                        </a>
                        <a href={`tel:${phoneTel}`} className="btn-outline" aria-label={`${t('nav.callUs')} : ${phone}`}>
                            <Phone size={15} />
                            <span>{phone}</span>
                        </a>
                        <Link href="/contact" className="btn-outline">
                            <span>{t('cta.quoteBtn')}</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
