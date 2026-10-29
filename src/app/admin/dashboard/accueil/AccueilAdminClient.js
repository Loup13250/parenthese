'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home,
    Video,
    Sparkles,
    Heart,
    Receipt,
    ExternalLink,
    ArrowRight,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    UploadCloud,
    Sliders,
    ImageIcon,
    Star,
    Type,
    Layers,
} from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { HOME_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';
import { updateSiteInfo } from '@/app/actions';

const isDynamicImg = (src) => typeof src === 'string' && (src.startsWith('/api/media/') || src.startsWith('http'));

export default function AccueilAdminClient({ siteInfo = {}, customTexts = { fr: {} } }) {
    const [info] = useState(siteInfo);
    const [activeTab, setActiveTab] = useState('all');
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState(null);

    // Prévisualisations locales des images
    const [trip1Preview, setTrip1Preview] = useState(info.home_trip1_image || '/images/spa-huiles.jpg');
    const [trip2Preview, setTrip2Preview] = useState(info.home_trip2_image || '/images/massage-detente.jpg');
    const [trip3Preview, setTrip3Preview] = useState(info.home_trip3_image || '/images/maternite-douceur.jpg');
    const [instPreview, setInstPreview] = useState(info.home_institut_image || '/images/plaque-institut.png');
    const [posterPreview, setPosterPreview] = useState(info.hero_poster || '/images/hero-poster.jpg');

    const handleFormSubmit = (e, successMessage) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            try {
                const res = await updateSiteInfo(formData);
                if (res?.error) {
                    setFeedback({ type: 'error', text: res.error });
                } else {
                    setFeedback({ type: 'ok', text: successMessage || 'Modifications enregistrées avec succès !' });
                    setTimeout(() => setFeedback((f) => (f?.type === 'ok' ? null : f)), 4500);
                }
            } catch (err) {
                console.error(err);
                setFeedback({ type: 'error', text: "Erreur lors de l'enregistrement." });
            }
        });
    };

    const handleFilePreview = (e, setPreview) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const showSection = (id) => activeTab === 'all' || activeTab === id;

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* EN-TÊTE UNIFIÉ */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-page-icon" aria-hidden="true">
                        <Home size={24} />
                    </div>
                    <div>
                        <span className="admin-eyebrow">Page 1 du site public</span>
                        <h1 className="admin-title">Page d&apos;Accueil</h1>
                        <p className="admin-subtitle">
                            Gérez dans l&apos;ordre d&apos;affichage la vidéo d&apos;en-tête, les photos du triptyque et du lieu, le nombre de soins et d&apos;avis présentés, ainsi que tous les textes de l&apos;accueil.
                        </p>
                    </div>
                </div>
                <div className="admin-page-actions">
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                    >
                        <ExternalLink size={15} /> Voir la page d&apos;accueil
                    </Link>
                </div>
            </div>

            {/* BARRE D'ONGLETS ERGONOMIQUE */}
            <div className="admin-quicknav" role="tablist" aria-label="Sections de la page d'accueil">
                <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`admin-quicknav-btn ${activeTab === 'all' ? 'active' : ''}`}
                >
                    <Layers size={15} /> Tout afficher
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`admin-quicknav-btn ${activeTab === 'video' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">1</span>
                    <Video size={14} /> Bannière Vidéo
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('images')}
                    className={`admin-quicknav-btn ${activeTab === 'images' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">2</span>
                    <ImageIcon size={14} /> Photos Triptyque &amp; Lieu
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('counts')}
                    className={`admin-quicknav-btn ${activeTab === 'counts' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">3</span>
                    <Sliders size={14} /> Nombre de Soins &amp; Avis
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('texts')}
                    className={`admin-quicknav-btn ${activeTab === 'texts' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">4</span>
                    <Type size={14} /> Textes de l&apos;Accueil
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('shared')}
                    className={`admin-quicknav-btn ${activeTab === 'shared' ? 'active' : ''}`}
                >
                    <Sparkles size={14} /> Éléments partagés
                </button>
            </div>

            {/* Notifications */}
            {feedback && (
                <div
                    className={`admin-alert ${feedback.type === 'ok' ? 'admin-alert-success' : 'admin-alert-error'}`}
                >
                    {feedback.type === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{feedback.text}</span>
                </div>
            )}

            {/* ÉLÉMENTS PARTAGÉS AVEC D'AUTRES PAGES */}
            {showSection('shared') && (
                <div className="admin-info-banner">
                    <div className="admin-info-banner-head">
                        <Sparkles size={18} style={{ color: 'var(--admin-gold)' }} />
                        <span>Raccourcis vers les sections partagées avec d&apos;autres pages</span>
                    </div>

                    <div className="admin-grid-2col">
                        <div style={{
                            background: '#FFFFFF',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius-md)',
                            padding: '1.15rem 1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.85rem',
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                    <Heart size={16} style={{ color: '#BE185D' }} />
                                    <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>
                                        Portrait &amp; Histoire d&apos;Harmonie
                                    </strong>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                    Le portrait d&apos;Harmonie et son histoire s&apos;affichent à la fois sur l&apos;accueil et sur la page <strong>Mon Approche</strong>.
                                </p>
                            </div>
                            <Link
                                href="/admin/dashboard/a-propos"
                                className="admin-btn admin-btn-secondary"
                                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.82rem' }}
                            >
                                <span>Modifier sur la page Mon Approche</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div style={{
                            background: '#FFFFFF',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius-md)',
                            padding: '1.15rem 1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.85rem',
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                    <Receipt size={16} style={{ color: '#047857' }} />
                                    <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>
                                        Sélection « Vos Coups de Cœur » &amp; Avis Clientes
                                    </strong>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                    Choisissez quels soins et quels témoignages sont mis en avant sur l&apos;accueil.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <Link
                                    href="/admin/dashboard/prestations"
                                    className="admin-btn admin-btn-secondary"
                                    style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }}
                                >
                                    Carte des Soins <ArrowRight size={13} />
                                </Link>
                                <Link
                                    href="/admin/dashboard/avis"
                                    className="admin-btn admin-btn-secondary"
                                    style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }}
                                >
                                    Avis Clientes <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ÉTAPE 1 : BANNIÈRE VIDÉO HERO & MÉDIAS */}
            {showSection('video') && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <span className="admin-eyebrow">Section 1 • Haut de page</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                <Video size={20} style={{ color: 'var(--admin-gold)' }} />
                                Bannière Vidéo d&apos;En-tête (Hero)
                            </h2>
                            <p className="admin-card-subtitle">
                                Personnalisez le fichier vidéo MP4 diffusé en plein écran ainsi que l&apos;image fixe (Poster) affichée pendant son chargement.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={(e) => handleFormSubmit(e, 'Bannière vidéo d’accueil mise à jour !')} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="admin-grid-2col">
                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
                                <label className="admin-label">Lien / Fichier Vidéo (MP4)</label>
                                <input
                                    type="text"
                                    name="hero_video"
                                    defaultValue={info.hero_video || '/videos/hero-massage.mp4'}
                                    placeholder="/videos/hero-massage.mp4"
                                    className="admin-input"
                                />
                                <span className="admin-hint">
                                    Fichier MP4 optimisé pour mobile et grand écran (ou téléversez directement une vidéo dans Paramètres Généraux).
                                </span>
                            </div>

                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
                                <label className="admin-label">Image d&apos;Affiche (Poster de chargement)</label>
                                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                                    {posterPreview && (
                                        <div style={{ width: '76px', height: '50px', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)', flexShrink: 0 }}>
                                            <Image src={posterPreview} alt="Affiche Hero" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(posterPreview)} />
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            name="hero_poster"
                                            defaultValue={info.hero_poster || '/images/hero-poster.jpg'}
                                            placeholder="/images/hero-poster.jpg"
                                            className="admin-input"
                                            onChange={(e) => setPosterPreview(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '0.65rem' }}>
                                    <label className="admin-btn admin-btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px', cursor: 'pointer' }}>
                                        <UploadCloud size={14} /> Téléverser une nouvelle affiche
                                        <input
                                            type="file"
                                            name="hero_poster_file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFilePreview(e, setPosterPreview)}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" disabled={isPending} className="admin-btn admin-btn-primary">
                                {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                                Enregistrer la bannière vidéo
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ÉTAPE 2 : IMAGES & VISUELS DE LA PAGE D'ACCUEIL */}
            {showSection('images') && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <span className="admin-eyebrow">Section 2 • Photographies dans l&apos;ordre de la page</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                <ImageIcon size={20} style={{ color: 'var(--admin-gold)' }} />
                                Images du Triptyque &amp; Présentation du Lieu
                            </h2>
                            <p className="admin-card-subtitle">
                                Remplacez les 3 images de la bannière triptyque ainsi que la photo de la plaque de l&apos;institut en bas de page.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={(e) => handleFormSubmit(e, 'Images de l’accueil enregistrées avec succès !')} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: '1.15rem' }}>
                            {/* Triptyque 1 */}
                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <strong style={{ fontSize: '0.84rem', color: 'var(--admin-text)' }}>1. Triptyque • Mon Approche</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', fontWeight: 700 }}>Gauche</span>
                                </div>
                                <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                    <Image src={trip1Preview} alt="Triptyque 1" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(trip1Preview)} />
                                </div>
                                <input
                                    type="text"
                                    name="home_trip1_image"
                                    defaultValue={info.home_trip1_image || '/images/spa-huiles.jpg'}
                                    className="admin-input"
                                    style={{ fontSize: '0.78rem', padding: '7px 10px' }}
                                    onChange={(e) => setTrip1Preview(e.target.value)}
                                />
                                <label className="admin-btn admin-btn-secondary" style={{ width: '100%', fontSize: '0.78rem', padding: '7px 10px', cursor: 'pointer' }}>
                                    <UploadCloud size={14} /> Choisir une photo
                                    <input
                                        type="file"
                                        name="home_trip1_file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFilePreview(e, setTrip1Preview)}
                                    />
                                </label>
                            </div>

                            {/* Triptyque 2 */}
                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <strong style={{ fontSize: '0.84rem', color: 'var(--admin-text)' }}>2. Triptyque • Carte des Soins</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', fontWeight: 700 }}>Centre</span>
                                </div>
                                <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                    <Image src={trip2Preview} alt="Triptyque 2" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(trip2Preview)} />
                                </div>
                                <input
                                    type="text"
                                    name="home_trip2_image"
                                    defaultValue={info.home_trip2_image || '/images/massage-detente.jpg'}
                                    className="admin-input"
                                    style={{ fontSize: '0.78rem', padding: '7px 10px' }}
                                    onChange={(e) => setTrip2Preview(e.target.value)}
                                />
                                <label className="admin-btn admin-btn-secondary" style={{ width: '100%', fontSize: '0.78rem', padding: '7px 10px', cursor: 'pointer' }}>
                                    <UploadCloud size={14} /> Choisir une photo
                                    <input
                                        type="file"
                                        name="home_trip2_file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFilePreview(e, setTrip2Preview)}
                                    />
                                </label>
                            </div>

                            {/* Triptyque 3 */}
                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <strong style={{ fontSize: '0.84rem', color: 'var(--admin-text)' }}>3. Triptyque • Carte Cadeau</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', fontWeight: 700 }}>Droite</span>
                                </div>
                                <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                    <Image src={trip3Preview} alt="Triptyque 3" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(trip3Preview)} />
                                </div>
                                <input
                                    type="text"
                                    name="home_trip3_image"
                                    defaultValue={info.home_trip3_image || '/images/maternite-douceur.jpg'}
                                    className="admin-input"
                                    style={{ fontSize: '0.78rem', padding: '7px 10px' }}
                                    onChange={(e) => setTrip3Preview(e.target.value)}
                                />
                                <label className="admin-btn admin-btn-secondary" style={{ width: '100%', fontSize: '0.78rem', padding: '7px 10px', cursor: 'pointer' }}>
                                    <UploadCloud size={14} /> Choisir une photo
                                    <input
                                        type="file"
                                        name="home_trip3_file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFilePreview(e, setTrip3Preview)}
                                    />
                                </label>
                            </div>

                            {/* Plaque Institut */}
                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <strong style={{ fontSize: '0.84rem', color: 'var(--admin-text)' }}>4. Présentation de l&apos;Institut</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', fontWeight: 700 }}>Bas de page</span>
                                </div>
                                <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                    <Image src={instPreview} alt="Plaque Institut" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(instPreview)} />
                                </div>
                                <input
                                    type="text"
                                    name="home_institut_image"
                                    defaultValue={info.home_institut_image || '/images/plaque-institut.png'}
                                    className="admin-input"
                                    style={{ fontSize: '0.78rem', padding: '7px 10px' }}
                                    onChange={(e) => setInstPreview(e.target.value)}
                                />
                                <label className="admin-btn admin-btn-secondary" style={{ width: '100%', fontSize: '0.78rem', padding: '7px 10px', cursor: 'pointer' }}>
                                    <UploadCloud size={14} /> Choisir une photo
                                    <input
                                        type="file"
                                        name="home_institut_file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFilePreview(e, setInstPreview)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" disabled={isPending} className="admin-btn admin-btn-primary">
                                {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                                Enregistrer les photos de l&apos;accueil
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ÉTAPE 3 : AGENCEMENT & NOMBRE D'ÉLÉMENTS SUR L'ACCUEIL */}
            {showSection('counts') && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <span className="admin-eyebrow">Section 3 • Affichage dynamique</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                <Sliders size={20} style={{ color: 'var(--admin-gold)' }} />
                                Nombre de Soins &amp; d&apos;Avis affichés sur l&apos;Accueil
                            </h2>
                            <p className="admin-card-subtitle">
                                Choisissez combien de soins « Coups de Cœur » et combien d&apos;avis clientes apparaissent sur la page d&apos;accueil.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={(e) => handleFormSubmit(e, 'Agencement de l’accueil mis à jour !')} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="admin-grid-2col">
                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
                                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <Receipt size={16} style={{ color: 'var(--admin-gold)' }} />
                                    Nombre de soins « Coups de Cœur » sur l&apos;accueil
                                </label>
                                <select
                                    name="home_featured_services_count"
                                    defaultValue={info.home_featured_services_count || '6'}
                                    className="admin-select"
                                >
                                    <option value="3">3 soins (1 rangée centrée)</option>
                                    <option value="4">4 soins</option>
                                    <option value="6">6 soins (2 rangées de 3 — Recommandé)</option>
                                    <option value="8">8 soins</option>
                                    <option value="all">Tous les soins marqués Coup de Cœur</option>
                                </select>
                                <span className="admin-hint">
                                    Astuce : cliquez sur l&apos;étoile ★ d&apos;un soin dans « Carte des Soins » pour l&apos;inclure ici.
                                </span>
                            </div>

                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
                                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <Star size={16} style={{ color: 'var(--admin-gold)' }} />
                                    Nombre d&apos;Avis Clientes sur l&apos;accueil
                                </label>
                                <select
                                    name="home_testimonials_count"
                                    defaultValue={info.home_testimonials_count || '3'}
                                    className="admin-select"
                                >
                                    <option value="2">2 avis</option>
                                    <option value="3">3 avis (1 rangée de 3 — Recommandé)</option>
                                    <option value="4">4 avis</option>
                                    <option value="6">6 avis (2 rangées de 3)</option>
                                    <option value="all">Tous les avis actifs</option>
                                </select>
                                <span className="admin-hint">
                                    Gérez le contenu des témoignages dans l&apos;onglet « Avis Clientes ».
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" disabled={isPending} className="admin-btn admin-btn-primary">
                                {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                                Enregistrer ces quantités
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ÉTAPE 4 : ÉDITEUR DES TEXTES DE LA PAGE D'ACCUEIL */}
            {showSection('texts') && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <span className="admin-eyebrow">Section 4 • Contenus écrits</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                <Type size={20} style={{ color: 'var(--admin-gold)' }} />
                                Textes &amp; Titres de la Page d&apos;Accueil
                            </h2>
                            <p className="admin-card-subtitle">
                                Cliquez sur une rubrique ci-dessous pour modifier ses titres, paragraphes et boutons.
                            </p>
                        </div>
                    </div>

                    <SiteTextsEditor
                        sections={HOME_PAGE_TEXT_SECTIONS}
                        overrides={customTexts}
                        searchable
                        collapsible
                        defaultOpenFirst
                    />
                </div>
            )}
        </div>
    );
}
