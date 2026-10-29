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

export default function PolitiqueClient({ siteInfo }) {
    const businessName = siteInfo?.business_name || 'La Parenthèse Harmonieuse';
    const creatorName = siteInfo?.creator_name || 'Harmonie PERRAULT';
    const email = siteInfo?.contact_email || 'laparentheseharmonieuse@gmail.com';
    const phone = siteInfo?.phone || '06 51 65 21 42';
    const address = siteInfo?.address || '418 Avenue Georges Guynemer - Pôle Santé Georges Guynemer';
    const headquartersAddress = siteInfo?.headquarters_address || 'Chemin de Saint-Jean, Résidence Lurian, 13300 Salon-de-Provence';
    const cityLine = [siteInfo?.postal_code || '13300', siteInfo?.city || 'Salon-de-Provence'].filter(Boolean).join(' ');

    return (
        <main id="main-content" className="legal-page-main" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', background: '#FAF7F2' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <span className="section-tag">PROTECTION DES DONNÉES &amp; VIE PRIVÉE</span>
                <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#231E1B', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                    Politique de Confidentialité (RGPD)
                </h1>

                <div style={{ background: '#FFFFFF', padding: 'clamp(1.75rem, 4vw, 3.25rem)', borderRadius: '4px', border: '1px solid rgba(185, 146, 94, 0.28)', lineHeight: 1.8, color: '#38302B', boxShadow: '0 10px 30px rgba(44, 38, 35, 0.04)' }}>
                    <p style={{ fontSize: '0.98rem', color: '#5C4E43' }}>
                        La présente Politique de Confidentialité a pour objet d&apos;informer en toute clarté et transparence les utilisatrices du site <em>laparentheseharmonieuse.fr</em> sur la manière dont leurs données à caractère personnel sont collectées, traitées et protégées, conformément au <strong>Règlement Général sur la Protection des Données (Règlement UE 2016/679 du 27 avril 2016 - RGPD)</strong> et à la <strong>Loi n° 78-17 du 6 janvier 1978 relative à l&apos;informatique, aux fichiers et aux libertés modifiée</strong>.
                    </p>

                    <h2 style={{ ...headingStyle, marginTop: '1.5rem' }}>
                        Article 1 — Responsable du traitement des données
                    </h2>
                    <p>
                        Le responsable du traitement des données personnelles collectées sur le site est :<br /><br />
                        <strong>Madame {creatorName}</strong> (Entrepreneur Individuel - EI)<br />
                        Exploitante de l&apos;institut <strong>{businessName}</strong><br />
                        <strong>Siège social :</strong> {headquartersAddress}<br />
                        <strong>Établissement &amp; Lieu d&apos;exercice :</strong> {address}{address.includes('Salon-de-Provence') ? '' : `, ${cityLine}`}<br />
                        <strong>Courriel :</strong> <a href={`mailto:${email}`} style={linkStyle}>{email}</a><br />
                        <strong>Téléphone :</strong> <a href={`tel:${phone.replace(/\s+/g, '')}`} style={linkStyle}>{phone}</a>
                    </p>

                    <h2 style={headingStyle}>
                        Article 2 — Conception, hébergement &amp; Prestataires techniques
                    </h2>
                    <div style={creditBoxStyle}>
                        <p style={{ margin: 0 }}>
                            <strong>Conception &amp; Développement du site :</strong><br />
                            Le site a été développé avec les plus hauts standards de sécurité et de confidentialité par l&apos;agence <strong>JL-Développement</strong> (<a href="https://jl-developpement.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://jl-developpement.com/</a>). Le code est optimisé pour garantir l&apos;absence de tout traçage publicitaire intrusif.<br /><br />
                            <strong>Hébergement de l&apos;application :</strong><br />
                            Assuré par <strong>Vercel Inc.</strong> (440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://vercel.com</a>), certifié conforme aux mécanismes de transferts internationaux de données (Data Privacy Framework UE-USA et Clauses Contractuelles Types de la Commission Européenne).<br /><br />
                            <strong>Gestion des rendez-vous et bons cadeaux en ligne :</strong><br />
                            Assurée par <strong>Planity SAS</strong> (11 rue de la Victoire, 75009 Paris — <a href="https://www.planity.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://www.planity.com</a>), agissant en qualité de responsable de traitement distinct pour ses propres services de réservation.
                        </p>
                    </div>

                    <h2 style={headingStyle}>
                        Article 3 — Principes fondamentaux du traitement (Art. 5 du RGPD)
                    </h2>
                    <p>
                        Conformément à l&apos;<strong>article 5 du Règlement (UE) 2016/679</strong>, les données à caractère personnel de nos clientes sont :<br />
                        • Traitées de manière licite, loyale et transparente au regard de la personne concernée (licéité, loyauté, transparence) ;<br />
                        • Collectées pour des finalités déterminées, explicites et légitimes (limitation des finalités) ;<br />
                        • Adéquates, pertinentes et limitées à ce qui est strictement nécessaire au regard des finalités (minimisation des données) ;<br />
                        • Exactes et tenues à jour ;<br />
                        • Conservées sous une forme permettant l&apos;identification des personnes pendant une durée n&apos;excédant pas celle nécessaire aux finalités (limitation de la conservation) ;<br />
                        • Traitées de façon à garantir une sécurité appropriée contre le traitement non autorisé ou illicite, la perte ou la destruction (intégrité et confidentialité).
                    </p>

                    <h2 style={headingStyle}>
                        Article 4 — Données collectées, finalités et bases légales (Art. 6 du RGPD)
                    </h2>
                    <p>
                        Nous collectons exclusivement les données requises pour le suivi bienveillant de vos demandes :<br /><br />
                        <strong>1. Formulaire de contact et demandes d&apos;informations :</strong><br />
                        • <em>Données collectées :</em> Nom, prénom, adresse électronique, numéro de téléphone (facultatif), soin sélectionné, date/créneau envisagé et message libre.<br />
                        • <em>Finalité :</em> Répondre à vos questions, préparer votre séance de soin sur mesure et vous contacter en retour.<br />
                        • <em>Base légale :</em> <span style={legalBadgeStyle}>Art. 6.1.b du RGPD</span> Exécution de mesures précontractuelles prises à votre demande expresse et <span style={legalBadgeStyle}>Art. 6.1.a du RGPD</span> consentement donné lors de l&apos;envoi du formulaire.<br /><br />

                        <strong>2. Réservations en ligne et cartes cadeaux via Planity :</strong><br />
                        • <em>Données :</em> Coordonnées nécessaires à la réservation ou à la commande de votre carte cadeau.<br />
                        • <em>Finalité :</em> Confirmation de rendez-vous, rappels par SMS et gestion de la prestation.<br />
                        • <em>Base légale :</em> <span style={legalBadgeStyle}>Art. 6.1.b du RGPD</span> Exécution du contrat de prestation de service.<br /><br />

                        <strong>3. Sécurité du site et prévention des cyberattaques :</strong><br />
                        • <em>Données :</em> Adresse IP hashée temporaire, agent utilisateur, horodatage des requêtes.<br />
                        • <em>Finalité :</em> Limitation du débit (rate limiting) pour bloquer les tentatives de piratage, spam et attaques par déni de service.<br />
                        • <em>Base légale :</em> <span style={legalBadgeStyle}>Art. 6.1.f du RGPD</span> Intérêt légitime impérieux à maintenir la sécurité, l&apos;intégrité et la disponibilité continue du service en ligne.
                    </p>

                    <h2 style={headingStyle}>
                        Article 5 — Non-cession &amp; Destinataires des données (Art. 28 du RGPD)
                    </h2>
                    <p>
                        <strong>Engagement formel de non-commercialisation :</strong><br />
                        Vos données personnelles sont <strong>strictement réservées à l&apos;usage exclusif de Madame {creatorName}</strong> au sein de {businessName}. Elles ne font l&apos;objet d&apos;<strong>aucune vente, aucune location, aucune cession, ni aucun échange à des fins publicitaires ou de prospection commerciale à des tiers</strong>.<br /><br />
                        Seuls nos prestataires techniques contractuellement liés (Vercel pour l&apos;infrastructure d&apos;hébergement, Turso pour la base de données sécurisée chiffrée, et Planity pour les réservations) peuvent traiter des données techniques dans le respect rigoureux de l&apos;article 28 du RGPD.
                    </p>

                    <h2 style={headingStyle}>
                        Article 6 — Durées de conservation des données (Art. 5.1.e du RGPD)
                    </h2>
                    <p>
                        Les données sont conservées pendant des durées strictement proportionnées aux finalités poursuivies :<br />
                        • <strong>Demandes issues du formulaire de contact :</strong> conservées pour une durée maximale de <strong>3 ans</strong> à compter du dernier contact émanant de la cliente (en conformité avec les préconisations de la CNIL), après quoi elles sont définitivement supprimées.<br />
                        • <strong>Documents contractuels et de facturation (si émis) :</strong> conservés pendant <strong>10 ans</strong> en application de l&apos;<strong>article L.123-22 du Code de commerce</strong>.<br />
                        • <strong>Journaux techniques et traces de sécurité :</strong> conservés pendant une durée n&apos;excédant pas <strong>12 mois</strong>.
                    </p>

                    <h2 style={headingStyle}>
                        Article 7 — Mesures de sécurité physiques et techniques (Art. 32 du RGPD)
                    </h2>
                    <p>
                        Conformément à l&apos;<strong>article 32 du RGPD</strong>, l&apos;institut met en œuvre toutes les mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque :<br />
                        • Chiffrement systématique des transferts de données via le protocole sécurisé <strong>HTTPS / TLS 1.3</strong> ;<br />
                        • Filtrage préventif des entrées contre les injections SQL, les failles XSS et les falsifications de requêtes (CSRF) ;<br />
                        • Isolation et hachage cryptographique fort des mots de passe d&apos;administration ;<br />
                        • Cookies de session d&apos;administration dotés des drapeaux de protection <code>HttpOnly</code>, <code>SameSite=Strict</code> et <code>Secure</code>.
                    </p>

                    <h2 style={headingStyle}>
                        Article 8 — Politique relative aux Cookies &amp; Traceurs (Art. 82 Loi Informatique et Libertés)
                    </h2>
                    <p>
                        Dans une démarche éthique et respectueuse de la tranquillité de ses visiteuses, le site <em>laparentheseharmonieuse.fr</em> :<br />
                        • <strong>N&apos;utilise AUCUN cookie publicitaire, aucun traceur de reciblage marketing, ni aucun outil de profilage commercial.</strong><br />
                        • <strong>Ne dépose aucun cookie de réseau social tiers à votre insu.</strong><br /><br />
                        Seuls des cookies strictement techniques indispensables au fonctionnement sécurisé du site (jeton d&apos;authentification administrateur) sont utilisés. Conformément aux <strong>lignes directrices et recommandations de la CNIL</strong> et à l&apos;<strong>article 82 de la loi Informatique et Libertés</strong>, ces traceurs purement techniques sont expressément exemptés de l&apos;obligation de consentement préalable.
                    </p>

                    <h2 style={headingStyle}>
                        Article 9 — Vos droits en tant que personne concernée (Articles 15 à 22 du RGPD)
                    </h2>
                    <p>
                        Conformément à la réglementation européenne, vous disposez des droits fondamentaux suivants sur vos données :<br /><br />

                        • <span style={legalBadgeStyle}>Article 15 du RGPD</span> <strong>Droit d&apos;accès :</strong> Vous avez le droit d&apos;obtenir la confirmation que des données à caractère personnel vous concernant sont ou ne sont pas traitées, et d&apos;en obtenir une copie.<br /><br />

                        • <span style={legalBadgeStyle}>Article 16 du RGPD</span> <strong>Droit de rectification :</strong> Vous pouvez demander la rectification immédiate de vos données personnelles si elles s&apos;avèrent inexactes ou incomplètes.<br /><br />

                        • <span style={legalBadgeStyle}>Article 17 du RGPD</span> <strong>Droit à l&apos;effacement (« Droit à l&apos;oubli ») :</strong><br />
                        <strong>En application de l&apos;article 17 du RGPD</strong>, vous avez le droit d&apos;obtenir du responsable du traitement l&apos;<strong>effacement dans les meilleurs délais de vos données à caractère personnel</strong>, notamment lorsque :<br />
                        — les données ne sont plus nécessaires au regard des finalités pour lesquelles elles ont été collectées ;<br />
                        — vous retirez le consentement sur lequel est fondé le traitement et il n&apos;existe pas d&apos;autre fondement juridique ;<br />
                        — vous vous opposez au traitement en vertu de l&apos;article 21 du RGPD ;<br />
                        — les données à caractère personnel ont fait l&apos;objet d&apos;un traitement illicite.<br /><br />

                        • <span style={legalBadgeStyle}>Article 18 du RGPD</span> <strong>Droit à la limitation du traitement :</strong> Vous pouvez demander le gel temporaire du traitement de vos données dans les hypothèses prévues par la loi.<br /><br />

                        • <span style={legalBadgeStyle}>Article 20 du RGPD</span> <strong>Droit à la portabilité des données :</strong> Vous avez le droit de recevoir les données fournies dans un format structuré, couramment utilisé et lisible par machine.<br /><br />

                        • <span style={legalBadgeStyle}>Article 21 du RGPD</span> <strong>Droit d&apos;opposition :</strong> Vous pouvez vous opposer à tout moment, pour des raisons tenant à votre situation particulière, au traitement de vos données fondé sur l&apos;intérêt légitime.<br /><br />

                        • <span style={legalBadgeStyle}>Article 85 de la loi Informatique et Libertés</span> <strong>Directives post-mortem :</strong> Vous disposez du droit de définir des directives relatives à la conservation, à l&apos;effacement et à la communication de vos données après votre décès.<br /><br />

                        <strong>Modalités d&apos;exercice de vos droits :</strong><br />
                        Pour exercer l&apos;un quelconque de ces droits, il vous suffit d&apos;adresser votre demande écrite à Madame {creatorName} :<br />
                        — Par courriel électronique : <a href={`mailto:${email}`} style={linkStyle}>{email}</a><br />
                        — Par voie postale : {businessName} — {headquartersAddress}<br />
                        Une réponse circonstanciée vous sera adressée dans un délai maximal d&apos;<strong>un (1) mois</strong> à compter de la réception de la demande (délai prévu à l&apos;article 12.3 du RGPD).
                    </p>

                    <h2 style={headingStyle}>
                        Article 10 — Droit d&apos;introduire une réclamation auprès de la CNIL (Art. 77 du RGPD)
                    </h2>
                    <p>
                        Si vous estimez, après nous avoir contactés, que vos droits sur vos données personnelles ne sont pas respectés ou que le traitement n&apos;est pas conforme à la législation en vigueur, vous disposez du droit d&apos;introduire une réclamation (plainte) auprès de l&apos;autorité de contrôle française compétente :<br /><br />
                        <strong>Commission Nationale de l&apos;Informatique et des Libertés (CNIL)</strong><br />
                        Adresse postale : 3 Place de Fontenoy - TSA 80715 - 75334 Paris Cedex 07<br />
                        Téléphone : 01 53 73 22 22<br />
                        Site web officiel : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" style={linkStyle}>https://www.cnil.fr/fr/plaintes</a>
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
