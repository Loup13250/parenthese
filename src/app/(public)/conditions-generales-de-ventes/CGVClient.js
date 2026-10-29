'use client';
import Link from 'next/link';

const headingStyle = {
    fontFamily: 'var(--font-cormorant), Georgia, serif',
    fontSize: '1.6rem',
    color: '#744E1C',
    marginTop: '2.25rem',
    marginBottom: '0.65rem',
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

const legalBadgeStyle = {
    display: 'inline-block',
    background: 'rgba(116, 78, 28, 0.08)',
    color: '#744E1C',
    border: '1px solid rgba(116, 78, 28, 0.25)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginRight: '0.5rem',
};

export default function CGVClient({ siteInfo }) {
    const businessName = siteInfo?.business_name || 'La Parenthèse Harmonieuse';
    const creatorName = siteInfo?.creator_name || 'Harmonie PERRAULT';
    const legalStatus = siteInfo?.legal_status || 'Entrepreneur Individuel (EI)';
    const siren = siteInfo?.siren || '980 474 340';
    const siret = siteInfo?.siret || '980 474 340 00018';
    const vatNumber = siteInfo?.vat_number || 'FR76980474340';
    const nafApe = siteInfo?.naf_ape || '9602B (Soins de beauté)';
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const email = siteInfo?.contact_email || 'laparentheseharmonieuse@gmail.com';
    const address = siteInfo?.address || '418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer';
    const headquartersAddress = siteInfo?.headquarters_address || 'Chemin de Saint-Jean, Résidence Lurian, 13300 Salon-de-Provence';
    const cityLine = [siteInfo?.postal_code || '13300', siteInfo?.city || 'Salon-de-Provence'].filter(Boolean).join(' ');

    return (
        <main id="main-content" className="legal-page-main" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', background: '#FAF7F2' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <span className="section-tag">CADRE CONTRACTUEL &amp; SÉRÉNITÉ</span>
                <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#231E1B', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                    Conditions Générales de Vente (CGV)
                </h1>

                <div style={{ background: '#FFFFFF', padding: 'clamp(1.75rem, 4vw, 3.25rem)', borderRadius: '4px', border: '1px solid rgba(185, 146, 94, 0.28)', lineHeight: 1.8, color: '#38302B', boxShadow: '0 10px 30px rgba(44, 38, 35, 0.04)' }}>
                    <p style={{ fontSize: '0.98rem', color: '#5C4E43' }}>
                        Les présentes Conditions Générales de Vente (ci-après « CGV ») sont conclues entre, d&apos;une part, <strong>Madame {creatorName}</strong>, exerçant sous la forme d&apos;{legalStatus} et sous l&apos;enseigne commerciale <strong>{businessName}</strong>, et d&apos;autre part, toute cliente (ci-après « la Cliente ») effectuant une réservation de soin ou l&apos;achat d&apos;une carte cadeau sur le site <em>laparentheseharmonieuse.fr</em>, sur la plateforme partenaire Planity ou directement en institut.
                    </p>

                    <h2 style={{ ...headingStyle, marginTop: '1.5rem' }}>
                        Article 1 — Identification de la professionnelle
                    </h2>
                    <p>
                        <strong>Exploitante &amp; Praticienne :</strong> Madame {creatorName}<br />
                        <strong>Enseigne :</strong> {businessName}<br />
                        <strong>Statut légal :</strong> {legalStatus}<br />
                        <strong>SIREN :</strong> {siren} — <strong>SIRET (siège) :</strong> {siret}<br />
                        <strong>Code APE / NAF :</strong> {nafApe}<br />
                        <strong>TVA Intracommunautaire :</strong> {vatNumber} (Franchise en base de TVA selon l&apos;article 293 B du CGI)<br />
                        <strong>Siège social :</strong> {headquartersAddress}<br />
                        <strong>Établissement &amp; Lieu des soins :</strong> {address}{address.includes('Salon-de-Provence') ? '' : `, ${cityLine}`}<br />
                        <strong>Téléphone :</strong> <a href={`tel:${phone.replace(/\s+/g, '')}`} style={linkStyle}>{phone}</a><br />
                        <strong>Courriel :</strong> <a href={`mailto:${email}`} style={linkStyle}>{email}</a>
                    </p>

                    <h2 style={headingStyle}>
                        Article 2 — Nature des prestations &amp; Contre-indications (Art. L.4321-1 CSP)
                    </h2>
                    <p>
                        <span style={legalBadgeStyle}>Article L.4321-1 du Code de la santé publique</span><br />
                        Les modelages corporels de bien-être, soins esthétiques du visage, rituels relaxants, madérothérapie et protocoles de drainage dispensés au sein de l&apos;institut ont pour unique finalité la détente, la relaxation et l&apos;embellissement esthétique.<br /><br />
                        Ils ne constituent en aucun cas des actes médicaux, thérapeutiques, paramédicaux ou de rééducation masso-kinésithérapique. Ils sont dénués de toute visée médicale et ne se substituent à aucun traitement prescrit par un médecin.<br /><br />
                        <strong>Éthique &amp; Clientèle exclusivement féminine :</strong><br />
                        L&apos;institut accueille <strong>exclusivement une clientèle féminine</strong>. Les soins sont dénués de toute connotation érotique ou sexuelle. Tout comportement inapproprié ou irrespectueux donnera lieu à l&apos;arrêt immédiat de la séance sans remboursement possible et pourra faire l&apos;objet de poursuites judiciaires.<br /><br />
                        <strong>Précautions médicales à la charge de la cliente :</strong><br />
                        La Cliente s&apos;engage à informer loyalement la praticienne avant le début du soin de tout état de grossesse (seul le protocole Future Maman étant adapté dès le 2e trimestre), d&apos;antécédents chirurgicaux récents, de problèmes cardiaques ou circulatoires (phlébite, varices sévères), d&apos;allergies cutanées ou de maladies contagieuses. En cas de contre-indication avérée, la praticienne se réserve le droit d&apos;adapter le soin ou d&apos;en refuser la réalisation pour préserver la santé de la Cliente.
                    </p>

                    <h2 style={headingStyle}>
                        Article 3 — Tarifs &amp; Modalités de règlement (Art. L.112-1 Code de la consommation)
                    </h2>
                    <p>
                        Les prix des prestations et des cartes cadeaux sont indiqués en Euros (€) nets de taxe, en application de l&apos;article 293 B du Code Général des Impôts (franchise de TVA).<br />
                        Les tarifs applicables sont ceux en vigueur au jour de la réservation, tels qu&apos;affichés sur le site internet et sur la fiche Planity de l&apos;institut.<br /><br />
                        <strong>Moyens de règlement acceptés :</strong><br />
                        • En cabine à l&apos;institut : Espèces, carte bancaire, ou carte cadeau en cours de validité.<br />
                        • En ligne via la plateforme Planity : Carte bancaire sécurisée (3D Secure).
                    </p>

                    <h2 style={headingStyle}>
                        Article 4 — Rendez-vous, ponctualité &amp; Politique d&apos;annulation
                    </h2>
                    <p>
                        <strong>Prise de rendez-vous :</strong><br />
                        Les rendez-vous se prennent directement en ligne sur la plateforme sécurisée Planity ou par contact direct au <a href={`tel:${phone.replace(/\s+/g, '')}`} style={linkStyle}>{phone}</a>.<br /><br />
                        <strong>Ponctualité :</strong><br />
                        Afin de préserver la quiétude du cocon et la qualité d&apos;accueil, il est recommandé de se présenter 5 minutes avant l&apos;heure convenue. En cas de retard de la Cliente, la séance sera écourtée d&apos;autant afin de ne pas impacter le rendez-vous de la cliente suivante. L&apos;intégralité du tarif prévu reste due.<br /><br />
                        <strong>Conditions d&apos;annulation et de report :</strong><br />
                        Toute modification ou annulation de rendez-vous doit être notifiée au moins <strong>24 heures à l&apos;avance</strong> via la plateforme Planity ou par téléphone.<br />
                        En cas d&apos;annulation tardive (moins de 24 heures avant le créneau) ou de non-présentation injustifiée (« no-show »), la séance sera automatiquement décomptée et réputée consommée s&apos;il s&apos;agissait d&apos;un bon cadeau ou d&apos;un forfait.
                    </p>

                    <h2 style={headingStyle}>
                        Article 5 — Bons et Cartes Cadeaux
                    </h2>
                    <p>
                        Les cartes cadeaux (pochette physique remise à l&apos;institut ou bon dématérialisé acheté en ligne via Planity) sont soumises aux conditions particulières suivantes :<br />
                        • <strong>Durée de validité :</strong> <strong>6 mois</strong> à compter de la date d&apos;émission.<br />
                        • <strong>Utilisation :</strong> Valables pour la prestation mentionnée ou pour le montant crédité.<br />
                        • <strong>Conditions financières :</strong> Les cartes cadeaux ne sont ni remboursables (hors délai légal de rétractation applicable aux ventes à distance), ni échangeables contre des espèces.<br />
                        • <strong>Prorogation exceptionnelle :</strong> En cas de fermeture temporaire de l&apos;institut pour congé de maternité ou cas de force majeure, la durée de validité des bons actifs est automatiquement prolongée d&apos;une durée équivalente.
                    </p>

                    <h2 style={headingStyle}>
                        Article 6 — Droit de rétractation (Articles L.221-18 et L.221-28 du Code de la consommation)
                    </h2>
                    <p>
                        <span style={legalBadgeStyle}>Article L.221-18 du Code de la consommation</span><br />
                        <strong>1. Pour les ventes conclues à distance (Cartes cadeaux dématérialisées achetées en ligne) :</strong><br />
                        L&apos;acheteuse non-professionnelle dispose d&apos;un délai légal de <strong>quatorze (14) jours calendaires</strong> à compter du jour de la conclusion de la commande en ligne pour exercer son droit de rétractation sans motif ni pénalité, en adressant sa demande claire et dénuée d&apos;ambiguïté par écrit à <a href={`mailto:${email}`} style={linkStyle}>{email}</a>. Le remboursement sera effectué sous 14 jours via le moyen de paiement utilisé lors de l&apos;achat.<br /><br />

                        <span style={legalBadgeStyle}>Article L.221-28 du Code de la consommation</span><br />
                        <strong>2. Exceptions légales au droit de rétractation :</strong><br />
                        Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour :<br />
                        • <em>1° Les prestations de services pleinement exécutées avant la fin du délai de rétractation</em> et dont l&apos;exécution a commencé après accord préalable exprès de la Cliente et renoncement exprès à son droit de rétractation ;<br />
                        • <em>12° Les prestations de services d&apos;activités de loisirs</em> (réservations de soins en institut) qui doivent être fournies à une date ou à une période déterminée.<br />
                        • De même, les achats de cartes cadeaux effectués physiquement en institut ne bénéficient pas d&apos;un droit de rétractation légal.
                    </p>

                    <h2 style={headingStyle}>
                        Article 7 — Responsabilité &amp; Assurance professionnelle
                    </h2>
                    <p>
                        Madame {creatorName} est titulaire d&apos;une police d&apos;assurance Responsabilité Civile Professionnelle couvrant l&apos;exercice des soins esthétiques et des modelages corporels au sein du Pôle Santé Georges Guynemer.<br />
                        La responsabilité de l&apos;institut ne saurait être engagée en cas de dommage résultant d&apos;une fausse déclaration ou d&apos;une omission de la part de la Cliente concernant son état de santé, ses antécédents médicaux ou d&apos;éventuelles contre-indications.
                    </p>

                    <h2 style={headingStyle}>
                        Article 8 — Médiation de la consommation &amp; Litiges (Art. L.612-1 et L.616-1)
                    </h2>
                    <p>
                        <span style={legalBadgeStyle}>Articles L.612-1 et L.616-1 du Code de la consommation</span><br />
                        En cas de différend ou de réclamation, la Cliente est invitée à contacter en priorité Madame {creatorName} par courriel à <a href={`mailto:${email}`} style={linkStyle}>{email}</a> ou par courrier recommandé avec accusé de réception afin de rechercher une solution amiable.<br /><br />
                        Conformément aux dispositions du Code de la consommation relatives au règlement amiable des litiges, toute consommatrice a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige l&apos;opposant à un professionnel. Les coordonnées du médiateur de la consommation compétent agréé par la CECMC sont les suivantes :<br /><br />
                        <strong>CNPM MÉDIATION CONSOMMATION</strong><br />
                        Adresse : 27 avenue de la Libération, 42400 Saint-Chamond<br />
                        Téléphone : 09 88 30 27 72<br />
                        Site internet : <a href="https://www.cnpm-mediation-consommation.eu" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://www.cnpm-mediation-consommation.eu</a><br /><br />
                        La Commission Européenne met également à disposition des consommatrices une plateforme de Règlement en Ligne des Litiges (RLL) accessible à l&apos;adresse suivante : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://ec.europa.eu/consumers/odr</a>.
                    </p>

                    <h2 style={headingStyle}>
                        Article 9 — Droit applicable &amp; Juridiction compétente
                    </h2>
                    <p>
                        Les présentes Conditions Générales de Vente ainsi que l&apos;ensemble des relations contractuelles entre {businessName} et la Cliente sont régies et interprétées selon le <strong>droit français</strong>.<br />
                        À défaut de résolution amiable ou par voie de médiation, tout litige sera porté devant les tribunaux judiciaires compétents selon les règles de compétence territoriale en vigueur (ressort de la Cour d&apos;appel d&apos;Aix-en-Provence).
                    </p>

                    <h2 style={headingStyle}>
                        Article 10 — Données personnelles &amp; Conception du site web
                    </h2>
                    <div style={creditBoxStyle}>
                        <p style={{ margin: 0 }}>
                            Les données personnelles collectées lors de la commande ou de la réservation sont traitées conformément à notre <Link href="/politique-de-confidentialite" style={linkStyle}>Politique de Confidentialité (RGPD)</Link>.<br /><br />
                            <strong>Conception &amp; Développement du site internet :</strong><br />
                            Le site a été réalisé sur-mesure par l&apos;agence <strong>JL-Développement</strong> (<a href="https://jl-developpement.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://jl-developpement.com/</a>).
                        </p>
                    </div>

                    <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(197, 168, 128, 0.3)', fontSize: '0.86rem', color: '#7A6B60', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span>Dernière mise à jour : 29 octobre 2026</span>
                        <span>Site conçu et développé par <a href="https://jl-developpement.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>JL-Développement</a></span>
                    </div>
                </div>
            </div>
        </main>
    );
}
