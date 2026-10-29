import { Suspense } from 'react';
import { getSiteInfo, getServices } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import CarteCadeauClient from './CarteCadeauClient';

export const metadata = {
    title: 'Offrir une Carte Cadeau',
    description: "Offrez un moment de pure détente et de douceur à Salon-de-Provence. Carte cadeau physique élégante à l'institut ou numérique immédiate sur Planity.",
    alternates: {
        canonical: `${SITE_URL}/carte-cadeau`,
    },
    openGraph: {
        title: 'Offrir une Carte Cadeau | La Parenthèse Harmonieuse',
        description: "Pochettes cadeaux physiques à l'institut ou e-bons cadeaux en ligne sur tous les rituels bien-être.",
        url: `${SITE_URL}/carte-cadeau`,
    },
};

export const revalidate = 60;

export default async function CarteCadeauPage() {
    const [siteInfo, services] = await Promise.all([
        getSiteInfo(),
        getServices(),
    ]);

    return (
        <Suspense fallback={null}>
            <CarteCadeauClient siteInfo={siteInfo} services={services} />
        </Suspense>
    );
}
