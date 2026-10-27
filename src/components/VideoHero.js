'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Sparkles, Volume2, VolumeX, Play, Pause, ChevronDown } from 'lucide-react';
import './VideoHero.css';

export default function VideoHero({ siteInfo }) {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // Autoplay policy might pause without mute
                if (videoRef.current) {
                    videoRef.current.muted = true;
                    videoRef.current.play().catch(() => {});
                }
            });
        }
    }, []);

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
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
        <section className="spa-hero" aria-label="Accueil La Parenthèse Harmonieuse">
            {/* Background Video */}
            <div className="hero-video-wrapper">
                <video
                    ref={videoRef}
                    className={`hero-bg-video ${isLoaded ? 'loaded' : ''}`}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    poster="/images/hero-poster.jpg"
                    onLoadedData={() => setIsLoaded(true)}
                >
                    <source src="/videos/hero-massage.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la balise vidéo.
                </video>

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
                    {/* Delicate editorial sanctuary label */}
                    <span className="hero-eyebrow-line">
                        SALON-DE-PROVENCE · INSTITUT PRIVATIF DÉDIÉ AUX FEMMES
                    </span>

                    {/* Consigne Harmonie : "offrez vous une parenthèse de bien être" */}
                    <h1 className="hero-title">
                        Offrez-vous une parenthèse <br className="hide-mobile" />
                        <span className="hero-title-italic">de bien-être...</span>
                    </h1>

                    {/* Subtitle with pillars */}
                    <p className="hero-subtitle">
                        Massages sur mesure d&apos;exception · Soins du Visage Bio · Drainage &amp; Kobido
                    </p>

                    <p className="hero-description">
                        Dans un cocon de douceur et de sérénité, chaque soin est pensé sur mesure pour relâcher les tensions, apaiser l&apos;esprit et reconnecter le corps.
                    </p>

                    {/* CTAs */}
                    <div className="hero-actions">
                        <a
                            href={planityUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-btn-primary"
                        >
                            <span>PRENDRE RENDEZ-VOUS</span>
                        </a>

                        <Link href="/carte-des-soins" className="hero-btn-secondary">
                            <span>DÉCOUVRIR LES SOINS</span>
                        </Link>
                    </div>

                    {/* Reassurance Palace Spa Ribbon */}
                    <div className="hero-reassurance-ribbon">
                        <span className="ribbon-item">Cosmétiques BIO Nohèm &amp; Green Spa</span>
                        <span className="ribbon-diamond" aria-hidden="true">✦</span>
                        <span className="ribbon-item">Parking Gratuit au Pôle Santé</span>
                        <span className="ribbon-diamond" aria-hidden="true">✦</span>
                        <span className="ribbon-item">Avis 5,0/5 sur Planity &amp; Google</span>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <button
                type="button"
                onClick={scrollToContent}
                className="hero-scroll-btn"
                aria-label="Défiler vers la suite"
            >
                <span className="scroll-label">Découvrir l&apos;institut</span>
                <ChevronDown size={18} className="scroll-chevron" />
            </button>
        </section>
    );
}
