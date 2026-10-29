'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import Image from 'next/image';
import {
    updateSiteInfo,
    updateSiteLogo,
    updateSiteIcon,
    updateHeroMedia,
    changeAdminPassword,
    restoreDatabaseFromBackup,
} from '@/app/actions';
import ImageCropperModal, {
    LOGO_CROP_TARGETS,
    FAVICON_CROP_TARGETS,
    HERO_POSTER_CROP_TARGETS,
} from '@/components/admin/ImageCropper';
import {
    Save,
    Image as ImageIcon,
    Mail,
    Phone,
    Globe,
    UploadCloud,
    CheckCircle2,
    Download,
    ShieldCheck,
    AlertCircle,
    Loader2,
    Crop,
    RotateCcw,
    X,
    Film,
    Lock,
    Building2,
    Clock,
    CalendarCheck,
    Eye,
    EyeOff,
    Sparkles,
} from 'lucide-react';

export default function SettingsFormClient({ info = {} }) {
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

    // --- 1. Logo Principal (Barre de navigation & Pied de page) ---
    const [logoPreview, setLogoPreview] = useState(info?.logo || '/images/logo.png');
    const [logoFile, setLogoFile] = useState(null);
    const [logoSaving, setLogoSaving] = useState(false);
    const [logoFeedback, setLogoFeedback] = useState({ error: '', success: '' });

    // --- 2. Favicon / Icône Onglet Navigateur ---
    const [siteIconPreview, setSiteIconPreview] = useState(info?.site_icon || '/icon.png');
    const [siteIconFile, setSiteIconFile] = useState(null);
    const [siteIconSaving, setSiteIconSaving] = useState(false);
    const [siteIconFeedback, setSiteIconFeedback] = useState({ error: '', success: '' });

    // --- 3. Bannière Vidéo & Image d'Accueil (Hero) ---
    const [heroVideoPreview, setHeroVideoPreview] = useState(info?.hero_video || '/videos/hero-massage.mp4');
    const [heroVideoFile, setHeroVideoFile] = useState(null);
    const [heroVideoUrlInput, setHeroVideoUrlInput] = useState('');
    const [heroPosterPreview, setHeroPosterPreview] = useState(info?.hero_poster || '/images/hero-poster.jpg');
    const [heroPosterFile, setHeroPosterFile] = useState(null);
    const [heroSaving, setHeroSaving] = useState(false);
    const [heroFeedback, setHeroFeedback] = useState({ error: '', success: '' });

    // --- Modal de recadrage ---
    const [cropper, setCropper] = useState(null); // { file?, url?, type: 'logo'|'favicon'|'poster', targets, title }

    // --- Soumission globale du formulaire ---
    const [loading, setLoading] = useState(false);
    const [formStatus, setFormStatus] = useState({ error: '', success: '' });

    // --- Changement de mot de passe ---
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdStatus, setPwdStatus] = useState({ error: '', success: '' });
    const [showPwd, setShowPwd] = useState(false);
    const pwdFormRef = useRef(null);

    // --- Sauvegarde & Restauration ---
    const [isRestoring, startRestoreTransition] = useTransition();
    const [restoreStatus, setRestoreStatus] = useState({ error: '', success: '' });

    const logoInputRef = useRef(null);
    const siteIconInputRef = useRef(null);
    const heroVideoInputRef = useRef(null);
    const heroPosterInputRef = useRef(null);
    const restoreInputRef = useRef(null);

    // Sélection d'un fichier logo
    const handleLogoFileSelect = (file) => {
        if (!file) return;
        setLogoFeedback({ error: '', success: '' });
        if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
            setLogoFeedback({ error: 'Veuillez choisir une image PNG, JPG, WebP ou SVG.', success: '' });
            return;
        }
        if (file.name.endsWith('.svg') || file.type.includes('svg')) {
            setLogoFile(file);
            setLogoPreview(trackBlobUrl(URL.createObjectURL(file)));
            return;
        }
        setCropper({
            file,
            type: 'logo',
            targets: LOGO_CROP_TARGETS,
            title: 'Recadrer le logo principal de La Parenthèse Harmonieuse',
        });
    };

    // Sélection d'un fichier favicon
    const handleSiteIconFileSelect = (file) => {
        if (!file) return;
        setSiteIconFeedback({ error: '', success: '' });
        if (!file.type.startsWith('image/') && !file.name.endsWith('.svg') && !file.name.endsWith('.ico')) {
            setSiteIconFeedback({ error: 'Veuillez choisir une icône PNG, WebP, SVG ou ICO.', success: '' });
            return;
        }
        if (file.name.endsWith('.svg') || file.type.includes('svg') || file.name.endsWith('.ico')) {
            setSiteIconFile(file);
            setSiteIconPreview(trackBlobUrl(URL.createObjectURL(file)));
            return;
        }
        setCropper({
            file,
            type: 'favicon',
            targets: FAVICON_CROP_TARGETS,
            title: "Recadrer l'icône d'onglet navigateur (Favicon 1:1)",
        });
    };

    // Sélection d'une image d'aperçu Hero
    const handleHeroPosterSelect = (file) => {
        if (!file) return;
        setHeroFeedback({ error: '', success: '' });
        if (!file.type.startsWith('image/')) {
            setHeroFeedback({ error: 'Veuillez sélectionner une image JPG, PNG ou WebP.', success: '' });
            return;
        }
        setCropper({
            file,
            type: 'poster',
            targets: HERO_POSTER_CROP_TARGETS,
            title: "Recadrer l'image d'accueil (16:9)",
        });
    };

    // Sélection d'une vidéo d'accueil
    const handleHeroVideoSelect = (file) => {
        if (!file) return;
        setHeroFeedback({ error: '', success: '' });
        if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov)$/i.test(file.name)) {
            setHeroFeedback({ error: 'Veuillez sélectionner une vidéo MP4, WebM ou MOV.', success: '' });
            return;
        }
        const maxVideoBytes = 4.5 * 1024 * 1024;
        if (file.size > maxVideoBytes) {
            setHeroFeedback({
                error: "Cette vidéo dépasse 4,5 Mo (limite d'envoi direct en ligne). Compressez-la légèrement en MP4 ou collez un lien direct vers la vidéo ci-dessous.",
                success: '',
            });
            return;
        }
        setHeroVideoFile(file);
        setHeroVideoUrlInput('');
        setHeroVideoPreview(trackBlobUrl(URL.createObjectURL(file)));
    };

    // Validation du recadrage
    const handleCropped = (results) => {
        if (!cropper || !results || results.length === 0) {
            setCropper(null);
            return;
        }
        const first = results[0];
        if (cropper.type === 'logo') {
            const croppedFile = first.outputs?.logo || first.original;
            if (croppedFile) {
                setLogoFile(croppedFile);
                setLogoPreview(trackBlobUrl(URL.createObjectURL(croppedFile)));
            }
        } else if (cropper.type === 'favicon') {
            const croppedFile = first.outputs?.favicon || first.original;
            if (croppedFile) {
                setSiteIconFile(croppedFile);
                setSiteIconPreview(trackBlobUrl(URL.createObjectURL(croppedFile)));
            }
        } else if (cropper.type === 'poster') {
            const croppedFile = first.outputs?.poster || first.original;
            if (croppedFile) {
                setHeroPosterFile(croppedFile);
                setHeroPosterPreview(trackBlobUrl(URL.createObjectURL(croppedFile)));
            }
        }
        setCropper(null);
    };

    // Publication rapide Logo
    const handleQuickSaveLogo = async () => {
        if (!logoFile) return;
        setLogoSaving(true);
        setLogoFeedback({ error: '', success: '' });
        try {
            const fd = new FormData();
            fd.append('logo_file', logoFile);
            const res = await updateSiteLogo(fd);
            if (res?.error) {
                setLogoFeedback({ error: res.error, success: '' });
            } else {
                setLogoFile(null);
                if (res?.url) setLogoPreview(res.url);
                setLogoFeedback({ error: '', success: 'Logo mis à jour sur tout le site !' });
                setTimeout(() => setLogoFeedback({ error: '', success: '' }), 3500);
            }
        } catch (err) {
            setLogoFeedback({ error: err.message || 'Erreur lors de la sauvegarde du logo.', success: '' });
        } finally {
            setLogoSaving(false);
        }
    };

    const handleResetLogo = async () => {
        if (!confirm('Rétablir le logo officiel par défaut de La Parenthèse Harmonieuse ?')) return;
        setLogoSaving(true);
        setLogoFeedback({ error: '', success: '' });
        try {
            const fd = new FormData();
            fd.append('reset', '1');
            const res = await updateSiteLogo(fd);
            if (res?.error) {
                setLogoFeedback({ error: res.error, success: '' });
            } else {
                setLogoFile(null);
                setLogoPreview('/images/logo.png');
                setLogoFeedback({ error: '', success: 'Logo officiel rétabli par défaut.' });
                setTimeout(() => setLogoFeedback({ error: '', success: '' }), 3500);
            }
        } catch (err) {
            setLogoFeedback({ error: err.message || 'Erreur lors de la réinitialisation.', success: '' });
        } finally {
            setLogoSaving(false);
        }
    };

    // Publication rapide Favicon
    const handleQuickSaveIcon = async () => {
        if (!siteIconFile) return;
        setSiteIconSaving(true);
        setSiteIconFeedback({ error: '', success: '' });
        try {
            const fd = new FormData();
            fd.append('site_icon_file', siteIconFile);
            const res = await updateSiteIcon(fd);
            if (res?.error) {
                setSiteIconFeedback({ error: res.error, success: '' });
            } else {
                setSiteIconFile(null);
                if (res?.url) setSiteIconPreview(res.url);
                setSiteIconFeedback({ error: '', success: 'Icône du navigateur mise à jour !' });
                setTimeout(() => setSiteIconFeedback({ error: '', success: '' }), 3500);
            }
        } catch (err) {
            setSiteIconFeedback({ error: err.message || "Erreur lors de la sauvegarde de l'icône.", success: '' });
        } finally {
            setSiteIconSaving(false);
        }
    };

    const handleResetIcon = async () => {
        if (!confirm("Rétablir l'icône d'onglet par défaut ?")) return;
        setSiteIconSaving(true);
        setSiteIconFeedback({ error: '', success: '' });
        try {
            const fd = new FormData();
            fd.append('reset', '1');
            const res = await updateSiteIcon(fd);
            if (res?.error) {
                setSiteIconFeedback({ error: res.error, success: '' });
            } else {
                setSiteIconFile(null);
                setSiteIconPreview('/icon.png');
                setSiteIconFeedback({ error: '', success: 'Icône par défaut rétablie.' });
                setTimeout(() => setSiteIconFeedback({ error: '', success: '' }), 3500);
            }
        } catch (err) {
            setSiteIconFeedback({ error: err.message || 'Erreur lors de la réinitialisation.', success: '' });
        } finally {
            setSiteIconSaving(false);
        }
    };

    // Publication rapide Bannière Hero (Vidéo & Poster)
    const handleQuickSaveHero = async (opts = {}) => {
        setHeroSaving(true);
        setHeroFeedback({ error: '', success: '' });
        try {
            const fd = new FormData();
            if (opts.resetVideo) {
                fd.append('reset_video', '1');
            } else if (heroVideoFile) {
                fd.append('hero_video_file', heroVideoFile);
            } else if (heroVideoUrlInput.trim()) {
                fd.append('hero_video_url', heroVideoUrlInput.trim());
            }

            if (opts.resetPoster) {
                fd.append('reset_poster', '1');
            } else if (heroPosterFile) {
                fd.append('hero_poster_file', heroPosterFile);
            }

            const res = await updateHeroMedia(fd);
            if (res?.error) {
                setHeroFeedback({ error: res.error, success: '' });
            } else {
                if (opts.resetVideo) {
                    setHeroVideoFile(null);
                    setHeroVideoUrlInput('');
                    setHeroVideoPreview('/videos/hero-massage.mp4');
                } else if (res?.hero_video) {
                    setHeroVideoFile(null);
                    setHeroVideoUrlInput('');
                    setHeroVideoPreview(res.hero_video);
                }
                if (opts.resetPoster) {
                    setHeroPosterFile(null);
                    setHeroPosterPreview('/images/hero-poster.jpg');
                } else if (res?.hero_poster) {
                    setHeroPosterFile(null);
                    setHeroPosterPreview(res.hero_poster);
                }
                setHeroFeedback({ error: '', success: "Bannière d'accueil mise à jour avec succès !" });
                setTimeout(() => setHeroFeedback({ error: '', success: '' }), 3500);
            }
        } catch (err) {
            setHeroFeedback({ error: err.message || "Erreur lors de la mise à jour de la bannière.", success: '' });
        } finally {
            setHeroSaving(false);
        }
    };

    // Soumission globale du formulaire principal
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormStatus({ error: '', success: '' });

        try {
            const formData = new FormData(e.target);
            formData.delete('logo_file');
            formData.delete('site_icon_file');
            formData.delete('hero_video_file');
            formData.delete('hero_poster_file');

            if (logoFile) formData.append('logo_file', logoFile);
            if (siteIconFile) formData.append('site_icon_file', siteIconFile);
            if (heroVideoFile) formData.append('hero_video_file', heroVideoFile);
            else if (heroVideoUrlInput.trim()) formData.set('hero_video', heroVideoUrlInput.trim());
            if (heroPosterFile) formData.append('hero_poster_file', heroPosterFile);

            const res = await updateSiteInfo(formData);
            if (res?.error) {
                setFormStatus({ error: res.error, success: '' });
            } else {
                setLogoFile(null);
                setSiteIconFile(null);
                setHeroVideoFile(null);
                setHeroPosterFile(null);
                setFormStatus({ error: '', success: 'Toutes les modifications ont été enregistrées et publiées !' });
                setTimeout(() => setFormStatus({ error: '', success: '' }), 4000);
            }
        } catch (err) {
            setFormStatus({ error: err.message || 'Une erreur est survenue lors de la sauvegarde.', success: '' });
        } finally {
            setLoading(false);
        }
    };

    // Soumission changement de mot de passe
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPwdLoading(true);
        setPwdStatus({ error: '', success: '' });
        try {
            const fd = new FormData(e.target);
            const res = await changeAdminPassword(fd);
            if (res?.error) {
                setPwdStatus({ error: res.error, success: '' });
            } else {
                pwdFormRef.current?.reset();
                setPwdStatus({ error: '', success: res?.message || 'Votre mot de passe administrateur a été modifié avec succès.' });
                setTimeout(() => setPwdStatus({ error: '', success: '' }), 5000);
            }
        } catch (err) {
            setPwdStatus({ error: err.message || 'Erreur lors du changement de mot de passe.', success: '' });
        } finally {
            setPwdLoading(false);
        }
    };

    const handleRestoreFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm('Attention : la restauration va remplacer les données actuelles par celles du fichier de sauvegarde sélectionné. Voulez-vous continuer ?')) {
            e.target.value = '';
            return;
        }

        const formData = new FormData();
        formData.append('backup_file', file);

        setRestoreStatus({ error: '', success: '' });
        startRestoreTransition(async () => {
            const res = await restoreDatabaseFromBackup(formData);
            if (res?.error) {
                setRestoreStatus({ error: res.error, success: '' });
            } else {
                setRestoreStatus({ error: '', success: 'Base de données restaurée avec succès ! Actualisation de la page…' });
                setTimeout(() => window.location.reload(), 1500);
            }
            e.target.value = '';
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
                {formStatus.success && (
                    <div className="admin-alert admin-alert-success">
                        <CheckCircle2 size={18} /> <span>{formStatus.success}</span>
                    </div>
                )}
                {formStatus.error && (
                    <div className="admin-alert admin-alert-error">
                        <AlertCircle size={18} /> <span>{formStatus.error}</span>
                    </div>
                )}

                {/* =====================================================
                   1. LOGO PRINCIPAL DU SITE (Barre de navigation)
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--admin-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <ImageIcon size={19} style={{ color: 'var(--admin-gold)' }} />
                            1. Logo Principal du Site (En-tête &amp; Pied de page)
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-gold)', background: 'rgba(184, 139, 70, 0.1)', border: '1px solid rgba(184, 139, 70, 0.3)', padding: '3px 9px', borderRadius: '4px', fontWeight: '600' }}>
                            Navigation &amp; Signature
                        </span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--admin-text-muted)', marginBottom: '1.25rem', lineHeight: '1.55' }}>
                        Le logo officiel affiché dans la barre de navigation et le pied de page. Vous pouvez le remplacer et le recadrer à tout moment en conservant la transparence PNG.
                    </p>

                    <div style={{
                        background: 'var(--admin-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--admin-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Aperçu en conditions réelles (barre de navigation albâtre) :
                                </span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--admin-gold-dark)', fontWeight: '600', background: 'rgba(184, 139, 70, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                                    Identité La Parenthèse Harmonieuse
                                </span>
                            </div>
                            <div style={{
                                background: '#FAF7F2',
                                border: '1px solid rgba(197, 168, 128, 0.35)',
                                borderRadius: '8px',
                                padding: '12px 22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                boxShadow: '0 4px 18px rgba(42, 36, 33, 0.06)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: '56px' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: '#FFFFFF',
                                        border: '1.5px solid rgba(197, 168, 128, 0.55)',
                                        boxShadow: '0 4px 12px rgba(42, 36, 33, 0.08)',
                                        padding: '4px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                    }}>
                                        <Image
                                            src={logoPreview}
                                            alt="Logo La Parenthèse Harmonieuse"
                                            width={52}
                                            height={52}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                            unoptimized
                                        />
                                    </div>
                                    <div style={{ lineHeight: 1.2 }}>
                                        <div style={{ fontFamily: 'var(--font-heading), Georgia, serif', fontSize: '1.05rem', color: '#2C2623', fontWeight: 600 }}>
                                            La Parenthèse
                                        </div>
                                        <div style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A6735', fontWeight: 600 }}>
                                            Harmonieuse
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.1rem', color: '#2C2623', fontSize: '0.76rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', flexWrap: 'wrap' }}>
                                    <span style={{ color: '#9E7D52' }}>Accueil</span>
                                    <span>Mon Approche</span>
                                    <span>Carte des Soins</span>
                                    <span>Carte Cadeau</span>
                                    <span>Contact</span>
                                </div>
                            </div>
                        </div>

                        {logoFeedback.error && (
                            <div className="admin-alert admin-alert-error" style={{ padding: '0.65rem 0.9rem', fontSize: '0.84rem' }}>
                                <AlertCircle size={16} /> <span>{logoFeedback.error}</span>
                            </div>
                        )}
                        {logoFeedback.success && (
                            <div className="admin-alert admin-alert-success" style={{ padding: '0.65rem 0.9rem', fontSize: '0.84rem' }}>
                                <CheckCircle2 size={16} /> <span>{logoFeedback.success}</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.25rem' }}>
                            <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="admin-btn admin-btn-secondary"
                                style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                            >
                                <UploadCloud size={15} /> Choisir une nouvelle image
                            </button>

                            {logoPreview && !logoPreview.endsWith('.svg') && (
                                <button
                                    type="button"
                                    onClick={() => setCropper({
                                        file: logoFile || undefined,
                                        url: logoFile ? undefined : logoPreview,
                                        type: 'logo',
                                        targets: LOGO_CROP_TARGETS,
                                        title: 'Recadrer le logo de navigation',
                                    })}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                                >
                                    <Crop size={15} /> Ajuster le recadrage
                                </button>
                            )}

                            {logoPreview !== '/images/logo.png' && (
                                <button
                                    type="button"
                                    onClick={handleResetLogo}
                                    disabled={logoSaving}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                                >
                                    <RotateCcw size={14} /> Rétablir le logo par défaut
                                </button>
                            )}

                            {logoFile && (
                                <button
                                    type="button"
                                    onClick={handleQuickSaveLogo}
                                    disabled={logoSaving}
                                    className="admin-btn admin-btn-primary"
                                    style={{ fontSize: '0.82rem', padding: '8px 18px' }}
                                >
                                    {logoSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                                    Publier ce logo immédiatement
                                </button>
                            )}
                        </div>

                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                handleLogoFileSelect(e.target.files?.[0]);
                                e.target.value = '';
                            }}
                        />
                    </div>
                </div>

                {/* =====================================================
                   2. PETIT LOGO / FAVICON / ICÔNE DU NAVIGATEUR
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--admin-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Globe size={19} style={{ color: 'var(--admin-gold)' }} />
                            2. Icône d&apos;Onglet Navigateur (Favicon)
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-gold)', background: 'rgba(184, 139, 70, 0.1)', border: '1px solid rgba(184, 139, 70, 0.3)', padding: '3px 9px', borderRadius: '4px', fontWeight: '600' }}>
                            Onglet Web &amp; Favoris
                        </span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--admin-text-muted)', marginBottom: '1.25rem', lineHeight: '1.55' }}>
                        La petite icône ronde ivoire et or champagne affichée à côté du titre dans l&apos;onglet Chrome, Safari ou Firefox ainsi que dans les favoris de vos clientes.
                    </p>

                    <div style={{
                        background: 'var(--admin-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--admin-text-subtle)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Aperçu dans l&apos;onglet du navigateur :
                            </span>
                            <div style={{
                                background: '#EAE5DC',
                                border: '1px solid rgba(42, 35, 29, 0.16)',
                                borderRadius: '8px 8px 0 0',
                                padding: '8px 12px 0 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                maxWidth: '100%',
                            }}>
                                <div style={{
                                    background: '#FFFFFF',
                                    borderRadius: '8px 8px 0 0',
                                    padding: '8px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#2A231D',
                                    fontSize: '0.82rem',
                                    borderTop: '2px solid #C5A880',
                                    boxShadow: '0 -2px 6px rgba(42, 35, 29, 0.05)',
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #FAF7F2 0%, #E8DFD1 100%)',
                                        border: '1px solid #C5A880',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                    }}>
                                        <Image
                                            src={siteIconPreview}
                                            alt="Favicon"
                                            width={18}
                                            height={18}
                                            style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                                            unoptimized
                                        />
                                    </div>
                                    <span style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '230px' }}>
                                        La Parenthèse Harmonieuse | Bien-être…
                                    </span>
                                    <X size={12} style={{ color: '#8A7E71', marginLeft: '6px' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.15rem',
                            padding: '0.9rem 1.1rem',
                            background: '#FFFFFF',
                            borderRadius: '8px',
                            border: '1px solid var(--admin-border-soft)',
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FAF7F2 0%, #F4EDE2 55%, #E8DFD1 100%)',
                                border: '2px solid #C5A880',
                                boxShadow: '0 4px 14px rgba(42, 36, 33, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}>
                                <Image
                                    src={siteIconPreview}
                                    alt="Médaillon Favicon"
                                    width={48}
                                    height={48}
                                    style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                                    unoptimized
                                />
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
                                <strong style={{ color: 'var(--admin-text)', display: 'block', marginBottom: '2px', fontSize: '0.88rem' }}>
                                    Médaillon circulaire albâtre &amp; liseré or champagne
                                </strong>
                                L&apos;outil de cadrage applique automatiquement un fond sablé lumineux et un fin liseré doré afin que votre emblème reste parfaitement lisible sur les onglets clairs comme sombres.
                            </div>
                        </div>

                        {siteIconFeedback.error && (
                            <div className="admin-alert admin-alert-error" style={{ padding: '0.65rem 0.9rem', fontSize: '0.84rem' }}>
                                <AlertCircle size={16} /> <span>{siteIconFeedback.error}</span>
                            </div>
                        )}
                        {siteIconFeedback.success && (
                            <div className="admin-alert admin-alert-success" style={{ padding: '0.65rem 0.9rem', fontSize: '0.84rem' }}>
                                <CheckCircle2 size={16} /> <span>{siteIconFeedback.success}</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.25rem' }}>
                            <button
                                type="button"
                                onClick={() => siteIconInputRef.current?.click()}
                                className="admin-btn admin-btn-secondary"
                                style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                            >
                                <UploadCloud size={15} /> Choisir &amp; Recadrer le favicon (1:1)
                            </button>

                            {siteIconPreview && !siteIconPreview.endsWith('.svg') && !siteIconPreview.endsWith('.ico') && (
                                <button
                                    type="button"
                                    onClick={() => setCropper({
                                        file: siteIconFile || undefined,
                                        url: siteIconFile ? undefined : siteIconPreview,
                                        type: 'favicon',
                                        targets: FAVICON_CROP_TARGETS,
                                        title: "Recadrer l'icône favicon (carré 1:1)",
                                    })}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                                >
                                    <Crop size={15} /> Ajuster le recadrage
                                </button>
                            )}

                            {siteIconPreview !== '/icon.png' && (
                                <button
                                    type="button"
                                    onClick={handleResetIcon}
                                    disabled={siteIconSaving}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                                >
                                    <RotateCcw size={14} /> Rétablir par défaut
                                </button>
                            )}

                            {siteIconFile && (
                                <button
                                    type="button"
                                    onClick={handleQuickSaveIcon}
                                    disabled={siteIconSaving}
                                    className="admin-btn admin-btn-primary"
                                    style={{ fontSize: '0.82rem', padding: '8px 18px' }}
                                >
                                    {siteIconSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                                    Publier le favicon immédiatement
                                </button>
                            )}
                        </div>

                        <input
                            ref={siteIconInputRef}
                            type="file"
                            accept="image/png,image/webp,image/jpeg,image/svg+xml,.svg,image/x-icon,image/vnd.microsoft.icon,.ico"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                handleSiteIconFileSelect(e.target.files?.[0]);
                                e.target.value = '';
                            }}
                        />
                    </div>
                </div>

                {/* =====================================================
                   3. BANNIÈRE VIDÉO & IMAGE D'ACCUEIL (HERO)
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--admin-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Film size={19} style={{ color: 'var(--admin-gold)' }} />
                            3. Bannière Vidéo &amp; Image d&apos;Accueil
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-gold)', background: 'rgba(184, 139, 70, 0.1)', border: '1px solid rgba(184, 139, 70, 0.3)', padding: '3px 9px', borderRadius: '4px', fontWeight: '600' }}>
                            Plein écran Page d&apos;Accueil
                        </span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--admin-text-muted)', marginBottom: '1.25rem', lineHeight: '1.55' }}>
                        Personnalisez la vidéo d&apos;ambiance diffusée en haut de la page d&apos;accueil ainsi que l&apos;image fixe (poster) affichée pendant son chargement ou lorsque l&apos;économie d&apos;animation est activée.
                    </p>

                    <div style={{
                        background: 'var(--admin-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                    }}>
                        {/* Aperçu double : Vidéo + Poster */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--admin-text-subtle)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Vidéo d&apos;ambiance actuelle :
                                </span>
                                <div style={{ aspectRatio: '16 / 9', borderRadius: '8px', overflow: 'hidden', background: '#1A1614', border: '1px solid var(--admin-border)', position: 'relative' }}>
                                    <video
                                        key={heroVideoUrlInput.trim() || heroVideoPreview}
                                        src={heroVideoUrlInput.trim() || heroVideoPreview}
                                        poster={heroPosterPreview}
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--admin-text-subtle)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Image d&apos;aperçu (Poster 16:9) :
                                </span>
                                <div style={{ aspectRatio: '16 / 9', borderRadius: '8px', overflow: 'hidden', background: '#1A1614', border: '1px solid var(--admin-border)', position: 'relative' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={heroPosterPreview}
                                        alt="Aperçu Poster Accueil"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contrôles Vidéo + Poster */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border-soft)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <strong style={{ fontSize: '0.86rem', color: 'var(--admin-text)' }}>Changer la vidéo d&apos;accueil</strong>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        onClick={() => heroVideoInputRef.current?.click()}
                                        className="admin-btn admin-btn-secondary"
                                        style={{ fontSize: '0.8rem', padding: '7px 13px' }}
                                    >
                                        <UploadCloud size={14} /> Téléverser un MP4/WebM (&le; 4,5 Mo)
                                    </button>
                                    {heroVideoPreview !== '/videos/hero-massage.mp4' && (
                                        <button
                                            type="button"
                                            onClick={() => handleQuickSaveHero({ resetVideo: true })}
                                            disabled={heroSaving}
                                            className="admin-btn admin-btn-secondary"
                                            style={{ fontSize: '0.78rem', padding: '7px 11px' }}
                                        >
                                            <RotateCcw size={13} /> Vidéo d&apos;origine
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={heroVideoUrlInput}
                                    onChange={(e) => {
                                        setHeroVideoUrlInput(e.target.value);
                                        if (e.target.value.trim()) setHeroVideoFile(null);
                                    }}
                                    placeholder="Ou lien vidéo direct (https://... ou /videos/...)"
                                    className="admin-input"
                                    style={{ fontSize: '0.82rem', padding: '7px 10px' }}
                                />
                                <input
                                    ref={heroVideoInputRef}
                                    type="file"
                                    accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        handleHeroVideoSelect(e.target.files?.[0]);
                                        e.target.value = '';
                                    }}
                                />
                            </div>

                            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border-soft)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <strong style={{ fontSize: '0.86rem', color: 'var(--admin-text)' }}>Changer l&apos;image d&apos;accueil (Poster)</strong>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        onClick={() => heroPosterInputRef.current?.click()}
                                        className="admin-btn admin-btn-secondary"
                                        style={{ fontSize: '0.8rem', padding: '7px 13px' }}
                                    >
                                        <UploadCloud size={14} /> Choisir &amp; Recadrer une photo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCropper({
                                            file: heroPosterFile || undefined,
                                            url: heroPosterFile ? undefined : heroPosterPreview,
                                            type: 'poster',
                                            targets: HERO_POSTER_CROP_TARGETS,
                                            title: "Recadrer l'image d'accueil (16:9)",
                                        })}
                                        className="admin-btn admin-btn-secondary"
                                        style={{ fontSize: '0.8rem', padding: '7px 13px' }}
                                    >
                                        <Crop size={14} /> Recadrer
                                    </button>
                                    {heroPosterPreview !== '/images/hero-poster.jpg' && (
                                        <button
                                            type="button"
                                            onClick={() => handleQuickSaveHero({ resetPoster: true })}
                                            disabled={heroSaving}
                                            className="admin-btn admin-btn-secondary"
                                            style={{ fontSize: '0.78rem', padding: '7px 11px' }}
                                        >
                                            <RotateCcw size={13} /> Image d&apos;origine
                                        </button>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.76rem', color: 'var(--admin-text-muted)' }}>
                                    Format 16:9 optimisé automatiquement en WebP haute qualité.
                                </span>
                                <input
                                    ref={heroPosterInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        handleHeroPosterSelect(e.target.files?.[0]);
                                        e.target.value = '';
                                    }}
                                />
                            </div>
                        </div>

                        {heroFeedback.error && (
                            <div className="admin-alert admin-alert-error" style={{ padding: '0.65rem 0.9rem', fontSize: '0.84rem' }}>
                                <AlertCircle size={16} /> <span>{heroFeedback.error}</span>
                            </div>
                        )}
                        {heroFeedback.success && (
                            <div className="admin-alert admin-alert-success" style={{ padding: '0.65rem 0.9rem', fontSize: '0.84rem' }}>
                                <CheckCircle2 size={16} /> <span>{heroFeedback.success}</span>
                            </div>
                        )}

                        {(heroVideoFile || heroVideoUrlInput.trim() || heroPosterFile) && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => handleQuickSaveHero()}
                                    disabled={heroSaving}
                                    className="admin-btn admin-btn-primary"
                                    style={{ fontSize: '0.84rem', padding: '9px 20px' }}
                                >
                                    {heroSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                                    Publier la bannière d&apos;accueil immédiatement
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* =====================================================
                   4. SLOGAN & ACCROCHES DE L'INSTITUT
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={18} style={{ color: 'var(--admin-gold)' }} /> 4. Slogan &amp; Accroches de l&apos;Institut
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label className="admin-label">Slogan principal</label>
                            <input
                                type="text"
                                name="tagline"
                                defaultValue={info.tagline || ''}
                                placeholder="Offrez-vous une parenthèse de bien-être..."
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Sous-titre des spécialités</label>
                            <input
                                type="text"
                                name="subtitle"
                                defaultValue={info.subtitle || ''}
                                placeholder="Massages sur mesure • Soins Visage • Drainage Lymphatique • Kobido"
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                {/* =====================================================
                   5. COORDONNÉES, ACCÈS & HORAIRES DÉTAILLÉS
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={18} style={{ color: 'var(--admin-gold)' }} /> 5. Coordonnées, Accès &amp; Horaires d&apos;Ouverture
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.15rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label className="admin-label">Téléphone</label>
                            <input
                                type="text"
                                name="phone"
                                defaultValue={info.phone || ''}
                                placeholder="06 51 65 21 42"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Email de contact public</label>
                            <input
                                type="email"
                                name="contact_email"
                                defaultValue={info.contact_email || ''}
                                placeholder="laparentheseharmonieuse@gmail.com"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Adresse de l&apos;institut</label>
                            <input
                                type="text"
                                name="address"
                                defaultValue={info.address || ''}
                                placeholder="418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Code postal &amp; Ville</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    name="postal_code"
                                    defaultValue={info.postal_code || '13300'}
                                    placeholder="13300"
                                    className="admin-input"
                                />
                                <input
                                    type="text"
                                    name="city"
                                    defaultValue={info.city || 'Salon-de-Provence'}
                                    placeholder="Salon-de-Provence"
                                    className="admin-input"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="admin-label">Indication Parking / Accès</label>
                            <input
                                type="text"
                                name="parking_info"
                                defaultValue={info.parking_info || ''}
                                placeholder="Parking gratuit et facile d'accès directement devant le Pôle Santé"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Résumé des horaires</label>
                            <input
                                type="text"
                                name="hours"
                                defaultValue={info.hours || ''}
                                placeholder="Mardi au Samedi — Sur rendez-vous"
                                className="admin-input"
                            />
                        </div>
                    </div>

                    {/* Grille horaire jour par jour */}
                    <div style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '1rem 1.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem', fontSize: '0.84rem', fontWeight: '700', color: 'var(--admin-text)' }}>
                            <Clock size={15} style={{ color: 'var(--admin-gold)' }} />
                            Horaires détaillés par jour (affichés sur la page Contact &amp; le pied de page)
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                            <div>
                                <label className="admin-label">Mardi</label>
                                <input type="text" name="hours_tue" defaultValue={info.hours_tue || '10:00 - 13:30 | 14:30 - 19:00'} className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Mercredi</label>
                                <input type="text" name="hours_wed" defaultValue={info.hours_wed || '14:00 - 19:00'} className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Jeudi</label>
                                <input type="text" name="hours_thu" defaultValue={info.hours_thu || '10:00 - 13:30 | 14:30 - 18:00'} className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Vendredi</label>
                                <input type="text" name="hours_fri" defaultValue={info.hours_fri || '10:00 - 13:30 | 14:30 - 17:30'} className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Samedi</label>
                                <input type="text" name="hours_sat" defaultValue={info.hours_sat || '09:30 - 14:00'} className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Dimanche &amp; Lundi</label>
                                <input type="text" name="hours_sun_mon" defaultValue={info.hours_sun_mon || 'Fermé'} className="admin-input" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                   6. PLANITY, RÉSEAUX SOCIAUX & AVIS GOOGLE
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CalendarCheck size={18} style={{ color: 'var(--admin-gold)' }} /> 6. Réservation Planity, Réseaux Sociaux &amp; Avis
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-label">Lien officiel de réservation Planity</label>
                            <input
                                type="url"
                                name="planity_url"
                                defaultValue={info.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence'}
                                placeholder="https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Lien Instagram</label>
                            <input
                                type="url"
                                name="instagram"
                                defaultValue={info.instagram || ''}
                                placeholder="https://www.instagram.com/laparentheseharmonieuse/"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Lien Facebook (Optionnel)</label>
                            <input
                                type="url"
                                name="facebook"
                                defaultValue={info.facebook || ''}
                                placeholder="https://www.facebook.com/..."
                                className="admin-input"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-label">Lien vers votre page Avis Google</label>
                            <input
                                type="url"
                                name="google_reviews"
                                defaultValue={info.google_reviews || ''}
                                placeholder="https://g.page/r/..."
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                {/* =====================================================
                   7. IDENTITÉ LÉGALE (MENTIONS LÉGALES & CGV)
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={18} style={{ color: 'var(--admin-gold)' }} /> 7. Informations Légales de l&apos;Institut
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.15rem' }}>
                        <div>
                            <label className="admin-label">Nom commercial</label>
                            <input
                                type="text"
                                name="business_name"
                                defaultValue={info.business_name || 'La Parenthèse Harmonieuse'}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Prénom &amp; Nom de la dirigeante / exploitante</label>
                            <input
                                type="text"
                                name="creator_name"
                                defaultValue={info.creator_name || 'Harmonie PERRAULT'}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Forme juridique</label>
                            <input
                                type="text"
                                name="legal_status"
                                defaultValue={info.legal_status || 'Entrepreneur Individuel (EI)'}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Numéro SIREN</label>
                            <input
                                type="text"
                                name="siren"
                                defaultValue={info.siren || '980 474 340'}
                                placeholder="980 474 340"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Numéro SIRET (siège social)</label>
                            <input
                                type="text"
                                name="siret"
                                defaultValue={info.siret || '980 474 340 00018'}
                                placeholder="980 474 340 00018"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Numéro TVA Intracommunautaire</label>
                            <input
                                type="text"
                                name="vat_number"
                                defaultValue={info.vat_number || 'FR76980474340'}
                                placeholder="FR76980474340"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Code APE / NAF</label>
                            <input
                                type="text"
                                name="naf_ape"
                                defaultValue={info.naf_ape || '9602B (Soins de beauté)'}
                                placeholder="9602B"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Date de création / début d&apos;activité</label>
                            <input
                                type="text"
                                name="creation_date"
                                defaultValue={info.creation_date || '21 octobre 2023'}
                                className="admin-input"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="admin-label">Adresse du siège social</label>
                            <input
                                type="text"
                                name="headquarters_address"
                                defaultValue={info.headquarters_address || 'Chemin de Saint-Jean, Résidence Lurian, 13300 Salon-de-Provence'}
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                {/* =====================================================
                   8. NOTIFICATIONS EMAIL CONTACT
                   ===================================================== */}
                <div style={{ borderBottom: '1px solid var(--admin-border-soft)', paddingBottom: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--admin-text)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={18} style={{ color: 'var(--admin-gold)' }} /> 8. Réception des Demandes Contact
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
                        <div>
                            <label className="admin-label">Email où recevoir les alertes messages</label>
                            <input
                                type="email"
                                name="notification_email"
                                defaultValue={info.notification_email || info.contact_email || ''}
                                placeholder="laparentheseharmonieuse@gmail.com"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Relais Formspree (Optionnel)</label>
                            <input
                                type="url"
                                name="formspree_url"
                                defaultValue={info.formspree_url || ''}
                                placeholder="https://formspree.io/f/..."
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                <div style={{ paddingTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={loading} style={{ padding: '14px 40px', fontSize: '0.95rem' }}>
                        {loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                        {loading ? 'Enregistrement en cours…' : 'Enregistrer toutes les modifications'}
                    </button>
                </div>
            </form>

            {/* Modal de recadrage Logo / Favicon / Poster */}
            {cropper && (
                <ImageCropperModal
                    items={[{ id: 'crop-target', file: cropper.file, url: cropper.url }]}
                    targets={cropper.targets}
                    heroPreview={cropper.type === 'poster'}
                    title={cropper.title}
                    confirmLabel="Valider le cadrage"
                    onCancel={() => setCropper(null)}
                    onConfirm={handleCropped}
                />
            )}

            {/* =====================================================
               9. SÉCURITÉ — MOT DE PASSE ADMINISTRATEUR
               ===================================================== */}
            <div style={{
                padding: '1.75rem',
                background: 'var(--admin-bg)',
                border: '1px solid var(--admin-border)',
                borderRadius: '10px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <Lock size={20} style={{ color: 'var(--admin-gold)' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--admin-text)', margin: 0 }}>
                        Sécurité — Modifier le mot de passe administrateur
                    </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: '1.55', marginBottom: '1.25rem' }}>
                    La modification du mot de passe déconnecte immédiatement toutes les autres sessions actives et renouvelle votre session sécurisée actuelle.
                </p>

                {pwdStatus.error && (
                    <div className="admin-alert admin-alert-error" style={{ marginBottom: '1rem' }}>
                        <AlertCircle size={16} /> <span>{pwdStatus.error}</span>
                    </div>
                )}
                {pwdStatus.success && (
                    <div className="admin-alert admin-alert-success" style={{ marginBottom: '1rem' }}>
                        <CheckCircle2 size={16} /> <span>{pwdStatus.success}</span>
                    </div>
                )}

                <form ref={pwdFormRef} onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label className="admin-label">Mot de passe actuel *</label>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                name="current_password"
                                required
                                autoComplete="current-password"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Nouveau mot de passe (min. 8 car.) *</label>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                name="new_password"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="admin-label">Confirmer le nouveau mot de passe *</label>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                name="confirm_password"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="admin-input"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.25rem' }}>
                        <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            className="admin-link-btn"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
                        >
                            {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                            {showPwd ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
                        </button>

                        <button type="submit" disabled={pwdLoading} className="admin-btn admin-btn-secondary" style={{ fontSize: '0.85rem', padding: '9px 20px' }}>
                            {pwdLoading ? <Loader2 size={15} className="spin" /> : <Lock size={15} />}
                            Mettre à jour le mot de passe
                        </button>
                    </div>
                </form>
            </div>

            {/* =====================================================
               10. SAUVEGARDE & RESTAURATION BASE DE DONNÉES
               ===================================================== */}
            <div style={{
                padding: '1.75rem',
                background: 'var(--admin-bg)',
                border: '1px solid var(--admin-border)',
                borderRadius: '10px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                    <ShieldCheck size={22} style={{ color: 'var(--admin-gold)' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--admin-text)', margin: 0 }}>
                        Sauvegarde &amp; Restauration Complète des Données
                    </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    Téléchargez à tout moment une sauvegarde JSON intégrale du site (carte des soins, avis clientes, galerie, messages, paramètres et médias téléversés) ou restaurez une sauvegarde précédente en un clic.
                </p>

                {restoreStatus.success && (
                    <div className="admin-alert admin-alert-success" style={{ marginBottom: '1rem' }}>
                        <CheckCircle2 size={16} /> <span>{restoreStatus.success}</span>
                    </div>
                )}
                {restoreStatus.error && (
                    <div className="admin-alert admin-alert-error" style={{ marginBottom: '1rem' }}>
                        <AlertCircle size={16} /> <span>{restoreStatus.error}</span>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <a
                        href="/api/admin/backup"
                        download
                        className="admin-btn admin-btn-primary"
                        style={{ padding: '10px 20px', fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                        <Download size={16} /> Télécharger une sauvegarde (JSON)
                    </a>

                    <button
                        type="button"
                        onClick={() => restoreInputRef.current?.click()}
                        className="admin-btn admin-btn-secondary"
                        disabled={isRestoring}
                        style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                    >
                        {isRestoring ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
                        Restaurer une sauvegarde
                    </button>
                    <input
                        ref={restoreInputRef}
                        type="file"
                        accept=".json,application/json"
                        style={{ display: 'none' }}
                        onChange={handleRestoreFile}
                    />
                </div>
            </div>
        </div>
    );
}
