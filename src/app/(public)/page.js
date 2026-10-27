import React from 'react';
import { getSiteInfo, getServices, getTestimonials } from '@/lib/data';
import HomePageClient from './HomePageClient';

export const revalidate = 60;

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
