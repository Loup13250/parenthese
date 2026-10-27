import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata = {
    title: 'Conditions Générales de Vente | La Parenthèse Harmonieuse',
    description: "Conditions générales de vente et d'utilisation des prestations de soins et cartes cadeaux de La Parenthèse Harmonieuse à Salon-de-Provence.",
};

export default function CGVPage() {
    return (
        <main className="legal-page-main" style={{ paddingTop: '140px', paddingBottom: '5rem', background: '#FAF7F2' }}>
            <div className="container" style={{ maxWidth: '850px' }}>
                <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem', color: '#2C2623', marginBottom: '1.5rem' }}>
                    Conditions Générales de Vente (CGV)
                </h1>

                <div style={{ background: '#FFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(185, 146, 94, 0.25)', lineHeight: 1.8, color: '#4A423D' }}>
                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1rem', marginBottom: '0.5rem' }}>
                        1. Objet et champ d&apos;application
                    </h2>
                    <p>
                        Les présentes Conditions Générales de Vente régissent l&apos;ensemble des prestations de bien-être, soins esthétiques et vente de cartes cadeaux dispensées par <strong>La Parenthèse Harmonieuse</strong>, établissement exclusivement dédié à la patientèle féminine situé au Pôle Santé Georges Guynemer, 13300 Salon-de-Provence.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        2. Prise de rendez-vous et ponctualité
                    </h2>
                    <p>
                        Les rendez-vous se prennent en ligne via la plateforme Planity ou par téléphone au 06 51 65 21 42. Afin de profiter pleinement de votre soin, il est recommandé d&apos;arriver 5 minutes avant l&apos;heure convenue. En cas de retard, la durée du soin pourra être écourtée afin de ne pas pénaliser les rendez-vous suivants.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        3. Annulation et report
                    </h2>
                    <p>
                        Toute annulation ou modification de rendez-vous doit être signalée au moins <strong>24 heures à l&apos;avance</strong>. Cela permet de libérer le créneau pour une autre cliente.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        4. Bons et cartes cadeaux
                    </h2>
                    <p>
                        Les cartes cadeaux (physiques ou numériques) sont valables pour une durée de <strong>6 mois</strong> à compter de leur date d&apos;émission. Elles ne sont ni remboursables ni échangeables contre des espèces. En cas d&apos;arrêt médical ou de congé maternité de la praticienne, la validité des bons cadeaux est automatiquement prolongée.
                    </p>

                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#9C7A4D', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        5. Nature des prestations et santé
                    </h2>
                    <p>
                        Les soins et massages proposés sont des soins de bien-être, de relaxation et d&apos;esthétique à visée non thérapeutique et non médicale. La cliente s&apos;engage à signaler tout problème de santé, grossesse, allergie ou contre-indication médicale préalable avant le début de chaque prestation.
                    </p>
                </div>
            </div>
        </main>
    );
}
