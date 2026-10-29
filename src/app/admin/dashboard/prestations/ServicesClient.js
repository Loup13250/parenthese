'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import {
    addService,
    editService,
    deleteService,
    reorderService,
    toggleServiceFeatured,
} from '@/app/actions';
import ImageCropperModal, { SERVICE_CROP_TARGETS, uid } from '@/components/admin/ImageCropper';
import {
    Plus,
    Trash2,
    Edit3,
    X,
    CheckCircle2,
    AlertCircle,
    ArrowUp,
    ArrowDown,
    Loader2,
    Sparkles,
    Star,
    UploadCloud,
    Crop,
    RotateCcw,
    Receipt,
    ExternalLink,
    Layers,
    Type,
} from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { TARIFS_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';

const CATEGORY_OPTIONS = [
    { slug: 'massages', name: 'Massages Sur Mesure' },
    { slug: 'drainage', name: 'Drainage Lymphatique' },
    { slug: 'kobido', name: 'Massage Kobido' },
    { slug: 'visage', name: 'Soins Visage' },
    { slug: 'maternite', name: 'Femmes Enceintes' },
    { slug: 'packs', name: 'Packs & Forfaits' },
];

export default function ServicesClient({ services = [], customTexts = { fr: {} } }) {
    const [prevServices, setPrevServices] = useState(services);
    const [servicesList, setServicesList] = useState(services);
    if (services !== prevServices) {
        setPrevServices(services);
        setServicesList(services);
    }

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

    const [activeSection, setActiveSection] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteModal, setDeleteModal] = useState(null);

    // --- État Ajout / Édition ---
    const [isAddingService, setIsAddingService] = useState(false);
    const [editingService, setEditingService] = useState(null);

    // --- Photo du soin (avec recadrage) ---
    const [servicePhotoFile, setServicePhotoFile] = useState(null);
    const [servicePhotoPreview, setServicePhotoPreview] = useState(null);
    const [resetExistingImage, setResetExistingImage] = useState(false);
    const [cropper, setCropper] = useState(null);

    const serviceFormRef = useRef(null);
    const photoInputRef = useRef(null);

    const showNotification = (msg, isErr = false) => {
        if (isErr) {
            setError(msg);
            setTimeout(() => setError(''), 5000);
        } else {
            setSuccess(msg);
            setTimeout(() => setSuccess(''), 3800);
        }
    };

    const resetPhotoState = () => {
        setServicePhotoFile(null);
        setServicePhotoPreview(null);
        setResetExistingImage(false);
    };

    const handleSelectPhoto = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showNotification('Veuillez sélectionner une image JPG, PNG ou WebP.', true);
            return;
        }
        setCropper({
            items: [{ id: uid(), file, name: file.name }],
        });
    };

    const handleCroppedPhoto = (results) => {
        if (results && results.length > 0) {
            const out = results[0].outputs?.image || results[0].original;
            if (out) {
                setServicePhotoFile(out);
                setServicePhotoPreview(trackBlobUrl(URL.createObjectURL(out)));
                setResetExistingImage(false);
            }
        }
        setCropper(null);
    };

    const handleAddService = (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const formData = new FormData(form);

        const catSlug = form.category_slug.value;
        const matchedCat = CATEGORY_OPTIONS.find((c) => c.slug === catSlug);
        if (matchedCat) {
            formData.set('category', matchedCat.name);
        }

        formData.delete('image_file');
        if (servicePhotoFile) {
            formData.append('image_file', servicePhotoFile);
        }

        startTransition(async () => {
            const res = await addService(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Soin ajouté avec succès à la carte !');
                setIsAddingService(false);
                resetPhotoState();
                serviceFormRef.current?.reset();
            }
        });
    };

    const handleEditService = (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const formData = new FormData(form);

        const catSlug = form.category_slug.value;
        const matchedCat = CATEGORY_OPTIONS.find((c) => c.slug === catSlug);
        if (matchedCat) {
            formData.set('category', matchedCat.name);
        }

        formData.delete('image_file');
        if (resetExistingImage) {
            formData.set('reset_image', '1');
        } else if (servicePhotoFile) {
            formData.append('image_file', servicePhotoFile);
        }

        startTransition(async () => {
            const res = await editService(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Soin mis à jour avec succès !');
                setEditingService(null);
                resetPhotoState();
            }
        });
    };

    const handleDeleteService = (id) => {
        setServicesList((prev) => prev.filter((s) => s.id !== id));
        startTransition(async () => {
            const res = await deleteService(id);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Soin supprimé de la carte.');
                setDeleteModal(null);
            }
        });
    };

    const handleToggleFeatured = (id) => {
        setServicesList((prev) => prev.map((s) => (s.id === id ? { ...s, is_featured: s.is_featured ? 0 : 1 } : s)));
        startTransition(async () => {
            const res = await toggleServiceFeatured(id);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification(
                    res.is_featured
                        ? "Soin mis en avant dans « Vos Coups de Cœur » sur la page d'accueil !"
                        : "Soin retiré des Coups de Cœur de la page d'accueil."
                );
            }
        });
    };

    const handleReorderService = (id, direction) => {
        setServicesList((prev) => {
            const subset = categoryFilter === 'all' ? prev : prev.filter((s) => s.category_slug === categoryFilter);
            const subIdx = subset.findIndex((s) => s.id === id);
            if (subIdx === -1) return prev;
            const neighborIdx = direction === 'up' ? subIdx - 1 : subIdx + 1;
            if (neighborIdx < 0 || neighborIdx >= subset.length) return prev;

            const globalA = prev.findIndex((s) => s.id === subset[subIdx].id);
            const globalB = prev.findIndex((s) => s.id === subset[neighborIdx].id);
            if (globalA === -1 || globalB === -1) return prev;

            const next = [...prev];
            const tmp = next[globalA];
            next[globalA] = next[globalB];
            next[globalB] = tmp;
            return next;
        });

        startTransition(async () => {
            const res = await reorderService(id, direction, categoryFilter);
            if (res?.error) {
                showNotification(res.error, true);
            }
        });
    };

    const filteredServices = categoryFilter === 'all'
        ? servicesList
        : servicesList.filter((s) => s.category_slug === categoryFilter);

    const openEditForm = (service) => {
        setEditingService(service);
        setIsAddingService(false);
        setActiveSection('catalog');
        resetPhotoState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentPreviewUrl = resetExistingImage
        ? '/images/massage-dos.jpg'
        : (servicePhotoPreview || editingService?.image_url || '/images/massage-dos.jpg');

    const showBlock = (id) => activeSection === 'all' || activeSection === id;

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* EN-TÊTE UNIFIÉ */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-page-icon" aria-hidden="true">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <span className="admin-eyebrow">Page 3 du site public</span>
                        <h1 className="admin-title">Carte des Soins &amp; Prestations</h1>
                        <p className="admin-subtitle">
                            Ajoutez, modifiez ou réordonnez les soins affichés sur <strong>/carte-des-soins</strong>. Cliquez sur l&apos;étoile ★ d&apos;un soin pour l&apos;afficher dans « Vos Coups de Cœur » sur la page d&apos;accueil.
                        </p>
                    </div>
                </div>

                <div className="admin-page-actions">
                    <a
                        href="/carte-des-soins"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                    >
                        <ExternalLink size={15} /> Voir /carte-des-soins
                    </a>
                    {!isAddingService && !editingService && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddingService(true);
                                setActiveSection('catalog');
                                resetPhotoState();
                            }}
                            className="admin-btn admin-btn-primary"
                        >
                            <Plus size={16} /> Ajouter un soin
                        </button>
                    )}
                </div>
            </div>

            {/* BARRE D'ONGLETS ERGONOMIQUE */}
            <div className="admin-quicknav" role="tablist" aria-label="Sections de la carte des soins">
                <button
                    type="button"
                    onClick={() => setActiveSection('all')}
                    className={`admin-quicknav-btn ${activeSection === 'all' ? 'active' : ''}`}
                >
                    <Layers size={15} /> Tout afficher
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSection('catalog')}
                    className={`admin-quicknav-btn ${activeSection === 'catalog' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">1</span>
                    <Receipt size={14} /> Catalogue des Soins ({servicesList.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSection('texts')}
                    className={`admin-quicknav-btn ${activeSection === 'texts' ? 'active' : ''}`}
                >
                    <span className="admin-quicknav-step">2</span>
                    <Type size={14} /> Titres &amp; Textes de la page
                </button>
            </div>

            {/* Notifications */}
            {success && (
                <div className="admin-alert admin-alert-success">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}
            {error && (
                <div className="admin-alert admin-alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* SECTION 1 : CATALOGUE DES SOINS */}
            {showBlock('catalog') && (
                <div style={{ width: '100%', marginBottom: '2rem' }}>
                    {/* Filtres par catégorie */}
                    <div className="admin-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('all')}
                                className={`admin-quicknav-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                                style={{ padding: '0.42rem 0.9rem', fontSize: '0.8rem', border: '1px solid var(--admin-border)' }}
                            >
                                Tous ({servicesList.length})
                            </button>
                            {CATEGORY_OPTIONS.map((cat) => {
                                const count = servicesList.filter((s) => s.category_slug === cat.slug).length;
                                const active = categoryFilter === cat.slug;
                                return (
                                    <button
                                        key={cat.slug}
                                        type="button"
                                        onClick={() => setCategoryFilter(cat.slug)}
                                        className={`admin-quicknav-btn ${active ? 'active' : ''}`}
                                        style={{ padding: '0.42rem 0.9rem', fontSize: '0.8rem', border: '1px solid var(--admin-border)' }}
                                    >
                                        {cat.name} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* FORMULAIRE AJOUT / ÉDITION SOIN */}
                    {(isAddingService || editingService) && (
                        <div className="admin-card" style={{ marginBottom: '1.75rem', borderColor: 'var(--admin-gold)' }}>
                            <div className="admin-card-header">
                                <div>
                                    <span className="admin-eyebrow">Édition du catalogue</span>
                                    <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                        {editingService ? `Modifier le soin « ${editingService.title} »` : 'Ajouter un nouveau Soin / Rituel'}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingService(false);
                                        setEditingService(null);
                                        resetPhotoState();
                                    }}
                                    className="admin-btn-icon"
                                    aria-label="Fermer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form
                                key={editingService ? `edit-${editingService.id}` : 'add-new'}
                                ref={serviceFormRef}
                                onSubmit={editingService ? handleEditService : handleAddService}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                            >
                                {editingService && (
                                    <>
                                        <input type="hidden" name="id" value={editingService.id} />
                                        <input type="hidden" name="image_url" value={editingService.image_url || ''} />
                                    </>
                                )}

                                <div className="admin-grid-2col">
                                    <div>
                                        <label className="admin-label">Titre du soin *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            defaultValue={editingService?.title || ''}
                                            placeholder="Ex : Massage La Parenthèse (60 min)"
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Catégorie *</label>
                                        <select
                                            name="category_slug"
                                            required
                                            defaultValue={editingService?.category_slug || 'massages'}
                                            className="admin-select"
                                        >
                                            {CATEGORY_OPTIONS.map((c) => (
                                                <option key={c.slug} value={c.slug}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="admin-grid-3col">
                                    <div>
                                        <label className="admin-label">Tarif TTC *</label>
                                        <input
                                            type="text"
                                            name="price"
                                            required
                                            defaultValue={editingService?.price || ''}
                                            placeholder="Ex : 70 €"
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Durée du soin</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            defaultValue={editingService?.duration || ''}
                                            placeholder="Ex : 60 min (rendez-vous 1h30)"
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Badge d&apos;accroche (Optionnel)</label>
                                        <input
                                            type="text"
                                            name="badge"
                                            defaultValue={editingService?.badge || ''}
                                            placeholder="Ex : Coup de Cœur, Signature, BIO..."
                                            className="admin-input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="admin-label">Sous-titre / Accroche courte (Optionnel)</label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        defaultValue={editingService?.subtitle || ''}
                                        placeholder="Ex : Votre moment sur mesure d'excellence"
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="admin-label">Description détaillée du soin *</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={3}
                                        defaultValue={editingService?.description || ''}
                                        placeholder="Décrivez le déroulé du soin, le ressenti, l'accompagnement personnalisé..."
                                        className="admin-textarea"
                                    />
                                </div>

                                <div className="admin-grid-2col">
                                    <div>
                                        <label className="admin-label">Bienfaits &amp; Cosmétiques utilisés (Optionnel)</label>
                                        <textarea
                                            name="benefits"
                                            rows={2}
                                            defaultValue={editingService?.benefits || ''}
                                            placeholder="Ex : Huiles Green Spa BIO certifiées Cosmos, détente neuromusculaire..."
                                            className="admin-textarea"
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Contre-indications / Précautions (Optionnel)</label>
                                        <textarea
                                            name="contraindications"
                                            rows={2}
                                            defaultValue={editingService?.contraindications || ''}
                                            placeholder="Ex : Déconseillé au 1er trimestre de grossesse, fièvre, phlébite..."
                                            className="admin-textarea"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="admin-label">Lien direct Planity (Optionnel)</label>
                                    <input
                                        type="url"
                                        name="planity_url"
                                        defaultValue={editingService?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence'}
                                        placeholder="https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence"
                                        className="admin-input"
                                    />
                                </div>

                                {/* Photo illustrative + Outil de recadrage */}
                                <div style={{ background: 'var(--admin-surface-subtle)', padding: '1.15rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
                                    <label className="admin-label" style={{ marginBottom: '0.65rem' }}>
                                        Photo illustrative du soin
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flexWrap: 'wrap' }}>
                                        <div style={{
                                            width: '124px',
                                            height: '92px',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: '1px solid var(--admin-border)',
                                            background: '#EAE5DC',
                                            flexShrink: 0,
                                        }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={currentPreviewUrl}
                                                alt="Aperçu du soin"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => photoInputRef.current?.click()}
                                                    className="admin-btn admin-btn-secondary"
                                                    style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                                                >
                                                    <UploadCloud size={15} /> Choisir &amp; Recadrer une photo
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setCropper({
                                                        items: [{
                                                            id: uid(),
                                                            file: servicePhotoFile || undefined,
                                                            url: servicePhotoFile ? undefined : currentPreviewUrl,
                                                            name: editingService?.title || 'Photo soin',
                                                        }],
                                                    })}
                                                    className="admin-btn admin-btn-secondary"
                                                    style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                                                >
                                                    <Crop size={14} /> Ajuster le cadrage
                                                </button>

                                                {(servicePhotoFile || (editingService?.image_url && editingService.image_url !== '/images/massage-dos.jpg')) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setServicePhotoFile(null);
                                                            setServicePhotoPreview(null);
                                                            setResetExistingImage(true);
                                                        }}
                                                        className="admin-btn admin-btn-secondary"
                                                        style={{ fontSize: '0.8rem', padding: '7px 12px' }}
                                                    >
                                                        <RotateCcw size={13} /> Photo par défaut
                                                    </button>
                                                )}
                                            </div>
                                            <span className="admin-hint" style={{ marginTop: 0 }}>
                                                {servicePhotoPreview
                                                    ? 'Nouvelle photo recadrée prête à enregistrer.'
                                                    : resetExistingImage
                                                        ? 'La photo par défaut sera rétablie lors de la sauvegarde.'
                                                        : 'Recadrage libre (4:3, 16:9, 1:1 ou 4:5) et compression WebP automatique.'}
                                            </span>
                                        </div>
                                    </div>

                                    <input
                                        ref={photoInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            handleSelectPhoto(e.target.files?.[0]);
                                            e.target.value = '';
                                        }}
                                    />
                                </div>

                                {/* Option Coup de Cœur Accueil */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.9rem 1.1rem', background: 'var(--admin-gold-soft)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-gold-border)' }}>
                                    <input
                                        type="checkbox"
                                        id="service_is_featured"
                                        name="is_featured"
                                        value="1"
                                        defaultChecked={editingService ? Boolean(editingService.is_featured) : false}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="service_is_featured" style={{ fontSize: '0.9rem', color: 'var(--admin-text)', cursor: 'pointer', margin: 0, fontWeight: 600 }}>
                                        Afficher ce soin dans la sélection « Vos Coups de Cœur » sur la page d&apos;accueil
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingService(false);
                                            setEditingService(null);
                                            resetPhotoState();
                                        }}
                                        className="admin-btn admin-btn-secondary"
                                        disabled={isPending}
                                    >
                                        Annuler
                                    </button>
                                    <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending}>
                                        {isPending ? <Loader2 size={16} className="spin" /> : null}
                                        {editingService ? 'Enregistrer les modifications' : 'Ajouter à la carte des soins'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Liste des Soins */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        {filteredServices.length === 0 ? (
                            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                                <Sparkles size={36} style={{ margin: '0 auto 1rem', color: 'var(--admin-gold)', opacity: 0.7 }} />
                                <p style={{ margin: 0 }}>Aucun soin enregistré dans cette catégorie pour le moment.</p>
                            </div>
                        ) : (
                            filteredServices.map((s, idx) => (
                                <div key={s.id} className="admin-card" style={{ marginBottom: 0, padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flex: '1 1 360px' }}>
                                        {/* Vignette Photo */}
                                        <div style={{
                                            width: '76px',
                                            height: '76px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            background: '#EAE5DC',
                                            border: '1px solid var(--admin-border)',
                                        }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={s.image_url || '/images/massage-dos.jpg'}
                                                alt={s.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                                <h3 style={{ fontSize: '1.08rem', color: 'var(--admin-text)', margin: 0, fontWeight: '600' }}>
                                                    {s.title}
                                                </h3>
                                                <span style={{
                                                    fontSize: '0.84rem',
                                                    fontWeight: '700',
                                                    color: 'var(--admin-gold-dark)',
                                                    background: 'var(--admin-gold-soft)',
                                                    border: '1px solid var(--admin-gold-border)',
                                                    padding: '2px 9px',
                                                    borderRadius: '6px',
                                                }}>
                                                    {s.price}
                                                </span>
                                                {s.is_featured ? (
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: '700',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '3px',
                                                        color: '#92400E',
                                                        background: '#FEF3C7',
                                                        border: '1px solid #FDE68A',
                                                        padding: '2px 8px',
                                                        borderRadius: '9999px',
                                                    }}>
                                                        <Star size={11} fill="currentColor" /> Coup de Cœur Accueil
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--admin-text-muted)', flexWrap: 'wrap' }}>
                                                {s.category && <span style={{ fontWeight: 600 }}>{s.category}</span>}
                                                {s.duration && <span>• {s.duration}</span>}
                                                {s.badge && <span style={{ color: 'var(--admin-gold-dark)', fontWeight: 600 }}>• {s.badge}</span>}
                                            </div>

                                            <p style={{ fontSize: '0.83rem', color: 'var(--admin-text-muted)', margin: '5px 0 0', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {s.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleFeatured(s.id)}
                                            className="admin-btn-icon"
                                            style={{
                                                color: s.is_featured ? '#D97706' : 'var(--admin-text-subtle)',
                                                background: s.is_featured ? '#FEF3C7' : undefined,
                                                borderColor: s.is_featured ? '#FCD34D' : undefined,
                                            }}
                                            title={s.is_featured ? "Retirer de la section Coups de Cœur de l'accueil" : "Mettre en avant sur la page d'accueil"}
                                            aria-label={s.is_featured ? `Retirer ${s.title} des Coups de Cœur de l'accueil` : `Mettre en avant ${s.title} sur l'accueil`}
                                        >
                                            <Star size={15} fill={s.is_featured ? 'currentColor' : 'none'} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleReorderService(s.id, 'up')}
                                            disabled={idx === 0 || isPending}
                                            className="admin-btn-icon"
                                            title="Monter dans la liste"
                                            aria-label={`Monter le soin ${s.title} dans la liste`}
                                        >
                                            <ArrowUp size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleReorderService(s.id, 'down')}
                                            disabled={idx === filteredServices.length - 1 || isPending}
                                            className="admin-btn-icon"
                                            title="Descendre dans la liste"
                                            aria-label={`Descendre le soin ${s.title} dans la liste`}
                                        >
                                            <ArrowDown size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openEditForm(s)}
                                            className="admin-btn-icon"
                                            title="Modifier ce soin"
                                            aria-label={`Modifier le soin ${s.title}`}
                                        >
                                            <Edit3 size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteModal({ id: s.id, title: s.title })}
                                            className="admin-btn-icon"
                                            style={{ color: '#DC2626' }}
                                            title="Supprimer ce soin"
                                            aria-label={`Supprimer le soin ${s.title}`}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* SECTION 2 : TITRES & TEXTES DE LA CARTE DES SOINS */}
            {showBlock('texts') && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <span className="admin-eyebrow">Section 2 • Contenus écrits</span>
                            <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                                <Type size={20} style={{ color: 'var(--admin-gold)' }} />
                                Titres &amp; Textes de la Carte des Soins
                            </h2>
                            <p className="admin-card-subtitle">
                                Modifiez le titre d&apos;en-tête et les textes d&apos;accompagnement de la page publique /carte-des-soins.
                            </p>
                        </div>
                    </div>
                    <SiteTextsEditor
                        sections={TARIFS_PAGE_TEXT_SECTIONS}
                        overrides={customTexts}
                        searchable
                        collapsible
                        defaultOpenFirst
                    />
                </div>
            )}

            {/* Modal de recadrage photo soin */}
            {cropper && (
                <ImageCropperModal
                    items={cropper.items}
                    targets={SERVICE_CROP_TARGETS}
                    heroPreview={false}
                    title="Recadrer la photo du soin"
                    confirmLabel="Valider le cadrage"
                    onCancel={() => setCropper(null)}
                    onConfirm={handleCroppedPhoto}
                />
            )}

            {/* Modal de confirmation suppression */}
            {deleteModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setDeleteModal(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(28, 24, 21, 0.55)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.25rem',
                    }}
                >
                    <div
                        className="admin-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', maxWidth: '440px', padding: '1.75rem', marginBottom: 0 }}
                    >
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--admin-text)', margin: '0 0 0.65rem' }}>
                            Supprimer ce soin ?
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', lineHeight: 1.55, margin: '0 0 1.5rem' }}>
                            Êtes-vous certaine de vouloir retirer <strong>« {deleteModal.title} »</strong> de la carte des soins ? Cette action est immédiate.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                            <button type="button" onClick={() => setDeleteModal(null)} className="admin-btn admin-btn-secondary">
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteService(deleteModal.id)}
                                disabled={isPending}
                                className="admin-btn admin-btn-danger"
                            >
                                {isPending ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />}
                                Supprimer définitivement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
