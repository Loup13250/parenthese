/**
 * Textes personnalisables du site (100% Français)
 * -----------------------------------------------
 * Les textes par défaut vivent dans src/context/dictionary.js.
 * Quand l'administratrice modifie un texte, la personnalisation est stockée
 * dans site_info (clé "custom_texts", JSON : { fr: { clé: texte } }).
 * Supprimer une personnalisation = retour automatique au texte d'origine.
 */
import { DICTIONARY } from '@/context/dictionary';

export const CUSTOM_TEXTS_KEY = 'custom_texts';
export const CUSTOM_TEXT_MAX_LENGTH = 2000;

/** Lit la valeur JSON stockée en base et garantit une structure { fr: {} } saine. */
export function parseCustomTexts(raw) {
    const result = { fr: {} };
    if (!raw || typeof raw !== 'string') return result;
    try {
        const parsed = JSON.parse(raw);
        const src = parsed?.fr || parsed;
        if (src && typeof src === 'object') {
            for (const [key, val] of Object.entries(src)) {
                if (typeof val === 'string' && val.trim() !== '' && key in DICTIONARY) {
                    result.fr[key] = val;
                }
            }
        }
    } catch {
        // JSON corrompu : on repart sur les textes par défaut
    }
    return result;
}

/** Une clé est modifiable uniquement si elle existe dans le dictionnaire par défaut. */
export function isEditableTextKey(key) {
    return typeof key === 'string' && key in DICTIONARY;
}

/** Texte par défaut d'une clé. */
export function getDefaultText(key) {
    return DICTIONARY[key] ?? '';
}

/* ----------------------------------------------------------------------------
   Libellés lisibles pour l'administration
   ---------------------------------------------------------------------------- */
export const TEXT_LABELS = {
    // Navigation & Pied de page
    'nav.home': 'Menu — Lien Accueil',
    'nav.about': 'Menu — Lien Mon approche',
    'nav.tarifs': 'Menu — Lien Carte des soins',
    'nav.gift': 'Menu — Lien Carte cadeau',
    'nav.contact': 'Menu — Lien Contact',
    'nav.bookBtn': 'Menu — Bouton Prendre rendez-vous',
    'nav.bookPlanity': 'Menu mobile — Bouton Planity',
    'nav.brandSubtitle': 'Menu mobile — Sous-titre de la marque',
    'footer.tagline': 'Pied de page — Accroche en italique',
    'footer.desc': "Pied de page — Présentation de l'institut",
    'footer.servicesTitle': 'Pied de page — Titre colonne Soins',
    'footer.contactTitle': 'Pied de page — Titre colonne Contact',
    'footer.hoursTitle': 'Pied de page — Titre colonne Horaires',
    'footer.bookPlanity': 'Pied de page — Bouton Planity',
    'footer.copyright': 'Pied de page — Mention droits réservés',

    // Bannière Vidéo (Accueil)
    'hero.eyebrow': 'Bannière — Sur-titre (lieu & spécialité)',
    'hero.titleLine1': 'Bannière — Grand titre (ligne 1)',
    'hero.titleItalic': 'Bannière — Grand titre (ligne 2 en italique)',
    'hero.subtitle': 'Bannière — Sous-titre (piliers de soins)',
    'hero.description': "Bannière — Texte d'introduction",
    'hero.bookBtn': 'Bannière — Bouton principal (Planity)',
    'hero.viewMenu': 'Bannière — Bouton secondaire (Carte des soins)',
    'hero.ribbon1': 'Bannière — Réassurance 1 (Cosmétiques)',
    'hero.ribbon2': 'Bannière — Réassurance 2 (Parking)',
    'hero.ribbon3': 'Bannière — Réassurance 3 (Avis)',
    'hero.scrollLabel': 'Bannière — Indicateur de défilement',

    // Accueil — Le Cocon Bien-Être
    'home.welcomeKicker': 'Cocon Bien-Être — Sur-titre',
    'home.welcomeTitle': 'Cocon Bien-Être — Titre (ligne 1)',
    'home.welcomeTitleItalic': 'Cocon Bien-Être — Titre (ligne 2 en italique)',
    'home.portraitRole': 'Cocon Bien-Être — Légende sous le portrait',
    'home.welcomeLead': 'Cocon Bien-Être — Paragraphe d’accroche',
    'home.welcomeP1': 'Cocon Bien-Être — Paragraphe parcours',
    'home.welcomeP2': 'Cocon Bien-Être — Paragraphe philosophie',
    'home.pillar1Title': 'Pilier 1 — Titre',
    'home.pillar1Desc': 'Pilier 1 — Description',
    'home.pillar2Title': 'Pilier 2 — Titre',
    'home.pillar2Desc': 'Pilier 2 — Description',
    'home.pillar3Title': 'Pilier 3 — Titre',
    'home.pillar3Desc': 'Pilier 3 — Description',
    'home.discoverApproachBtn': 'Bouton « Découvrir mon approche »',

    // Accueil — Triptyque & RDV & Coups de cœur & Lieu
    'home.trip1Kicker': 'Triptyque 1 — Sur-titre',
    'home.trip1Title': 'Triptyque 1 — Titre',
    'home.trip1Cta': 'Triptyque 1 — Lien',
    'home.trip2Kicker': 'Triptyque 2 — Sur-titre',
    'home.trip2Title': 'Triptyque 2 — Titre',
    'home.trip2Cta': 'Triptyque 2 — Lien',
    'home.trip3Kicker': 'Triptyque 3 — Sur-titre',
    'home.trip3Title': 'Triptyque 3 — Titre',
    'home.trip3Cta': 'Triptyque 3 — Lien',
    'home.rdvKicker': 'Section RDV — Sur-titre',
    'home.rdvTitle': 'Section RDV — Titre',
    'home.rdvTitleItalic': 'Section RDV — Titre (italique)',
    'home.soloTitle': 'Carte Rendez-Vous — Titre',
    'home.soloDesc': 'Carte Rendez-Vous — Description',
    'home.soloBtn': 'Carte Rendez-Vous — Bouton',
    'home.hasGiftTitle': 'Carte J’ai un Bon Cadeau — Titre',
    'home.hasGiftDesc': 'Carte J’ai un Bon Cadeau — Description',
    'home.hasGiftBtn': 'Carte J’ai un Bon Cadeau — Bouton',
    'home.favKicker': 'Coups de cœur — Sur-titre',
    'home.favTitle': 'Coups de cœur — Titre',
    'home.favTitleItalic': 'Coups de cœur — Titre (italique)',
    'home.favLead': 'Coups de cœur — Texte de présentation',
    'home.viewAllSoins': 'Coups de cœur — Lien vers toute la carte',
    'home.durationLabel': 'Coups de cœur — Libellé Durée',
    'home.priceLabel': 'Coups de cœur — Libellé Tarif',
    'home.reserveBtn': 'Coups de cœur — Bouton Réserver',
    'home.offerBtn': 'Coups de cœur — Bouton Offrir',
    'home.detailsBtn': 'Coups de cœur — Bouton En savoir plus',
    'reviews.badge': 'Avis Clientes — Sur-titre',
    'reviews.title': 'Avis Clientes — Titre',
    'reviews.titleItalic': 'Avis Clientes — Titre (italique)',
    'reviews.subtitle': 'Avis Clientes — Sous-titre note 5/5',
    'reviews.viewAll': 'Avis Clientes — Bouton voir tous les avis',
    'home.placeKicker': 'Section Lieu — Sur-titre',
    'home.placeTitle': 'Section Lieu — Titre (ligne 1)',
    'home.placeTitleItalic': 'Section Lieu — Titre (ligne 2 en italique)',
    'home.placeLead': 'Section Lieu — Accroche accès & parking',
    'home.placeP': 'Section Lieu — Ambiance de la cabine',
    'home.placeHours': 'Section Lieu — Résumé horaires',
    'home.callBtn': 'Section Lieu — Bouton appel ({phone} = numéro)',
    'home.plaqueCaption': 'Section Lieu — Légende photo plaque officielle',

    // Page Mon Approche
    'about.pageBadge': 'En-tête — Sur-titre',
    'about.pageTitle': 'En-tête — Grand titre (ligne 1)',
    'about.pageTitleItalic': 'En-tête — Grand titre (ligne 2 en italique)',
    'about.portraitBadge': 'Portrait — Badge sous la photo',
    'about.chip1': 'Pastille réassurance 1',
    'about.chip2': 'Pastille réassurance 2',
    'about.chip3': 'Pastille réassurance 3',
    'about.valuesBadge': 'Section Engagements — Sur-titre',
    'about.valuesTitle': 'Section Engagements — Titre',
    'about.valuesTitleItalic': 'Section Engagements — Titre (italique)',
    'about.valuesSubtitle': 'Section Engagements — Sous-titre',
    'about.val1Title': 'Engagement 1 — Titre',
    'about.val1Desc': 'Engagement 1 — Texte',
    'about.val2Title': 'Engagement 2 — Titre',
    'about.val2Desc': 'Engagement 2 — Texte',
    'about.val3Title': 'Engagement 3 — Titre',
    'about.val3Desc': 'Engagement 3 — Texte',
    'about.val4Title': 'Engagement 4 — Titre',
    'about.val4Desc': 'Engagement 4 — Texte',
    'about.brandsBadge': 'Section Marques BIO — Sur-titre',
    'about.brandsTitle': 'Section Marques BIO — Titre',
    'about.brandsTitleItalic': 'Section Marques BIO — Titre (italique)',
    'about.brandsIntro': 'Section Marques BIO — Introduction',
    'about.ctaBadge': 'Bloc final — Sur-titre',
    'about.ctaTitle': 'Bloc final — Titre',
    'about.ctaDesc': 'Bloc final — Description',
    'about.ctaBookBtn': 'Bloc final — Bouton Planity',
    'about.ctaMenuBtn': 'Bloc final — Bouton Carte des soins',

    // Page Carte des Soins
    'tarifs.badge': 'Carte des soins — Sur-titre',
    'tarifs.title': 'Carte des soins — Grand titre',
    'tarifs.titleItalic': 'Carte des soins — Grand titre (italique)',
    'tarifs.moreDetails': 'Carte des soins — Bouton Détails du soin',
    'tarifs.lessDetails': 'Carte des soins — Bouton Moins de détails',
    'tarifs.offerBtn': 'Carte des soins — Bouton Offrir ce soin',
    'tarifs.bookBtn': 'Carte des soins — Bouton Réserver',
    'tarifs.bookingNoticeTitle': 'Encart conseil — Titre en gras',
    'tarifs.bookingNoticeText': 'Encart conseil — Texte explicatif',
    'tarifs.helpTag': 'Bloc accompagnement — Sur-titre',
    'tarifs.ctaTitle': 'Bloc accompagnement — Titre',
    'tarifs.ctaDesc': 'Bloc accompagnement — Texte ({phone} = numéro)',
    'tarifs.bilanBtn': 'Bloc accompagnement — Bouton Bilan Planity',
    'tarifs.askBtn': 'Bloc accompagnement — Bouton Poser une question',

    // Page Carte Cadeau
    'gift.badge': 'Carte cadeau — Sur-titre',
    'gift.title': 'Carte cadeau — Grand titre',
    'gift.titleItalic': 'Carte cadeau — Grand titre (italique)',
    'gift.introTitle': 'Carte d’introduction — Titre',
    'gift.introLead': 'Carte d’introduction — Texte',
    'gift.formatsTitle': 'Section Formats — Titre',
    'gift.formatsTitleItalic': 'Section Formats — Titre (italique)',
    'gift.formatsSubtitle': 'Section Formats — Sous-titre',
    'gift.physTitle': 'Format Physique — Titre',
    'gift.physSub': 'Format Physique — Sous-titre',
    'gift.physDesc': 'Format Physique — Description',
    'gift.physCallBtn': 'Format Physique — Bouton appel ({phone})',
    'gift.digTitle': 'Format Digital — Titre',
    'gift.digSub': 'Format Digital — Sous-titre',
    'gift.digDesc': 'Format Digital — Description',
    'gift.digBtn': 'Format Digital — Bouton Planity',
    'gift.inspTitle': 'Suggestions cadeaux — Titre',

    // Page Contact
    'contact.badge': 'Contact — Sur-titre',
    'contact.title': 'Contact — Grand titre',
    'contact.titleItalic': 'Contact — Grand titre (italique)',
    'contact.planityTitle': 'Encart Planity — Titre',
    'contact.planityDesc': 'Encart Planity — Texte',
    'contact.formTitle': 'Formulaire — Titre',
    'contact.formDesc': 'Formulaire — Texte d’accueil',
    'contact.submitBtn': 'Formulaire — Bouton d’envoi',

    // Page 404
    '404.badge': 'Page 404 — Badge supérieur',
    '404.title': 'Page 404 — Titre principal',
    '404.titleItalic': 'Page 404 — Suite du titre (italique)',
    '404.desc': 'Page 404 — Message explicatif',
    '404.backHome': 'Page 404 — Bouton retour accueil',
};

/** Libellé d'une clé : libellé dédié, sinon texte d'origine tronqué. */
export function getTextLabel(key) {
    if (TEXT_LABELS[key]) return TEXT_LABELS[key];
    const fr = DICTIONARY[key] || key;
    return fr.length > 60 ? `${fr.slice(0, 57)}…` : fr;
}

/* ----------------------------------------------------------------------------
   Regroupement par page (sections d'édition dédiées)
   ---------------------------------------------------------------------------- */

/** Sections de la Page d'Accueil */
export const HOME_PAGE_TEXT_SECTIONS = [
    {
        id: 'home-hero',
        title: 'Bannière Vidéo & Accroches Principales',
        description: 'Textes de la bannière tout en haut de la page d’accueil.',
        keys: [
            'hero.eyebrow',
            'hero.titleLine1',
            'hero.titleItalic',
            'hero.subtitle',
            'hero.description',
            'hero.bookBtn',
            'hero.viewMenu',
            'hero.ribbon1',
            'hero.ribbon2',
            'hero.ribbon3',
            'hero.scrollLabel',
        ],
    },
    {
        id: 'home-welcome',
        title: 'Section « Le Cocon Bien-Être » (Piliers)',
        description: 'Titres, rôles et description des 3 piliers de prise en charge.',
        keys: [
            'home.welcomeKicker',
            'home.welcomeTitle',
            'home.welcomeTitleItalic',
            'home.portraitRole',
            'home.welcomeLead',
            'home.welcomeP1',
            'home.welcomeP2',
            'home.pillar1Title',
            'home.pillar1Desc',
            'home.pillar2Title',
            'home.pillar2Desc',
            'home.pillar3Title',
            'home.pillar3Desc',
            'home.discoverApproachBtn',
        ],
    },
    {
        id: 'home-triptych',
        title: 'Banderole Triptyque Photographique',
        description: 'Les 3 encarts d’accès direct (Histoire, Soins, Carte cadeau).',
        keys: [
            'home.trip1Kicker',
            'home.trip1Title',
            'home.trip1Cta',
            'home.trip2Kicker',
            'home.trip2Title',
            'home.trip2Cta',
            'home.trip3Kicker',
            'home.trip3Title',
            'home.trip3Cta',
        ],
    },
    {
        id: 'home-rdv',
        title: 'Section « Prendre Rendez-Vous »',
        description: 'Cartes d’orientation pour réservation directe ou utilisation d’un bon cadeau.',
        keys: [
            'home.rdvKicker',
            'home.rdvTitle',
            'home.rdvTitleItalic',
            'home.soloTitle',
            'home.soloDesc',
            'home.soloBtn',
            'home.hasGiftTitle',
            'home.hasGiftDesc',
            'home.hasGiftBtn',
        ],
    },
    {
        id: 'home-favs',
        title: 'Section « Vos Coups de Cœur » & Témoignages',
        description: 'Titres et sous-titres des rituels signatures et des avis vérifiés.',
        keys: [
            'home.favKicker',
            'home.favTitle',
            'home.favTitleItalic',
            'home.favLead',
            'home.viewAllSoins',
            'home.durationLabel',
            'home.priceLabel',
            'home.reserveBtn',
            'home.offerBtn',
            'home.detailsBtn',
            'reviews.badge',
            'reviews.title',
            'reviews.titleItalic',
            'reviews.subtitle',
            'reviews.viewAll',
        ],
    },
    {
        id: 'home-place',
        title: 'Section « Le Refuge de Bien-Être » (Lieu & Accès)',
        description: 'Présentation de la cabine au Pôle Santé Guynemer et informations pratiques.',
        keys: [
            'home.placeKicker',
            'home.placeTitle',
            'home.placeTitleItalic',
            'home.placeLead',
            'home.placeP',
            'home.placeHours',
            'home.callBtn',
            'home.plaqueCaption',
        ],
    },
];

/** Sections de la Page Mon Approche */
export const ABOUT_PAGE_TEXT_SECTIONS = [
    {
        id: 'about-hero',
        title: 'En-tête & Pastilles de Réassurance',
        description: 'Titres principaux et points forts de la page Mon Approche.',
        keys: [
            'about.pageBadge',
            'about.pageTitle',
            'about.pageTitleItalic',
            'about.portraitBadge',
            'about.chip1',
            'about.chip2',
            'about.chip3',
        ],
    },
    {
        id: 'about-values',
        title: 'Section « Mon Engagement » (4 Piliers)',
        description: 'Les quatre valeurs fondatrices de l’institut.',
        keys: [
            'about.valuesBadge',
            'about.valuesTitle',
            'about.valuesTitleItalic',
            'about.valuesSubtitle',
            'about.val1Title',
            'about.val1Desc',
            'about.val2Title',
            'about.val2Desc',
            'about.val3Title',
            'about.val3Desc',
            'about.val4Title',
            'about.val4Desc',
        ],
    },
    {
        id: 'about-brands',
        title: 'Section « Cosmétiques BIO » & Partenaires',
        description: 'Mise en avant des maisons françaises écoresponsables.',
        keys: [
            'about.brandsBadge',
            'about.brandsTitle',
            'about.brandsTitleItalic',
            'about.brandsIntro',
        ],
    },
    {
        id: 'about-cta',
        title: 'Bloc Final de Prise de Rendez-Vous',
        description: 'Boutons d’action vers Planity et vers la carte des soins.',
        keys: [
            'about.ctaBadge',
            'about.ctaTitle',
            'about.ctaDesc',
            'about.ctaBookBtn',
            'about.ctaMenuBtn',
        ],
    },
];

/** Sections de la Page Carte des Soins */
export const TARIFS_PAGE_TEXT_SECTIONS = [
    {
        id: 'tarifs-hero',
        title: 'En-tête & Conseil Réservation',
        description: 'Titre principal de la carte et message de prévenance.',
        keys: [
            'tarifs.badge',
            'tarifs.title',
            'tarifs.titleItalic',
            'tarifs.moreDetails',
            'tarifs.lessDetails',
            'tarifs.offerBtn',
            'tarifs.bookBtn',
            'tarifs.bookingNoticeTitle',
            'tarifs.bookingNoticeText',
        ],
    },
    {
        id: 'tarifs-cta',
        title: 'Bloc « Bilan Personnalisé & Conseil »',
        description: 'Encart invitant à contacter Harmonie ou à réserver avec bilan.',
        keys: [
            'tarifs.helpTag',
            'tarifs.ctaTitle',
            'tarifs.ctaDesc',
            'tarifs.bilanBtn',
            'tarifs.askBtn',
        ],
    },
];

/** Sections de la Page Carte Cadeau */
export const GIFT_PAGE_TEXT_SECTIONS = [
    {
        id: 'gift-hero',
        title: 'En-tête & Présentation Carte Cadeau',
        description: 'Grand titre et message introductif de la carte cadeau.',
        keys: [
            'gift.badge',
            'gift.title',
            'gift.titleItalic',
            'gift.introTitle',
            'gift.introLead',
        ],
    },
    {
        id: 'gift-formats',
        title: 'Les Deux Formats (Pochette Papier & Bon Digital)',
        description: 'Détails des deux options d’achat.',
        keys: [
            'gift.formatsTitle',
            'gift.formatsTitleItalic',
            'gift.formatsSubtitle',
            'gift.physTitle',
            'gift.physSub',
            'gift.physDesc',
            'gift.physCallBtn',
            'gift.digTitle',
            'gift.digSub',
            'gift.digDesc',
            'gift.digBtn',
        ],
    },
    {
        id: 'gift-insp',
        title: 'Inspirations Soins Cadeaux',
        description: 'Titre de la sélection des soins les plus offerts.',
        keys: [
            'gift.inspTitle',
        ],
    },
];

/** Sections de la Page Contact */
export const CONTACT_PAGE_TEXT_SECTIONS = [
    {
        id: 'contact-hero',
        title: 'En-tête de la Page Contact',
        description: 'Titres de la page et encart Planity.',
        keys: [
            'contact.badge',
            'contact.title',
            'contact.titleItalic',
            'contact.planityTitle',
            'contact.planityDesc',
        ],
    },
    {
        id: 'contact-form',
        title: 'Formulaire de Contact Direct',
        description: 'Titres et invitation à envoyer un message.',
        keys: [
            'contact.formTitle',
            'contact.formDesc',
            'contact.submitBtn',
        ],
    },
];

/** Sections Menu & Pied de page */
export const LAYOUT_TEXT_SECTIONS = [
    {
        id: 'layout-nav',
        title: 'Menu de Navigation & Boutons',
        description: 'Libellés des liens du menu principal et des boutons de réservation.',
        keys: [
            'nav.home',
            'nav.about',
            'nav.tarifs',
            'nav.gift',
            'nav.contact',
            'nav.bookBtn',
            'nav.bookPlanity',
            'nav.brandSubtitle',
        ],
    },
    {
        id: 'layout-footer',
        title: 'Pied de Page (Footer)',
        description: 'Textes de bas de page, colonnes et mentions.',
        keys: [
            'footer.tagline',
            'footer.desc',
            'footer.servicesTitle',
            'footer.contactTitle',
            'footer.hoursTitle',
            'footer.bookPlanity',
            'footer.copyright',
        ],
    },
];

/** Liste globale des pages du site pour l’annuaire des textes */
export const SITE_TEXT_GROUPS = [
    {
        id: 'accueil',
        title: "Page d'Accueil",
        description: 'Bannière vidéo, cocon bien-être, triptyque, coups de cœur, avis clientes et lieu.',
        href: '/admin/dashboard/accueil',
        sections: HOME_PAGE_TEXT_SECTIONS,
    },
    {
        id: 'mon-approche',
        title: 'Page Mon Approche',
        description: 'Titres, pastilles, 4 engagements, cosmétiques BIO et appel à l’action.',
        href: '/admin/dashboard/a-propos',
        sections: ABOUT_PAGE_TEXT_SECTIONS,
    },
    {
        id: 'carte-des-soins',
        title: 'Page Carte des Soins',
        description: 'Titres, encart conseil et bloc accompagnement bilan.',
        href: '/admin/dashboard/prestations',
        sections: TARIFS_PAGE_TEXT_SECTIONS,
    },
    {
        id: 'carte-cadeau',
        title: 'Page Carte Cadeau',
        description: 'Pochette physique, bon digital Planity et suggestions cadeaux.',
        href: '/admin/dashboard/carte-cadeau',
        sections: GIFT_PAGE_TEXT_SECTIONS,
    },
    {
        id: 'contact',
        title: 'Page Contact & Accès',
        description: 'Titres, encart Planity et formulaire de contact.',
        href: '/admin/dashboard/contact',
        sections: CONTACT_PAGE_TEXT_SECTIONS,
    },
    {
        id: 'layout',
        title: 'Menu & Pied de Page',
        description: 'Liens du menu principal et textes du pied de page.',
        href: '/admin/dashboard/settings',
        sections: LAYOUT_TEXT_SECTIONS,
    },
];
