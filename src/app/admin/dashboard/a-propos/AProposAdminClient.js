'use client';

import { useState, useRef, useTransition } from 'react';
import { 
    updateAboutInfo 
} from '@/app/actions';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import ImageCropperModal, { ABOUT_CROP_TARGETS, uid } from '@/components/admin/ImageCropper';
import { ABOUT_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';
import Link from 'next/link';
import { 
    Heart, 
    Sparkles, 
    Plus, 
    Trash2, 
    Edit3, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    ArrowUp, 
    ArrowDown, 
    Loader2, 
    UploadCloud, 
    ExternalLink, 
    Languages, 
    Layers,
    Save,
    Crop
} from 'lucide-react';

/* Utilitaire de compression côté navigateur */
async function compressImageFile(file, maxWidth = 1400, quality = 0.82) {
    if (!file || !file.type.startsWith('image/')) return file;
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                if (w > maxWidth) {
                    h = Math.round((h * maxWidth) / w);
                    w = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(
                    (blob) => {
                        if (blob && blob.size < file.size) {
                            const newFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });
                            resolve(newFile);
                        } else {
                            resolve(file);
                        }
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = () => resolve(file);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
}

export default function AProposAdminClient({ info = {}, services = [], customTexts = { fr: {}, en: {} } }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // État de la photo Mon Approche
    const [aboutPhotoPreview, setAboutPhotoPreview] = useState(info?.about_image || null);
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [cropper, setCropper] = useState(null); // { items: [...] }
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

    // Gestion du choix de la photo Mon Approche (ouvre l'outil de recadrage ergonomique)
    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCropper({
            items: [{ id: uid(), file, name: file.name }],
        });
        e.target.value = '';
    };

    // Recadrer la photo actuellement affichée
    const handleRecrop = () => {
        if (!aboutPhotoPreview) return;
        if (selectedPhotoFile) {
            setCropper({
                items: [{ id: uid(), file: selectedPhotoFile, name: selectedPhotoFile.name }],
            });
        } else {
            setCropper({
                items: [{ id: uid(), url: aboutPhotoPreview, name: 'Photo Mon Approche' }],
            });
        }
    };

    // Résultat du recadrage : sauvegarde DIRECTE automatique
    const handleCropped = async (results) => {
        try {
            if (!results || results.length === 0) return;
            const croppedBlob = results[0]?.outputs?.image || results[0]?.outputs?.desktop || results[0]?.original;
            if (croppedBlob) {
                const file = croppedBlob instanceof File 
                    ? croppedBlob 
                    : new File([croppedBlob], 'a-propos.webp', { type: 'image/webp' });
                
                // Mettre à jour la prévisualisation immédiatement
                setAboutPhotoPreview(URL.createObjectURL(file));
                setSelectedPhotoFile(null);

                // Sauvegarde immédiate en base de données
                const formData = new FormData();
                const form = storyFormRef.current;
                formData.append('about_text', form?.about_text?.value || info?.about_text || '');
                formData.append('about_text_en', form?.about_text_en?.value || info?.about_text_en || '');
                formData.append('tagline', form?.tagline?.value || info?.tagline || '');
                formData.append('tagline_en', form?.tagline_en?.value || info?.tagline_en || '');
                formData.append('about_file', file);

                startTransition(async () => {
                    const res = await updateAboutInfo(formData);
                    if (res?.error) {
                        showNotification(res.error, true);
                    } else {
                        showNotification('Photo Mon Approche enregistrée et mise à jour avec succès !');
                    }
                });
            }
        } catch (err) {
            console.error('Error handling cropped about photo:', err);
            showNotification('Erreur lors de l’enregistrement de la photo.', true);
        } finally {
            setCropper(null);
        }
    };

    // Soumission du formulaire Histoire & Photo
    const handleSaveAboutStory = (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const formData = new FormData();

        formData.append('about_text', form.about_text.value);
        formData.append('about_text_en', form.about_text_en?.value || '');
        formData.append('tagline', form.tagline?.value || '');
        formData.append('tagline_en', form.tagline_en?.value || '');

        if (selectedPhotoFile) {
            formData.append('about_file', selectedPhotoFile);
        }

        startTransition(async () => {
            const res = await updateAboutInfo(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Présentation et photo "Mon Approche" enregistrées avec succès !');
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
                marginBottom: '2rem'
            }}>
                <div>
                    <span className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                        Page Mon Approche
                    </span>
                    <h1 className="title-md" style={{ color: 'var(--admin-text)', marginBottom: '0.3rem' }}>
                        Mon Approche &amp; Philosophie
                    </h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.95rem' }}>
                        Gérez ici l&apos;histoire d&apos;Harmonie, la photo officielle et la philosophie de La Parenthèse Harmonieuse.
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

            {/* Notifications */}
            {error && (
                <div className="admin-alert admin-alert-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            {/* SECTION 1: HISTOIRE & PHOTO OFFICIELLE */}
            <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Heart size={20} style={{ color: 'var(--admin-gold)' }} />
                        Histoire &amp; Photo Officielle
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        Section haute de la page /mon-approche
                    </span>
                </div>

                <form ref={storyFormRef} onSubmit={handleSaveAboutStory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="admin-story-grid">
                        {/* Colonne gauche : Textes FR / EN */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="admin-label" htmlFor="about_story_fr">
                                    Histoire &amp; Philosophie (Français) *
                                </label>
                                <textarea
                                    id="about_story_fr"
                                    name="about_text"
                                    rows={6}
                                    required
                                    defaultValue={info?.about_text || "Je m'appelle Harmonie, j'ai 29 ans, et je suis originaire de Château-Gontier en Mayenne. Depuis plus de 10 ans, je me consacre avec passion au bien-être et à l'esthétique.\n\nAprès avoir exercé dans des spas d'hôtels étoilés et instituts reconnus, j'ai créé La Parenthèse Harmonieuse : un lieu dédié exclusivement aux femmes, pensé comme une bulle hors du temps où chaque détail a été soigné pour vous faire vivre un pur moment de relaxation."}
                                    className="admin-textarea"
                                    placeholder="Racontez la passion et le parcours d'Harmonie..."
                                />
                            </div>

                            <div>
                                <label className="admin-label" htmlFor="about_story_en" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Languages size={14} style={{ color: 'var(--admin-gold)' }} /> Histoire en Anglais (Optionnel)
                                </label>
                                <textarea
                                    id="about_story_en"
                                    name="about_text_en"
                                    rows={5}
                                    defaultValue={info?.about_text_en || "My name is Harmonie. For over 10 years, I have dedicated myself with passion to wellness and beauty.\n\nLa Parenthèse Harmonieuse is a private institute exclusively dedicated to women, designed as a haven outside of time."}
                                    className="admin-textarea"
                                    placeholder="Story in English..."
                                />
                            </div>

                            {/* Tagline courte FR / EN */}
                            <div className="admin-grid-2col">
                                <div>
                                    <label className="admin-label" htmlFor="tagline_fr">
                                        Accroche courte (FR)
                                    </label>
                                    <input
                                        id="tagline_fr"
                                        type="text"
                                        name="tagline"
                                        defaultValue={info?.tagline || 'Offrez-vous une parenthèse de bien-être...'}
                                        className="admin-input"
                                    />
                                </div>
                                <div>
                                    <label className="admin-label" htmlFor="tagline_en" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Languages size={14} style={{ color: 'var(--admin-gold)' }} /> Accroche (EN)
                                    </label>
                                    <input
                                        id="tagline_en"
                                        type="text"
                                        name="tagline_en"
                                        defaultValue={info?.tagline_en || 'A gentle retreat dedicated to your well-being'}
                                        className="admin-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Colonne droite : Photo officielle Mon Approche */}
                        <div>
                            <label className="admin-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Photo officielle d&apos;illustration (Portrait ou cabine)
                            </label>
                            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.75rem' }}>
                                Cette photo apparaît à droite de votre philosophie sur la page /mon-approche.
                            </p>

                            <div style={{
                                width: '100%',
                                maxWidth: '320px',
                                margin: '0 auto 1.25rem',
                                aspectRatio: photoAspect,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid var(--admin-border)',
                                boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
                                position: 'relative',
                                background: 'var(--admin-surface)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'aspect-ratio 0.25s ease',
                            }}>
                                {aboutPhotoPreview ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={aboutPhotoPreview}
                                            alt="Aperçu photo Mon Approche"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onLoad={(e) => {
                                                const w = e.target.naturalWidth;
                                                const h = e.target.naturalHeight;
                                                if (w && h) {
                                                    setPhotoAspect(`${w} / ${h}`);
                                                    const r = w / h;
                                                    if (Math.abs(r - 1) < 0.08) {
                                                        setPhotoRatioLabel('Format 1:1 (Carré)');
                                                    } else if (Math.abs(r - 0.8) < 0.08) {
                                                        setPhotoRatioLabel('Format 4:5 (Portrait)');
                                                    } else if (Math.abs(r - 0.75) < 0.08) {
                                                        setPhotoRatioLabel('Format 3:4 (Standard)');
                                                    } else if (Math.abs(r - 16 / 9) < 0.1) {
                                                        setPhotoRatioLabel('Format 16:9 (Paysage)');
                                                    } else {
                                                        setPhotoRatioLabel(`${w} × ${h} px`);
                                                    }
                                                }
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            display: 'flex',
                                            gap: '6px',
                                        }}>
                                            <button
                                                type="button"
                                                onClick={handleRecrop}
                                                className="admin-btn"
                                                style={{
                                                    background: 'rgba(26, 24, 21, 0.88)',
                                                    backdropFilter: 'blur(6px)',
                                                    color: 'var(--admin-gold)',
                                                    border: '1px solid var(--admin-gold)',
                                                    padding: '6px 12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                                }}
                                                title="Ajuster le cadrage ou le zoom de la photo"
                                            >
                                                <Crop size={14} /> Recadrer la photo
                                            </button>
                                        </div>
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: 'rgba(26, 24, 21, 0.85)',
                                            backdropFilter: 'blur(4px)',
                                            color: 'var(--admin-text-subtle)',
                                            fontSize: '0.72rem',
                                            fontWeight: '600',
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--admin-border)',
                                        }}>
                                            {photoRatioLabel}
                                        </div>
                                    </>
                                ) : (
                                    <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Aucune photo sélectionnée</span>
                                )}
                            </div>

                            <label className="admin-dropzone" style={{ cursor: 'pointer', display: 'block', textAlign: 'center', padding: '1rem', border: '2px dashed var(--admin-border)', borderRadius: '8px' }}>
                                <UploadCloud size={24} style={{ color: 'var(--admin-gold)', margin: '0 auto 0.25rem' }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text)', fontWeight: '500', display: 'block' }}>
                                    {selectedPhotoFile ? selectedPhotoFile.name : 'Changer la photo Mon Approche'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>JPG, PNG ou WebP (recadrage &amp; compression auto)</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="admin-btn admin-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '12px 24px' }}
                        >
                            {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                            Enregistrer l&apos;Histoire et la Photo
                        </button>
                    </div>
                </form>
            </div>

            {/* SECTION 1 bis: TITRES & INTITULÉS DE LA PAGE (FR / EN) */}
            <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Languages size={20} style={{ color: 'var(--admin-gold)' }} />
                            Titres &amp; intitulés de la page
                        </h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                            Ex : « Une Approche Holistique et Bienveillante », les 4 piliers de soin… en français et en anglais.
                        </span>
                    </div>
                    <Link href="/admin/dashboard/textes" className="admin-btn admin-btn-secondary" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Languages size={14} /> Tous les textes du site
                    </Link>
                </div>
                <SiteTextsEditor sections={ABOUT_PAGE_TEXT_SECTIONS} overrides={customTexts} />
            </div>

            {/* SECTION 2: LIEN VERS LA CARTE DES SOINS */}
            <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', padding: '1.5rem 1.75rem', background: 'linear-gradient(135deg, rgba(200, 169, 110, 0.08) 0%, rgba(200, 169, 110, 0.02) 100%)', border: '1px solid rgba(200, 169, 110, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '10px',
                        background: 'rgba(200, 169, 110, 0.15)', color: 'var(--admin-gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Layers size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.05rem', color: 'var(--admin-text)', margin: '0 0 0.25rem', fontWeight: '600' }}>
                            Gestion des Soins &amp; Rituels
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                            La carte complète des soins (tarifs, durées, descriptions, photos et coups de cœur accueil) se gère directement dans l&apos;onglet dédié.
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/dashboard/prestations"
                    className="admin-btn admin-btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                >
                    <Sparkles size={16} /> Ouvrir la Carte des Soins
                </Link>
            </div>
            {/* Modal de recadrage ergonomique */}
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
