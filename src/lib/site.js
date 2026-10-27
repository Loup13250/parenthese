const RAW_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://laparentheseharmonieuse.fr';

export const SITE_URL = RAW_URL.replace(/\/+$/, '');

export function absoluteUrl(path = '') {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${cleanPath}`;
}
