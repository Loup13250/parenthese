import { getSiteInfo } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import PolitiqueClient from './PolitiqueClient';

export const metadata = {
    title: 'Politique de Confidentialité',
    description: 'Protection de vos données personnelles et conformité RGPD de La Parenthèse Harmonieuse : formulaire de contact, rendez-vous et respect absolu de votre vie privée.',
    alternates: {
        canonical: `${SITE_URL}/politique-de-confidentialite`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const revalidate = 60;

export default async function PolitiqueConfidentialitePage() {
    const siteInfo = await getSiteInfo();
    return <PolitiqueClient siteInfo={siteInfo} />;
}
