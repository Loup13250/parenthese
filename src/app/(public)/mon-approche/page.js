import { getSiteInfo } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import MonApprocheClient from './MonApprocheClient';

export const metadata = {
    title: 'Mon Approche',
    description: "Découvrez la philosophie d'Harmonie, praticienne bien-être et esthéticienne passionnée à Salon-de-Provence. Des soins sur mesure et bienveillants dans un espace dédié aux femmes.",
    alternates: {
        canonical: `${SITE_URL}/mon-approche`,
    },
    openGraph: {
        title: 'Mon Approche | La Parenthèse Harmonieuse',
        description: "Découvrez le parcours d'Harmonie et sa philosophie du bien-être féminin à Salon-de-Provence.",
        url: `${SITE_URL}/mon-approche`,
    },
};

export const revalidate = 60;

export default async function MonApprochePage() {
    const siteInfo = await getSiteInfo();
    return <MonApprocheClient siteInfo={siteInfo} />;
}
