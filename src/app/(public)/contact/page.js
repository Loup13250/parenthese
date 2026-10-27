import { getSiteInfo } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import ContactClient from './ContactClient';

export const metadata = {
    title: 'Contact & Accès | La Parenthèse Harmonieuse',
    description: "Contactez Harmonie à Salon-de-Provence. Adresse au Pôle Santé Georges Guynemer, horaires d'ouverture, téléphone et formulaire de contact direct.",
    alternates: {
        canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
        title: 'Contact & Accès | La Parenthèse Harmonieuse',
        description: "Prenez contact avec Harmonie pour toute question ou demande de renseignements sur les soins.",
        url: `${SITE_URL}/contact`,
    },
};

export const revalidate = 60;

export default async function ContactPage() {
    const info = await getSiteInfo();

    return <ContactClient info={info} />;
}
