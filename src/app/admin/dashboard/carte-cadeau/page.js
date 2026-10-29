import { getSiteInfo } from '@/lib/data';
import { parseCustomTexts } from '@/lib/siteTexts';
import GiftAdminClient from './GiftAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Page Carte Cadeau | Admin La Parenthèse Harmonieuse',
};

export default async function GiftAdminPage() {
    const siteInfo = await getSiteInfo();
    const customTexts = parseCustomTexts(siteInfo?.custom_texts);
    return <GiftAdminClient siteInfo={siteInfo} customTexts={customTexts} />;
}

