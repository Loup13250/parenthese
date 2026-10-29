'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
    Star,
    Plus,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    Save,
} from 'lucide-react';
import {
    addTestimonial,
    editTestimonial,
    deleteTestimonial,
    toggleTestimonialFeatured,
    reorderTestimonial,
} from '@/app/actions';

export default function TestimonialsClient({ initialTestimonials = [] }) {
    const router = useRouter();
    const [items, setItems] = useState(initialTestimonials);
    const [prevInitial, setPrevInitial] = useState(initialTestimonials);
    if (prevInitial !== initialTestimonials) {
        setPrevInitial(initialTestimonials);
        setItems(initialTestimonials);
    }

    const [showAdd, setShowAdd] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isPending, startTransition] = useTransition();

    const notify = (type, text) => {
        setFeedback({ type, text });
        if (type === 'success') {
            setTimeout(() => setFeedback((cur) => (cur?.text === text ? null : cur)), 4500);
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        startTransition(async () => {
            try {
                const res = await addTestimonial(formData);
                if (res?.error) {
                    notify('error', res.error);
                    return;
                }
                form.reset();
                setShowAdd(false);
                notify('success', 'Témoignage ajouté et publié sur le site.');
                router.refresh();
            } catch {
                notify('error', "Erreur lors de l'ajout du témoignage.");
            }
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!editingItem) return;
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            try {
                const res = await editTestimonial(editingItem.id, formData);
                if (res?.error) {
                    notify('error', res.error);
                    return;
                }
                setEditingItem(null);
                notify('success', 'Témoignage mis à jour.');
                router.refresh();
            } catch {
                notify('error', 'Erreur lors de la modification du témoignage.');
            }
        });
    };

    const handleDelete = (item) => {
        if (!window.confirm(`Supprimer l'avis de « ${item.author} » ?`)) return;
        startTransition(async () => {
            try {
                const res = await deleteTestimonial(item.id);
                if (res?.error) {
                    notify('error', res.error);
                    return;
                }
                setItems((prev) => prev.filter((t) => t.id !== item.id));
                notify('success', 'Témoignage supprimé.');
                router.refresh();
            } catch {
                notify('error', 'Impossible de supprimer ce témoignage.');
            }
        });
    };

    const handleToggleFeatured = (item) => {
        const nextVal = !item.is_featured;
        setItems((prev) => prev.map((t) => (t.id === item.id ? { ...t, is_featured: nextVal ? 1 : 0 } : t)));
        startTransition(async () => {
            try {
                const res = await toggleTestimonialFeatured(item.id, nextVal);
                if (res?.error) {
                    notify('error', res.error);
                }
                router.refresh();
            } catch {
                notify('error', 'Impossible de modifier la visibilité.');
            }
        });
    };

    const handleMove = (index, direction) => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;
        const current = items[index];
        const nextList = [...items];
        [nextList[index], nextList[targetIndex]] = [nextList[targetIndex], nextList[index]];
        setItems(nextList);

        startTransition(async () => {
            try {
                await reorderTestimonial(current.id, direction);
                router.refresh();
            } catch {
                notify('error', "Erreur lors du réordonnancement.");
            }
        });
    };

    const featuredCount = items.filter((i) => i.is_featured).length;

    return (
        <div className="animate-fade" style={{ maxWidth: '1040px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                    <h1 className="admin-page-title">Avis &amp; Témoignages Clientes</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', margin: 0 }}>
                        Gérez les avis vérifiés affichés sur la page d&apos;accueil (les 3 premiers témoignages actifs sont mis en avant).
                    </p>
                </div>
                <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={() => { setShowAdd((v) => !v); setEditingItem(null); }}
                >
                    {showAdd ? <X size={16} /> : <Plus size={16} />}
                    <span>{showAdd ? 'Fermer' : 'Ajouter un avis'}</span>
                </button>
            </header>

            {feedback && (
                <div className={`admin-alert ${feedback.type === 'error' ? 'admin-alert-error' : 'admin-alert-success'}`} role="status">
                    {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                    <span>{feedback.text}</span>
                </div>
            )}

            {/* Formulaire d'ajout */}
            {showAdd && (
                <section className="admin-card animate-fade-up" style={{ borderColor: 'var(--admin-gold)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Nouveau témoignage cliente</h2>
                    </div>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="admin-grid-2col">
                            <div>
                                <label className="admin-label">Prénom / Nom de la cliente *</label>
                                <input name="author" required placeholder="Ex : Camille L." className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Soin réalisé (optionnel)</label>
                                <input name="treatment_name" placeholder="Ex : Massage Kobido (75 min)" className="admin-input" />
                            </div>
                        </div>

                        <div className="admin-grid-3col">
                            <div>
                                <label className="admin-label">Note (étoiles)</label>
                                <select name="rating" defaultValue="5" className="admin-select">
                                    <option value="5">5 ★</option>
                                    <option value="4">4 ★</option>
                                    <option value="3">3 ★</option>
                                    <option value="2">2 ★</option>
                                    <option value="1">1 ★</option>
                                </select>
                            </div>
                            <div>
                                <label className="admin-label">Source de l&apos;avis</label>
                                <select name="source" defaultValue="Avis vérifié Planity" className="admin-select">
                                    <option value="Avis vérifié Planity">Avis vérifié Planity</option>
                                    <option value="Avis vérifié Google">Avis vérifié Google</option>
                                    <option value="Cliente fidèle">Cliente fidèle</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 550 }}>
                                    <input type="checkbox" name="is_featured" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--admin-gold)' }} />
                                    <span>Afficher sur la page d&apos;accueil</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="admin-label">Témoignage (Français) *</label>
                            <textarea
                                name="comment"
                                required
                                rows={3}
                                placeholder="Copiez ici le commentaire laissé par la cliente..."
                                className="admin-textarea"
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAdd(false)}>
                                Annuler
                            </button>
                            <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending}>
                                {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                                <span>Publier l&apos;avis</span>
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Modale / Carte d'édition */}
            {editingItem && (
                <section className="admin-card animate-fade-up" style={{ borderColor: 'var(--admin-gold)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Modifier l&apos;avis de {editingItem.author}</h2>
                        <button type="button" className="admin-btn-icon" onClick={() => setEditingItem(null)} aria-label="Fermer">
                            <X size={16} />
                        </button>
                    </div>
                    <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="admin-grid-2col">
                            <div>
                                <label className="admin-label">Prénom / Nom de la cliente *</label>
                                <input name="author" required defaultValue={editingItem.author} className="admin-input" />
                            </div>
                            <div>
                                <label className="admin-label">Soin réalisé</label>
                                <input name="treatment_name" defaultValue={editingItem.treatment_name || ''} className="admin-input" />
                            </div>
                        </div>

                        <div className="admin-grid-3col">
                            <div>
                                <label className="admin-label">Note</label>
                                <select name="rating" defaultValue={String(editingItem.rating || 5)} className="admin-select">
                                    <option value="5">5 ★</option>
                                    <option value="4">4 ★</option>
                                    <option value="3">3 ★</option>
                                    <option value="2">2 ★</option>
                                    <option value="1">1 ★</option>
                                </select>
                            </div>
                            <div>
                                <label className="admin-label">Source</label>
                                <input name="source" defaultValue={editingItem.source || 'Avis vérifié Planity'} className="admin-input" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 550 }}>
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        defaultChecked={Boolean(editingItem.is_featured)}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--admin-gold)' }}
                                    />
                                    <span>Afficher sur l&apos;accueil</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="admin-label">Témoignage (Français) *</label>
                            <textarea name="comment" required rows={4} defaultValue={editingItem.comment} className="admin-textarea" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setEditingItem(null)}>
                                Annuler
                            </button>
                            <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending}>
                                {isPending ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                                <span>Enregistrer</span>
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Liste des témoignages */}
            <div style={{ marginBottom: '0.9rem', fontSize: '0.84rem', color: 'var(--admin-text-muted)' }}>
                <strong>{items.length}</strong> témoignage{items.length > 1 ? 's' : ''} enregistré{items.length > 1 ? 's' : ''} •{' '}
                <strong>{featuredCount}</strong> actif{featuredCount > 1 ? 's' : ''} sur l&apos;accueil
            </div>

            {items.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <Star size={32} style={{ color: 'var(--admin-gold)', marginBottom: '0.75rem' }} />
                    <p style={{ margin: 0, color: 'var(--admin-text-muted)' }}>
                        Aucun témoignage enregistré pour le moment. Cliquez sur « Ajouter un avis » pour publier un retour cliente.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {items.map((item, idx) => (
                        <article
                            key={item.id}
                            className="admin-card"
                            style={{
                                marginBottom: 0,
                                padding: '1.25rem 1.5rem',
                                opacity: item.is_featured ? 1 : 0.68,
                                borderLeft: item.is_featured ? '3px solid var(--admin-gold)' : '1px solid var(--admin-border)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '240px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                                        <strong style={{ fontSize: '1rem', color: 'var(--admin-text)' }}>{item.author}</strong>
                                        <span style={{ display: 'inline-flex', gap: '2px', color: '#D97706' }}>
                                            {[...Array(item.rating || 5)].map((_, i) => (
                                                <Star key={i} size={13} fill="#D97706" stroke="#D97706" />
                                            ))}
                                        </span>
                                        {item.treatment_name && (
                                            <span style={{
                                                fontSize: '0.76rem',
                                                padding: '2px 8px',
                                                borderRadius: '999px',
                                                background: 'var(--admin-surface)',
                                                border: '1px solid var(--admin-border-soft)',
                                                color: 'var(--admin-gold-dark)',
                                                fontWeight: 550,
                                            }}>
                                                {item.treatment_name}
                                            </span>
                                        )}
                                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)' }}>
                                            • {item.source || 'Avis vérifié'}
                                        </span>
                                        {idx < 3 && Boolean(item.is_featured) && (
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                borderRadius: '999px',
                                                background: '#ECFDF5',
                                                color: '#047857',
                                                border: '1px solid #A7F3D0',
                                                fontWeight: 600,
                                            }}>
                                                Affiché en position #{idx + 1}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--admin-text-muted)' }}>
                                        &ldquo;{item.comment}&rdquo;
                                    </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                                    <button
                                        type="button"
                                        className="admin-btn-icon"
                                        onClick={() => handleMove(idx, 'up')}
                                        disabled={idx === 0 || isPending}
                                        title="Monter"
                                        aria-label="Monter cet avis"
                                    >
                                        <ArrowUp size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn-icon"
                                        onClick={() => handleMove(idx, 'down')}
                                        disabled={idx === items.length - 1 || isPending}
                                        title="Descendre"
                                        aria-label="Descendre cet avis"
                                    >
                                        <ArrowDown size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn-icon"
                                        onClick={() => handleToggleFeatured(item)}
                                        disabled={isPending}
                                        title={item.is_featured ? "Masquer de l'accueil" : "Afficher sur l'accueil"}
                                        aria-label={item.is_featured ? "Masquer de l'accueil" : "Afficher sur l'accueil"}
                                    >
                                        {item.is_featured ? <Eye size={15} /> : <EyeOff size={15} />}
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn-icon"
                                        onClick={() => {
                                            setEditingItem(item);
                                            setShowAdd(false);
                                        }}
                                        title="Modifier"
                                        aria-label="Modifier cet avis"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn-icon"
                                        onClick={() => handleDelete(item)}
                                        disabled={isPending}
                                        title="Supprimer"
                                        aria-label="Supprimer cet avis"
                                        style={{ color: 'var(--admin-terracotta)' }}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

