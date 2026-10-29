import { getSiteInfo } from '@/lib/data';
import { parseCustomTexts } from '@/lib/siteTexts';
import AccueilAdminClient from './AccueilAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Page d'Accueil | Admin La Parenthèse Harmonieuse",
};

export default async function AccueilAdminPage() {
    const siteInfo = await getSiteInfo();
    const customTexts = parseCustomTexts(siteInfo?.custom_texts);
    return <AccueilAdminClient siteInfo={siteInfo} customTexts={customTexts} />;
}

