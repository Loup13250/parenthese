/**
 * Textes personnalisables du site (FR / EN)
 * -----------------------------------------
 * Les textes par défaut vivent dans src/context/dictionary.js.
 * Quand l'administratrice modifie un texte, seule la différence est stockée
 * dans site_info (clé "custom_texts", JSON : { fr: { clé: texte }, en: { ... } }).
 * Supprimer une surcharge = retour automatique au texte d'origine.
 *
 * Ce module est volontairement "pur" (pas de 'use client' / 'use server') :
 * il est utilisé côté serveur (layout, actions) ET côté client (éditeur admin).
 */
import { DICTIONARY } from '@/context/dictionary';

export const CUSTOM_TEXTS_KEY = 'custom_texts';
export const CUSTOM_TEXT_MAX_LENGTH = 2000;

/** Lit la valeur JSON stockée en base et garantit une structure { fr: {}, en: {} } saine. */
export function parseCustomTexts(raw) {
    const result = { fr: {}, en: {} };
    if (!raw || typeof raw !== 'string') return result;
    try {
        const parsed = JSON.parse(raw);
        for (const lang of ['fr', 'en']) {
            const src = parsed?.[lang];
            if (!src || typeof src !== 'object') continue;
            for (const [key, val] of Object.entries(src)) {
                if (typeof val === 'string' && val.trim() !== '' && key in (DICTIONARY.fr || {})) {
                    result[lang][key] = val;
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
    return typeof key === 'string' && key in DICTIONARY.fr;
}

/** Texte par défaut d'une clé dans une langue (repli sur le français). */
export function getDefaultText(lang, key) {
    return DICTIONARY[lang]?.[key] ?? DICTIONARY.fr[key] ?? '';
}

/* ----------------------------------------------------------------------------
   Libellés lisibles pour l'admin (en plus du texte d'origine affiché dans le champ)
   ---------------------------------------------------------------------------- */
export const TEXT_LABELS = {
    // Mon Approche
    'about.pageBadge': 'Petit titre au-dessus du grand titre',
    'about.pageTitle': 'Grand titre de la page',
    'about.passionBadge': 'Petit titre de la section philosophie',
    'about.authTitle': 'Titre de la section philosophie - ligne 1',
    'about.authTitleItalic': 'Titre de la section philosophie - ligne 2 (en italique doré)',
    'about.method': 'Point fort 1 - intitulé',
    'about.methodVal': 'Point fort 1 - valeur',
    'about.sourcing': 'Point fort 2 - intitulé',
    'about.sourcingVal': 'Point fort 2 - valeur',
    'about.avail': 'Point fort 3 - intitulé',
    'about.availVal': 'Point fort 3 - valeur',
    'about.loc': 'Point fort 4 - intitulé',
    'about.locVal': 'Point fort 4 - valeur',
    'about.tasteTitle': 'Bloc final - titre',
    'about.tasteDesc': 'Bloc final - texte',
    'about.badge': 'Accroche de la section « Mon Approche » (accueil)',
    'about.spirit': 'Titre section « Mon Approche » (accueil) - début',
    'about.spiritItalic': 'Titre section « Mon Approche » (accueil) - partie en italique',
    'about.learnMore': 'Bouton « En savoir plus » (accueil)',
    'about.locationLabel': 'Intitulé « Localisation » (accueil)',
    'about.contactLabel': 'Intitulé « Contact » (accueil)',
    'about.pageTagline': 'Accroche sous le titre',
    'services.badge': 'Prestations - petit titre',
    'services.title': 'Prestations - titre (accueil)',
    'services.aboutTitle': 'Prestations - titre (page Mon Approche)',
    'cta.badge': 'Bloc « Commander » - petit titre',
    'cta.title': 'Bloc « Commander » - titre',
    'cta.desc': 'Bloc « Commander » - texte',
    'cta.callBtn': 'Bouton « Appeler pour commander »',
    'cta.quoteBtn': 'Bouton « Demander un devis »',
    // Accueil
    'hero.eyebrow': 'Bannière - petite ligne au-dessus du titre',
    'hero.viewMenu': 'Bannière - bouton menu',
    'hero.viewTarifs': 'Bannière - bouton tarifs',
    'hero.call': 'Bannière - bouton appel',
    'hero.defaultTitle': 'Bannière - titre par défaut',
    'hero.defaultSubtitle': 'Bannière - sous-titre par défaut',
    'menu.badge': 'Menu de la semaine - petit titre',
    'menu.title': 'Menu de la semaine - titre',
    'menu.titleItalic': 'Menu de la semaine - suite du titre (italique)',
    'menu.orderPhone': 'Phrase commande par téléphone ({phone} = numéro)',
    'menu.orderHint': 'Phrase livraison / retrait',
    'menu.orderBtn': 'Bouton commander par téléphone',
    'menu.quoteBtn': 'Bouton demander un devis',
    'menu.tarifsBtn': 'Bouton consulter les tarifs',
    'strip.delivery': 'Bandeau du haut - livraison',
    'strip.pickup': 'Bandeau du haut - retrait',
    'strip.hours': 'Bandeau du haut - horaires de commande',
    // Page 404
    '404.badge': 'Page 404 - petit badge supérieur',
    '404.title': 'Page 404 - titre principal (ligne 1)',
    '404.titleItalic': 'Page 404 - suite du titre (ligne 2 en italique)',
    '404.desc': 'Page 404 - message explicatif',
    '404.backHome': 'Page 404 - bouton retour à l’accueil',
    '404.call': 'Page 404 - bouton contact téléphone',
    '404.suggestionsTitle': 'Page 404 - titre de la section raccourcis',
};

/** Libellé d'une clé : libellé dédié, sinon texte d'origine tronqué. */
export function getTextLabel(key) {
    if (TEXT_LABELS[key]) return TEXT_LABELS[key];
    const fr = DICTIONARY.fr[key] || key;
    return fr.length > 60 ? `${fr.slice(0, 57)}…` : fr;
}

/* ----------------------------------------------------------------------------
   Regroupement par page (page « Textes du site »)
   ---------------------------------------------------------------------------- */
export const SITE_TEXT_GROUPS = [
    {
        id: 'home',
        title: "Page d'accueil",
        description: 'Bannière, menu de la semaine, avis clients, bloc « Commander » et bandeau du haut.',
        href: '/',
        prefixes: ['hero.', 'menu.', 'strip.', 'reviews.', 'cta.'],
    },
    {
        id: 'about',
        title: 'Page Mon Approche',
        description: "Titres, points forts et textes de la page « Mon Approche ».",
        href: '/mon-approche',
        prefixes: ['about.', 'services.'],
    },
    {
        id: 'tarifs',
        title: 'Page Carte des Soins',
        description: 'Titres, onglets et descriptions de la carte des soins.',
        href: '/carte-des-soins',
        prefixes: ['tarifs.'],
    },
    {
        id: 'gallery',
        title: 'Page Galerie',
        description: 'Titres et textes de la galerie du cocon de soin.',
        href: '/galerie',
        prefixes: ['gallery.'],
    },
    {
        id: 'contact',
        title: 'Page Contact & Rendez-vous',
        description: 'Titres, champs du formulaire et messages affichés aux clientes.',
        href: '/contact',
        prefixes: ['contact.', 'type.'],
    },
    {
        id: 'layout',
        title: 'Menu de navigation & pied de page',
        description: 'Liens du menu, texte du pied de page, mentions affichées sur toutes les pages.',
        href: '/',
        prefixes: ['nav.', 'footer.'],
    },
    {
        id: 'notfound',
        title: 'Page Erreur 404',
        description: 'Titres, textes d’accroche et boutons de la page 404.',
        href: '/404',
        prefixes: ['404.'],
    },
];

/** Toutes les clés d'un groupe, dans l'ordre du dictionnaire. */
export function getGroupKeys(group) {
    return Object.keys(DICTIONARY.fr).filter((key) => group.prefixes.some((p) => key.startsWith(p)));
}

/**
 * Éditeur rapide intégré à la page admin « Mon Approche » :
 * les titres/intitulés de la page publique /mon-approche, dans l'ordre d'affichage.
 */
export const ABOUT_PAGE_TEXT_SECTIONS = [
    {
        id: 'about-hero',
        title: 'En-tête de la page',
        keys: ['about.pageBadge', 'about.pageTitle'],
    },
    {
        id: 'about-story',
        title: "Titres de la section « Histoire »",
        keys: ['about.passionBadge', 'about.authTitle', 'about.authTitleItalic'],
    },
    {
        id: 'about-facts',
        title: 'Les 4 chiffres clés',
        keys: [
            'about.method', 'about.methodVal',
            'about.sourcing', 'about.sourcingVal',
            'about.avail', 'about.availVal',
            'about.loc', 'about.locVal',
        ],
    },
    {
        id: 'about-services',
        title: 'Titre de la section « Prestations »',
        keys: ['services.badge', 'services.aboutTitle'],
    },
    {
        id: 'about-cta',
        title: 'Bloc final « Envie de goûter ? »',
        keys: ['about.tasteTitle', 'about.tasteDesc'],
    },
];
