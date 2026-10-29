'use client';

/**
 * SiteTextsEditor - modification des textes du site (100% en Français)
 * --------------------------------------------------------------------
 * Chaque champ est pré-rempli avec le texte actuellement actif sur le site.
 * Cliquer sur "Enregistrer" met à jour le site instantanément.
 * "Rétablir l'original" réinitialise le texte à sa valeur par défaut.
 */

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import {
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    ChevronDown,
    Search,
    ExternalLink,
    Undo2,
    Sparkles,
    ChevronsUpDown,
} from 'lucide-react';
import { DICTIONARY } from '@/context/dictionary';
import { getTextLabel } from '@/lib/siteTexts';
import { saveSiteTexts } from '@/app/actions';
import './SiteTextsEditor.css';

const defaultOf = (key) => DICTIONARY[key] ?? '';

const normalize = (s) =>
    String(s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const placeholdersOf = (text) => (String(text).match(/\{[a-zA-Z]+\}/g) || []);

function buildInitialValues(sections, overrides) {
    const rawFr = overrides?.fr || overrides || {};
    const values = {};
    sections.forEach((section) => {
        section.keys.forEach((key) => {
            values[key] = rawFr[key] ?? defaultOf(key);
        });
    });
    return values;
}

function TextField({ id, value, onChange, defaultText }) {
    const isLong = (defaultText && (defaultText.length > 70 || defaultText.includes('\n'))) ||
        (value && (value.length > 90 || value.includes('\n')));
    const common = {
        id,
        value: value ?? '',
        onChange: (e) => onChange(e.target.value),
        placeholder: defaultText || '',
        spellCheck: true,
    };
    if (isLong) {
        const rows = Math.min(7, Math.max(3, Math.ceil(Math.max((value || '').length, (defaultText || '').length) / 60)));
        return <textarea {...common} rows={rows} className="admin-textarea st-field" />;
    }
    return <input type="text" {...common} className="admin-input st-field" />;
}

export default function SiteTextsEditor({
    sections,
    overrides = { fr: {} },
    searchable = false,
    collapsible = false,
    defaultOpenFirst = false,
}) {
    const [prevOverrides, setPrevOverrides] = useState(overrides);
    const [values, setValues] = useState(() => buildInitialValues(sections, overrides));
    const [saved, setSaved] = useState(() => buildInitialValues(sections, overrides));

    if (prevOverrides !== overrides) {
        setPrevOverrides(overrides);
        const fresh = buildInitialValues(sections, overrides);
        setSaved(fresh);
        setValues(fresh);
    }

    const [open, setOpen] = useState(() => {
        const init = {};
        sections.forEach((s, i) => { init[s.id] = !collapsible || (defaultOpenFirst && i === 0); });
        return init;
    });
    const [query, setQuery] = useState('');
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState(null);

    const allKeys = useMemo(() => sections.flatMap((s) => s.keys), [sections]);

    const changedKeys = useMemo(
        () => allKeys.filter((key) => (values[key] ?? '') !== (saved[key] ?? '')),
        [allKeys, values, saved],
    );
    const dirty = changedKeys.length > 0;

    const isCustom = (key) => (values[key] ?? '') !== defaultOf(key);

    const setValue = (key, text) => {
        setFeedback(null);
        setValues((prev) => ({ ...prev, [key]: text }));
    };

    const resetKey = (key) => {
        setFeedback(null);
        setValues((prev) => ({ ...prev, [key]: defaultOf(key) }));
    };

    const discardChanges = () => {
        setFeedback(null);
        setValues(saved);
    };

    const allExpanded = useMemo(
        () => sections.every((s) => open[s.id]),
        [sections, open]
    );

    const toggleAll = () => {
        const nextVal = !allExpanded;
        const next = {};
        sections.forEach((s) => { next[s.id] = nextVal; });
        setOpen(next);
    };

    const handleSave = () => {
        for (const key of changedKeys) {
            const missing = placeholdersOf(defaultOf(key)).filter((p) => !(values[key] || '').includes(p));
            if (missing.length && (values[key] || '').trim() !== '') {
                setFeedback({
                    type: 'error',
                    text: `« ${getTextLabel(key)} » doit conserver ${missing.join(', ')} : ce paramètre est remplacé automatiquement.`,
                });
                return;
            }
        }

        const updates = { fr: {} };
        changedKeys.forEach((key) => {
            const val = (values[key] || '').trim();
            updates.fr[key] = val === '' || val === defaultOf(key) ? null : values[key];
        });

        startTransition(async () => {
            try {
                const res = await saveSiteTexts(updates);
                if (res?.error) {
                    setFeedback({ type: 'error', text: res.error });
                    return;
                }
                const next = { ...values };
                changedKeys.forEach((key) => {
                    if ((next[key] || '').trim() === '') next[key] = defaultOf(key);
                });
                setValues(next);
                setSaved(next);
                setFeedback({ type: 'ok', text: 'Textes enregistrés avec succès. Le site est mis à jour.' });
                setTimeout(() => setFeedback((f) => (f?.type === 'ok' ? null : f)), 4500);
            } catch (err) {
                console.error(err);
                setFeedback({ type: 'error', text: "L'enregistrement a échoué. Veuillez vérifier votre connexion." });
            }
        });
    };

    const q = normalize(query.trim());
    const visibleSections = sections
        .map((section) => ({
            ...section,
            visibleKeys: q
                ? section.keys.filter((key) =>
                    normalize([getTextLabel(key), key, values[key], defaultOf(key)].join(' ')).includes(q))
                : section.keys,
        }))
        .filter((s) => s.visibleKeys.length > 0);

    const customCount = allKeys.filter(isCustom).length;

    return (
        <div className="st-root">
            {(searchable || collapsible || customCount > 0) && (
                <div className="st-toolbar">
                    {searchable && (
                        <label className="st-search">
                            <Search size={16} />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher un texte, un titre ou un mot-clé…"
                                aria-label="Rechercher un texte"
                            />
                        </label>
                    )}
                    <div className="st-toolbar-actions">
                        {customCount > 0 && (
                            <span className="st-count" title="Textes différents de ceux d'origine">
                                <Sparkles size={13} /> {customCount} texte{customCount > 1 ? 's' : ''} personnalisé{customCount > 1 ? 's' : ''}
                            </span>
                        )}
                        {collapsible && sections.length > 1 && (
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                                <ChevronsUpDown size={14} />
                                {allExpanded ? 'Tout replier' : 'Tout déplier'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {visibleSections.length === 0 && (
                <p className="st-empty">Aucun texte ne correspond à « {query} ».</p>
            )}

            {visibleSections.map((section, idx) => {
                const isOpen = q ? true : open[section.id];
                const customInSection = section.keys.filter(isCustom).length;
                return (
                    <section key={section.id} className={`st-section ${isOpen ? 'is-open' : ''}`}>
                        <div className="st-section-head">
                            <button
                                type="button"
                                className="st-section-toggle"
                                onClick={() => collapsible && setOpen((prev) => ({ ...prev, [section.id]: !prev[section.id] }))}
                                aria-expanded={isOpen}
                                style={{ cursor: collapsible ? 'pointer' : 'default' }}
                            >
                                <span className="st-section-num" aria-hidden="true">{idx + 1}</span>
                                <span className="st-section-text">
                                    <strong>{section.title}</strong>
                                    {section.description && <em>{section.description}</em>}
                                </span>
                                {customInSection > 0 && (
                                    <span className="st-pill">
                                        {customInSection} personnalisé{customInSection > 1 ? 's' : ''}
                                    </span>
                                )}
                                {collapsible && <ChevronDown size={18} className="st-chevron" />}
                            </button>
                            {section.href && (
                                <Link
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="st-link"
                                >
                                    <ExternalLink size={13} /> Voir la page
                                </Link>
                            )}
                        </div>

                        {isOpen && (
                            <div className="st-items">
                                {section.visibleKeys.map((key) => {
                                    const custom = isCustom(key);
                                    const tokens = placeholdersOf(defaultOf(key));
                                    return (
                                        <div key={key} className={`st-item ${custom ? 'is-custom' : ''}`}>
                                            <div className="st-item-head">
                                                <label htmlFor={`st-${key}`}>{getTextLabel(key)}</label>
                                                {custom && (
                                                    <button
                                                        type="button"
                                                        className="st-reset"
                                                        onClick={() => resetKey(key)}
                                                        title="Revenir au texte d'origine"
                                                    >
                                                        <RotateCcw size={12} /> Rétablir l&apos;original
                                                    </button>
                                                )}
                                            </div>
                                            <div className="st-field-wrap">
                                                <TextField
                                                    id={`st-${key}`}
                                                    value={values[key]}
                                                    defaultText={defaultOf(key)}
                                                    onChange={(text) => setValue(key, text)}
                                                />
                                            </div>
                                            {tokens.length > 0 && (
                                                <p className="st-note">
                                                    Conservez {tokens.join(', ')} : ce paramètre est complété automatiquement par le site.
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                );
            })}

            {/* Barre d'enregistrement */}
            <div className={`st-savebar ${dirty || feedback ? 'is-visible' : ''}`} role="status" aria-live="polite">
                {feedback ? (
                    <span className={`st-feedback ${feedback.type === 'ok' ? 'is-ok' : 'is-error'}`}>
                        {feedback.type === 'ok' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
                        {feedback.text}
                    </span>
                ) : dirty ? (
                    <span className="st-dirty">
                        <span className="st-dot" /> {changedKeys.length} texte{changedKeys.length > 1 ? 's' : ''} modifié{changedKeys.length > 1 ? 's' : ''} — pensez à enregistrer
                    </span>
                ) : (
                    <span className="st-dirty" style={{ fontWeight: 500 }}>
                        Tous les textes sont à jour sur le site public.
                    </span>
                )}
                <div className="st-save-actions">
                    {dirty && (
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary st-btn"
                            onClick={discardChanges}
                            disabled={isPending}
                        >
                            <Undo2 size={15} /> Annuler
                        </button>
                    )}
                    <button
                        type="button"
                        className="admin-btn admin-btn-primary st-btn"
                        onClick={handleSave}
                        disabled={isPending || !dirty}
                    >
                        {isPending ? <Loader2 size={15} className="st-spin" /> : <Save size={15} />}
                        Enregistrer les textes
                    </button>
                </div>
            </div>
        </div>
    );
}
