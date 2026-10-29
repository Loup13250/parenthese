'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, Clock, ExternalLink, Settings, MessageSquare, Sparkles } from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { CONTACT_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';

export default function ContactAdminClient({ siteInfo = {}, customTexts = { fr: {} }, unreadCount = 0 }) {
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const email = siteInfo?.contact_email || 'laparentheseharmonieuse@gmail.com';
    const address = siteInfo?.address || '418 Avenue Georges Guynemer, 13300 Salon-de-Provence';

    return (
        <div className="anim-fade" style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Header de la page Contact */}
            <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Mail size={26} style={{ color: 'var(--admin-gold)' }} />
                        Page Contact &amp; Accès
                    </h1>
                    <p className="admin-subtitle">
                        Gérez les textes d&apos;accueil, les mentions d&apos;accès et le formulaire de la page /contact.
                    </p>
                </div>
                <Link
                    href="/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
                >
                    <ExternalLink size={14} /> Voir la page en ligne
                </Link>
            </div>

            {/* Raccourcis pratiques Coordonnées & Boîte de réception */}
            <div
                className="admin-card"
                style={{
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, rgba(184, 139, 70, 0.08) 0%, rgba(184, 139, 70, 0.02) 100%)',
                    border: '1px solid rgba(184, 139, 70, 0.3)',
                    padding: '1.5rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                    <Sparkles size={20} style={{ color: 'var(--admin-gold)' }} />
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
                        Informations &amp; Messages reçus
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {/* Bloc Messages */}
                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                <MessageSquare size={16} style={{ color: 'var(--admin-gold)' }} />
                                <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>Boîte de Réception des Messages</strong>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                Les demandes envoyées par les clientes via le formulaire arrivent directement dans votre espace messages.
                            </p>
                        </div>
                        <Link
                            href="/admin/dashboard/messages"
                            className="admin-btn admin-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.82rem', padding: '8px 12px' }}
                        >
                            <MessageSquare size={14} /> Consulter les messages reçus {unreadCount > 0 ? `(${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''})` : ''}
                        </Link>
                    </div>

                    {/* Bloc Coordonnées & Horaires */}
                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                <Settings size={16} style={{ color: 'var(--admin-gold)' }} />
                                <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>Coordonnées &amp; Horaires</strong>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                                Téléphone : <strong>{phone}</strong> • Email : <strong>{email}</strong>. Pour modifier vos horaires ou adresse :
                            </p>
                        </div>
                        <Link
                            href="/admin/dashboard/settings"
                            className="admin-btn admin-btn-secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.82rem', padding: '8px 12px' }}
                        >
                            <Settings size={14} /> Modifier dans Paramètres Généraux
                        </Link>
                    </div>
                </div>
            </div>

            {/* Éditeur des textes de la page Contact */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={20} style={{ color: 'var(--admin-gold)' }} />
                        Textes de la Page Contact
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Modifiez les titres d&apos;en-tête, les encarts et les libellés du formulaire.
                    </span>
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

