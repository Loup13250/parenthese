'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { updateAboutInfo } from '@/app/actions';
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
    Languages,
    Layers,
    Save,
    Crop,
    RotateCcw,
} from 'lucide-react';

const DEFAULT_PORTRAIT = '/images/harmonie-portrait.jpg';

export default function AProposAdminClient({ info = {}, customTexts = { fr: {}, en: {} } }) {
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

    return (
        <div className="anim-fade" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            {/* En-tête */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                <div>
                    <span className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                        Page Mon Approche
                    </span>
                    <h1 className="title-md" style={{ color: 'var(--admin-text)', marginBottom: '0.3rem' }}>
                        Mon Approche &amp; Philosophie
                    </h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.95rem' }}>
                        Gérez ici l&apos;histoire d&apos;Harmonie, le portrait officiel, vos marques partenaires et la philosophie de La Parenthèse Harmonieuse.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <a
                        href="/mon-approche"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                    >
                        <ExternalLink size={15} /> Voir la page /mon-approche
                    </a>
                </div>
            </div>

            {error && (
                <div className="admin-alert admin-alert-error" style={{ marginBottom: '1.5rem' }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            {/* Callout de synchronisation avec l'Accueil */}
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(184, 139, 70, 0.08) 0%, rgba(184, 139, 70, 0.02) 100%)',
                    border: '1px solid rgba(184, 139, 70, 0.3)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                }}
            >
                <Sparkles size={20} style={{ color: 'var(--admin-gold)', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--admin-text-muted)', lineHeight: 1.5 }}>
                    <strong>Éléments partagés avec l&apos;Accueil :</strong> Le portrait photographique officiel d&apos;Harmonie et sa biographie ci-dessous alimentent automatiquement la section de bienvenue de la{' '}
                    <Link href="/admin/dashboard/accueil" style={{ color: 'var(--admin-gold-dark)', textDecoration: 'underline', fontWeight: 600 }}>
                        Page d&apos;Accueil
                    </Link>.
                </p>
            </div>

            {/* SECTION 1: HISTOIRE, MARQUES & PHOTO OFFICIELLE */}
            <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Heart size={20} style={{ color: 'var(--admin-gold)' }} />
                        Histoire d&apos;Harmonie &amp; Portrait Officiel
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        Affiché sur l&apos;Accueil et sur /mon-approche
                    </span>
                </div>

                <form ref={storyFormRef} onSubmit={handleSaveAboutStory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="admin-story-grid">
                        {/* Colonne gauche : Textes FR / EN */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="admin-label" htmlFor="about_title_fr">
                                    Titre d&apos;introduction (FR)
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
                                    Histoire &amp; Philosophie (Français) *
                                </label>
                                <textarea
                                    id="about_story_fr"
                                    name="about_text"
                                    rows={7}
                                    required
                                    defaultValue={info?.about_text || "Je m'appelle Harmonie, j'ai 29 ans, et je suis originaire de Château-Gontier, en Mayenne. Depuis plus de 10 ans, je me consacre avec passion au bien-être et à l'esthétique.\n\nAprès avoir exercé dans des spas d'hôtels étoilés et instituts reconnus, j'ai créé La Parenthèse Harmonieuse : un lieu dédié exclusivement aux femmes, pensé comme une bulle hors du temps où chaque détail a été soigné pour vous faire vivre un pur moment de relaxation et de reconnexion à soi."}
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
                        <div>
                            <label className="admin-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Portrait officiel / Photo d&apos;illustration
                            </label>
                            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                Cette photographie s&apos;affiche dans votre portrait sur l&apos;accueil ainsi que sur la page /mon-approche.
                            </p>

                            <div style={{
                                width: '100%',
                                maxWidth: '320px',
                                margin: '0 auto 1rem',
                                aspectRatio: photoAspect,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid var(--admin-border)',
                                boxShadow: '0 6px 20px rgba(42, 36, 33, 0.12)',
                                position: 'relative',
                                background: 'var(--admin-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'aspect-ratio 0.25s ease',
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

                            <label className="admin-dropzone" style={{ cursor: 'pointer', display: 'block', textAlign: 'center', padding: '1rem', border: '2px dashed var(--admin-border)', borderRadius: '8px', background: 'var(--admin-bg)' }}>
                                <UploadCloud size={24} style={{ color: 'var(--admin-gold)', margin: '0 auto 0.25rem' }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text)', fontWeight: '600', display: 'block' }}>
                                    {selectedPhotoFile ? selectedPhotoFile.name : 'Choisir une nouvelle photo'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>JPG, PNG ou WebP (recadrage &amp; publication immédiate)</span>
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="admin-btn admin-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '12px 26px' }}
                        >
                            {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                            Enregistrer l&apos;Histoire &amp; les Marques
                        </button>
                    </div>
                </form>
            </div>

            {/* SECTION 2: TITRES & INTITULÉS DE LA PAGE MON APPROCHE */}
            <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <div>
                        <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Heart size={20} style={{ color: 'var(--admin-gold)' }} />
                            Titres, engagements &amp; cosmétiques de Mon Approche
                        </h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                            Modifiez chaque intitulé, les 4 engagements et les cosmétiques de la page publique /mon-approche.
                        </span>
                    </div>
                </div>
                <SiteTextsEditor sections={ABOUT_PAGE_TEXT_SECTIONS} overrides={customTexts} />
            </div>

            {/* SECTION 3: LIEN VERS LA CARTE DES SOINS */}
            <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', padding: '1.5rem 1.75rem', background: 'linear-gradient(135deg, rgba(184, 139, 70, 0.08) 0%, rgba(184, 139, 70, 0.02) 100%)', border: '1px solid rgba(184, 139, 70, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        background: 'rgba(184, 139, 70, 0.15)',
                        color: 'var(--admin-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Layers size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.05rem', color: 'var(--admin-text)', margin: '0 0 0.25rem', fontWeight: '600' }}>
                            Gestion des Soins &amp; Rituels
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                            La carte complète des soins (tarifs, durées, descriptions, contre-indications et photos) se gère dans l&apos;onglet dédié.
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/dashboard/prestations"
                    className="admin-btn admin-btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    <Sparkles size={16} /> Ouvrir la Carte des Soins
                </Link>
            </div>

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
