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
} from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { HOME_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';
import { updateSiteInfo } from '@/app/actions';

export default function AccueilAdminClient({ siteInfo = {}, customTexts = { fr: {} } }) {
    const [info, setInfo] = useState(siteInfo);
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState(null);

    const handleSaveHeroMedia = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            try {
                const res = await updateSiteInfo(formData);
                if (res?.error) {
                    setFeedback({ type: 'error', text: res.error });
                } else {
                    setFeedback({ type: 'ok', text: 'Média de la bannière accueil enregistrés avec succès !' });
                    setTimeout(() => setFeedback((f) => (f?.type === 'ok' ? null : f)), 4500);
                }
            } catch (err) {
                console.error(err);
                setFeedback({ type: 'error', text: "Erreur lors de l'enregistrement." });
            }
        });
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
                        Gérez les médias d&apos;en-tête, la bannière vidéo et tous les textes affichés sur la page d&apos;accueil du site.
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

            {/* SECTION 1 : BANNIÈRE VIDÉO HERO & MÉDIAS */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Video size={20} style={{ color: 'var(--admin-gold)' }} />
                        Bannière Vidéo d&apos;En-tête (Hero)
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Personnalisez le fichier vidéo mp4 ou l&apos;affiche photo affichée lors du chargement.
                    </span>
                </div>

                <form onSubmit={handleSaveHeroMedia} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                            <label className="admin-label">Image d&apos;Affiche (Poster) / Repli photo</label>
                            <input
                                type="text"
                                name="hero_poster"
                                defaultValue={info.hero_poster || '/images/hero-poster.jpg'}
                                placeholder="/images/hero-poster.jpg"
                                className="admin-input"
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                                Affichée instantanément avant la lecture de la vidéo.
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
                            Enregistrer les médias de la bannière
                        </button>
                    </div>
                </form>
            </div>

            {/* SECTION 2 : ÉDITEUR DES TEXTES DE LA PAGE D'ACCUEIL */}
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

