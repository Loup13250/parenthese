import { getServices, getSiteInfo } from '@/lib/data';
import CarteSoinsClient from './CarteSoinsClient';

export const metadata = {
    title: 'Carte des Soins & Tarifs | La Parenthèse Harmonieuse',
    description: 'Consultez tous nos massages sur mesure, soins visage Nohèm BIO, drainage lymphatique, madérothérapie, lifting Kobido et rituels femmes enceintes à Salon-de-Provence.',
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
