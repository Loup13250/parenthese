'use client';
import Link from 'next/link';

export default function MentionsLegalesClient() {
    return (
        <main className="legal-page-main" style={{ paddingTop: '140px', paddingBottom: '5rem', background: '#FAF7F2' }}>
            <div className="container" style={{ maxWidth: '850px' }}>
                <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem', color: '#2C2623', marginBottom: '1.5rem' }}>
                    Mentions Légales
                </h1>

                <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(185, 146, 94, 0.25)', lineHeight: 1.8, color: '#4A423D' }}>
                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1rem', marginBottom: '0.5rem' }}>
                        1. Présentation de l&apos;institut
                    </h2>
                    <p>
                        <strong>Dénomination commerciale :</strong> La Parenthèse Harmonieuse<br />
                        <strong>Responsable de la publication :</strong> Harmonie<br />
                        <strong>Adresse :</strong> 418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer, 13300 Salon-de-Provence<br />
                        <strong>Téléphone :</strong> 06 51 65 21 42<br />
                        <strong>Email :</strong> laparentheseharmonieuse@gmail.com<br />
                        <strong>Activité :</strong> Soins bien-être, massages corporels et soins esthétiques exclusivement dédiés aux femmes.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '2rem', marginBottom: '0.5rem' }}>
                        2. Hébergement
                    </h2>
                    <p>
                        Le site est hébergé par la société <strong>Vercel Inc.</strong><br />
                        Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
                        Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: '#9C7A4D', textDecoration: 'underline' }}>https://vercel.com</a>
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '2rem', marginBottom: '0.5rem' }}>
                        3. Plateforme de réservation
                    </h2>
                    <p>
                        Les réservations de créneaux en ligne sont opérées en partenariat avec la plateforme <strong>Planity SAS</strong>.<br />
                        Siège social : 11 rue de la Victoire, 75009 Paris.<br />
                        Site web : <a href="https://www.planity.com" target="_blank" rel="noopener noreferrer" style={{ color: '#9C7A4D', textDecoration: 'underline' }}>https://www.planity.com</a>
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '2rem', marginBottom: '0.5rem' }}>
                        4. Propriété intellectuelle
                    </h2>
                    <p>
                        L&apos;ensemble des contenus présents sur ce site (textes, logos, photographies, vidéos, design) est la propriété exclusive de La Parenthèse Harmonieuse ou de ses partenaires (Nohèm, Green Spa, Oh My Jelly). Toute reproduction, représentation, modification ou diffusion sans autorisation préalable est interdite.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '2rem', marginBottom: '0.5rem' }}>
                        5. Données personnelles
                    </h2>
                    <p>
                        Les données recueillies via le formulaire de contact (nom, email, téléphone) sont destinées exclusivement à répondre à vos demandes de renseignements. Elles ne sont en aucun cas vendues ou cédées à des tiers. Pour en savoir plus, consultez notre <Link href="/politique-de-confidentialite" style={{ color: '#9C7A4D', textDecoration: 'underline' }}>politique de confidentialité</Link>.
                    </p>
                </div>
            </div>
        </main>
    );
}
