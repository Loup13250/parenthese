import { getSiteInfo, getGalleryPosts } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import RealisationsClient from '../realisations/RealisationsClient';

export const metadata = {
    title: 'Galerie & Cocon de Soin',
    description: "Découvrez en images le cocon de soin, l'atmosphère apaisante et l'univers bien-être de La Parenthèse Harmonieuse à Salon-de-Provence.",
    alternates: {
        canonical: `${SITE_URL}/galerie`,
    },
    openGraph: {
        title: 'Galerie & Cocon | La Parenthèse Harmonieuse',
        description: "Découvrez en images l'atmosphère apaisante et les rituels de soin à Salon-de-Provence.",
        url: `${SITE_URL}/galerie`,
    },
};

export const revalidate = 3600;

export default async function GaleriePage() {
    const [siteInfo, galleryPosts] = await Promise.all([
        getSiteInfo(),
        getGalleryPosts(),
    ]);

    return <RealisationsClient siteInfo={siteInfo} galleryPosts={galleryPosts} />;
}
