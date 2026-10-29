import { getServices, getSiteInfo } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import CarteSoinsClient from './CarteSoinsClient';

export const metadata = {
    title: 'Carte des Soins & Tarifs',
    description: 'Consultez tous nos massages sur mesure, soins visage Nohèm BIO, drainage lymphatique, madérothérapie, lifting Kobido et rituels femmes enceintes à Salon-de-Provence.',
    alternates: {
        canonical: `${SITE_URL}/carte-des-soins`,
    },
    openGraph: {
        title: 'Carte des Soins & Tarifs | La Parenthèse Harmonieuse',
        description: 'Massages sur mesure, soins visage bio Nohèm, drainage lymphatique et lifting Kobido à Salon-de-Provence.',
        url: `${SITE_URL}/carte-des-soins`,
    },
};

export const revalidate = 60;

export default async function CarteDesSoinsPage() {
    const [services, siteInfo] = await Promise.all([
        getServices(),
        getSiteInfo(),
    ]);

    return (
        <CarteSoinsClient services={services} siteInfo={siteInfo} />
    );
}
