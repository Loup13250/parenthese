import { getSiteInfo, getUnreadMessageCount } from '@/lib/data';
import { parseCustomTexts } from '@/lib/siteTexts';
import ContactAdminClient from './ContactAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Page Contact & Accès | Admin La Parenthèse Harmonieuse',
};

export default async function ContactAdminPage() {
    const [siteInfo, unreadCount] = await Promise.all([
        getSiteInfo(),
        getUnreadMessageCount().catch(() => 0),
    ]);
    const customTexts = parseCustomTexts(siteInfo?.custom_texts);
    return <ContactAdminClient siteInfo={siteInfo} customTexts={customTexts} unreadCount={unreadCount} />;
}

