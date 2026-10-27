import { getActivityLogs } from '@/lib/logs';
import LogsClient from './LogsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: "Journal d'Activité | Admin La Parenthèse Harmonieuse",
    description: 'Historique et audit complet de toutes les modifications effectuées sur le site.',
};

export default async function ActivityLogsPage() {
    const logs = await getActivityLogs(400);
    return <LogsClient initialLogs={logs} />;
}
