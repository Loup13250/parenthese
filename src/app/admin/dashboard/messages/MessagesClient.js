'use client';

import { useState, useTransition } from 'react';
import { deleteMessage, updateMessageStatus, updateMessageNotes } from '@/app/actions';
import {
    Mail,
    Phone,
    Calendar,
    Clock,
    Sparkles,
    Trash2,
    StickyNote,
    Check,
    Loader2,
    MessageSquare,
} from 'lucide-react';

function parseDbDate(dateStr) {
    if (!dateStr) return null;
    const s = String(dateStr);
    const d = new Date(s.endsWith('Z') || s.includes('+') ? s : s.replace(' ', 'T') + 'Z');
    return Number.isNaN(d.getTime()) ? null : d;
}

const STATUS_CONFIG = {
    nouveau: {
        label: 'Nouveau',
        bg: 'rgba(184, 139, 70, 0.15)',
        color: 'var(--admin-gold-dark)',
        border: 'rgba(184, 139, 70, 0.35)',
    },
    en_cours: {
        label: 'En cours',
        bg: 'rgba(59, 130, 246, 0.14)',
        color: '#2563EB',
        border: 'rgba(59, 130, 246, 0.32)',
    },
    traite: {
        label: 'Traité / Répondu',
        bg: 'rgba(34, 197, 94, 0.14)',
        color: '#16A34A',
        border: 'rgba(34, 197, 94, 0.32)',
    },
    effectue: {
        label: 'Traité / Répondu',
        bg: 'rgba(34, 197, 94, 0.14)',
        color: '#16A34A',
        border: 'rgba(34, 197, 94, 0.32)',
    },
    archive: {
        label: 'Archivé',
        bg: 'rgba(120, 113, 108, 0.14)',
        color: '#57534E',
        border: 'rgba(120, 113, 108, 0.3)',
    },
    annule: {
        label: 'Annulé',
        bg: 'rgba(220, 38, 38, 0.12)',
        color: '#DC2626',
        border: 'rgba(220, 38, 38, 0.3)',
    },
};

function normalizeStatus(msg) {
    const raw = msg.status || (msg.is_read ? 'en_cours' : 'nouveau');
    return raw === 'effectue' ? 'traite' : raw;
}

function MessageCard({ msg }) {
    const [status, setStatus] = useState(() => normalizeStatus(msg));
    const [notes, setNotes] = useState(msg.admin_notes || '');
    const [savedNotes, setSavedNotes] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        startTransition(async () => {
            await updateMessageStatus(msg.id, newStatus);
        });
    };

    const handleSaveNotes = (e) => {
        e.preventDefault();
        startTransition(async () => {
            await updateMessageNotes(msg.id, notes);
            setSavedNotes(true);
            setTimeout(() => setSavedNotes(false), 2200);
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            await deleteMessage(msg.id);
        });
    };

    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.nouveau;
    const receivedDate = parseDbDate(msg.created_at);
    const serviceLabel = msg.service_interest || msg.event_type || 'Renseignement bien-être';
    const preferredDate = msg.preferred_date || msg.event_date || '';
    const preferredTime = msg.preferred_time || msg.guests || '';

    return (
        <div
            className="admin-card"
            style={{
                borderLeft: `4px solid ${cfg.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                marginBottom: 0,
            }}
        >
            {/* Barre du haut : nom, date, statut, actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border-soft)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--admin-text)', fontFamily: 'var(--font-body), system-ui, sans-serif', margin: 0 }}>
                            {msg.name}
                        </h2>
                        <span style={{
                            background: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.border}`,
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '3px 10px',
                            borderRadius: '999px',
                        }}>
                            {cfg.label}
                        </span>
                    </div>
                    {receivedDate && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', marginTop: '0.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={13} style={{ color: 'var(--admin-gold)' }} />
                            Reçu le {receivedDate.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>

                {/* Changement de statut et suppression */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {status === 'nouveau' && (
                        <button
                            type="button"
                            onClick={() => handleStatusChange('en_cours')}
                            disabled={isPending}
                            className="admin-btn admin-btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                            <Clock size={13} /> Marquer « En cours »
                        </button>
                    )}

                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="admin-select"
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            width: 'auto',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="nouveau">Nouveau</option>
                        <option value="en_cours">En cours</option>
                        <option value="traite">Traité / Répondu</option>
                        <option value="archive">Archivé</option>
                        <option value="annule">Annulé</option>
                    </select>

                    {deleteConfirm ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            >
                                {isPending ? <Loader2 size={13} className="spin" /> : 'Confirmer'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteConfirm(false)}
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            >
                                Annuler
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setDeleteConfirm(true)}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '7px 11px' }}
                            title="Supprimer cette demande"
                            aria-label="Supprimer cette demande de contact"
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            </div>

            {/* Grille de coordonnées & souhait */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
                gap: '1.15rem',
                background: 'var(--admin-surface-subtle)',
                padding: '1.15rem',
                borderRadius: 'var(--admin-radius-md)',
                border: '1px solid var(--admin-border)',
            }}>
                <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
                        Téléphone
                    </span>
                    {msg.phone ? (
                        <a href={`tel:${msg.phone.replace(/\s+/g, '')}`} style={{ color: 'var(--admin-text)', fontWeight: '600', fontSize: '0.96rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                            <Phone size={14} style={{ color: 'var(--admin-gold)' }} />
                            {msg.phone}
                        </a>
                    ) : (
                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem', fontStyle: 'italic' }}>Non renseigné</span>
                    )}
                </div>

                <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
                        Email
                    </span>
                    <a href={`mailto:${msg.email}?subject=${encodeURIComponent(`La Parenthèse Harmonieuse — Votre demande (${serviceLabel})`)}`} style={{ color: 'var(--admin-text)', fontWeight: '500', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', wordBreak: 'break-all', textDecoration: 'none' }}>
                        <Mail size={14} style={{ color: 'var(--admin-gold)' }} />
                        {msg.email}
                    </a>
                </div>

                <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
                        Soin / Objet
                    </span>
                    <span style={{ fontWeight: '600', color: 'var(--admin-text)', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Sparkles size={14} style={{ color: 'var(--admin-gold)' }} />
                        {serviceLabel}
                    </span>
                </div>

                {preferredDate && (
                    <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
                            Date souhaitée
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--admin-text)', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={14} style={{ color: 'var(--admin-gold)' }} />
                            {preferredDate}
                        </span>
                    </div>
                )}

                {preferredTime && (
                    <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-gold-dark)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
                            Créneau / Précision
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--admin-text)', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Clock size={14} style={{ color: 'var(--admin-gold)' }} />
                            {preferredTime}
                        </span>
                    </div>
                )}
            </div>

            {/* Texte du message de la cliente */}
            <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-gold-dark)', display: 'block', marginBottom: '0.45rem' }}>
                    Message reçu :
                </span>
                <div style={{
                    color: 'var(--admin-text)',
                    lineHeight: '1.7',
                    fontSize: '0.95rem',
                    whiteSpace: 'pre-wrap',
                    background: 'var(--admin-surface-subtle)',
                    padding: '1.15rem 1.25rem',
                    borderRadius: 'var(--admin-radius-md)',
                    border: '1px solid var(--admin-border)',
                }}>
                    {msg.message}
                </div>
            </div>

            {/* Note interne privée */}
            <form onSubmit={handleSaveNotes} style={{ background: 'var(--admin-gold-soft)', border: '1px solid var(--admin-gold-border)', borderRadius: 'var(--admin-radius-md)', padding: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-gold-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <StickyNote size={14} /> Note privée interne (suivi cliente, carte cadeau, rappel…)
                    </label>
                    {savedNotes && (
                        <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Check size={14} /> Note enregistrée !
                        </span>
                    )}
                </div>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Saisissez vos remarques privées (ex : carte cadeau 75 min envoyée le 12/05, rappel effectué, préférences de soin)..."
                    className="admin-textarea"
                    rows={2}
                    style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '0.75rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="admin-btn admin-btn-secondary" disabled={isPending} style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
                        {isPending ? <Loader2 size={13} className="spin" /> : 'Enregistrer la note'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function MessagesClient({ messages = [] }) {
    const [filter, setFilter] = useState('tous');

    const filteredMessages = messages.filter((msg) => {
        if (filter === 'tous') return true;
        return normalizeStatus(msg) === filter;
    });

    const countOf = (key) => messages.filter((m) => normalizeStatus(m) === key).length;

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* EN-TÊTE UNIFIÉ */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-page-icon" aria-hidden="true">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <span className="admin-eyebrow">Messagerie Clientèle</span>
                        <h1 className="admin-title">Demandes &amp; Messages Reçus</h1>
                        <p className="admin-subtitle">
                            Retrouvez toutes les demandes envoyées depuis le formulaire de contact (renseignements soins, cartes cadeaux, créneaux) et consignez vos notes privées de suivi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Onglets de filtre */}
            <div className="admin-quicknav" role="tablist" aria-label="Filtrer les demandes par statut">
                {[
                    { id: 'tous', label: `Tous (${messages.length})` },
                    { id: 'nouveau', label: `Nouveaux (${countOf('nouveau')})` },
                    { id: 'en_cours', label: `En cours (${countOf('en_cours')})` },
                    { id: 'traite', label: `Traités (${countOf('traite')})` },
                    { id: 'archive', label: `Archivés (${countOf('archive')})` },
                    { id: 'annule', label: `Annulés (${countOf('annule')})` },
                ].map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setFilter(t.id)}
                        className={`admin-quicknav-btn ${filter === t.id ? 'active' : ''}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Liste des messages */}
            <div style={{ width: '100%' }}>
                {filteredMessages.length === 0 ? (
                    <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--admin-text-muted)' }}>
                        <Mail size={42} style={{ opacity: 0.45, margin: '0 auto 1rem', color: 'var(--admin-gold)' }} />
                        <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                            Aucun message dans cette catégorie pour le moment.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                        {filteredMessages.map((msg) => (
                            <MessageCard key={msg.id} msg={msg} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
