import { SITE_URL } from '@/lib/site';
import PolitiqueClient from './PolitiqueClient';

export const metadata = {
    title: 'Politique de Confidentialité',
    description: "Protection de vos données personnelles et conformité RGPD de La Parenthèse Harmonieuse : formulaire de contact, rendez-vous et respect absolu de votre vie privée.",
    alternates: {
        canonical: `${SITE_URL}/politique-de-confidentialite`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PolitiqueConfidentialitePage() {
    return <PolitiqueClient />;
}
