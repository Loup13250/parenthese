import { SITE_URL } from '@/lib/site';
import MentionsLegalesClient from './MentionsLegalesClient';

export const metadata = {
    title: 'Mentions Légales | La Parenthèse Harmonieuse',
    description: "Mentions légales officielles de l'institut La Parenthèse Harmonieuse à Salon-de-Provence : informations légales, coordonnées, hébergement et propriété intellectuelle.",
    alternates: {
        canonical: `${SITE_URL}/mentions-legales`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function MentionsLegalesPage() {
    return <MentionsLegalesClient />;
}
