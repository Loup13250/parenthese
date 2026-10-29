import { getSiteInfo } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import CGVClient from './CGVClient';

export const metadata = {
    title: 'Conditions Générales de Vente',
    description: "Conditions générales de vente et d'utilisation des prestations de soins bien-être et cartes cadeaux de La Parenthèse Harmonieuse à Salon-de-Provence.",
    alternates: {
        canonical: `${SITE_URL}/conditions-generales-de-ventes`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const revalidate = 60;

export default async function CGVPage() {
    const siteInfo = await getSiteInfo();
    return <CGVClient siteInfo={siteInfo} />;
}
