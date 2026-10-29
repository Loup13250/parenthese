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
    RotateCcw,
    Sliders,
    ImageIcon,
    Star,
} from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { HOME_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';
import { updateSiteInfo } from '@/app/actions';

const isDynamicImg = (src) => typeof src === 'string' && (src.startsWith('/api/media/') || src.startsWith('http'));

export default function AccueilAdminClient({ siteInfo = {}, customTexts = { fr: {} } }) {
    const [info, setInfo] = useState(siteInfo);
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

    return (
        <div className="anim-fade" style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Header de la page Accueil */}
            <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Home size={26} style={{ color: 'var(--admin-gold)' }} />
                        Page d&apos;Accueil
                    </h1>
                    <p className="admin-subtitle">
                        Gérez les visuels, le nombre de soins et avis affichés, la bannière vidéo et tous les textes de la page d&apos;accueil.
                    </p>
                </div>
                <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
                >
                    <ExternalLink size={14} /> Voir la page d&apos;accueil en ligne
                </Link>
            </div>

            {/* Notifications */}
            {feedback && (
                <div
                    className={`admin-alert ${feedback.type === 'ok' ? 'admin-alert-success' : 'admin-alert-error'}`}
                    style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {feedback.type === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{feedback.text}</span>
                </div>
            )}

            {/* ENCART SPÉCIAL : ÉLÉMENTS PARTAGÉS AVEC D'AUTRES PAGES */}
            <div
                className="admin-card"
                style={{
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, rgba(184, 139, 70, 0.08) 0%, rgba(184, 139, 70, 0.02) 100%)',
                    border: '1px solid rgba(184, 139, 70, 0.35)',
                    padding: '1.5rem 1.75rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                    <Sparkles size={20} style={{ color: 'var(--admin-gold)' }} />
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
                        Éléments partagés entre l&apos;Accueil et d&apos;autres pages
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {/* Bloc 1 : Portrait & Histoire Harmonie -> Mon Approche */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '10px',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '1rem',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Heart size={18} style={{ color: 'var(--admin-gold)' }} />
                                <strong style={{ fontSize: '0.95rem', color: 'var(--admin-text)' }}>
                                    Portrait &amp; Histoire d&apos;Harmonie
                                </strong>
                            </div>
                            <p style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                La photo de portrait d&apos;Harmonie, son histoire et ses marques partenaires s&apos;affichent sur l&apos;accueil et sur la page <strong>Mon Approche</strong>. Toute modification effectuée sur Mon Approche s&apos;applique automatiquement à l&apos;accueil.
                            </p>
                        </div>
                        <Link
                            href="/admin/dashboard/a-propos"
                            className="admin-btn admin-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.82rem', padding: '9px 14px' }}
                        >
                            Modifier le portrait &amp; la présentation sur Mon Approche <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Bloc 2 : Vos Coups de Cœur -> Carte des Soins */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '10px',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '1rem',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Receipt size={18} style={{ color: 'var(--admin-gold)' }} />
                                <strong style={{ fontSize: '0.95rem', color: 'var(--admin-text)' }}>
                                    Sélection « Vos Coups de Cœur »
                                </strong>
                            </div>
                            <p style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                Les soins mis en avant dans la section Coups de Cœur de l&apos;accueil sont choisis parmi les rituels de la <strong>Carte des Soins</strong> (en activant l&apos;étoile Coup de Cœur sur chaque soin).
                            </p>
                        </div>
                        <Link
                            href="/admin/dashboard/prestations"
                            className="admin-btn admin-btn-secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.82rem', padding: '9px 14px' }}
                        >
                            Gérer les soins sur la Carte des Soins <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* SECTION 1 : AGENCEMENT & NOMBRE D'ÉLÉMENTS SUR L'ACCUEIL */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sliders size={20} style={{ color: 'var(--admin-gold)' }} />
                        Agencement &amp; Quantités d&apos;Éléments sur l&apos;Accueil
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Choisissez le nombre exact de soins et d&apos;avis présentés sur la page d&apos;accueil.
                    </span>
                </div>

                <form onSubmit={(e) => handleFormSubmit(e, 'Agencement de l’accueil mis à jour !')} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {/* Nombre de soins coups de coeur */}
                        <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                            <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                <Receipt size={16} style={{ color: 'var(--admin-gold)' }} />
                                Soins « Coups de Cœur » affichés
                            </label>
                            <select
                                name="home_featured_services_count"
                                defaultValue={info.home_featured_services_count || '6'}
                                className="admin-input"
                                style={{ marginTop: '0.4rem' }}
                            >
                                <option value="3">3 soins (1 rangée équilibrée)</option>
                                <option value="4">4 soins</option>
                                <option value="6">6 soins (2 rangées de 3 - Recommandé)</option>
                                <option value="8">8 soins</option>
                                <option value="all">Tous les soins mis en avant (sans limite)</option>
                            </select>
                            <span style={{ fontSize: '0.76rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.4rem', lineHeight: 1.4 }}>
                                Seuls les soins marqués « Coup de Cœur » dans la Carte des Soins apparaîtront.
                            </span>
                        </div>

                        {/* Nombre d'avis clientes */}
                        <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                            <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                <Star size={16} style={{ color: 'var(--admin-gold)' }} />
                                Avis Clientes affichés sur l&apos;Accueil
                            </label>
                            <select
                                name="home_testimonials_count"
                                defaultValue={info.home_testimonials_count || '3'}
                                className="admin-input"
                                style={{ marginTop: '0.4rem' }}
                            >
                                <option value="2">2 avis</option>
                                <option value="3">3 avis (1 rangée de 3 - Recommandé)</option>
                                <option value="4">4 avis</option>
                                <option value="6">6 avis (2 rangées de 3)</option>
                                <option value="all">Tous les avis (sans limite)</option>
                            </select>
                            <span style={{ fontSize: '0.76rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.4rem', lineHeight: 1.4 }}>
                                Sélectionnés parmi vos avis enregistrés dans l&apos;onglet Avis Clientes.
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="admin-btn admin-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                            Enregistrer l&apos;agencement
                        </button>
                    </div>
                </form>
            </div>

            {/* SECTION 2 : BANNIÈRE VIDÉO HERO & MÉDIAS */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Video size={20} style={{ color: 'var(--admin-gold)' }} />
                        Bannière Vidéo d&apos;En-tête (Hero)
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Personnalisez le fichier vidéo MP4 ou l&apos;affiche photo affichée lors du chargement.
                    </span>
                </div>

                <form onSubmit={(e) => handleFormSubmit(e, 'Bannière d’accueil mise à jour !')} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label className="admin-label">Lien / Fichier Vidéo (MP4)</label>
                            <input
                                type="text"
                                name="hero_video"
                                defaultValue={info.hero_video || '/videos/hero-massage.mp4'}
                                placeholder="/videos/hero-massage.mp4"
                                className="admin-input"
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                                Fichier MP4 optimisé pour mobile et grand écran.
                            </span>
                        </div>

                        <div>
                            <label className="admin-label">Image d&apos;Affiche (Poster de repli)</label>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                {posterPreview && (
                                    <div style={{ width: '56px', height: '42px', borderRadius: '4px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)', flexShrink: 0 }}>
                                        <Image src={posterPreview} alt="Affiche" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(posterPreview)} />
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
                            <div style={{ marginTop: '0.5rem' }}>
                                <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', padding: '6px 12px', cursor: 'pointer' }}>
                                    <UploadCloud size={14} /> Téléverser une photo d&apos;affiche
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
                        <button
                            type="submit"
                            disabled={isPending}
                            className="admin-btn admin-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                            Enregistrer la bannière vidéo
                        </button>
                    </div>
                </form>
            </div>

            {/* SECTION 3 : IMAGES & VISUELS DE LA PAGE D'ACCUEIL */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ImageIcon size={20} style={{ color: 'var(--admin-gold)' }} />
                        Images &amp; Visuels de la Page d&apos;Accueil
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Personnalisez les photos de la bannière triptyque et l&apos;image de présentation du lieu avec prévisualisation directe.
                    </span>
                </div>

                <form onSubmit={(e) => handleFormSubmit(e, 'Images de l’accueil enregistrées avec succès !')} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        {/* Triptyque 1 */}
                        <div style={{ background: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                Triptyque 1 • Mon Approche
                            </span>
                            <div style={{ width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                <Image src={trip1Preview} alt="Triptyque 1" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(trip1Preview)} />
                            </div>
                            <input
                                type="text"
                                name="home_trip1_image"
                                defaultValue={info.home_trip1_image || '/images/spa-huiles.jpg'}
                                className="admin-input"
                                style={{ fontSize: '0.78rem' }}
                                onChange={(e) => setTrip1Preview(e.target.value)}
                            />
                            <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.76rem', padding: '6px 10px', cursor: 'pointer' }}>
                                <UploadCloud size={13} /> Changer l&apos;image
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
                        <div style={{ background: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                Triptyque 2 • Carte des Soins
                            </span>
                            <div style={{ width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                <Image src={trip2Preview} alt="Triptyque 2" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(trip2Preview)} />
                            </div>
                            <input
                                type="text"
                                name="home_trip2_image"
                                defaultValue={info.home_trip2_image || '/images/massage-detente.jpg'}
                                className="admin-input"
                                style={{ fontSize: '0.78rem' }}
                                onChange={(e) => setTrip2Preview(e.target.value)}
                            />
                            <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.76rem', padding: '6px 10px', cursor: 'pointer' }}>
                                <UploadCloud size={13} /> Changer l&apos;image
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
                        <div style={{ background: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                Triptyque 3 • Carte Cadeau
                            </span>
                            <div style={{ width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                <Image src={trip3Preview} alt="Triptyque 3" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(trip3Preview)} />
                            </div>
                            <input
                                type="text"
                                name="home_trip3_image"
                                defaultValue={info.home_trip3_image || '/images/maternite-douceur.jpg'}
                                className="admin-input"
                                style={{ fontSize: '0.78rem' }}
                                onChange={(e) => setTrip3Preview(e.target.value)}
                            />
                            <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.76rem', padding: '6px 10px', cursor: 'pointer' }}>
                                <UploadCloud size={13} /> Changer l&apos;image
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
                        <div style={{ background: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                Présentation du Lieu (Plaque Institut)
                            </span>
                            <div style={{ width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid var(--admin-border)' }}>
                                <Image src={instPreview} alt="Institut" fill style={{ objectFit: 'cover' }} unoptimized={isDynamicImg(instPreview)} />
                            </div>
                            <input
                                type="text"
                                name="home_institut_image"
                                defaultValue={info.home_institut_image || '/images/plaque-institut.png'}
                                className="admin-input"
                                style={{ fontSize: '0.78rem' }}
                                onChange={(e) => setInstPreview(e.target.value)}
                            />
                            <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.76rem', padding: '6px 10px', cursor: 'pointer' }}>
                                <UploadCloud size={13} /> Changer l&apos;image
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
                        <button
                            type="submit"
                            disabled={isPending}
                            className="admin-btn admin-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                            Enregistrer les images de l&apos;accueil
                        </button>
                    </div>
                </form>
            </div>

            {/* SECTION 4 : ÉDITEUR DES TEXTES DE LA PAGE D'ACCUEIL */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Home size={20} style={{ color: 'var(--admin-gold)' }} />
                        Textes &amp; Sections de la Page d&apos;Accueil
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Modifiez chaque titre, paragraphe, bouton et réassurance de la page d&apos;accueil.
                    </span>
                </div>

                <SiteTextsEditor
                    sections={HOME_PAGE_TEXT_SECTIONS}
                    overrides={customTexts}
                    searchable
                    collapsible
                    defaultOpenFirst
                />
            </div>
        </div>
    );
}
