'use client';
import Link from 'next/link';

export default function PolitiqueClient() {
    return (
        <main className="legal-page-main" style={{ paddingTop: '140px', paddingBottom: '5rem', background: '#FAF7F2' }}>
            <div className="container" style={{ maxWidth: '850px' }}>
                <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem', color: '#2C2623', marginBottom: '1.5rem' }}>
                    Politique de Confidentialité
                </h1>

                <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(185, 146, 94, 0.25)', lineHeight: 1.8, color: '#4A423D' }}>
                    <p>
                        La protection de vos données personnelles est une priorité pour <strong>La Parenthèse Harmonieuse</strong>. Cette politique détaille la nature des informations collectées et la façon dont elles sont utilisées.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        1. Responsable du traitement
                    </h2>
                    <p>
                        Le responsable du traitement des données est Harmonie pour La Parenthèse Harmonieuse.<br />
                        Email : <strong>laparentheseharmonieuse@gmail.com</strong><br />
                        Adresse : 418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer, 13300 Salon-de-Provence.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        2. Données collectées
                    </h2>
                    <p>
                        Nous collectons uniquement les informations nécessaires au traitement de vos demandes formulées via le site web :<br />
                        - Votre nom et prénom<br />
                        - Votre adresse email<br />
                        - Votre numéro de téléphone<br />
                        - Le sujet ou le soin souhaité ainsi que votre message
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        3. Finalité et durée de conservation
                    </h2>
                    <p>
                        Ces informations sont utilisées exclusivement pour vous recontacter, répondre à vos questions et organiser vos rendez-vous. Elles sont conservées pour une durée maximale de 3 ans à compter du dernier contact et ne sont jamais communiquées à des tiers à des fins commerciales.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        4. Vos droits
                    </h2>
                    <p>
                        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment en envoyant un email à : <strong>laparentheseharmonieuse@gmail.com</strong>.
                    </p>
                </div>
            </div>
        </main>
    );
}
