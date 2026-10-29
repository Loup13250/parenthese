import { getServices, getSiteInfo } from '@/lib/data';
import { parseCustomTexts } from '@/lib/siteTexts';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Carte des Soins & Massages | Admin La Parenthèse Harmonieuse',
};

export default async function PrestationsAdminPage() {
    const [services, siteInfo] = await Promise.all([
        getServices(),
        getSiteInfo(),
    ]);
    const customTexts = parseCustomTexts(siteInfo?.custom_texts);
    return <ServicesClient services={services} customTexts={customTexts} />;
}
