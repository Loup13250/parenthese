import { getTestimonials } from '@/lib/data';
import TestimonialsClient from './TestimonialsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Avis Clientes | Admin La Parenthèse Harmonieuse',
};

export default async function AdminTestimonialsPage() {
    const testimonials = await getTestimonials(false);
    return <TestimonialsClient initialTestimonials={testimonials} />;
}

