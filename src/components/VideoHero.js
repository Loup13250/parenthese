'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Play, Pause, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './VideoHero.css';

const DEFAULT_TAGLINE_FR = 'Offrez-vous une parenthèse de bien-être...';

export default function VideoHero({ siteInfo }) {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const { t } = useLanguage();

    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const videoSrc = siteInfo?.hero_video || '/videos/hero-massage.mp4';
    const posterSrc = siteInfo?.hero_poster || '/images/hero-poster.jpg';

    const customTagline = siteInfo?.tagline && siteInfo.tagline.trim() && siteInfo.tagline.trim() !== DEFAULT_TAGLINE_FR
        ? siteInfo.tagline.trim()
        : '';

    const customSubtitle = siteInfo?.subtitle && siteInfo.subtitle.trim()
        ? siteInfo.subtitle.trim()
        : '';

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const prefersReducedMotion = typeof window !== 'undefined'
            && window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            video.pause();
            return;
        }

        video.play().catch(() => {
            if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(() => {});
            }
        });
    }, [videoSrc]);

    const toggleMute = () => {
        if (!videoRef.current) return;
        const nextMuted = !isMuted;
        videoRef.current.muted = nextMuted;
        setIsMuted(nextMuted);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    const scrollToContent = () => {
        const target = document.getElementById('bienvenue-section');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="spa-hero" aria-label={siteInfo?.business_name || 'La Parenthèse Harmonieuse'}>
            {/* Background Video */}
            <div className="hero-video-wrapper">
                <video
                    key={videoSrc}
                    ref={videoRef}
                    src={videoSrc}
                    className={`hero-bg-video ${isLoaded ? 'loaded' : ''}`}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    poster={posterSrc}
                    onLoadedData={() => setIsLoaded(true)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                {/* Elegant Luxury Cinematic Overlay */}
                <div className="hero-cinematic-overlay" />
            </div>

            {/* Video Control Buttons */}
            <div className="hero-controls">
                <button
                    type="button"
                    onClick={togglePlay}
                    className="hero-ctrl-btn"
                    aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la vidéo'}
                    title={isPlaying ? 'Pause' : 'Lecture'}
                >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button
                    type="button"
                    onClick={toggleMute}
                    className="hero-ctrl-btn"
                    aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                    title={isMuted ? 'Son désactivé' : 'Son activé'}
                >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
            </div>

            {/* Main Content */}
            <div className="container hero-content-container">
                <div className="hero-text-block">
                    <span className="hero-eyebrow-line">
                        {t('hero.eyebrow')}
                    </span>

                    <h1 className="hero-title">
                        {customTagline ? (
                            customTagline
                        ) : (
                            <>
                                {t('hero.titleLine1')} <br className="hide-mobile" />
                                <span className="hero-title-italic">{t('hero.titleItalic')}</span>
                            </>
                        )}
                    </h1>

                    <p className="hero-subtitle">
                        {customSubtitle || t('hero.subtitle')}
                    </p>

                    <p className="hero-description">
                        {t('hero.description')}
                    </p>

                    {/* CTAs */}
                    <div className="hero-actions">
                        <a
                            href={planityUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-btn-primary"
                        >
                            <span>{t('hero.bookBtn')}</span>
                        </a>

                        <Link href="/carte-des-soins" className="hero-btn-secondary">
                            <span>{t('hero.viewMenu')}</span>
                        </Link>
                    </div>

                    {/* Reassurance Palace Spa Ribbon */}
                    <div className="hero-reassurance-ribbon">
                        <span className="ribbon-item">{t('hero.ribbon1')}</span>
                        <span className="ribbon-diamond" aria-hidden="true">✦</span>
                        <span className="ribbon-item">{t('hero.ribbon2')}</span>
                        <span className="ribbon-diamond" aria-hidden="true">✦</span>
                        <span className="ribbon-item">{t('hero.ribbon3')}</span>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <button
                type="button"
                onClick={scrollToContent}
                className="hero-scroll-btn"
                aria-label={t('hero.scrollLabel')}
            >
                <span className="scroll-label">{t('hero.scrollLabel')}</span>
                <ChevronDown size={18} className="scroll-chevron" />
            </button>
        </section>
    );
}
