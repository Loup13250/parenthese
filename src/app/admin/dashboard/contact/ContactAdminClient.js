'use client';

import Link from 'next/link';
import { Mail, ExternalLink, Settings, MessageSquare, Sparkles, Type, ArrowRight } from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { CONTACT_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';

export default function ContactAdminClient({ siteInfo = {}, customTexts = { fr: {} }, unreadCount = 0 }) {
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const email = siteInfo?.contact_email || 'laparentheseharmonieuse@gmail.com';

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* EN-TÊTE UNIFIÉ */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-page-icon" aria-hidden="true">
                        <Mail size={24} />
                    </div>
                    <div>
                        <span className="admin-eyebrow">Page 5 du site public</span>
                        <h1 className="admin-title">Page Contact &amp; Accès</h1>
                        <p className="admin-subtitle">
                            Gérez les textes d&apos;accueil, les indications d&apos;accès (Pôle Santé Georges Guynemer, parking gratuit) et les intitulés du formulaire de la page /contact.
                        </p>
                    </div>
                </div>
                <div className="admin-page-actions">
                    <Link
                        href="/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                    >
                        <ExternalLink size={15} /> Voir /contact
                    </Link>
                </div>
            </div>

            {/* Raccourcis pratiques Coordonnées & Boîte de réception */}
            <div className="admin-info-banner">
                <div className="admin-info-banner-head">
                    <Sparkles size={18} style={{ color: 'var(--admin-gold)' }} />
                    <span>Raccourcis liés à votre page Contact</span>
                </div>

                <div className="admin-grid-2col">
                    {/* Bloc Messages */}
                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', padding: '1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                <MessageSquare size={16} style={{ color: 'var(--admin-gold)' }} />
                                <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>Boîte de Réception des Demandes</strong>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                Les demandes envoyées par vos clientes depuis le formulaire arrivent directement dans votre espace Messages.
                            </p>
                        </div>
                        <Link
                            href="/admin/dashboard/messages"
                            className="admin-btn admin-btn-primary"
                            style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.82rem' }}
                        >
                            <span>Consulter les messages reçus {unreadCount > 0 ? `(${unreadCount} non lu${unreadCount > 1 ? 's' : ''})` : ''}</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Bloc Coordonnées & Horaires */}
                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', padding: '1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                <Settings size={16} style={{ color: 'var(--admin-gold)' }} />
                                <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>Coordonnées &amp; Horaires d&apos;Ouverture</strong>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                Actuellement : <strong>{phone}</strong> • <strong>{email}</strong>. Modifiez vos horaires par jour ou votre numéro dans les paramètres.
                            </p>
                        </div>
                        <Link
                            href="/admin/dashboard/settings"
                            className="admin-btn admin-btn-secondary"
                            style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.82rem' }}
                        >
                            <span>Modifier mes horaires &amp; coordonnées</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Éditeur des textes de la page Contact */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <span className="admin-eyebrow">Contenus écrits</span>
                        <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                            <Type size={20} style={{ color: 'var(--admin-gold)' }} />
                            Textes de la Page Contact
                        </h2>
                        <p className="admin-card-subtitle">
                            Modifiez les titres d&apos;en-tête, les encarts pratiques et les libellés du formulaire.
                        </p>
                    </div>
                </div>

                <SiteTextsEditor
                    sections={CONTACT_PAGE_TEXT_SECTIONS}
                    overrides={customTexts}
                    searchable
                    collapsible
                    defaultOpenFirst
                />
            </div>
        </div>
    );
}
