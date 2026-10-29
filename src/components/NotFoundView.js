'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
    Home,
    Phone,
    Sparkles,
    Heart,
    Gift,
    MapPin,
    ArrowRight
} from 'lucide-react';

export default function NotFoundView({ siteInfo }) {
    const { t } = useLanguage();
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const phoneTel = phone.replace(/\s+/g, '');

    return (
        <main id="main-content" className="not-found-page">
            <div className="not-found-bg-glow" aria-hidden="true" />

            <div className="not-found-content">
                <div className="not-found-digits" aria-hidden="true">
                    <span className="not-found-num">4</span>
                    <div className="not-found-emblem" title="La Parenthèse Harmonieuse">
                        <Sparkles size={48} strokeWidth={1.5} />
                    </div>
                    <span className="not-found-num">4</span>
                </div>

                <h1 className="not-found-title">
                    {t('404.title')} <em>{t('404.titleItalic')}</em>
                </h1>

                <p className="not-found-desc">
                    {t('404.desc')}
                </p>

                <div className="not-found-actions">
                    <Link href="/" className="btn-gold">
                        <Home size={18} />
                        <span>{t('404.backHome')}</span>
                    </Link>

                    <a href={`tel:${phoneTel}`} className="btn-outline">
                        <Phone size={18} />
                        <span>{t('404.call')} : {phone}</span>
                    </a>
                </div>

                <section className="not-found-suggestions" aria-label={t('404.suggestionsTitle')}>
                    <h2 className="not-found-suggestions-title">
                        {t('404.suggestionsTitle')}
                    </h2>

                    <div className="not-found-grid">
                        <Link href="/carte-des-soins" className="not-found-card">
                            <div className="not-found-card-icon">
                                <Sparkles size={22} />
                            </div>
                            <h3>
                                <span>{t('404.menuTitle')}</span>
                                <ArrowRight size={16} />
                            </h3>
                            <p>{t('404.menuDesc')}</p>
                            <span className="not-found-card-link">
                                {t('404.menuLink')} →
                            </span>
                        </Link>

                        <Link href="/mon-approche" className="not-found-card">
                            <div className="not-found-card-icon">
                                <Heart size={22} />
                            </div>
                            <h3>
                                <span>{t('404.aboutTitle')}</span>
                                <ArrowRight size={16} />
                            </h3>
                            <p>{t('404.aboutDesc')}</p>
                            <span className="not-found-card-link">
                                {t('404.aboutLink')} →
                            </span>
                        </Link>

                        <Link href="/carte-cadeau" className="not-found-card">
                            <div className="not-found-card-icon">
                                <Gift size={22} />
                            </div>
                            <h3>
                                <span>{t('404.tarifsTitle')}</span>
                                <ArrowRight size={16} />
                            </h3>
                            <p>{t('404.tarifsDesc')}</p>
                            <span className="not-found-card-link">
                                {t('404.tarifsLink')} →
                            </span>
                        </Link>

                        <Link href="/contact" className="not-found-card">
                            <div className="not-found-card-icon">
                                <MapPin size={22} />
                            </div>
                            <h3>
                                <span>{t('404.contactTitle')}</span>
                                <ArrowRight size={16} />
                            </h3>
                            <p>{t('404.contactDesc')}</p>
                            <span className="not-found-card-link">
                                {t('404.contactLink')} →
                            </span>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
