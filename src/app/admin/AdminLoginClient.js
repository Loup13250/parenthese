'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLoginClient() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data.error) {
                setError(data.error || 'Identifiant ou mot de passe incorrect.');
                setLoading(false);
                return;
            }

            if (data.success) {
                window.location.href = data.redirect || '/admin/dashboard';
                return;
            }

            setError('Réponse inattendue du serveur.');
            setLoading(false);
        } catch (err) {
            console.error('Login error:', err);
            setError('Erreur réseau. Vérifiez votre connexion Internet.');
            setLoading(false);
        }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-box animate-fade-up">
                <div className="admin-login-brand">
                    <div className="admin-login-badge" aria-hidden="true">
                        <ShieldCheck size={24} />
                    </div>
                    <h1>La Parenthèse Harmonieuse</h1>
                    <p>Portail d&apos;Administration Privé</p>
                </div>

                {error && <p className="admin-login-error" role="alert">{error}</p>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    <div>
                        <label htmlFor="admin-username" className="admin-label">Identifiant administrateur</label>
                        <input
                            id="admin-username"
                            type="text"
                            name="username"
                            placeholder="Votre identifiant"
                            required
                            autoComplete="username"
                            className="admin-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className="admin-label">Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Votre mot de passe"
                                required
                                autoComplete="current-password"
                                className="admin-input"
                                style={{ paddingRight: '42px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--admin-text-subtle)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '0.35rem', padding: '13px 18px', fontSize: '0.92rem' }}
                    >
                        <Lock size={15} />
                        {loading ? 'Connexion sécurisée en cours…' : 'Accéder à mon espace'}
                    </button>
                </form>

                <div style={{ marginTop: '1.75rem', paddingTop: '1.15rem', borderTop: '1px solid var(--admin-border-soft)', textAlign: 'center' }}>
                    <Link
                        href="/"
                        className="admin-link-btn"
                        style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem', justifyContent: 'center' }}
                    >
                        <ArrowLeft size={14} /> Retour au site public
                    </Link>
                </div>
            </div>
        </div>
    );
}
