'use client';

import { useState, useRef, useTransition } from 'react';
import Image from 'next/image';
import { 
    addService, editService, deleteService, reorderService, toggleServiceFeatured,
    addPricingDocument, editPricingDocument, deletePricingDocument, reorderPricingDocument
} from '@/app/actions';
import { 
    Plus, Trash2, Edit3, X, CheckCircle2, AlertCircle, ArrowUp, ArrowDown, 
    Loader2, FileText, Sparkles, ExternalLink, Star, Image as ImageIcon, Clock, Tag
} from 'lucide-react';

const CATEGORY_OPTIONS = [
    { slug: 'massages', name: 'Massages Sur Mesure' },
    { slug: 'drainage', name: 'Drainage & Madérothérapie' },
    { slug: 'kobido', name: 'Massage Kobido' },
    { slug: 'visage', name: 'Soins Visage Nohèm BIO' },
    { slug: 'maternite', name: 'Spécial Maternité' },
    { slug: 'packs', name: 'Packs & Forfaits' },
];

export default function ServicesClient({ services = [], pricingDocuments = [] }) {
    const [prevServices, setPrevServices] = useState(services);
    const [servicesList, setServicesList] = useState(services);
    if (services !== prevServices) {
        setPrevServices(services);
        setServicesList(services);
    }

    const [prevDocs, setPrevDocs] = useState(pricingDocuments);
    const [docsList, setDocsList] = useState(pricingDocuments);
    if (pricingDocuments !== prevDocs) {
        setPrevDocs(pricingDocuments);
        setDocsList(pricingDocuments);
    }

    const [activeTab, setActiveTab] = useState('services'); // 'services' | 'docs'
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteModal, setDeleteModal] = useState(null); // { type, id, title }

    // --- État des prestations ---
    const [isAddingService, setIsAddingService] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [servicePhotoPreview, setServicePhotoPreview] = useState(null);

    // --- État des documents tarifaires ---
    const [isAddingDoc, setIsAddingDoc] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);

    const docFormRef = useRef(null);
    const serviceFormRef = useRef(null);

    const showNotification = (msg, isErr = false) => {
        if (isErr) {
            setError(msg);
            setTimeout(() => setError(''), 4500);
        } else {
            setSuccess(msg);
            setTimeout(() => setSuccess(''), 3500);
        }
    };

    // ==========================================
    // GESTIONNAIRES : DOCUMENTS TARIFAIRES
    // ==========================================
    const handleAddDoc = (e) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.target);
        startTransition(async () => {
            const res = await addPricingDocument(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Document / Carte de tarifs ajouté(e) avec succès !');
                setIsAddingDoc(false);
                docFormRef.current?.reset();
            }
        });
    };

    const handleEditDoc = (e) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.target);
        startTransition(async () => {
            const res = await editPricingDocument(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Document / Carte de tarifs mis(e) à jour !');
                setEditingDoc(null);
            }
        });
    };

    const handleDeleteDoc = (id) => {
        setDocsList(prev => prev.filter(d => d.id !== id));
        startTransition(async () => {
            const res = await deletePricingDocument(id);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Document supprimé.');
                setDeleteModal(null);
            }
        });
    };

    const handleReorderDoc = (id, direction) => {
        setDocsList(prev => {
            const idx = prev.findIndex(d => d.id === id);
            if (idx === -1) return prev;
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= prev.length) return prev;
            const next = [...prev];
            const [moved] = next.splice(idx, 1);
            next.splice(targetIdx, 0, moved);
            return next;
        });
        startTransition(async () => {
            await reorderPricingDocument(id, direction);
        });
    };

    // ==========================================
    // GESTIONNAIRES : PRESTATIONS (SOINS)
    // ==========================================
    const handleAddService = (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const formData = new FormData(form);

        // Synchroniser category name avec category_slug
        const catSlug = form.category_slug.value;
        const matchedCat = CATEGORY_OPTIONS.find(c => c.slug === catSlug);
        if (matchedCat) {
            formData.set('category', matchedCat.name);
        }

        startTransition(async () => {
            const res = await addService(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Soin ajouté avec succès à la carte !');
                setIsAddingService(false);
                setServicePhotoPreview(null);
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
        const matchedCat = CATEGORY_OPTIONS.find(c => c.slug === catSlug);
        if (matchedCat) {
            formData.set('category', matchedCat.name);
        }

        startTransition(async () => {
            const res = await editService(formData);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification('Soin mis à jour avec succès !');
                setEditingService(null);
                setServicePhotoPreview(null);
            }
        });
    };

    const handleDeleteService = (id) => {
        setServicesList(prev => prev.filter(s => s.id !== id));
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
        setServicesList(prev => prev.map(s => s.id === id ? { ...s, is_featured: s.is_featured ? 0 : 1 } : s));
        startTransition(async () => {
            const res = await toggleServiceFeatured(id);
            if (res?.error) {
                showNotification(res.error, true);
            } else {
                showNotification(res.is_featured ? 'Soin mis en avant en Coup de Cœur sur l’accueil !' : 'Soin retiré des Coups de Cœur de l’accueil.');
            }
        });
    };

    const handleReorderService = (id, direction) => {
        setServicesList(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if (idx === -1) return prev;
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= prev.length) return prev;
            const next = [...prev];
            const [moved] = next.splice(idx, 1);
            next.splice(targetIdx, 0, moved);
            return next;
        });
        startTransition(async () => {
            await reorderService(id, direction);
        });
    };

    const filteredServices = categoryFilter === 'all'
        ? servicesList
        : servicesList.filter(s => s.category_slug === categoryFilter);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>

            {/* Notifications */}
            {success && (
                <div style={{
                    width: '100%', maxWidth: '850px', marginBottom: '1.25rem',
                    background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#15803d', padding: '0.85rem 1.25rem', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem'
                }}>
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}
            {error && (
                <div style={{
                    width: '100%', maxWidth: '850px', marginBottom: '1.25rem',
                    background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#b91c1c', padding: '0.85rem 1.25rem', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem'
                }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* En-tête */}
            <div style={{ width: '100%', maxWidth: '850px', marginBottom: '2rem' }}>
                <h1 className="admin-page-title">Carte des Soins &amp; Prestations</h1>
                <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    Gérez ici les soins et rituels affichés sur la page <strong>/carte-des-soins</strong> et sélectionnez les soins à mettre en avant dans <strong>Vos Coups de Cœur</strong> sur la page d&apos;accueil.
                </p>

                {/* Navigation par onglets (2 onglets) */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    borderBottom: '1px solid var(--admin-border-soft)',
                    paddingBottom: '0.75rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('services'); setIsAddingService(false); setEditingService(null); }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.15rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'services' ? 'var(--admin-gold)' : 'var(--admin-surface)',
                            color: activeTab === 'services' ? '#1a1510' : 'var(--admin-text)',
                            fontWeight: activeTab === 'services' ? '700' : '500',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Sparkles size={16} />
                        Soins &amp; Rituels Bien-Être
                        <span style={{
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            background: activeTab === 'services' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.06)',
                            fontWeight: '700'
                        }}>
                            {servicesList.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setActiveTab('docs'); setIsAddingDoc(false); setEditingDoc(null); }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.15rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'docs' ? 'var(--admin-gold)' : 'var(--admin-surface)',
                            color: activeTab === 'docs' ? '#1a1510' : 'var(--admin-text)',
                            fontWeight: activeTab === 'docs' ? '700' : '500',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <FileText size={16} />
                        Cartes &amp; Documents (PDF / Images)
                        <span style={{
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            background: activeTab === 'docs' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.06)',
                            fontWeight: '700'
                        }}>
                            {docsList.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* TAB 1: SOINS & RITUELS BIEN-ÊTRE (PAR DÉFAUT)                            */}
            {/* ========================================================================= */}
            {activeTab === 'services' && (
                <div style={{ width: '100%', maxWidth: '850px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', color: 'var(--admin-text)', margin: 0 }}>Rituels &amp; Soins de l&apos;Institut</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>
                                Modifiez les tarifs, durées, descriptions, photos et l&apos;ordre d&apos;affichage.
                            </p>
                        </div>
                        {!isAddingService && !editingService && (
                            <button onClick={() => { setIsAddingService(true); setServicePhotoPreview(null); }} className="admin-btn admin-btn-primary">
                                <Plus size={16} /> Ajouter un soin
                            </button>
                        )}
                    </div>

                    {/* Filtre par catégorie */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        <button
                            type="button"
                            onClick={() => setCategoryFilter('all')}
                            style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                border: '1px solid var(--admin-border)',
                                background: categoryFilter === 'all' ? 'var(--admin-gold)' : 'var(--admin-surface)',
                                color: categoryFilter === 'all' ? '#1a1510' : 'var(--admin-text)',
                                fontWeight: categoryFilter === 'all' ? '600' : '400',
                                cursor: 'pointer'
                            }}
                        >
                            Tous ({servicesList.length})
                        </button>
                        {CATEGORY_OPTIONS.map(cat => {
                            const count = servicesList.filter(s => s.category_slug === cat.slug).length;
                            return (
                                <button
                                    key={cat.slug}
                                    type="button"
                                    onClick={() => setCategoryFilter(cat.slug)}
                                    style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        border: '1px solid var(--admin-border)',
                                        background: categoryFilter === cat.slug ? 'var(--admin-gold)' : 'var(--admin-surface)',
                                        color: categoryFilter === cat.slug ? '#1a1510' : 'var(--admin-text)',
                                        fontWeight: categoryFilter === cat.slug ? '600' : '400',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {cat.name} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Formulaire Ajout Soin */}
                    {isAddingService && (
                        <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border-soft)' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text)', margin: 0 }}>Nouveau Soin / Rituel</h3>
                                <button type="button" onClick={() => setIsAddingService(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-subtle)', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form ref={serviceFormRef} onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label className="admin-label">Titre du soin *</label>
                                        <input type="text" name="title" required placeholder="Ex: Massage La Parenthèse (60 min)" className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Catégorie *</label>
                                        <select name="category_slug" required className="admin-input">
                                            {CATEGORY_OPTIONS.map(c => (
                                                <option key={c.slug} value={c.slug}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label className="admin-label">Tarif *</label>
                                        <input type="text" name="price" required placeholder="Ex: 70 €" className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Durée</label>
                                        <input type="text" name="duration" placeholder="Ex: 60 min (rendez-vous 1h30)" className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Badge d&apos;accroche (Optionnel)</label>
                                        <input type="text" name="badge" placeholder="Ex: Coup de Cœur, Signature, BIO..." className="admin-input" />
                                    </div>
                                </div>

                                <div>
                                    <label className="admin-label">Sous-titre / Accroche courte (Optionnel)</label>
                                    <input type="text" name="subtitle" placeholder="Ex: Votre moment sur mesure d'excellence" className="admin-input" />
                                </div>

                                <div>
                                    <label className="admin-label">Description détaillée du soin *</label>
                                    <textarea name="description" required rows="3" placeholder="Décrivez le protocole, le ressenti, l'approche personnalisée..." className="admin-input" style={{ lineHeight: '1.6' }} />
                                </div>

                                <div>
                                    <label className="admin-label">Bienfaits &amp; Produits associés (Optionnel)</label>
                                    <input type="text" name="benefits" placeholder="Ex: Huiles Green Spa BIO certifiées Cosmos par Ecocert, artisanales et sensorielles." className="admin-input" />
                                </div>

                                <div>
                                    <label className="admin-label">Lien direct Planity (Optionnel)</label>
                                    <input type="url" name="planity_url" placeholder="https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence" className="admin-input" />
                                </div>

                                {/* Téléversement Photo */}
                                <div style={{ background: 'var(--admin-surface)', padding: '1rem', borderRadius: '8px' }}>
                                    <label className="admin-label" style={{ fontWeight: 600 }}>Photo illustrative du soin</label>
                                    <input
                                        type="file"
                                        name="image_file"
                                        accept="image/*"
                                        className="admin-input"
                                        style={{ padding: '0.45rem' }}
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) setServicePhotoPreview(URL.createObjectURL(f));
                                        }}
                                    />
                                    {servicePhotoPreview && (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={servicePhotoPreview} alt="Aperçu" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Nouvelle photo sélectionnée</span>
                                        </div>
                                    )}
                                </div>

                                {/* Option Coup de Cœur Accueil */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', background: 'rgba(200, 169, 110, 0.1)', borderRadius: '8px', border: '1px solid rgba(200, 169, 110, 0.25)' }}>
                                    <input type="checkbox" id="add_is_featured" name="is_featured" value="1" style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)', cursor: 'pointer' }} />
                                    <label htmlFor="add_is_featured" style={{ fontSize: '0.9rem', color: 'var(--admin-text)', cursor: 'pointer', margin: 0, fontWeight: 500 }}>
                                        Mettre en avant dans la section &laquo; Vos Coups de Cœur &raquo; sur la page d&apos;accueil
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    <button type="button" onClick={() => setIsAddingService(false)} className="admin-btn admin-btn-secondary" disabled={isPending}>Annuler</button>
                                    <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending}>
                                        {isPending ? <Loader2 size={16} className="spin" /> : 'Enregistrer le soin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Formulaire Édition Soin */}
                    {editingService && (
                        <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border-soft)' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text)', margin: 0 }}>Modifier le Soin &laquo; {editingService.title} &raquo;</h3>
                                <button type="button" onClick={() => { setEditingService(null); setServicePhotoPreview(null); }} style={{ background: 'none', border: 'none', color: 'var(--admin-text-subtle)', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleEditService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <input type="hidden" name="id" value={editingService.id} />
                                <input type="hidden" name="image_url" value={editingService.image_url || ''} />

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label className="admin-label">Titre du soin *</label>
                                        <input type="text" name="title" defaultValue={editingService.title || ''} required className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Catégorie *</label>
                                        <select name="category_slug" defaultValue={editingService.category_slug || 'massages'} required className="admin-input">
                                            {CATEGORY_OPTIONS.map(c => (
                                                <option key={c.slug} value={c.slug}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label className="admin-label">Tarif *</label>
                                        <input type="text" name="price" defaultValue={editingService.price || ''} required className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Durée</label>
                                        <input type="text" name="duration" defaultValue={editingService.duration || ''} className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Badge d&apos;accroche (Optionnel)</label>
                                        <input type="text" name="badge" defaultValue={editingService.badge || ''} className="admin-input" />
                                    </div>
                                </div>

                                <div>
                                    <label className="admin-label">Sous-titre / Accroche courte</label>
                                    <input type="text" name="subtitle" defaultValue={editingService.subtitle || ''} className="admin-input" />
                                </div>

                                <div>
                                    <label className="admin-label">Description complète *</label>
                                    <textarea name="description" defaultValue={editingService.description || ''} required rows="3" className="admin-input" style={{ lineHeight: '1.6' }} />
                                </div>

                                <div>
                                    <label className="admin-label">Bienfaits &amp; Actifs</label>
                                    <input type="text" name="benefits" defaultValue={editingService.benefits || ''} className="admin-input" />
                                </div>

                                <div>
                                    <label className="admin-label">Lien direct Planity</label>
                                    <input type="url" name="planity_url" defaultValue={editingService.planity_url || ''} className="admin-input" />
                                </div>

                                {/* Téléversement Photo */}
                                <div style={{ background: 'var(--admin-surface)', padding: '1rem', borderRadius: '8px' }}>
                                    <label className="admin-label" style={{ fontWeight: 600 }}>Remplacer la photo du soin</label>
                                    <input
                                        type="file"
                                        name="image_file"
                                        accept="image/*"
                                        className="admin-input"
                                        style={{ padding: '0.45rem' }}
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) setServicePhotoPreview(URL.createObjectURL(f));
                                        }}
                                    />
                                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={servicePhotoPreview || editingService.image_url || '/images/massage-dos.jpg'}
                                            alt="Aperçu"
                                            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                            {servicePhotoPreview ? 'Nouvelle photo sélectionnée' : 'Photo actuelle'}
                                        </span>
                                    </div>
                                </div>

                                {/* Option Coup de Cœur Accueil */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', background: 'rgba(200, 169, 110, 0.1)', borderRadius: '8px', border: '1px solid rgba(200, 169, 110, 0.25)' }}>
                                    <input
                                        type="checkbox"
                                        id="edit_is_featured"
                                        name="is_featured"
                                        value="1"
                                        defaultChecked={Boolean(editingService.is_featured)}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="edit_is_featured" style={{ fontSize: '0.9rem', color: 'var(--admin-text)', cursor: 'pointer', margin: 0, fontWeight: 500 }}>
                                        Mettre en avant dans la section &laquo; Vos Coups de Cœur &raquo; sur la page d&apos;accueil
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    <button type="button" onClick={() => { setEditingService(null); setServicePhotoPreview(null); }} className="admin-btn admin-btn-secondary" disabled={isPending}>Annuler</button>
                                    <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending}>
                                        {isPending ? <Loader2 size={16} className="spin" /> : 'Enregistrer les modifications'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Liste des Soins */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredServices.length === 0 ? (
                            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                                <Sparkles size={36} style={{ margin: '0 auto 1rem', color: 'var(--admin-gold)', opacity: 0.7 }} />
                                <p>Aucun soin dans cette catégorie.</p>
                            </div>
                        ) : (
                            filteredServices.map((s, idx) => (
                                <div key={s.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '1 1 360px' }}>
                                        {/* Vignette Photo */}
                                        <div style={{
                                            width: '64px', height: '64px', borderRadius: '8px',
                                            overflow: 'hidden', flexShrink: 0, background: '#1a1510',
                                            border: '1px solid var(--admin-border)', position: 'relative'
                                        }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={s.image_url || '/images/massage-dos.jpg'}
                                                alt={s.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                                                <h3 style={{ fontSize: '1.05rem', color: 'var(--admin-text)', margin: 0, fontWeight: '600' }}>{s.title}</h3>
                                                <span style={{
                                                    fontSize: '0.85rem', fontWeight: '700',
                                                    color: 'var(--admin-gold)', background: 'rgba(200, 169, 110, 0.12)',
                                                    padding: '2px 8px', borderRadius: '4px'
                                                }}>
                                                    {s.price}
                                                </span>
                                                {s.is_featured ? (
                                                    <span style={{
                                                        fontSize: '0.7rem', fontWeight: '700',
                                                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                                                        color: '#b45309', background: 'rgba(245, 158, 11, 0.15)',
                                                        padding: '2px 7px', borderRadius: '9999px'
                                                    }}>
                                                        <Star size={11} fill="currentColor" /> Coup de Cœur Accueil
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--admin-text-muted)', flexWrap: 'wrap' }}>
                                                {s.category && <span>{s.category}</span>}
                                                {s.duration && <span>• {s.duration}</span>}
                                                {s.badge && <span style={{ color: 'var(--admin-gold)' }}>• {s.badge}</span>}
                                            </div>

                                            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '4px 0 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {s.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                        {/* Bouton Coup de Cœur */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleFeatured(s.id)}
                                            className="admin-btn-icon"
                                            style={{
                                                color: s.is_featured ? '#f59e0b' : 'var(--admin-text-subtle)',
                                                background: s.is_featured ? 'rgba(245, 158, 11, 0.15)' : undefined
                                            }}
                                            title={s.is_featured ? "Retirer de la section Coups de Cœur de l'accueil" : "Mettre en avant sur la page d'accueil"}
                                        >
                                            <Star size={15} fill={s.is_featured ? 'currentColor' : 'none'} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleReorderService(s.id, 'up')}
                                            disabled={idx === 0 || isPending}
                                            className="admin-btn-icon"
                                            title="Monter"
                                        >
                                            <ArrowUp size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleReorderService(s.id, 'down')}
                                            disabled={idx === filteredServices.length - 1 || isPending}
                                            className="admin-btn-icon"
                                            title="Descendre"
                                        >
                                            <ArrowDown size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setEditingService(s); setIsAddingService(false); setServicePhotoPreview(null); }}
                                            className="admin-btn-icon"
                                            title="Modifier"
                                        >
                                            <Edit3 size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteModal({ type: 'service', id: s.id, title: s.title })}
                                            className="admin-btn-icon"
                                            style={{ color: '#ef4444' }}
                                            title="Supprimer"
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

            {/* ========================================================================= */}
            {/* TAB 2: CARTES & DOCUMENTS TARIFAIRES                                     */}
            {/* ========================================================================= */}
            {activeTab === 'docs' && (
                <div style={{ width: '100%', maxWidth: '850px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', color: 'var(--admin-text)', margin: 0 }}>Documents &amp; Cartes Tarifaires</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>
                                Fichiers PDF et visuels de la grille tarifaire complète.
                            </p>
                        </div>
                        {!isAddingDoc && !editingDoc && (
                            <button onClick={() => setIsAddingDoc(true)} className="admin-btn admin-btn-primary">
                                <Plus size={16} /> Ajouter une carte / PDF
                            </button>
                        )}
                    </div>

                    {/* Formulaire Ajout Document */}
                    {isAddingDoc && (
                        <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border-soft)' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text)', margin: 0 }}>Nouvelle Carte / Grille Tarifaire</h3>
                                <button type="button" onClick={() => setIsAddingDoc(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-subtle)', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form ref={docFormRef} onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label className="admin-label">Titre de la carte *</label>
                                        <input type="text" name="title" required placeholder="Ex: Carte des Soins Automne-Hiver" className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Description (Optionnel)</label>
                                        <input type="text" name="description" placeholder="Ex: Tous les tarifs en format PDF téléchargeable" className="admin-input" />
                                    </div>
                                </div>

                                <div style={{ background: 'var(--admin-surface)', padding: '1rem', borderRadius: '8px' }}>
                                    <label className="admin-label" style={{ fontWeight: 600 }}>Fichier PDF ou Image *</label>
                                    <input
                                        type="file"
                                        name="file_fr"
                                        accept="image/*,application/pdf"
                                        required
                                        className="admin-input"
                                        style={{ padding: '0.45rem' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    <button type="button" onClick={() => setIsAddingDoc(false)} className="admin-btn admin-btn-secondary" disabled={isPending}>Annuler</button>
                                    <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending}>
                                        {isPending ? <Loader2 size={16} className="spin" /> : 'Enregistrer le document'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Formulaire Édition Document */}
                    {editingDoc && (
                        <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border-soft)' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--admin-text)', margin: 0 }}>Modifier la Carte / Document</h3>
                                <button type="button" onClick={() => setEditingDoc(null)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-subtle)', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleEditDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <input type="hidden" name="id" value={editingDoc.id} />

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label className="admin-label">Titre *</label>
                                        <input type="text" name="title" defaultValue={editingDoc.title || ''} required className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Description</label>
                                        <input type="text" name="description" defaultValue={editingDoc.description || ''} className="admin-input" />
                                    </div>
                                </div>

                                <div style={{ background: 'var(--admin-surface)', padding: '1rem', borderRadius: '8px' }}>
                                    <label className="admin-label" style={{ fontWeight: 600 }}>Remplacer le Fichier (Optionnel)</label>
                                    <input
                                        type="file"
                                        name="file_fr"
                                        accept="image/*,application/pdf"
                                        className="admin-input"
                                        style={{ padding: '0.45rem' }}
                                    />
                                    {editingDoc.file_url && (
                                        <div style={{ marginTop: '6px', fontSize: '0.8rem' }}>
                                            <a href={editingDoc.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <ExternalLink size={12} /> Voir fichier actuel
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    <button type="button" onClick={() => setEditingDoc(null)} className="admin-btn admin-btn-secondary" disabled={isPending}>Annuler</button>
                                    <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending}>
                                        {isPending ? <Loader2 size={16} className="spin" /> : 'Enregistrer les modifications'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Liste des Documents */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {docsList.length === 0 ? (
                            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                                <FileText size={36} style={{ margin: '0 auto 1rem', color: 'var(--admin-gold)', opacity: 0.7 }} />
                                <p>Aucun document ou carte tarifaire n&apos;est enregistré pour le moment.</p>
                                <button onClick={() => setIsAddingDoc(true)} className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
                                    <Plus size={16} /> Ajouter le premier document
                                </button>
                            </div>
                        ) : (
                            docsList.map((doc, idx) => {
                                const isPdf = doc.file_type === 'pdf' || (doc.file_url && doc.file_url.toLowerCase().endsWith('.pdf'));

                                return (
                                    <div key={doc.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: '1 1 300px' }}>
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '8px',
                                                background: isPdf ? 'rgba(239,68,68,0.12)' : '#1a1510',
                                                border: '1px solid var(--admin-border)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                overflow: 'hidden'
                                            }}>
                                                {isPdf ? (
                                                    <FileText size={28} style={{ color: '#ef4444' }} />
                                                ) : (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={doc.file_url}
                                                        alt={doc.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                )}
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.05rem', color: 'var(--admin-text)', margin: '0 0 0.35rem', fontWeight: '600' }}>
                                                    {doc.title}
                                                </h3>
                                                {doc.description && (
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: 0, lineHeight: '1.5' }}>
                                                        {doc.description}
                                                    </p>
                                                )}
                                                {doc.file_url && (
                                                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--admin-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                                                        <ExternalLink size={12} /> Consulter le document
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                            <button
                                                type="button"
                                                onClick={() => handleReorderDoc(doc.id, 'up')}
                                                disabled={idx === 0 || isPending}
                                                className="admin-btn-icon"
                                                title="Monter"
                                            >
                                                <ArrowUp size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleReorderDoc(doc.id, 'down')}
                                                disabled={idx === docsList.length - 1 || isPending}
                                                className="admin-btn-icon"
                                                title="Descendre"
                                            >
                                                <ArrowDown size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setEditingDoc(doc); setIsAddingDoc(false); }}
                                                className="admin-btn-icon"
                                                title="Modifier"
                                            >
                                                <Edit3 size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteModal({ type: 'doc', id: doc.id, title: doc.title })}
                                                className="admin-btn-icon"
                                                style={{ color: '#ef4444' }}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Modal de Confirmation de Suppression */}
            {deleteModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="admin-card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', textAlign: 'center' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(239,68,68,0.15)',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <Trash2 size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--admin-text)' }}>
                            Confirmer la suppression
                        </h3>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                            Es-tu sûr de vouloir supprimer &laquo; <strong>{deleteModal.title}</strong> &raquo; ? Cette action est irréversible.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setDeleteModal(null)}
                                className="admin-btn admin-btn-secondary"
                                disabled={isPending}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (deleteModal.type === 'doc') handleDeleteDoc(deleteModal.id);
                                    else if (deleteModal.type === 'service') handleDeleteService(deleteModal.id);
                                }}
                                className="admin-btn admin-btn-danger"
                                style={{ background: '#dc2626', color: '#fff', border: 'none' }}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 size={16} className="spin" /> : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
