'use client';
import Link from 'next/link';

const headingStyle = {
    fontFamily: 'var(--font-cormorant), Georgia, serif',
    fontSize: '1.6rem',
    color: '#744E1C',
    marginTop: '2.25rem',
    marginBottom: '0.65rem',
};

const subHeadingStyle = {
    fontFamily: 'var(--font-cormorant), Georgia, serif',
    fontSize: '1.25rem',
    color: '#2A231D',
    marginTop: '1.25rem',
    marginBottom: '0.4rem',
    fontWeight: 600,
};

const linkStyle = {
    color: '#744E1C',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    fontWeight: 500,
};

const creditBoxStyle = {
    background: '#FAF7F2',
    border: '1px solid rgba(197, 168, 128, 0.4)',
    borderRadius: '6px',
    padding: '1.25rem 1.5rem',
    marginTop: '1rem',
    marginBottom: '1rem',
};

export default function MentionsLegalesClient({ siteInfo }) {
    const businessName = siteInfo?.business_name || 'La Parenthèse Harmonieuse';
    const creatorName = siteInfo?.creator_name || 'Harmonie PERRAULT';
    const legalStatus = siteInfo?.legal_status || 'Entrepreneur Individuel (EI)';
    const siren = siteInfo?.siren || '980 474 340';
    const siret = siteInfo?.siret || '980 474 340 00018';
    const vatNumber = siteInfo?.vat_number || 'FR76980474340';
    const nafApe = siteInfo?.naf_ape || '9602B (Soins de beauté)';
    const creationDate = siteInfo?.creation_date || '21 octobre 2023';
    const headquartersAddress = siteInfo?.headquarters_address || 'Chemin de Saint-Jean, Résidence Lurian, 13300 Salon-de-Provence';
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const email = siteInfo?.contact_email || 'laparentheseharmonieuse@gmail.com';
    const address = siteInfo?.address || '418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer';
    const cityLine = [siteInfo?.postal_code || '13300', siteInfo?.city || 'Salon-de-Provence'].filter(Boolean).join(' ');

    return (
        <main id="main-content" className="legal-page-main" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', background: '#FAF7F2' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <span className="section-tag">CADRE RÉGLEMENTAIRE &amp; TRANSPARENCE</span>
                <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#231E1B', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                    Mentions Légales
                </h1>

                <div style={{ background: '#FFFFFF', padding: 'clamp(1.75rem, 4vw, 3.25rem)', borderRadius: '4px', border: '1px solid rgba(185, 146, 94, 0.28)', lineHeight: 1.8, color: '#38302B', boxShadow: '0 10px 30px rgba(44, 38, 35, 0.04)' }}>
                    <p style={{ fontSize: '0.98rem', color: '#5C4E43' }}>
                        Conformément aux dispositions de l&apos;article 6-III et de l&apos;article 19 de la <strong>Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique (LCEN)</strong>, du <strong>Code de la consommation</strong> et du <strong>Décret n° 2022-725 du 28 avril 2022</strong> relatif à la mention de la qualité d&apos;entrepreneur individuel, il est porté à la connaissance des utilisatrices et visiteuses du site <em>laparentheseharmonieuse.fr</em> les présentes mentions légales.
                    </p>

                    <h2 style={{ ...headingStyle, marginTop: '1.5rem' }}>
                        1. Éditeur du site &amp; Exploitation de l&apos;établissement
                    </h2>
                    <p>
                        Le site internet accessible à l&apos;adresse <em>https://laparentheseharmonieuse.fr</em> est édité et exploité par :<br /><br />
                        <strong>Exploitante &amp; Directrice de la publication :</strong> Madame {creatorName}<br />
                        <strong>Enseigne &amp; Dénomination commerciale :</strong> {businessName}<br />
                        <strong>Forme juridique :</strong> {legalStatus} (statut légal régi par la loi du 14 février 2022 en faveur de l&apos;activité professionnelle indépendante)<br />
                        <strong>Numéro SIREN :</strong> {siren}<br />
                        <strong>Numéro SIRET (siège social) :</strong> {siret}<br />
                        <strong>Immatriculation :</strong> Inscrite au Registre National des Entreprises (RNE) et au Registre du Commerce et des Sociétés (R.C.S.) sous le numéro {siren}<br />
                        <strong>Code Activité (NAF / APE) :</strong> {nafApe}<br />
                        <strong>Date d&apos;immatriculation / création :</strong> {creationDate}<br />
                        <strong>Numéro de TVA intracommunautaire :</strong> {vatNumber}<br />
                        <strong>Régime fiscal :</strong> Franchise en base de TVA en application de l&apos;article 293 B du Code Général des Impôts (CGI) (TVA non applicable sur les prestations et ventes, sauf mention expresse contraire sur facture)<br />
                        <strong>Adresse du siège social :</strong> {headquartersAddress}<br />
                        <strong>Lieu d&apos;exercice &amp; Institut de soins :</strong> {address}{address.includes('Salon-de-Provence') ? '' : `, ${cityLine}`}<br />
                        <strong>Téléphone :</strong> <a href={`tel:${phone.replace(/\s+/g, '')}`} style={linkStyle}>{phone}</a><br />
                        <strong>Courriel :</strong> <a href={`mailto:${email}`} style={linkStyle}>{email}</a><br />
                        <strong>Responsable de la rédaction et de la publication :</strong> Madame {creatorName}
                    </p>

                    <h2 style={headingStyle}>
                        2. Conception &amp; Développement du site internet
                    </h2>
                    <div style={creditBoxStyle}>
                        <p style={{ margin: 0 }}>
                            Ce site internet sur-mesure a été intégralement pensé, conçu, modélisé et développé par :<br /><br />
                            <strong>Agence / Développeur Web :</strong> <strong>JL-Développement</strong><br />
                            <strong>Site web officiel :</strong>{' '}
                            <a href="https://jl-developpement.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                                https://jl-developpement.com/
                            </a><br />
                            <strong>Activité :</strong> Conception de sites web sur-mesure, développement applicatif Next.js, optimisation des performances, audits SEO et intégration ergonomique haute fidélité.
                        </p>
                    </div>

                    <h2 style={headingStyle}>
                        3. Hébergement du site internet
                    </h2>
                    <p>
                        L&apos;infrastructure d&apos;hébergement du site est assurée par la société :<br /><br />
                        <strong>Vercel Inc.</strong><br />
                        Adresse postale : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
                        Site web officiel : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://vercel.com</a><br />
                        L&apos;hébergeur garantit un niveau de sécurité et de disponibilité conforme aux normes de l&apos;industrie (protocole chiffré HTTPS / TLS et certificat SSL haute sécurité).
                    </p>

                    <h2 style={headingStyle}>
                        4. Plateforme de réservation en ligne &amp; Cartes cadeaux
                    </h2>
                    <p>
                        La prise de rendez-vous en ligne, le planning des disponibilités en temps réel ainsi que l&apos;achat dématérialisé de bons cadeaux sont opérés via la plateforme partenaire agréée :<br /><br />
                        <strong>Planity SAS</strong><br />
                        Société par Actions Simplifiée au capital de 31 161,28 €<br />
                        Immatriculée au RCS de Paris sous le n° 801 821 547<br />
                        Siège social : 11 rue de la Victoire, 75009 Paris, France<br />
                        Site web officiel : <a href="https://www.planity.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://www.planity.com</a>
                    </p>

                    <h2 style={headingStyle}>
                        5. Cadre réglementaire &amp; Nature des soins de bien-être
                    </h2>
                    <p>
                        Conformément aux dispositions de l&apos;<strong>article L.4321-1 du Code de la santé publique</strong>, les modelages corporels, massages relaxants, soins du visage et protocoles de drainage dispensés par Madame {creatorName} au sein de l&apos;institut <strong>{businessName}</strong> ont pour unique objet la détente, le confort corporel, la mise en beauté et la relaxation.<br /><br />
                        Ces prestations sont <strong>strictement dépourvues de tout caractère médical, paramédical, kinésithérapique, ostéopathique ou thérapeutique</strong>. Elles ne se substituent en aucun cas à un diagnostic, avis ou traitement médical.<br />
                        L&apos;établissement est un cocon intimiste <strong>exclusivement réservé à une clientèle féminine</strong>. Tout comportement déplacé ou dérogeant au respect de ce cadre donnera lieu à l&apos;interruption immédiate de la séance et à d&apos;éventuelles poursuites.<br /><br />
                        <strong>Assurance Responsabilité Civile Professionnelle (RCP) :</strong> Madame {creatorName} est couverte par un contrat d&apos;assurance Responsabilité Civile Professionnelle souscrit auprès d&apos;une compagnie d&apos;assurance notoirement solvable en France, garantissant les activités esthétiques et modelages de bien-être au sein du Pôle Santé Georges Guynemer.
                    </p>

                    <h2 style={headingStyle}>
                        6. Propriété intellectuelle &amp; Droits d&apos;auteur
                    </h2>
                    <p>
                        Le site internet dans son ensemble, ainsi que chacun des éléments qui le composent (notamment les marques, photographies, textes, slogans, illustrations, vidéos, séquences animées, charte graphique, mise en page, logo et architecture logicielle) sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle (notamment les <strong>articles L.111-1, L.122-4, L.122-5 et L.335-2 et suivants du Code de la Propriété Intellectuelle</strong>).<br /><br />
                        Ils sont la propriété exclusive de <strong>{businessName}</strong> et de Madame {creatorName}, sous réserve des droits concédés par leurs partenaires officiels (marques Nohèm, Green Spa, Oh My Jelly).<br /><br />
                        Toute reproduction, représentation, diffusion, extraction, adaptation ou modification intégrale ou partielle de ce site ou de l&apos;un quelconque de ses éléments, quel que soit le moyen ou le procédé employé, sans l&apos;autorisation préalable et écrite de Madame {creatorName}, est constitutive d&apos;une contrefaçon sanctionnée par le Code de la Propriété Intellectuelle.
                    </p>

                    <h2 style={headingStyle}>
                        7. Liens hypertextes &amp; Responsabilité
                    </h2>
                    <p>
                        Le site <em>laparentheseharmonieuse.fr</em> contient des liens hypertextes dirigeant vers des sites internet externes (plateforme Planity, réseaux sociaux Instagram, etc.). La responsabilité de l&apos;éditrice ne saurait être engagée quant au contenu, à l&apos;accessibilité ou aux politiques de confidentialité de ces sites tiers.<br />
                        L&apos;éditrice apporte le plus grand soin à l&apos;exactitude des informations diffusées sur le site. Toutefois, elle ne saurait être tenue pour responsable des éventuelles omissions, erreurs ou lacunes pouvant survenir lors des mises à jour.
                    </p>

                    <h2 style={headingStyle}>
                        8. Protection des données personnelles &amp; Règlement des litiges
                    </h2>
                    <p>
                        Pour toute information relative à la collecte et au traitement de vos données personnelles ainsi qu&apos;à l&apos;exercice de vos droits (notamment votre droit d&apos;accès et votre <strong>droit à l&apos;effacement en vertu de l&apos;article 17 du RGPD</strong>), nous vous invitons à consulter notre <Link href="/politique-de-confidentialite" style={linkStyle}>Politique de Confidentialité</Link>.<br /><br />
                        Les conditions d&apos;achat, d&apos;annulation, de validité des bons cadeaux et les modalités du recours gratuit au <strong>médiateur de la consommation (Art. L.612-1 du Code de la consommation)</strong> sont détaillées dans nos <Link href="/conditions-generales-de-ventes" style={linkStyle}>Conditions Générales de Vente (CGV)</Link>.
                    </p>

                    <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(197, 168, 128, 0.3)', fontSize: '0.86rem', color: '#7A6B60', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span>Dernière mise à jour : 29 octobre 2026</span>
                        <span>Site conçu et développé par <a href="https://jl-developpement.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>JL-Développement</a></span>
                    </div>
                </div>
            </div>
        </main>
    );
}
