'use client';
import { useState } from 'react';
import Link from 'next/link';
import { submitContactForm } from '@/app/actions';
import { Send, CheckCircle2, AlertCircle, Phone, Calendar, Mail, User, Sparkles, Heart } from 'lucide-react';
import './ContactForm.css';

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [selectedService, setSelectedService] = useState('Massage sur mesure');

    const serviceOptions = [
        'Massage sur mesure (Green Spa)',
        'Drainage lymphatique',
        'Madérothérapie',
        'Massage liftant Kobido',
        'Soin visage bio (Nohèm)',
        'Soin future maman (Grossesse)',
        'Demande carte cadeau',
        'Autre demande / question',
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const formData = new FormData(e.target);
        formData.set('event_type', selectedService);

        const nameVal = (formData.get('name') || '').toString().trim();
        const emailVal = (formData.get('email') || '').toString().trim();
        const phoneVal = (formData.get('phone') || '').toString().trim();
        const messageVal = (formData.get('message') || '').toString().trim();

        // 1. Validation Nom
        if (!nameVal || nameVal.length < 2) {
            setError('Veuillez renseigner votre nom complet.');
            setLoading(false);
            return;
        }

        // 2. Validation Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            setError('Veuillez saisir une adresse email valide.');
            setLoading(false);
            return;
        }

        // 3. Validation Téléphone
        if (phoneVal) {
            if (/[a-zA-Z]/.test(phoneVal) || !/^(\+?[0-9\s().-]{8,25})$/.test(phoneVal) || phoneVal.replace(/\D/g, '').length < 8) {
                setError('Veuillez saisir un numéro de téléphone valide (ex : 06 12 34 56 78).');
                setLoading(false);
                return;
            }
        }

        // 4. Validation Message
        if (!messageVal || messageVal.length < 5) {
            setError('Veuillez préciser votre demande dans le message (au moins 5 caractères).');
            setLoading(false);
            return;
        }

        const res = await submitContactForm(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            e.target.reset();
        }
    }

    return (
        <div className="contact-card">
            <div className="contact-form-header">
                <span className="contact-tag">CONTACTEZ HARMONIE</span>
                <h2>Écrivez-moi</h2>
                <p>Une question sur un soin, une contre-indication ou une demande particulière ? Je vous réponds avec douceur et bienveillance.</p>
            </div>

            {success && (
                <div className="form-alert alert-success" role="alert">
                    <CheckCircle2 size={20} className="alert-success-icon" />
                    <div>
                        <strong>Message envoyé avec succès !</strong>
                        <p>Merci pour votre message. Harmonie vous répondra personnellement sous 24h.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="form-alert alert-error" role="alert">
                    <AlertCircle size={20} className="alert-error-icon" />
                    <div>
                        <strong>Une erreur est survenue</strong>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
                {/* Honeypot anti-spam caché */}
                <input
                    type="text"
                    name="_hp_check"
                    style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                    tabIndex={-1}
                    autoComplete="off"
                />

                {/* Prestation / Sujet */}
                <div className="form-group">
                    <label className="form-label" htmlFor="service-select">
                        Soin ou objet de votre message
                    </label>
                    <select
                        id="service-select"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
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
                        Votre nom et prénom <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                        <User size={16} className="input-icon" />
                        <input
                            id="name-input"
                            type="text"
                            name="name"
                            required
                            placeholder="ex : Sophie Martin"
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Dual row : Email & Téléphone */}
                <div className="form-dual-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email-input">
                            Adresse email <span className="req">*</span>
                        </label>
                        <div className="input-with-icon">
                            <Mail size={16} className="input-icon" />
                            <input
                                id="email-input"
                                type="email"
                                name="email"
                                required
                                placeholder="nom@exemple.fr"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone-input">
                            Téléphone
                        </label>
                        <div className="input-with-icon">
                            <Phone size={16} className="input-icon" />
                            <input
                                id="phone-input"
                                type="tel"
                                name="phone"
                                placeholder="06 12 34 56 78"
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Date souhaitée (optionnelle) */}
                <div className="form-group">
                    <label className="form-label" htmlFor="date-input">
                        Période ou date souhaitée <em>(optionnel)</em>
                    </label>
                    <div className="input-with-icon">
                        <Calendar size={16} className="input-icon" />
                        <input
                            id="date-input"
                            type="date"
                            name="event_date"
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Message */}
                <div className="form-group">
                    <label className="form-label" htmlFor="message-input">
                        Votre message <span className="req">*</span>
                    </label>
                    <textarea
                        id="message-input"
                        name="message"
                        required
                        rows={4}
                        placeholder="Précisez votre demande, vos disponibilités ou vos questions sur le déroulement des soins..."
                        className="form-textarea"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="form-submit-btn"
                >
                    {loading ? (
                        <span>Envoi en cours...</span>
                    ) : (
                        <>
                            <Send size={16} />
                            <span>Envoyer mon message</span>
                        </>
                    )}
                </button>

                <p className="form-disclaimer">
                    Vos données restent strictement confidentielles et ne sont jamais transmises à des tiers.
                </p>
            </form>
        </div>
    );
}
