'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { updateAboutInfo } from '@/app/actions';
import { calculateHarmonieAge, formatHarmonieBio } from '@/lib/site';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import ImageCropperModal, { ABOUT_CROP_TARGETS, uid } from '@/components/admin/ImageCropper';
import { ABOUT_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';
import Link from 'next/link';
import {
    Heart,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Loader2,
    UploadCloud,
    ExternalLink,
    Layers,
    Save,
    Crop,
    RotateCcw,
    Type,
    UserCheck,
} from 'lucide-react';

const DEFAULT_PORTRAIT = '/images/harmonie-portrait.jpg';

export default function AProposAdminClient({ info = {}, customTexts = { fr: {} } }) {
    const [activeTab, setActiveTab] = useState('all');
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const blobUrlsRef = useRef([]);
    const trackBlobUrl = (url) => {
        if (url && url.startsWith('blob:')) {
            blobUrlsRef.current.push(url);
        }
        return url;
    };

    useEffect(() => {
        const list = blobUrlsRef.current;
        return () => {
            list.forEach((u) => URL.revokeObjectURL(u));
        };
    }, []);

    // État de la photo Mon Approche
    const [aboutPhotoPreview, setAboutPhotoPreview] = useState(info?.about_image || DEFAULT_PORTRAIT);
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [cropper, setCropper] = useState(null);
    const [photoAspect, setPhotoAspect] = useState('4 / 5');
    const [photoRatioLabel, setPhotoRatioLabel] = useState('Format 4:5 (Portrait)');

    const storyFormRef = useRef(null);

    const showNotification = (msg, isErr = false) => {
        if (isErr) {
            setError(msg);
            setTimeout(() => setError(''), 4500);
        } else {
            setSuccess(msg);
            setTimeout(() => setSuccess(''), 3500);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCropper({
            items: [{ id: uid(), file, name: file.name }],
        });
        e.target.value = '';
    };

    const handleRecrop = () => {
        if (!aboutPhotoPreview) return;
        if (selectedPhotoFile) {
            setCropper({
                items: [{ id: uid(), file: selectedPhotoFile, name: selectedPhotoFile.name }],
            });
        } else {
            setCropper({
                items: [{ id: uid(), url: aboutPhotoPreview, name: 'Portrait Mon Approche' }],
            });
        }
    };

    const handleResetPortrait = () => {
        if (!confirm("Rétablir le portrait par défaut d'Harmonie ?")) return;
        const formData = new FormData();
        formData.append('reset_about_image', '1');
        startTransition(async () => {
            const res = await updateAboutInfo(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                setSelectedPhotoFile(null);
                setAboutPhotoPreview(DEFAULT_PORTRAIT);
                showNotification('Portrait officiel par défaut rétabli.');
            }
        });
    };

    const handleCropped = async (results) => {
        try {
            if (!results || results.length === 0) return;
            const croppedBlob = results[0]?.outputs?.image || results[0]?.outputs?.desktop || results[0]?.original;
            if (croppedBlob) {
                const file = croppedBlob instanceof File
                    ? croppedBlob
                    : new File([croppedBlob], 'mon-approche.webp', { type: 'image/webp' });

                setAboutPhotoPreview(trackBlobUrl(URL.createObjectURL(file)));
                setSelectedPhotoFile(null);

                const formData = new FormData();
                const form = storyFormRef.current;
                if (form?.about_title) formData.append('about_title', form.about_title.value);
                formData.append('about_text', form?.about_text?.value || info?.about_text || '');
                if (form?.brands) formData.append('brands', form.brands.value);
                formData.append('tagline', form?.tagline?.value || info?.tagline || '');
                formData.append('about_file', file);

                startTransition(async () => {
                    const res = await updateAboutInfo(formData);
                    if (res?.error) {
                        showNotification(res.error, true);
                    } else {
                        if (res?.about_image) setAboutPhotoPreview(res.about_image);
                        showNotification('Photo « Mon Approche » enregistrée et publiée avec succès !');
                    }
                });
            }
        } catch (err) {
            console.error('Error handling cropped about photo:', err);
            showNotification("Erreur lors de l'enregistrement de la photo.", true);
        } finally {
            setCropper(null);
        }
    };

    const handleSaveAboutStory = (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const formData = new FormData();

        formData.append('about_title', form.about_title?.value || '');
        formData.append('about_text', form.about_text.value);
        formData.append('brands', form.brands?.value || '');
        formData.append('tagline', form.tagline?.value || '');

        if (selectedPhotoFile) {
            formData.append('about_file', selectedPhotoFile);
        }

        startTransition(async () => {
            const res = await updateAboutInfo(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Présentation et philosophie « Mon Approche » enregistrées avec succès !');
                setSelectedPhotoFile(null);
            }
        });
    };

    const showSection = (id) => activeTab === 'all' || activeTab === id;

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* EN-TÊTE UNIFIÉ */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-page-icon" aria-hidden="true">
                        <Heart size={24} />
                    </div>
                    <div>
                        <span className="admin-eyebrow">Page 2 du site public</span>
                        <h1 className="admin-title">Page Mon Approche</h1>
                        <p className="admin-subtitle">
                            Gérez le portrait officiel d&apos;Harmonie, votre biographie, vos 4 engagements qualité et vos marques cosmétiques partenaires (Nohèm, Green Spa, Oh My Jelly).
                        </p>
                    </div>
                </div>
                <div className="admin-page-actions">
                    <a
                        href="/mon-approche"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                    >
                        <ExternalLink size={15} /> Voir /mon-approche
                    </a>
                </div>
            </div>

            {/* BARRE D'ONGLETS ERGONOMIQUE */}
            <div className="admin-quicknav" role="tablist" aria-label="Sections de Mon Approche">
                <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`admin-quicknav-btn ${activeTab === 'all' ? 'active' : ''}`}
                >
                    <Layers size={15} /> Tout afficher
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('portrait')}
                    className={`admin-quicknav-btn ${activeTab === 'portrait' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">1</span>
                    <UserCheck size={14} /> Portrait &amp; Biographie
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('texts')}
                    className={`admin-quicknav-btn ${activeTab === 'texts' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">2</span>
                    <Type size={14} /> Engagements &amp; Cosmétiques
                </button>
            </div>

            {error && (
                <div className="admin-alert admin-alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="admin-alert admin-alert-success">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            {/* Rappel de synchronisation avec l'Accueil */}
            <div className="admin-info-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sparkles size={19} style={{ color: 'var(--admin-gold)', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--admin-text-muted)', lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--admin-text)' }}>Synchronisé avec l&apos;Accueil :</strong> Le portrait d&apos;Harmonie et sa biographie ci-dessous mettent automatiquement à jour l&apos;encart de présentation sur la Page d&apos;Accueil.
                    </p>
                </div>
                <Link href="/admin/dashboard/accueil" className="admin-btn admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '7px 13px' }}>
                    Aller à la Page d&apos;Accueil
                </Link>
            </div>

            {/* SECTION 1 : HISTOIRE, MARQUES & PHOTO OFFICIELLE */}
            {showSection('portrait') && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <span className="admin-eyebrow">Section 1 • Présentation &amp; Photo</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                <Heart size={20} style={{ color: 'var(--admin-gold)' }} />
                                Histoire d&apos;Harmonie &amp; Portrait Officiel
                            </h2>
                            <p className="admin-card-subtitle">
                                Modifiez votre texte de présentation, vos marques partenaires et recadrez votre photo officielle.
                            </p>
                        </div>
                    </div>

                    <form ref={storyFormRef} onSubmit={handleSaveAboutStory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="admin-story-grid">
                            {/* Colonne gauche : Textes FR */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label className="admin-label" htmlFor="about_title_fr">
                                        Titre d&apos;introduction
                                    </label>
                                    <input
                                        id="about_title_fr"
                                        type="text"
                                        name="about_title"
                                        defaultValue={info?.about_title || 'Une esthéticienne et masseuse passionnée, un lieu pensé pour vous'}
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="admin-label" htmlFor="about_story_fr">
                                        Histoire &amp; Philosophie *
                                    </label>
                                    <textarea
                                        id="about_story_fr"
                                        name="about_text"
                                        rows={8}
                                        required
                                        defaultValue={formatHarmonieBio(info?.about_text || info?.about_bio || `Je m'appelle Harmonie, j'ai ${calculateHarmonieAge()} ans, et je suis originaire de Château-Gontier, en Mayenne. Depuis plus de 10 ans, je me consacre avec passion au bien-être et à l'esthétique.\n\nAprès avoir exercé dans des spas d'hôtels étoilés et instituts reconnus, j'ai créé La Parenthèse Harmonieuse : un lieu dédié exclusivement aux femmes, pensé comme une bulle hors du temps où chaque détail a été soigné pour vous faire vivre un pur moment de relaxation et de reconnexion à soi.`)}
                                        className="admin-textarea"
                                        placeholder="Racontez votre parcours et votre approche..."
                                    />
                                </div>

                                <div>
                                    <label className="admin-label" htmlFor="brands_input">
                                        Marques cosmétiques partenaires
                                    </label>
                                    <input
                                        id="brands_input"
                                        type="text"
                                        name="brands"
                                        defaultValue={info?.brands || 'Nohèm (BIO certifié Ecocert), Green Spa (BIO Cosmos), Oh My Jelly'}
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="admin-label" htmlFor="tagline_fr">
                                        Accroche courte de l&apos;institut
                                    </label>
                                    <input
                                        id="tagline_fr"
                                        type="text"
                                        name="tagline"
                                        defaultValue={info?.tagline || 'Offrez-vous une parenthèse de bien-être...'}
                                        className="admin-input"
                                    />
                                </div>
                            </div>

                            {/* Colonne droite : Photo officielle Mon Approche */}
                            <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
                                <label className="admin-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                                    Portrait officiel d&apos;Harmonie
                                </label>
                                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.9rem', lineHeight: 1.45 }}>
                                    Affiché sur l&apos;accueil et en haut de la page /mon-approche.
                                </p>

                                <div style={{
                                    width: '100%',
                                    maxWidth: '280px',
                                    margin: '0 auto 1rem',
                                    aspectRatio: photoAspect,
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--admin-border)',
                                    boxShadow: 'var(--admin-shadow)',
                                    position: 'relative',
                                    background: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={aboutPhotoPreview}
                                        alt="Aperçu portrait Mon Approche"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        onLoad={(e) => {
                                            const w = e.target.naturalWidth;
                                            const h = e.target.naturalHeight;
                                            if (w && h) {
                                                setPhotoAspect(`${w} / ${h}`);
                                                const r = w / h;
                                                if (Math.abs(r - 1) < 0.08) setPhotoRatioLabel('Format 1:1 (Carré)');
                                                else if (Math.abs(r - 0.8) < 0.08) setPhotoRatioLabel('Format 4:5 (Portrait)');
                                                else if (Math.abs(r - 0.75) < 0.08) setPhotoRatioLabel('Format 3:4 (Standard)');
                                                else if (Math.abs(r - 16 / 9) < 0.1) setPhotoRatioLabel('Format 16:9 (Paysage)');
                                                else setPhotoRatioLabel(`${w} × ${h} px`);
                                            }
                                        }}
                                    />
                                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                                        <button
                                            type="button"
                                            onClick={handleRecrop}
                                            className="admin-btn"
                                            style={{
                                                background: 'rgba(28, 24, 21, 0.86)',
                                                backdropFilter: 'blur(6px)',
                                                color: '#E5CFA8',
                                                border: '1px solid rgba(197, 168, 128, 0.6)',
                                                padding: '6px 12px',
                                                fontSize: '0.78rem',
                                                fontWeight: '600',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            <Crop size={14} /> Recadrer
                                        </button>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        background: 'rgba(28, 24, 21, 0.82)',
                                        backdropFilter: 'blur(4px)',
                                        color: '#FAF7F2',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                    }}>
                                        {photoRatioLabel}
                                    </div>
                                </div>

                                <label style={{
                                    cursor: 'pointer',
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: '0.9rem',
                                    border: '1.5px dashed var(--admin-border-strong)',
                                    borderRadius: 'var(--admin-radius-sm)',
                                    background: '#FFFFFF',
                                }}>
                                    <UploadCloud size={22} style={{ color: 'var(--admin-gold)', margin: '0 auto 0.25rem' }} />
                                    <span style={{ fontSize: '0.84rem', color: 'var(--admin-text)', fontWeight: '600', display: 'block' }}>
                                        {selectedPhotoFile ? selectedPhotoFile.name : 'Remplacer le portrait'}
                                    </span>
                                    <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)' }}>
                                        JPG, PNG ou WebP avec recadrage libre
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handlePhotoChange}
                                    />
                                </label>

                                {aboutPhotoPreview !== DEFAULT_PORTRAIT && (
                                    <button
                                        type="button"
                                        onClick={handleResetPortrait}
                                        disabled={isPending}
                                        className="admin-btn admin-btn-secondary"
                                        style={{ width: '100%', marginTop: '0.65rem', fontSize: '0.8rem', padding: '7px 12px' }}
                                    >
                                        <RotateCcw size={14} /> Rétablir le portrait d&apos;origine
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--admin-border-soft)' }}>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="admin-btn admin-btn-primary"
                            >
                                {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                                Enregistrer l&apos;Histoire &amp; les Marques
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* SECTION 2 : TITRES & INTITULÉS DE LA PAGE MON APPROCHE */}
            {showSection('texts') && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <span className="admin-eyebrow">Section 2 • Contenus détaillés</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                <Type size={20} style={{ color: 'var(--admin-gold)' }} />
                                Titres, 4 Engagements &amp; Cosmétiques BIO
                            </h2>
                            <p className="admin-card-subtitle">
                                Modifiez chaque intitulé, les 4 piliers d&apos;engagement et la présentation Nohèm de la page /mon-approche.
                            </p>
                        </div>
                    </div>
                    <SiteTextsEditor
                        sections={ABOUT_PAGE_TEXT_SECTIONS}
                        overrides={customTexts}
                        searchable
                        collapsible
                        defaultOpenFirst
                    />
                </div>
            )}

            {cropper && (
                <ImageCropperModal
                    items={cropper.items}
                    targets={ABOUT_CROP_TARGETS}
                    onCancel={() => setCropper(null)}
                    onConfirm={handleCropped}
                    onComplete={handleCropped}
                />
            )}
        </div>
    );
}
