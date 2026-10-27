import { getServices } from '@/lib/data';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Carte des Soins & Massages | Admin La Parenthèse Harmonieuse',
};

export default async function PrestationsAdminPage() {
    const services = await getServices();
    return <ServicesClient services={services} />;
}

