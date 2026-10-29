'use client';

import { useState } from 'react';

export default function AdminLoginClient() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                    <h1>La Parenthèse Harmonieuse</h1>
                    <p>Espace Administration Privé</p>
                </div>
                {error && <p className="admin-login-error" role="alert">{error}</p>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="admin-username" className="admin-label">Nom d&apos;utilisateur</label>
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
                        <input
                            id="admin-password"
                            type="password"
                            name="password"
                            placeholder="Votre mot de passe"
                            required
                            autoComplete="current-password"
                            className="admin-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '0.5rem', padding: '14px' }}
                    >
                        {loading ? 'Connexion en cours…' : 'Se connecter'}
                    </button>
                </form>
                <div style={{ marginTop: '2rem', fontSize: '0.85rem', textAlign: 'center' }}>
                    <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-text-subtle)' }}>
                        &larr; Retour au site public
                    </a>
                </div>
            </div>
        </div>
    );
}

