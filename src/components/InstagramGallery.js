'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { X, Play, Instagram, Phone, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './InstagramGallery.css';

export default function InstagramGallery({ posts, siteInfo, showHeader = true }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const { t, trans, lang } = useLanguage();

    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const instagramUrl = siteInfo?.instagram || 'https://www.instagram.com/laparentheseharmonieuse/';

    const handleKeyDown = useCallback((e) => {
        if (selectedIndex === null || !posts?.length) return;
        if (e.key === 'Escape') setSelectedIndex(null);
        if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
        if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
    }, [selectedIndex, posts]);

    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedIndex, handleKeyDown]);

    if (!posts || posts.length === 0) {
        return (
            <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                {showHeader && (
                    <div className="gallery-header anim-up">
                        <span className="label">{t('gallery.badge')}</span>
                        <h2 className="title-lg" style={{ marginTop: '0.75rem' }}>
                            {t('gallery.title')}<br /><em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>{t('gallery.titleItalic')}</em>
                        </h2>
                    </div>
                )}
                <div style={{
                    maxWidth: '580px',
                    margin: '1.5rem auto 0',
                    padding: '3rem 2rem',
                    background: '#FFFFFF',
                    border: '1px solid rgba(197, 168, 128, 0.3)',
                    borderRadius: '3px',
                    boxShadow: '0 12px 35px rgba(44, 38, 35, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(185, 146, 94, 0.12)',
                        border: '1px solid rgba(185, 146, 94, 0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold)',
                    }}>
                        <Instagram size={26} />
                    </div>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.65rem', color: '#231E1B', marginBottom: '0.5rem' }}>
                            {t('gallery.emptyTitle')}
                        </h3>
                        <p style={{ color: '#4A403A', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                            {t('gallery.empty')}
                        </p>
                    </div>
                    {instagramUrl && (
                        <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-terra"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                        >
                            <Instagram size={17} />
                            <span>{t('gallery.follow')}</span>
                        </a>
                    )}
                </div>
            </div>
        );
    }

    const selectedPost = selectedIndex !== null ? posts[selectedIndex] : null;

    return (
        <div className="container">
            {showHeader && (
                <div className="gallery-header anim-up">
                    <span className="label">{t('gallery.badge')}</span>
                    <h2 className="title-lg" style={{ marginTop: '0.75rem' }}>
                        {t('gallery.title')}<br /><em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>{t('gallery.titleItalic')}</em>
                    </h2>
                </div>
            )}

            <div className="gallery-grid">
                {posts.map((post, idx) => {
                    const postTitle = trans(post, 'title');
                    const postCaption = trans(post, 'caption');
                    return (
                        <div
                            key={post.id}
                            className="gallery-item"
                            style={{ animationDelay: `${(idx % 4) * 35}ms` }}
                            onClick={() => setSelectedIndex(idx)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedIndex(idx);
                                }
                            }}
                            aria-label={postTitle || 'Agrandir la photo'}
                        >
                            {post.media_type === 'video' ? (
                                <>
                                    <video
                                        src={post.image_url}
                                        poster={post.thumbnail_url || undefined}
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                        onMouseLeave={(e) => e.currentTarget.pause()}
                                        className="gallery-img"
                                    />
                                    <div className="video-mark" aria-hidden="true">
                                        <Play size={12} fill="currentColor" />
                                    </div>
                                </>
                            ) : (
                                <Image
                                    src={post.thumbnail_url || post.image_url}
                                    alt={postTitle || postCaption || 'Ambiance soin La Parenthèse Harmonieuse'}
                                    width={500}
                                    height={500}
                                    className="gallery-img"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    decoding="async"
                                    unoptimized
                                />
                            )}
                            <div className="gallery-overlay">
                                {postTitle && <h3 className="gallery-overlay-title">{postTitle}</h3>}
                                {postCaption && <p className="gallery-overlay-caption">{postCaption}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {instagramUrl && (
                <div className="gallery-footer text-center">
                    <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                    >
                        <Instagram size={16} />
                        <span>{t('gallery.follow')}</span>
                        <ArrowRight size={14} />
                    </a>
                </div>
            )}

            {/* Plein écran (lightbox) */}
            {selectedPost && (
                <div
                    className="modal-backdrop"
                    onClick={() => setSelectedIndex(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={trans(selectedPost, 'title') || 'Aperçu photo'}
                >
                    <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
                        {posts.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="lightbox-nav-btn prev"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
                                    }}
                                    aria-label={t('hero.prev')}
                                >
                                    <ChevronLeft className="lightbox-nav-icon" />
                                </button>
                                <button
                                    type="button"
                                    className="lightbox-nav-btn next"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
                                    }}
                                    aria-label={t('hero.next')}
                                >
                                    <ChevronRight className="lightbox-nav-icon" />
                                </button>
                            </>
                        )}

                        <div className="modal-card">
                            <button type="button" className="modal-close" onClick={() => setSelectedIndex(null)} aria-label={t('modal.close')}>
                                <X size={18} />
                            </button>

                            <div
                                className="modal-img-box"
                                onClick={() => {
                                    if (posts.length > 1 && selectedPost.media_type !== 'video') {
                                        setSelectedIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
                                    }
                                }}
                                style={{ cursor: posts.length > 1 && selectedPost.media_type !== 'video' ? 'pointer' : 'default', position: 'relative' }}
                            >
                                {posts.length > 1 && (
                                    <div className="lightbox-counter">
                                        {selectedIndex + 1} / {posts.length}
                                    </div>
                                )}

                                {selectedPost.media_type === 'video' ? (
                                    <video
                                        key={selectedPost.image_url}
                                        src={selectedPost.image_url}
                                        poster={selectedPost.thumbnail_url || undefined}
                                        controls
                                        autoPlay
                                        loop
                                        playsInline
                                        style={{ width: '100%', maxHeight: '560px' }}
                                    />
                                ) : (
                                    <Image
                                        src={selectedPost.image_url}
                                        alt={trans(selectedPost, 'title') || 'La Parenthèse Harmonieuse'}
                                        width={1600}
                                        height={1200}
                                        className="modal-img"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        sizes="(max-width: 768px) 100vw, 1200px"
                                        decoding="async"
                                        unoptimized
                                        key={selectedPost.image_url}
                                    />
                                )}
                            </div>
                            <div className="modal-info">
                                <div className="modal-meta">
                                    <Image
                                        src={siteInfo?.site_icon || siteInfo?.logo || '/images/logo.png'}
                                        alt={siteInfo?.business_name || 'La Parenthèse Harmonieuse'}
                                        width={36}
                                        height={36}
                                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'contain' }}
                                        unoptimized
                                    />
                                    <div className="modal-meta-text">
                                        <strong>{siteInfo?.business_name || 'La Parenthèse Harmonieuse'}</strong>
                                        <span>Salon-de-Provence · Cocon de Soin</span>
                                    </div>
                                </div>
                                {trans(selectedPost, 'title') && <h3 className="modal-title">{trans(selectedPost, 'title')}</h3>}
                                {trans(selectedPost, 'caption') && <p className="modal-caption">{trans(selectedPost, 'caption')}</p>}
                                <div className="modal-cta" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <a href={planityUrl} target="_blank" rel="noopener noreferrer" className="btn-terra modal-cta-btn">
                                        <Calendar size={15} />
                                        <span>{t('nav.bookPlanity')}</span>
                                    </a>
                                    <a href={`tel:${phoneTel}`} className="btn-outline modal-cta-btn" style={{ padding: '11px' }}>
                                        <Phone size={14} />
                                        <span>{phone}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
