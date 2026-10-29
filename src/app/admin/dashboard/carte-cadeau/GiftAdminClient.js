'use client';

import Link from 'next/link';
import { Gift, ExternalLink, Sparkles, CreditCard, Mail, Type } from 'lucide-react';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';
import { GIFT_PAGE_TEXT_SECTIONS } from '@/lib/siteTexts';

export default function GiftAdminClient({ siteInfo = {}, customTexts = { fr: {} } }) {
    const phone = siteInfo?.phone || '06 51 65 21 42';

    return (
        <div className="anim-fade" style={{ width: '100%' }}>
            {/* EN-TÊTE UNIFIÉ */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-page-icon" aria-hidden="true">
                        <Gift size={24} />
                    </div>
                    <div>
                        <span className="admin-eyebrow">Page 4 du site public</span>
                        <h1 className="admin-title">Page Carte Cadeau</h1>
                        <p className="admin-subtitle">
                            Gérez les textes des deux formats d&apos;achat (Pochette Physique et Bon Digital Instantané Planity) ainsi que les suggestions de soins à offrir sur /carte-cadeau.
                        </p>
                    </div>
                </div>
                <div className="admin-page-actions">
                    <Link
                        href="/carte-cadeau"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                    >
                        <ExternalLink size={15} /> Voir /carte-cadeau
                    </Link>
                </div>
            </div>

            {/* Rappel des 2 formats d'achat */}
            <div className="admin-info-banner">
                <div className="admin-info-banner-head">
                    <Sparkles size={18} style={{ color: 'var(--admin-gold)' }} />
                    <span>Fonctionnement des deux formats proposés à vos clientes</span>
                </div>

                <div className="admin-grid-2col">
                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', padding: '1.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <Mail size={16} style={{ color: 'var(--admin-gold)' }} />
                            <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>Format 1 : Pochette Physique Précieuse</strong>
                        </div>
                        <p style={{ fontSize: '0.83rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                            Pochette élégante à retirer à l&apos;institut sur rendez-vous. La cliente vous contacte directement au <strong>{phone}</strong>.
                        </p>
                    </div>

                    <div style={{ background: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', padding: '1.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <CreditCard size={16} style={{ color: 'var(--admin-gold)' }} />
                            <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>Format 2 : Bon Digital Instantané</strong>
                        </div>
                        <p style={{ fontSize: '0.83rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                            Achat en ligne 24h/24 et envoi immédiat via votre espace officiel Planity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Éditeur des textes de la page Carte Cadeau */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <span className="admin-eyebrow">Contenus écrits</span>
                        <h2 className="admin-card-title" style={{ marginTop: '0.2rem' }}>
                            <Type size={20} style={{ color: 'var(--admin-gold)' }} />
                            Textes de la Page Carte Cadeau
                        </h2>
                        <p className="admin-card-subtitle">
                            Modifiez les titres, sous-titres et descriptions des formats physique et digital.
                        </p>
                    </div>
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
