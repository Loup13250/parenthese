'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { submitContactForm } from '@/app/actions';
import { useLanguage } from '@/context/LanguageContext';
import { Send, CheckCircle2, AlertCircle, Phone, Calendar, Clock, Mail, User } from 'lucide-react';
import './ContactForm.css';

export default function ContactForm({ services = [] }) {
    const { lang, t, trans } = useLanguage();
    const searchParams = useSearchParams();
    const soinParam = searchParams?.get('soin')?.trim() || '';

    const serviceOptions = useMemo(() => {
        const dynamicTitles = services
            .map((s) => trans(s, 'title'))
            .filter(Boolean);

        const baseOptions = dynamicTitles.length > 0
            ? dynamicTitles
            : [
                'Massage sur mesure (Green Spa)',
                'Drainage lymphatique',
                'Madérothérapie',
                'Massage liftant Kobido',
                'Soin visage bio (Nohèm)',
                'Soin future maman (Grossesse)',
            ];

        const extraOptions = ['Demande carte cadeau', 'Autre demande / conseil personnalisé'];

        const merged = [...baseOptions, ...extraOptions];
        if (soinParam && !merged.includes(soinParam)) {
            return [soinParam, ...merged];
        }
        return merged;
    }, [services, trans, soinParam]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [userSelectedService, setUserSelectedService] = useState('');

    const selectedService = userSelectedService && serviceOptions.includes(userSelectedService)
        ? userSelectedService
        : (soinParam || serviceOptions[0] || '');

    const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);

    async function handleSubmit(e) {
        e.preventDefault();
        const formEl = e.currentTarget;
        setLoading(true);
        setError('');
        setSuccess(false);

        const formData = new FormData(formEl);
        formData.set('service_interest', selectedService || serviceOptions[0] || '');

        const nameVal = (formData.get('name') || '').toString().trim();
        const emailVal = (formData.get('email') || '').toString().trim();
        const phoneVal = (formData.get('phone') || '').toString().trim();
        const messageVal = (formData.get('message') || '').toString().trim();

        if (!nameVal || nameVal.length < 2) {
            setError(t('contact.errorName'));
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            setError(t('contact.errorEmail'));
            setLoading(false);
            return;
        }

        if (phoneVal) {
            if (/[a-zA-Z]/.test(phoneVal) || !/^(\+?[0-9\s().-]{8,25})$/.test(phoneVal) || phoneVal.replace(/\D/g, '').length < 8) {
                setError(t('contact.errorPhone'));
                setLoading(false);
                return;
            }
        }

        if (!messageVal || messageVal.length < 5) {
            setError(t('contact.errorMessage'));
            setLoading(false);
            return;
        }

        try {
            const res = await submitContactForm(formData);
            if (res?.error) {
                setError(res.error);
            } else {
                setSuccess(true);
                formEl.reset();
            }
        } catch {
            setError("Une erreur réseau est survenue lors de l'envoi. Veuillez réessayer ou appeler le 06 51 65 21 42.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="contact-card">
            <div className="contact-form-header">
                <span className="contact-tag">{t('contact.formBadge')}</span>
                <h2>{t('contact.formTitle')}</h2>
                <p>{t('contact.formDesc')}</p>
            </div>

            {success && (
                <div className="form-alert alert-success" role="status">
                    <CheckCircle2 size={20} className="alert-success-icon" />
                    <div>
                        <strong>{t('contact.successTitle')}</strong>
                        <p>{t('contact.successDesc')}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="form-alert alert-error" role="alert">
                    <AlertCircle size={20} className="alert-error-icon" />
                    <div>
                        <strong>{t('contact.errorTitle')}</strong>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {/* Honeypot anti-spam */}
                <input
                    type="text"
                    name="website"
                    style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                />

                {/* Prestation / Sujet */}
                <div className="form-group">
                    <label className="form-label" htmlFor="service-select">
                        {t('contact.typeLabel')}
                    </label>
                    <select
                        id="service-select"
                        name="service_interest"
                        value={selectedService}
                        onChange={(e) => setUserSelectedService(e.target.value)}
                        className="form-select"
                    >
                        {serviceOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* Nom et Prénom */}
                <div className="form-group">
                    <label className="form-label" htmlFor="name-input">
                        {t('contact.nameLabel')} <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                        <User size={16} className="input-icon" />
                        <input
                            id="name-input"
                            type="text"
                            name="name"
                            required
                            autoComplete="name"
                            placeholder={t('contact.namePlaceholder')}
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Dual row : Email & Téléphone */}
                <div className="form-dual-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email-input">
                            {t('contact.emailLabel')} <span className="req">*</span>
                        </label>
                        <div className="input-with-icon">
                            <Mail size={16} className="input-icon" />
                            <input
                                id="email-input"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder={t('contact.emailPlaceholder')}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone-input">
                            {t('contact.phoneLabel')}
                        </label>
                        <div className="input-with-icon">
                            <Phone size={16} className="input-icon" />
                            <input
                                id="phone-input"
                                type="tel"
                                name="phone"
                                autoComplete="tel"
                                placeholder={t('contact.phonePlaceholder')}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Dual row : Date souhaitée & Créneau préféré (optionnels) */}
                <div className="form-dual-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="date-input">
                            {t('contact.dateLabel')} <em>{t('contact.optionalBadge')}</em>
                        </label>
                        <div className="input-with-icon">
                            <Calendar size={16} className="input-icon" />
                            <input
                                id="date-input"
                                type="date"
                                name="preferred_date"
                                min={todayIso}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="time-input">
                            {t('contact.timeLabel')} <em>{t('contact.optionalBadge')}</em>
                        </label>
                        <div className="input-with-icon">
                            <Clock size={16} className="input-icon" />
                            <input
                                id="time-input"
                                type="text"
                                name="preferred_time"
                                placeholder={t('contact.timePlaceholder')}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="form-group">
                    <label className="form-label" htmlFor="message-input">
                        {t('contact.messageLabel')} <span className="req">*</span>
                    </label>
                    <textarea
                        id="message-input"
                        name="message"
                        required
                        rows={4}
                        placeholder={t('contact.messagePlaceholder')}
                        className="form-textarea"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="form-submit-btn"
                    aria-busy={loading}
                    aria-label={loading ? t('contact.submitting') : t('contact.submitBtn')}
                >
                    {loading ? (
                        <span>{t('contact.submitting')}</span>
                    ) : (
                        <>
                            <Send size={16} />
                            <span>{t('contact.submitBtn')}</span>
                        </>
                    )}
                </button>

                <p className="form-disclaimer">
                    {t('contact.rgpdNotice')}{' '}
                    <Link href="/politique-de-confidentialite" className="form-rgpd-link">
                        {t('contact.rgpdLink')}
                    </Link>.
                </p>
            </form>
        </div>
    );
}
