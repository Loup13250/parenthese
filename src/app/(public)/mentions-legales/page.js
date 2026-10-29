import { getSiteInfo } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import MentionsLegalesClient from './MentionsLegalesClient';

export const metadata = {
    title: 'Mentions Légales',
    description: "Mentions légales officielles de l'institut La Parenthèse Harmonieuse à Salon-de-Provence : informations légales LCEN, coordonnées, hébergement et propriété intellectuelle.",
    alternates: {
        canonical: `${SITE_URL}/mentions-legales`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const revalidate = 60;

export default async function MentionsLegalesPage() {
    const siteInfo = await getSiteInfo();
    return <MentionsLegalesClient siteInfo={siteInfo} />;
}
