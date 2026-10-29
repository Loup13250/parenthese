import React from 'react';
import { getSiteInfo, getServices, getTestimonials } from '@/lib/data';
import HomePageClient from './HomePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://laparentheseharmonieuse.fr';

export const revalidate = 60;

export const metadata = {
    alternates: {
        canonical: SITE_URL,
    },
};

export default async function Home() {
    const [siteInfo, services, testimonials] = await Promise.all([
        getSiteInfo(),
        getServices(),
        getTestimonials(true),
    ]);

    return (
        <HomePageClient
            siteInfo={siteInfo}
            services={services}
            testimonials={testimonials}
        />
    );
}
