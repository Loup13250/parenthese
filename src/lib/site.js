const RAW_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://laparentheseharmonieuse.fr';

export const SITE_URL = RAW_URL.replace(/\/+$/, '');

export function absoluteUrl(path = '') {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${cleanPath}`;
}

/** Date de naissance officielle d'Harmonie : 17 août 1995 */
export const HARMONIE_BIRTHDATE = '1995-08-17';

/**
 * Calcule dynamiquement l'âge actuel d'Harmonie à partir de sa date de naissance.
 * Se met à jour automatiquement chaque année le 17 août.
 */
export function calculateHarmonieAge(birthDate = HARMONIE_BIRTHDATE) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

/**
 * Formate un texte de présentation pour garantir que toute mention de l'âge
 * (ex: "j'ai 29 ans", "j'ai xx ans") reflète toujours son âge réel et dynamique.
 */
export function formatHarmonieBio(text) {
    if (!text || typeof text !== 'string') return text;
    const age = calculateHarmonieAge();
    return text.replace(/j['’]ai\s+(?:\d+|xx)\s+ans/gi, `j'ai ${age} ans`);
}
