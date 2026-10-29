'use client';

import Link from 'next/link';
import { Gift, ExternalLink, Sparkles, CreditCard, Mail } from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { GIFT_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';

export default function GiftAdminClient({ siteInfo = {}, customTexts = { fr: {} } }) {
    const planityUrl = siteInfo?.planity_url || 'https://www.planity.com/la-parenthese-harmonieuse-13300-salon-de-provence';
    const phone = siteInfo?.phone || '06 51 65 21 42';

    return (
        <div className="anim-fade" style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Header de la page Carte Cadeau */}
            <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Gift size={26} style={{ color: 'var(--admin-gold)' }} />
                        Page Carte Cadeau
                    </h1>
                    <p className="admin-subtitle">
                        Gérez les informations d&apos;achat de bons cadeaux et tous les textes de la page /carte-cadeau.
                    </p>
                </div>
                <Link
                    href="/carte-cadeau"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
                >
                    <ExternalLink size={14} /> Voir la page en ligne
                </Link>
            </div>

            {/* Rappel des 2 formats d'achat */}
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
                        Fonctionnement des Deux Formats
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <Mail size={16} style={{ color: 'var(--admin-gold)' }} />
                            <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>Format 1 : Pochette Physique Précieuse</strong>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                            Pochette élégante à retirer à l&apos;institut ou sur rendez-vous. La cliente commande directement par téléphone au <strong>{phone}</strong>.
                        </p>
                    </div>

                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <CreditCard size={16} style={{ color: 'var(--admin-gold)' }} />
                            <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>Format 2 : Bon Digital Instantané</strong>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                            Achat et génération automatique 24h/24 via votre compte Planity. Le bouton renvoie vers votre planning officiel Planity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Éditeur des textes de la page Carte Cadeau */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Gift size={20} style={{ color: 'var(--admin-gold)' }} />
                        Textes de la Page Carte Cadeau
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Modifiez les titres, sous-titres et descriptions des formats physique et digital.
                    </span>
                </div>

                <SiteTextsEditor
                    sections={GIFT_PAGE_TEXT_SECTIONS}
                    overrides={customTexts}
                    searchable
                    collapsible
                    defaultOpenFirst
                />
            </div>
        </div>
    );
}

